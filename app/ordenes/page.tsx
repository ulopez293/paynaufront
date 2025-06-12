'use client'
import { useState } from 'react'
type Producto = {
    id: string
    nombre: string
    precio: number
}
type ProductoConCantidad = Producto & {
    cantidad: number
}
type Orden = {
    id: string
    cliente: string
    fecha: string
    productos: ProductoConCantidad[]
    total: string
}
export default function Ordenes() {
    const productosDisponibles: Producto[] = [
        { id: '1', nombre: 'Camiseta', precio: 20 },
        { id: '2', nombre: 'Pantalón', precio: 35 },
        { id: '3', nombre: 'Zapatos', precio: 50 },
        { id: '4', nombre: 'Gorra', precio: 15 },
    ]

    const [ordenes, setOrdenes] = useState<Orden[]>([])
    const [form, setForm] = useState({
        id: '',
        cliente: '',
        fecha: '',
        productos: [] as ProductoConCantidad[],
        total: '',
    })

    const [productoSeleccionado, setProductoSeleccionado] = useState<string>('') // ID
    const [cantidadSeleccionada, setCantidadSeleccionada] = useState<number>(1) // Cantidad del producto
    const [modoEdicion, setModoEdicion] = useState<Orden | null>(null)
    const [mostrarFormulario, setMostrarFormulario] = useState(false)
    const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false)
    const [tipoConfirmacion, setTipoConfirmacion] = useState<'guardar' | 'cancelar'>('guardar')
    const [idCancelar, setIdCancelar] = useState<string | null>(null)

    const calcularTotal = (productos: ProductoConCantidad[]) =>
        `$${productos.reduce((acc, p) => acc + p.precio * p.cantidad, 0).toFixed(2)}`

    const resetForm = () => {
        setForm({ id: '', cliente: '', fecha: '', productos: [], total: '' })
        setProductoSeleccionado('')
        setCantidadSeleccionada(1)
        setModoEdicion(null)
        setMostrarFormulario(false)
    }

    const agregarProducto = () => {
        if (!productoSeleccionado || cantidadSeleccionada < 1) return

        const producto = productosDisponibles.find(p => p.id === productoSeleccionado)
        if (!producto) return

        // Verificar si el producto ya está agregado para sumar la cantidad
        const productoExistenteIndex = form.productos.findIndex(p => p.id === productoSeleccionado)
        let nuevosProductos: ProductoConCantidad[]

        if (productoExistenteIndex >= 0) {
            // Actualizar la cantidad
            nuevosProductos = [...form.productos]
            nuevosProductos[productoExistenteIndex].cantidad += cantidadSeleccionada
        } else {
            // Agregar nuevo producto con cantidad
            nuevosProductos = [...form.productos, { ...producto, cantidad: cantidadSeleccionada }]
        }

        setForm({
            ...form,
            productos: nuevosProductos,
            total: calcularTotal(nuevosProductos),
        })

        setProductoSeleccionado('')
        setCantidadSeleccionada(1)
    }

    const eliminarProducto = (index: number) => {
        const nuevosProductos = form.productos.filter((_, i) => i !== index)
        setForm({
            ...form,
            productos: nuevosProductos,
            total: calcularTotal(nuevosProductos),
        })
    }

    const cambiarCantidad = (index: number, nuevaCantidad: number) => {
        if (nuevaCantidad < 1) return
        const nuevosProductos = [...form.productos]
        nuevosProductos[index].cantidad = nuevaCantidad
        setForm({
            ...form,
            productos: nuevosProductos,
            total: calcularTotal(nuevosProductos),
        })
    }

    const submitOrden = () => {
        const nuevaOrden: Orden = {
            id: form.id || Date.now().toString(),
            cliente: form.cliente,
            fecha: form.fecha,
            productos: form.productos,
            total: calcularTotal(form.productos),
        }

        if (modoEdicion) {
            setOrdenes(ordenes.map(o => (o.id === modoEdicion.id ? nuevaOrden : o)))
        } else {
            setOrdenes([...ordenes, nuevaOrden])
        }

        resetForm()
        setMostrarConfirmacion(false)
    }

    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        setTipoConfirmacion('guardar')
        setMostrarConfirmacion(true)
    }

    const handleCancelarOrden = (id: string) => {
        setTipoConfirmacion('cancelar')
        setIdCancelar(id)
        setMostrarConfirmacion(true)
    }

    const confirmarAccion = () => {
        if (tipoConfirmacion === 'guardar') {
            submitOrden()
        } else if (tipoConfirmacion === 'cancelar' && idCancelar) {
            setOrdenes(ordenes.filter(o => o.id !== idCancelar))
            if (modoEdicion?.id === idCancelar) resetForm()
            setIdCancelar(null)
            setMostrarConfirmacion(false)
        }
    }

    const editarOrden = (orden: Orden) => {
        setForm(orden)
        setModoEdicion(orden)
        setMostrarFormulario(true)
    }

    return (
        <main className="bg-white min-h-screen px-4 py-12 text-gray-800">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-3xl font-bold mb-8 text-center">Órdenes</h1>

                {!mostrarFormulario && !modoEdicion && (
                    <div className="text-center mb-6">
                        <button
                            onClick={() => setMostrarFormulario(true)}
                            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                        >
                            Agregar nueva orden
                        </button>
                    </div>
                )}

                {mostrarFormulario && (
                    <form onSubmit={handleFormSubmit} className="bg-gray-100 p-4 rounded mb-8 max-w-full">
                        <h2 className="text-xl font-semibold mb-4">
                            {modoEdicion ? 'Editar Orden' : 'Agregar Orden'}
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                            <input
                                type="text"
                                placeholder="Cliente"
                                className="border p-2 rounded w-full"
                                value={form.cliente}
                                onChange={e => setForm({ ...form, cliente: e.target.value })}
                                required
                            />
                            <input
                                type="date"
                                className="border p-2 rounded w-full"
                                value={form.fecha}
                                onChange={e => setForm({ ...form, fecha: e.target.value })}
                                required
                            />
                        </div>

                        <div className="border-t pt-4">
                            <h3 className="text-lg font-medium mb-2">Productos</h3>
                            <div className="flex flex-col sm:flex-row gap-2 mb-2">
                                <select
                                    value={productoSeleccionado}
                                    onChange={e => setProductoSeleccionado(e.target.value)}
                                    className="border p-2 rounded flex-1 w-full sm:w-auto"
                                >
                                    <option value="">Seleccionar producto</option>
                                    {productosDisponibles.map(producto => (
                                        <option key={producto.id} value={producto.id}>
                                            {producto.nombre} - ${producto.precio}
                                        </option>
                                    ))}
                                </select>

                                <input
                                    type="number"
                                    min={1}
                                    value={cantidadSeleccionada}
                                    onChange={e => setCantidadSeleccionada(Number(e.target.value))}
                                    className="border p-2 rounded w-full sm:w-20"
                                />

                                <button
                                    type="button"
                                    onClick={agregarProducto}
                                    className="bg-blue-600 text-white px-3 py-2 rounded hover:bg-blue-700 w-full sm:w-auto"
                                >
                                    Agregar
                                </button>
                            </div>

                            {/* Lista de productos en la orden */}
                            <ul className="mb-2">
                                {form.productos.map((p, index) => (
                                    <li
                                        key={index}
                                        className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white border p-2 rounded mb-1 gap-2"
                                    >
                                        <div>
                                            <span className="font-semibold">{p.nombre}</span> - ${p.precio.toFixed(2)} x{' '}
                                            <input
                                                type="number"
                                                min={1}
                                                value={p.cantidad}
                                                onChange={e => cambiarCantidad(index, Number(e.target.value))}
                                                className="border rounded w-full sm:w-16 p-1 text-center"
                                            />{' '}
                                            = ${(p.precio * p.cantidad).toFixed(2)}
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => eliminarProducto(index)}
                                            className="text-red-600 text-xs hover:underline self-start sm:self-auto"
                                        >
                                            Eliminar
                                        </button>
                                    </li>
                                ))}
                            </ul>

                            <p className="font-semibold">Total: {calcularTotal(form.productos)}</p>
                        </div>

                        <div className="mt-4 flex flex-col sm:flex-row gap-2">
                            <button
                                type="submit"
                                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 w-full sm:w-auto"
                            >
                                {modoEdicion ? 'Guardar cambios' : 'Agregar'}
                            </button>
                            <button
                                type="button"
                                onClick={resetForm}
                                className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500 w-full sm:w-auto"
                            >
                                Cancelar
                            </button>
                        </div>
                    </form>
                )}

                {/* Tabla de órdenes */}
                <div className="overflow-x-auto">
                    <table className="w-full border border-gray-200 rounded-lg shadow-sm">
                        <thead className="bg-gray-100">
                            <tr className="text-left text-sm text-gray-600">
                                <th className="p-4">ID</th>
                                <th className="p-4">Cliente</th>
                                <th className="p-4">Fecha</th>
                                <th className="p-4">Productos</th>
                                <th className="p-4">Total</th>
                                <th className="p-4">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {ordenes.map(orden => (
                                <tr key={orden.id} className="border-t hover:bg-gray-50 text-sm align-top">
                                    <td className="p-4 font-mono">{orden.id}</td>
                                    <td className="p-4">{orden.cliente}</td>
                                    <td className="p-4">{orden.fecha}</td>
                                    <td className="p-4">
                                        <ul className="list-disc list-inside">
                                            {orden.productos.map((p, i) => (
                                                <li key={i}>
                                                    {p.nombre} x {p.cantidad} = ${(p.precio * p.cantidad).toFixed(2)}
                                                </li>
                                            ))}
                                        </ul>
                                    </td>
                                    <td className="p-4">{orden.total}</td>
                                    <td className="p-4 flex gap-2">
                                        <button
                                            onClick={() => editarOrden(orden)}
                                            className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 text-xs"
                                        >
                                            Editar
                                        </button>
                                        <button
                                            onClick={() => handleCancelarOrden(orden.id)}
                                            className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 text-xs"
                                        >
                                            Cancelar
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {ordenes.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="p-4 text-center text-gray-500">
                                        No hay órdenes registradas.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Modal confirmación */}
                {mostrarConfirmacion && (
                    <div className="fixed inset-0 bg-[rgba(0,0,0,0.5)] flex items-center justify-center z-50">
                        <div className="bg-white p-6 rounded shadow max-w-sm w-full text-center">
                            <p className="mb-4 font-semibold">
                                {tipoConfirmacion === 'guardar'
                                    ? '¿Deseas guardar esta orden?'
                                    : '¿Seguro que quieres cancelar esta orden?'}
                            </p>
                            <div className="flex justify-center gap-4">
                                <button
                                    onClick={confirmarAccion}
                                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                                >
                                    Sí
                                </button>
                                <button
                                    onClick={() => setMostrarConfirmacion(false)}
                                    className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
                                >
                                    No
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </main>
    )
}
