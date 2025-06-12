import { Producto } from "./Producto"

export type Orden = {
    id: string
    cliente: string
    fecha: string
    total: string
    productos: OrdenProductoConInfo[]
}
export type OrdenProductoConInfo = {
    id: string
    ordenId: string
    productoId: string
    cantidad: number
    total: number
    producto: Producto
}

export type NuevaOrden = {
    cliente: string
    productos: {
        producto_id: string
        cantidad: number
    }[]
}