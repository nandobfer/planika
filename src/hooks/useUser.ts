import { useContext, useMemo } from "react"
import UserContext from "../contexts/UserContext"
import { jwtDecode } from "jwt-decode"
import type { User } from "../types/server/class/User"
import axios from "axios"
import { api_url } from "../backend/api"
import { useNavigate } from "react-router-dom"
import { useFilesDialogModal } from "./useFilesDialogModal"

export const useUser = () => {
    const context = useContext(UserContext)
    const navigate = useNavigate()
    const updateProfilePic = useFilesDialogModal({ accept: "image/*", request: (formData) => patchProfilePic(formData) })

    const logout = () => {
        context.setUser(null)
        context.setAccessToken(null)
    }

    const handleLogin = (token: string) => {
        const decryped = jwtDecode<{ user: User; exp: number; iat: number }>(token)
        context.setUser(decryped.user)
        console.log(decryped.user)
        context.setAccessToken({ ...decryped, value: token })
        navigate("/trips")
    }

    const authenticatedApi = useMemo(
        () => axios.create({ baseURL: api_url, headers: { Authorization: `Bearer ${context.accessToken?.value}` } }),
        [context.accessToken]
    )

    const patch = async (data: Partial<User>) => {
        if (!context.accessToken) throw new Error("No access token")

        const response = await authenticatedApi.patch<User>("/user", data)
        context.setUser(response.data)
    }

    const patchProfilePic = async (formData: FormData) => {
        if (!context.accessToken) throw new Error("No access token")

        const response = await authenticatedApi.patch<User>("/user", formData)

        context.setUser(response.data)
    }

    return { ...context, logout, handleLogin, authenticatedApi, patch, updateProfilePic }
}
