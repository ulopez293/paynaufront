// app/page.tsx (o Home si estás exportando como componente de servidor)

import Link from 'next/link'

export default function Home() {
  return (
    <main className="bg-white min-h-screen text-gray-800">
      <section className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-6">Bienvenido a Paynau</h1>
        <p className="text-lg md:text-xl mb-8">
          Simplificamos la gestión de productos y órdenes de compra para tu negocio.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link href="/productos" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded">
            Ver productos
          </Link>
          <Link href="/ordenes" className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-6 rounded">
            Realizar orden
          </Link>
        </div>
      </section>

      <section className="bg-gray-50 py-16">
        <div className="max-w-4xl mx-auto px-4 grid md:grid-cols-2 gap-12">
          <div>
            <h2 className="text-2xl font-bold mb-4">¿Qué es Paynau?</h2>
            <p>
              Paynau es una solución completa para manejar catálogos de productos y órdenes de compra. Con una API robusta desarrollada en Golang y un frontend moderno con Next.js, brindamos una plataforma estable, segura y escalable.
            </p>
          </div>
          <div>
            <h2 className="text-2xl font-bold mb-4">Características principales</h2>
            <ul className="list-disc list-inside space-y-2">
              <li>Gestión de productos con stock en tiempo real</li>
              <li>Órdenes seguras con control de concurrencia</li>
              <li>Autenticación con JWT por cada transacción</li>
              <li>Diseño responsivo y simple</li>
            </ul>
          </div>
        </div>
      </section>
    </main>
  )
}
