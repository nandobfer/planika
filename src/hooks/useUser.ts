import { useContext, useMemo } from "react"
import UserContext from "../contexts/UserContext"
import { jwtDecode } from "jwt-decode"
import type { GoogleAuthResponse, User, UserForm } from "../types/server/class/User"
import axios from "axios"
import { api, api_url } from "../backend/api"
import { useNavigate } from "react-router-dom"
import { useFilesDialogModal } from "./useFilesDialogModal"
import type { Recovery } from "../types/server/class/Recovery"
import type { TripParticipant } from "../types/server/class/Trip/TripParticipant"

export const useUser = () => {
    const context = useContext(UserContext)
    const navigate = useNavigate()
    const profilePicSettings = useFilesDialogModal({ accept: "image/*", request: (formData) => patchProfilePic(formData) })

    const logout = () => {
        navigate("/")
        setTimeout(() => {
            context.setUser(null)
            context.setAccessToken(null)
        })
    }

    const handleLogin = (token: string, onSuccess?: () => void) => {
        const decryped = jwtDecode<{ user: User; exp: number; iat: number }>(token)
        context.setUser(decryped.user)
        // console.log(decryped.user)
        context.setAccessToken({ ...decryped, value: token })
        if (onSuccess) {
            onSuccess()
        } else {
            navigate("/my-trips")
        }
    }

    const handleGoogleSuccess = async (data: GoogleAuthResponse, onSuccess?: () => void) => {
        const response = await api.post<string>("/login/google", data)
        // console.log(response.data)
        handleLogin(response.data, onSuccess)

        // const decoded = jwtDecode(data.credential)
        // console.log(decoded)
    }

    const authenticatedApi = useMemo(
        () => axios.create({ baseURL: api_url, headers: { Authorization: `Bearer ${context.accessToken?.value}` } }),
        [context.accessToken?.value]
    )

    const patch = async (data: Partial<User>) => {
        if (!context.accessToken) throw new Error("No access token")

        const response = await authenticatedApi.patch<User>("/user", data)
        console.log(response.data)
        context.setUser(response.data)
    }

    const patchProfilePic = async (formData: FormData) => {
        if (!context.accessToken) throw new Error("No access token")

        const response = await authenticatedApi.patch<User>("/user", formData)

        context.setUser(response.data)
    }

    const tryChangePassword = async (current_password: string, new_password: string) => {
        if (!context.accessToken) throw new Error("No access token")

        await authenticatedApi.post("/user/change-password", { current_password, new_password })
    }

    const trySignup = async (data: UserForm, onSuccess?: () => void) => {
        const response = await api.post<string>("/user", data)
        handleLogin(response.data, onSuccess)
    }

    const searchUser = async (query: string) => {
        const response = await api.get<User[]>("/user/search", { params: { query } })
        return response.data
    }

    const fetchAllUsers = async () => {
        const response = await api.get<User[]>("/user")
        return response.data
    }

    const sendPasswordRecoveryEmail = async (email: string) => {
        await api.post("/recovery", { email })
    }

    const sendCodeVerification = async (email: string, code: string) => {
        const response = await api.post<Recovery>("/recovery/verify-code", { target: email, code: code.split("").map((item) => Number(item)) })
        return response.data
    }

    const sendRecoveryNewPassword = async (recovery: Recovery, password: string) => {
        const response = await api.post<string>("/recovery/reset-password", { target: recovery.target, password })
        return response.data
    }

    const getPendingInvitations = async () => {
        if (!context.accessToken) throw new Error("No access token")

        const response = await authenticatedApi.get<TripParticipant[]>("/user/pending-invitations")
        return response.data
    }

    return {
        ...context,
        logout,
        handleLogin,
        authenticatedApi,
        patch,
        profilePicSettings,
        tryChangePassword,
        handleGoogleSuccess,
        trySignup,
        searchUser,
        fetchAllUsers,
        sendPasswordRecoveryEmail,
        sendCodeVerification,
        sendRecoveryNewPassword,
        getPendingInvitations,
    }
}
