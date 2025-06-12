export const getToken = (): string | null => {
  if (typeof document === 'undefined') return null
  const cookies = document.cookie.split('; ').reduce<Record<string, string>>((acc, cookie) => {
    const [key, value] = cookie.split('=')
    acc[key] = decodeURIComponent(value)
    return acc
  }, {})
  return cookies['token'] || null
}