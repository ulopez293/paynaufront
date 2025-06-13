'use client'

import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-600 to-blue-800 text-white">
      <section className="text-center px-6 py-24">
        <h1 className="text-5xl md:text-7xl font-extrabold drop-shadow-md mb-6 animate-fade-in">
          Bienvenido a <span className="text-yellow-300">Paynau</span>
        </h1>
        <p className="text-lg md:text-2xl text-white/90 max-w-2xl mx-auto mb-10 animate-fade-in delay-100">
          Simplificamos la gestión de productos y órdenes de compra para tu negocio.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4 animate-fade-in delay-200">
          <Link
            href="/productos"
            className="bg-yellow-400 hover:bg-yellow-300 text-blue-900 font-semibold py-3 px-8 rounded-full shadow-lg transition"
          >
            Ver productos
          </Link>
          <Link
            href="/ordenes"
            className="border border-white hover:bg-white hover:text-blue-800 text-white font-semibold py-3 px-8 rounded-full transition"
          >
            Realizar orden
          </Link>
        </div>
      </section>
      <section className="bg-white text-gray-800 py-20 px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12">
          <div className="animate-slide-in-left">
            <h2 className="text-3xl font-bold mb-4">¿Qué es Paynau?</h2>
            <p className="text-gray-600 text-lg">
              Paynau es una solución completa para manejar catálogos de productos y órdenes de compra. Con una API robusta en Golang y un frontend moderno en Next.js, te damos una plataforma estable, segura y escalable.
            </p>
          </div>
          <div className="animate-slide-in-right">
            <h2 className="text-3xl font-bold mb-4">Características principales</h2>
            <ul className="space-y-4 text-gray-700">
              {[
                'Gestión de productos con stock en tiempo real',
                'Órdenes seguras con control de concurrencia',
                'Autenticación con JWT por cada transacción',
                'Diseño responsivo y simple'
              ].map((feature, i) => (
                <li key={i} className="flex items-center gap-3">
                  <span className="text-green-500 text-xl">✔</span>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </main>
  )
}
