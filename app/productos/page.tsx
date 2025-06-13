'use client'

import { useState, useEffect } from 'react'
import { Producto } from '../interface/Producto'
import { cargarProductos, deleteProducto, guardarProducto } from '../fetch/apiService'
import { Pencil, Trash2 } from 'lucide-react'
import { Dialog } from '@headlessui/react'
import { motion, AnimatePresence } from 'framer-motion'
import { useToken } from '../hooks/useToken'

export default function Productos() {
  const [productos, setProductos] = useState<Producto[]>([])
  const [modoEdicion, setModoEdicion] = useState<null | Producto>(null)
  const [mostrarFormulario, setMostrarFormulario] = useState(false)
  const [form, setForm] = useState({ nombre: '', descripcion: '', precio: '', stock: '' })
  const [productoAEliminar, setProductoAEliminar] = useState<null | Producto>(null)
  const { validateToken } = useToken()
  const token = validateToken()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const productos = await cargarProductos(token)
        setProductos(productos)
      } catch (error) {
        console.error(error)
      }
    }
    fetchData()
  }, [token])

  const resetForm = () => {
    setForm({ nombre: '', descripcion: '', precio: '', stock: '' })
    setModoEdicion(null)
    setMostrarFormulario(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
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

  const confirmarEliminar = (producto: Producto) => setProductoAEliminar(producto)
  const cancelarEliminar = () => setProductoAEliminar(null)
  const handleDelete = async () => {
    if (!productoAEliminar) {
      alert('Producto no seleccionado')
      return
    }
    try {
      await deleteProducto(token, productoAEliminar.id)
      setProductos(productos.filter(p => p.id !== productoAEliminar.id))
      if (modoEdicion?.id === productoAEliminar.id) resetForm()
      cancelarEliminar()
    } catch (error) {
      console.error('Error al eliminar producto:', error)
      alert('Error al eliminar producto')
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-100 to-white px-4 py-10">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-extrabold text-center text-gray-800 mb-10">
          Gestión de <span className="text-green-600">Productos</span>
        </h1>
        {!mostrarFormulario && !modoEdicion && (
          <div className="flex justify-center">
            <button
              onClick={() => setMostrarFormulario(true)}
              className="mb-8 px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg shadow transition"
            >
              ➕ Agregar nuevo producto
            </button>
          </div>
        )}

        {mostrarFormulario && (
          <form
            onSubmit={handleSubmit}
            className="bg-white p-6 md:p-8 rounded-xl shadow-lg mb-12 border border-gray-200 animate-fade-in"
          >
            <h2 className="text-2xl font-semibold text-center text-gray-700 mb-6">
              {modoEdicion ? '✏️ Editar Producto' : '➕ Agregar Producto'}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Nombre"
                className="input-field"
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
                className="input-field"
                value={form.descripcion}
                onChange={e => setForm({ ...form, descripcion: e.target.value })}
                required
              />
              <input
                type="number"
                placeholder="Precio"
                className="input-field"
                value={form.precio}
                onChange={e => setForm({ ...form, precio: e.target.value })}
                required
                min={0}
                step="0.01"
              />
              <input
                type="number"
                placeholder="Stock"
                className="input-field"
                value={form.stock}
                onChange={e => setForm({ ...form, stock: e.target.value })}
                required
                min={0}
              />
            </div>
            <div className="mt-6 flex justify-center gap-4">
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2 rounded-lg shadow"
              >
                {modoEdicion ? '💾 Guardar cambios' : '✅ Agregar'}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="bg-gray-500 hover:bg-gray-600 text-white font-medium px-6 py-2 rounded-lg shadow"
              >
                Cancelar
              </button>
            </div>
          </form>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {productos.map(producto => (
              <motion.div
                key={producto.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                layout
                className="bg-white p-5 rounded-xl shadow-md hover:shadow-xl transition border border-gray-200"
              >
                <h2 className="text-xl font-bold text-gray-800 mb-1">{producto.nombre}</h2>
                <p className="text-gray-600 text-sm mb-2">{producto.descripcion}</p>
                <p className="text-green-700 font-semibold">💵 ${producto.precio.toFixed(2)}</p>
                <p className="text-sm text-gray-700">📦 Stock: {producto.stock}</p>
                <div className="flex gap-3 mt-4">
                  <button
                    onClick={() => handleEdit(producto)}
                    className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-1 rounded-md shadow flex items-center gap-1"
                    aria-label={`Editar ${producto.nombre}`}
                  >
                    <Pencil size={16} />
                    Editar
                  </button>
                  <button
                    onClick={() => confirmarEliminar(producto)}
                    className="bg-red-600 hover:bg-red-700 text-white text-sm px-4 py-1 rounded-md shadow flex items-center gap-1"
                    aria-label={`Eliminar ${producto.nombre}`}
                  >
                    <Trash2 size={16} />
                    Eliminar
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
        <AnimatePresence>
          {productoAEliminar && (
            <Dialog
              as={motion.div}
              static
              open={!!productoAEliminar}
              onClose={cancelarEliminar}
              className="fixed inset-0 z-50 flex items-center justify-center"
              style={{ backgroundColor: 'rgba(0, 0, 0, 0.60)' }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="fixed inset-0" aria-hidden="true" />
              <motion.div
                className="bg-white rounded-lg p-6 max-w-md mx-auto shadow-lg z-50"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <Dialog.Title className="text-lg font-bold text-gray-800 mb-4">
                  Confirmar eliminación
                </Dialog.Title>
                <Dialog.Description className="mb-6 text-gray-700">
                  ¿Estás seguro que quieres eliminar <strong>{productoAEliminar.nombre}</strong>?
                </Dialog.Description>
                <div className="flex justify-end gap-4">
                  <button
                    onClick={cancelarEliminar}
                    className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleDelete}
                    className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
                  >
                    Eliminar
                  </button>
                </div>
              </motion.div>
            </Dialog>
          )}
        </AnimatePresence>
      </div>
    </main>
  )
}
