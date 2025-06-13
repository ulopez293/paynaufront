import { getToken } from "../utils/getToken"

export const useToken = () => {
    const validateToken = () => {
        const token = getToken()
        if (!token) throw new Error('Token no disponible')
        return token
    }
    return { getToken, validateToken }
}