export type Producto = {
  id: string
  nombre: string
  descripcion: string
  precio: number
  stock: number
}

export type ProductoConCantidad = Producto & { cantidad: number }