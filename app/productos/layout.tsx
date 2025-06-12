import type { Metadata } from "next"
import "../globals.css"

export const metadata: Metadata = {
    title: "Productos",
    description: "Ejercicio de paynau",
}

export default function Layout({ children }: { children: React.ReactNode }) {
    return children
}
