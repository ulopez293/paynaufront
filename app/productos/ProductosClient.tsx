'use client'

import { useState, useEffect } from 'react'
import { getToken } from '../utils/getToken'
import ProductoForm from './ProductoForm'
import ProductosLista from './ProductosLista'

export type Producto = {
  id: number
  nombre: string
  descripcion: string
  precio: number
  stock: number
}

export default function ProductosClient() {
  const [productos, setProductos] = useState<Producto[]>([])
  const [modoEdicion, setModoEdicion] = useState<null | Producto>(null)
  const [mostrarFormulario, setMostrarFormulario] = useState(false)

  const token = getToken()
  const baseUrl = process.env.NEXT_PUBLIC_API_GOLANG

  useEffect(() => {
    async function cargarProductos() {
      if (!baseUrl) {
        console.error('NEXT_PUBLIC_API_GOLANG no definido')
        return
      }
      try {
        const res = await fetch(`${baseUrl}/api/products`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        if (!res.ok) throw new Error('Error al obtener productos')
        const data = await res.json()
        setProductos(data)
      } catch (error) {
        console.error(error)
      }
    }
    cargarProductos()
  }, [baseUrl, token])

  const resetForm = () => {
    setModoEdicion(null)
    setMostrarFormulario(false)
  }

  // Guardar producto nuevo o editado
  const guardarProducto = async (producto: Omit<Producto, 'id'> & Partial<Producto>) => {
    if (!baseUrl) throw new Error('La variable de entorno NEXT_PUBLIC_API_GOLANG no está definida')

    try {
      const url = modoEdicion
        ? `${baseUrl}/api/products/${modoEdicion.id}`
        : `${baseUrl}/api/products`

      const method = modoEdicion ? 'PUT' : 'POST'

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(producto),
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
    setMostrarFormulario(true)
  }

  const handleDelete = async (id: number) => {
    if (!baseUrl) {
      alert('No está configurada la variable de entorno')
      return
    }
    try {
      const res = await fetch(`${baseUrl}/api/products/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
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
          <ProductoForm
            productoEdicion={modoEdicion}
            onGuardar={guardarProducto}
            onCancelar={resetForm}
          />
        )}

        <ProductosLista
          productos={productos}
          onEditar={handleEdit}
          onEliminar={handleDelete}
        />
      </div>
    </main>
  )
}
