import type { Metadata } from "next"
import "./globals.css"
import Navigate from "./components/Navigate/Navigate"
import { Footer } from "./components/Footer/Footer"

export const metadata: Metadata = {
  title: "Paynau",
  description: "Ejercicio de paynau",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body>
        <Navigate />
        {children}
        <Footer />
      </body>
    </html>
  );
}
