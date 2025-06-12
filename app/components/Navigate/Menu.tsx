'use client'

import Link from 'next/link'
import { useState } from 'react'
import { FiMenu, FiX } from 'react-icons/fi'

function Menu() {
  const [isOpen, setIsOpen] = useState(false)
  return (
    <header className="bg-gray-900 shadow-md text-white">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">Catálogo</h1>
        {/* Botón para móviles */}
        <button
          className="md:hidden text-2xl text-white"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Abrir menú"
        >
          {isOpen ? <FiX /> : <FiMenu />}
        </button>
        {/* Menú horizontal en pantallas grandes */}
        <nav className="hidden md:flex gap-6">
          <Link href="/" className="hover:text-blue-400">Home</Link>
          <Link href="/productos" className="hover:text-blue-400">Productos</Link>
          <Link href="/ordenes" className="hover:text-blue-400">Órdenes</Link>
        </nav>
      </div>
      {/* Menú desplegable para móviles */}
      {isOpen && (
        <nav className="md:hidden bg-gray-900 px-4 pb-4">
          <ul className="flex flex-col gap-2">
            <li><Link href="/" onClick={() => setIsOpen(false)} className="hover:text-blue-400">Inicio</Link></li>
            <li><Link href="/productos" onClick={() => setIsOpen(false)} className="hover:text-blue-400">Productos</Link></li>
            <li><Link href="/ordenes" onClick={() => setIsOpen(false)} className="hover:text-blue-400">Órdenes</Link></li>
          </ul>
        </nav>
      )}
    </header>
  )
}

export default Menu
