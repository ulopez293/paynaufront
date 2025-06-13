'use client'

import { useState, useEffect } from 'react'
import { getToken } from '../utils/getToken'
import { Producto } from '../interface/Producto'
import { cargarProductos, deleteProducto, guardarProducto } from '../fetch/apiService'
import Button from '@mui/material/Button'


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

  useEffect(() => {
    if (!token) {
      console.error('Token no disponible')
      return
    }
    const fetchData = async () => {
      try {
        const productos = await cargarProductos(token)
        setProductos(productos)
      } catch (error) {
        console.error(error)
      }
    }
    fetchData()
  }, [])

  const resetForm = () => {
    setForm({ nombre: '', descripcion: '', precio: '', stock: '' })
    setModoEdicion(null)
    setMostrarFormulario(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!token) {
      console.error('Token no disponible')
      return
    }
    const nuevoProducto = {
      nombre: form.nombre,
      descripcion: form.descripcion,
      precio: parseFloat(form.precio),
      stock: parseInt(form.stock, 10),
    }
    try {
      const productoGuardado = await guardarProducto(token, nuevoProducto, modoEdicion?.id)
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
    if (!token) {
      alert('Token no disponible')
      return
    }
    try {
      await deleteProducto(token, id)
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
                onChange={e => {
                  const soloLetras = e.target.value.replace(/[^A-Za-zÁÉÍÓÚáéíóúÑñ\s]/g, '')
                  if (soloLetras.trim() === '' && soloLetras.length > 0) return
                  setForm({ ...form, nombre: soloLetras })
                }}
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
              <Button
                type="submit"
                variant="contained"
                color="primary"
              >
                {modoEdicion ? 'Guardar cambios' : 'Agregar'}
              </Button>

              <Button
                type="button"
                onClick={resetForm}
                variant="contained"
                color="inherit"
                sx={{ backgroundColor: 'gray', color: 'white', '&:hover': { backgroundColor: 'darkgray' }, ml: 2 }}
              >
                Cancelar
              </Button>
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
                <Button
                  onClick={() => handleEdit(producto)}
                  variant="contained"
                  size="small"
                >
                  Editar
                </Button>

                <Button
                  onClick={() => handleDelete(producto.id)}
                  variant="contained"
                  size="small"
                  color="error"
                >
                  Eliminar
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
