'use client'
import { useEffect, useState } from 'react'
import { Producto, ProductoConCantidad } from '../interface/Producto'
import { getToken } from '../utils/getToken'
import { NuevaOrden, Orden } from '../interface/Orden'
import { cargarOrdenes, cargarProductos, submitOrden } from '../fetch/apiService'
import Button from '@mui/material/Button'
import TableContainer from '@mui/material/TableContainer'
import Table from '@mui/material/Table'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import TableCell from '@mui/material/TableCell'
import Paper from '@mui/material/Paper'
import TableBody from '@mui/material/TableBody'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import Typography from '@mui/material/Typography'
import useMediaQuery from '@mui/material/useMediaQuery'
import { useTheme } from '@mui/material/styles'
import { FiPlusCircle, FiTrash2, FiXCircle } from 'react-icons/fi'

export default function Ordenes() {
    const theme = useTheme()
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
    const [productosDisponibles, setProductosDisponibles] = useState<Producto[]>([])
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
    const [mostrarFormulario, setMostrarFormulario] = useState(false)
    const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false)
    const [tipoConfirmacion, setTipoConfirmacion] = useState<'guardar' | 'cancelar'>('guardar')
    const [idCancelar, setIdCancelar] = useState<string | null>(null)
    const token = getToken()

    useEffect(() => {
        if (!token) {
            console.error('Token no disponible')
            return
        }
        const fetchData = async () => {
            try {
                const productos = await cargarProductos(token)
                setProductosDisponibles(productos)
                const ordenes = await cargarOrdenes(token)
                setOrdenes(ordenes)
            } catch (error) {
                console.error(error)
            }
        }
        fetchData()
    }, [])

    const calcularTotal = (productos: ProductoConCantidad[]) => `$${productos.reduce((acc, p) => acc + p.precio * p.cantidad, 0).toFixed(2)}`
    const resetForm = () => {
        setForm({ id: '', cliente: '', fecha: '', productos: [], total: '' })
        setProductoSeleccionado('')
        setCantidadSeleccionada(1)
        setMostrarFormulario(false)
    }
    const agregarProducto = () => {
        if (!productoSeleccionado || cantidadSeleccionada < 1) return
        const producto = productosDisponibles.find(p => p.id === productoSeleccionado)
        console.log("producto ", productoSeleccionado);
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
    const submitOrdenHandler = async () => {
        if (!token) {
            console.error('Token no disponible')
            return
        }
        const nuevaOrden: NuevaOrden = {
            cliente: form.cliente,
            productos: form.productos.map(p => ({
                producto_id: p.id,
                cantidad: p.cantidad,
            })),
        }
        try {
            const ordenGuardada = await submitOrden(token, nuevaOrden)
            setOrdenes([...ordenes, ordenGuardada])
            resetForm()
            setMostrarConfirmacion(false)
        } catch (error) {
            console.error('Error al guardar la orden:', error)
            alert('Hubo un error al guardar la orden. Intenta de nuevo.')
        }
    }

    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        setTipoConfirmacion('guardar')
        setMostrarConfirmacion(true)
    }

    const confirmarAccion = () => {
        console.log(form.productos.length)
        if (form.productos.length < 1) {
            alert("Agrega al menos un producto")
            return
        }
        if (tipoConfirmacion === 'guardar') {
            submitOrdenHandler()
        } else if (tipoConfirmacion === 'cancelar' && idCancelar) {
            setOrdenes(ordenes.filter(o => o.id !== idCancelar))
            setIdCancelar(null)
            setMostrarConfirmacion(false)
        }
    }

    return (
        <main className="bg-gradient-to-br from-blue-50 to-white min-h-screen px-4 py-10 text-gray-800">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-4xl font-extrabold text-center text-blue-800 mb-10">
                    Órdenes
                </h1>

                {!mostrarFormulario && (
                    <div className="text-center mb-8">
                        <button
                            onClick={() => setMostrarFormulario(true)}
                            className="bg-green-600 text-white px-6 py-3 rounded-md hover:bg-green-700 shadow-lg flex items-center gap-2 mx-auto transition"
                        >
                            <FiPlusCircle className="text-xl" />
                            Agregar nueva orden
                        </button>
                    </div>
                )}

                {mostrarFormulario && (
                    <form
                        onSubmit={handleFormSubmit}
                        className="bg-white border rounded-xl p-6 shadow-xl mb-10"
                    >
                        <h2 className="text-2xl font-semibold mb-6 text-blue-700">
                            Agregar Orden
                        </h2>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                            <input
                                type="text"
                                placeholder="Cliente"
                                className="border p-3 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-300"
                                value={form.cliente}
                                onChange={e => {
                                    const soloLetras = e.target.value.replace(/[^A-Za-zÁÉÍÓÚáéíóúÑñ\s]/g, '')
                                    if (soloLetras.trim() === '' && soloLetras.length > 0) return
                                    setForm({ ...form, cliente: soloLetras })
                                }}
                                required
                            />
                            <input
                                type="date"
                                className="border p-3 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-300"
                                value={form.fecha}
                                onChange={e => setForm({ ...form, fecha: e.target.value })}
                                min={new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().split("T")[0]}
                                required
                            />
                        </div>

                        <div className="border-t pt-6">
                            <h3 className="text-lg font-medium mb-4 text-gray-700">Productos</h3>
                            <div className="flex flex-col sm:flex-row gap-2 mb-4">
                                <select
                                    value={productoSeleccionado}
                                    onChange={e => setProductoSeleccionado(e.target.value)}
                                    className="border p-3 rounded flex-1 w-full focus:outline-none focus:ring-2 focus:ring-blue-300"
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
                                    className="border p-3 rounded w-full sm:w-24 focus:outline-none focus:ring-2 focus:ring-blue-300"
                                />
                                <button
                                    type="button"
                                    onClick={agregarProducto}
                                    className="bg-blue-600 text-white px-4 py-3 rounded-md hover:bg-blue-700 transition-all"
                                >
                                    Agregar
                                </button>
                            </div>

                            <ul className="mb-4">
                                {form.productos.map((p, index) => (
                                    <li
                                        key={index}
                                        className="flex flex-col sm:flex-row justify-between items-start sm:items-center border p-3 rounded mb-2 bg-gray-50 shadow-sm transition hover:shadow-md"
                                    >
                                        <div>
                                            <span className="font-semibold">{p.nombre}</span> - ${p.precio.toFixed(2)} x{' '}
                                            <input
                                                type="number"
                                                min={1}
                                                value={p.cantidad}
                                                onChange={e => cambiarCantidad(index, Number(e.target.value))}
                                                className="border rounded w-16 p-1 text-center ml-1"
                                            /> = <span className="font-semibold">${(p.precio * p.cantidad).toFixed(2)}</span>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => eliminarProducto(index)}
                                            className="text-red-600 hover:text-red-800 flex items-center gap-1 text-sm transition"
                                        >
                                            <FiTrash2 className="text-base" />
                                            Eliminar
                                        </button>
                                    </li>
                                ))}
                            </ul>

                            <p className="font-semibold text-lg">Total: {calcularTotal(form.productos)}</p>
                        </div>

                        <div className="mt-6 flex flex-col sm:flex-row gap-3">
                            <Button type="submit" variant="contained" color="success" fullWidth>
                                Agregar
                            </Button>
                            <Button type="button" onClick={resetForm} variant="contained" color="error" fullWidth>
                                Cancelar
                            </Button>
                        </div>
                    </form>
                )}

                <div className="overflow-x-auto">
                    <TableContainer
                        component={Paper}
                        elevation={2}
                        sx={{
                            overflowX: 'auto',
                            width: '100%',
                            p: isMobile ? 1 : 2,
                        }}
                    >
                        <Table size={isMobile ? 'small' : 'medium'}>
                            <TableHead>
                                <TableRow>
                                    <TableCell sx={{ minWidth: 60 }}>ID</TableCell>
                                    <TableCell sx={{ minWidth: 100 }}>Cliente</TableCell>
                                    <TableCell sx={{ minWidth: 100 }}>Fecha</TableCell>
                                    <TableCell sx={{ minWidth: 200 }}>Productos</TableCell>
                                    <TableCell sx={{ minWidth: 80 }}>Total</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {ordenes.length > 0 ? (
                                    ordenes.map((orden) => (
                                        <TableRow key={orden.id} hover>
                                            <TableCell sx={{ fontFamily: 'monospace' }}>{orden.id}</TableCell>
                                            <TableCell>{orden.cliente}</TableCell>
                                            <TableCell>{orden.fecha}</TableCell>
                                            <TableCell>
                                                <List dense disablePadding>
                                                    {Array.isArray(orden.productos) ? orden.productos.map((p) => (
                                                        <ListItem
                                                            key={p.id}
                                                            sx={{
                                                                display: 'list-item',
                                                                pl: 2,
                                                                fontSize: isMobile ? '0.8rem' : '0.95rem',
                                                            }}
                                                        >
                                                            {p.producto.nombre} x {p.cantidad} 
                                                        </ListItem>
                                                    )) : null}
                                                </List>
                                            </TableCell>
                                            <TableCell>${orden.total}</TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={5} align="center">
                                            <Typography variant="body2" color="text.secondary">
                                                No hay órdenes registradas.
                                            </Typography>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </div>

                {mostrarConfirmacion && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
                        <div className="bg-white p-6 rounded-xl shadow-2xl max-w-sm w-full text-center relative">
                            <button
                                onClick={() => setMostrarConfirmacion(false)}
                                className="absolute top-2 right-2 text-gray-500 hover:text-red-600 transition"
                            >
                                <FiXCircle className="text-2xl" />
                            </button>
                            <p className="mb-6 font-medium text-gray-800 text-lg">
                                {tipoConfirmacion === 'guardar'
                                    ? '¿Deseas guardar esta orden?'
                                    : '¿Seguro que quieres cancelar esta orden?'}
                            </p>
                            <div className="flex justify-center gap-4">
                                <button
                                    onClick={confirmarAccion}
                                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-all shadow"
                                >
                                    Sí
                                </button>
                                <button
                                    onClick={() => setMostrarConfirmacion(false)}
                                    className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500 transition-all shadow"
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
