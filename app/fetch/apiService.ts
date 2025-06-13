import { NuevaOrden } from "../interface/Orden"
import { GuardarProducto } from "../interface/Producto"

const baseUrl = process.env.NEXT_PUBLIC_API_GOLANG

export const cargarProductos = async (token: string) => {
    if (!baseUrl) throw new Error('NEXT_PUBLIC_API_GOLANG no definido')
    const res = await fetch(`${baseUrl}/api/products`, {
        headers: { Authorization: `Bearer ${token}` },
    })
    if (!res.ok) throw new Error('Error al obtener productos')
    return res.json()
}

export const cargarOrdenes = async (token: string) => {
    if (!baseUrl) throw new Error('NEXT_PUBLIC_API_GOLANG no definido')
    const res = await fetch(`${baseUrl}/api/orders`, {
        headers: { Authorization: `Bearer ${token}` },
    })
    if (!res.ok) throw new Error('Error al obtener ordenes')
    return res.json()
}

export const submitOrden = async (token: string, nuevaOrden: NuevaOrden) => {
    if (!baseUrl) throw new Error('NEXT_PUBLIC_API_GOLANG no definido')
    const res = await fetch(`${baseUrl}/api/orders`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(nuevaOrden),
    })
    if (!res.ok) throw new Error('Error al guardar la orden')
    return res.json()
}

export const deleteProducto = async (token: string, id: string) => {
    if (!baseUrl) throw new Error('NEXT_PUBLIC_API_GOLANG no definido')
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
    return
}

export const guardarProducto = async (
    token: string,
    producto: GuardarProducto,
    id?: string
) => {
    if (!baseUrl) throw new Error('NEXT_PUBLIC_API_GOLANG no definido')
    const url = id ? `${baseUrl}/api/products/${id}` : `${baseUrl}/api/products`
    const method = id ? 'PUT' : 'POST'
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
    return res.json()
}