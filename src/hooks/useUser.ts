import { useContext, useMemo } from "react"
import UserContext from "../contexts/UserContext"
import { jwtDecode } from "jwt-decode"
import type { User } from "../types/server/class/User"
import axios from "axios"
import { api_url } from "../backend/api"

export const useUser = () => {
    const context = useContext(UserContext)

    const logout = () => {
        context.setUser(null)
        context.setAccessToken(null)
    }

    const handleLogin = (token: string) => {
        const decryped = jwtDecode<{ user: User; exp: number; iat: number }>(token)
        context.setUser(decryped.user)
        console.log(decryped.user)
        context.setAccessToken({ ...decryped, value: token })
    }

    const adminApi = useMemo(
        () => axios.create({ baseURL: api_url, headers: { Authorization: `Bearer ${context.accessToken?.value}` } }),
        [context.accessToken]
    )

    return { ...context, logout, handleLogin, adminApi }
}
