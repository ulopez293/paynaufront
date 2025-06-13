'use client'

import { useEffect } from 'react'

export function useFetchAuth() {
  useEffect(() => {
    fetch('/api/auth', { method: 'POST' })
      .then(res => res.json())
      .then(data => {
        if (data.success) console.log('Token guardado en cookie')
      })
      .catch(console.error)
  }, [])
}
