import { NextResponse } from 'next/server'

export async function POST() {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_GOLANG}/api/auth`, {
            method: 'POST',
            cache: 'no-store',
        })
        const data = await res.json()
        if (!res.ok) {
            return NextResponse.json({ error: data.error || 'Error de autenticación' }, { status: 400 })
        }
        const response = NextResponse.json({ success: true, token: data.token })
        response.cookies.set('token', data.token, {
            httpOnly: false,
            secure: false,
            sameSite: 'lax',
            path: '/',
        })
        return response
    } catch (error) {
        console.error(error)
        return NextResponse.json(
            { error: 'Error inesperado del servidor' },
            { status: 500 }
        )
    }
}