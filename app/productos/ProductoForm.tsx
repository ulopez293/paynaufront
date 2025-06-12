'use client'

import { useState, useEffect } from 'react'
import { Producto } from './ProductosClient'

type Props = {
  productoEdicion: Producto | null
  onGuardar: (producto: Omit<Producto, 'id'>) => Promise<void>
  onCancelar: () => void
}

export default function ProductoForm({ productoEdicion, onGuardar, onCancelar }: Props) {
  const [form, setForm] = useState({
    nombre: '',
    descripcion: '',
    precio: '',
    stock: '',
  })

  useEffect(() => {
    if (productoEdicion) {
      setForm({
        nombre: productoEdicion.nombre,
        descripcion: productoEdicion.descripcion,
        precio: productoEdicion.precio.toString(),
        stock: productoEdicion.stock.toString(),
      })
    } else {
      setForm({ nombre: '', descripcion: '', precio: '', stock: '' })
    }
  }, [productoEdicion])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    await onGuardar({
      nombre: form.nombre,
      descripcion: form.descripcion,
      precio: parseFloat(form.precio),
      stock: parseInt(form.stock),
    })
  }

  return (
    <form onSubmit={handleSubmit} className="bg-gray-100 p-6 rounded mb-8 shadow-md">
      <h2 className="text-xl font-semibold mb-4 text-center">
        {productoEdicion ? 'Editar Producto' : 'Agregar Producto'}
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
          {productoEdicion ? 'Guardar cambios' : 'Agregar'}
        </button>
        <button
          type="button"
          onClick={onCancelar}
          className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
        >
          Cancelar
        </button>
      </div>
    </form>
  )
}
