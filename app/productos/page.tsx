'use client'

import { useState, useEffect } from 'react'
import { getToken } from '../utils/getToken'
import { Producto } from '../interface/Producto'


export default function Productos() {
  const [productos, setProductos] = useState<Producto[]>([])
  const [modoEdicion, setModoEdicion] = useState<null | Producto>(null)
  const [mostrarFormulario, setMostrarFormulario] = useState(false)
  const [form, setForm] = useState({
    nombre: '',
    descripcion: '',
    precio: '',
    stock: '',
  })
  const token = getToken()
  const baseUrl = process.env.NEXT_PUBLIC_API_GOLANG

  const cargarProductos = async () => {
    if (!baseUrl) {
      console.error('NEXT_PUBLIC_API_GOLANG no definido')
      return
    }
    try {
      const res = await fetch(`${baseUrl}/api/products`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })
      if (!res.ok) {
        throw new Error('Error al obtener productos')
      }
      const data = await res.json()
      setProductos(data)
    } catch (error) {
      console.error(error)
    }
  }
  useEffect(() => {
    cargarProductos()
  }, [])

  const resetForm = () => {
    setForm({ nombre: '', descripcion: '', precio: '', stock: '' })
    setModoEdicion(null)
    setMostrarFormulario(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!baseUrl) throw new Error('La variable de entorno NEXT_PUBLIC_API_GOLANG no está definida')
    const nuevoProducto = {
      nombre: form.nombre,
      descripcion: form.descripcion,
      precio: parseFloat(form.precio),
      stock: parseInt(form.stock),
    }
    try {
      const url = modoEdicion
        ? `${baseUrl}/api/products/${modoEdicion.id}`
        : `${baseUrl}/api/products`

      const method = modoEdicion ? 'PUT' : 'POST'
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(nuevoProducto),
      })
      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.error || 'Error al guardar producto')
      }
      const productoGuardado = await res.json()
      if (modoEdicion) {
        setProductos(productos.map(p => (p.id === modoEdicion.id ? productoGuardado : p)))
      } else {
        setProductos([...productos, productoGuardado])
      }
      resetForm()
    } catch (error) {
      console.error('Error al guardar producto:', error)
      alert('Error al guardar producto')
    }
  }

  const handleEdit = (producto: Producto) => {
    setModoEdicion(producto)
    setForm({
      nombre: producto.nombre,
      descripcion: producto.descripcion,
      precio: producto.precio.toString(),
      stock: producto.stock.toString(),
    })
    setMostrarFormulario(true)
  }

  const handleDelete = async (id: string) => {
    if (!baseUrl) {
      alert('No está configurada la variable de entorno')
      return
    }
    try {
      const res = await fetch(`${baseUrl}/api/products/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })
      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.error || 'Error al eliminar producto')
      }
      setProductos(productos.filter(p => p.id !== id))
      if (modoEdicion?.id === id) resetForm()
    } catch (error) {
      console.error('Error al eliminar producto:', error)
      alert('Error al eliminar producto')
    }
  }

  return (
    <main className="min-h-screen bg-white px-6 py-10">
      <div className="max-w-screen-md mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-center">Gestión de Productos</h1>

        {!mostrarFormulario && !modoEdicion && (
          <div className="flex justify-center">
            <button
              onClick={() => setMostrarFormulario(true)}
              className="mb-6 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Agregar nuevo producto
            </button>
          </div>
        )}

        {mostrarFormulario && (
          <form onSubmit={handleSubmit} className="bg-gray-100 p-6 rounded mb-8 shadow-md">
            <h2 className="text-xl font-semibold mb-4 text-center">
              {modoEdicion ? 'Editar Producto' : 'Agregar Producto'}
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Nombre"
                className="border p-2 rounded"
                value={form.nombre}
                onChange={e => setForm({ ...form, nombre: e.target.value })}
                required
              />
              <input
                type="text"
                placeholder="Descripción"
                className="border p-2 rounded"
                value={form.descripcion}
                onChange={e => setForm({ ...form, descripcion: e.target.value })}
                required
              />
              <input
                type="number"
                placeholder="Precio"
                className="border p-2 rounded"
                value={form.precio}
                onChange={e => setForm({ ...form, precio: e.target.value })}
                required
                min={0}
                step="0.01"
              />
              <input
                type="number"
                placeholder="Stock"
                className="border p-2 rounded"
                value={form.stock}
                onChange={e => setForm({ ...form, stock: e.target.value })}
                required
                min={0}
              />
            </div>
            <div className="mt-4 flex justify-center gap-2">
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                {modoEdicion ? 'Guardar cambios' : 'Agregar'}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
              >
                Cancelar
              </button>
            </div>
          </form>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {productos.map(producto => (
            <div
              key={producto.id}
              className="border rounded-lg p-4 shadow hover:shadow-lg transition"
            >
              <h2 className="text-xl font-semibold">{producto.nombre}</h2>
              <p className="text-gray-600">{producto.descripcion}</p>
              <p className="text-sm text-gray-800 mt-1">💵 ${producto.precio.toFixed(2)}</p>
              <p className="text-sm text-gray-800">📦 Stock: {producto.stock}</p>
              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => handleEdit(producto)}
                  className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 text-sm"
                >
                  Editar
                </button>
                <button
                  onClick={() => handleDelete(producto.id)}
                  className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
