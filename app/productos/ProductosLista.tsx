'use client'

import { Producto } from './ProductosClient'

type Props = {
  productos: Producto[]
  onEditar: (producto: Producto) => void
  onEliminar: (id: number) => void
}

export default function ProductosLista({ productos, onEditar, onEliminar }: Props) {
  return (
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
              onClick={() => onEditar(producto)}
              className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 text-sm"
            >
              Editar
            </button>
            <button
              onClick={() => {
                if (
                  confirm(
                    `¿Seguro que quieres eliminar el producto "${producto.nombre}"?`
                  )
                ) {
                  onEliminar(producto.id)
                }
              }}
              className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
            >
              Eliminar
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}
