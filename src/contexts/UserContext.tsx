import { createContext, useEffect, useRef, useState } from "react"
import React from "react"
import type { AccessToken, User } from "../types/server/class/User"
import { useLocalStorage } from "@mantine/hooks"
import { api } from "../backend/api"

interface UserContextValue {
    user: User | null
    setUser: React.Dispatch<React.SetStateAction<User | null>>

    accessToken: AccessToken | null
    setAccessToken: React.Dispatch<React.SetStateAction<AccessToken | null>>
}

interface UserProviderProps {
    children: React.ReactNode
}

const UserContext = createContext<UserContextValue>({} as UserContextValue)

export default UserContext

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
    const firstRender = useRef(true)
    const [user, setUser] = useLocalStorage<User | null>({ key: "planika:user", defaultValue: null })
    const [accessToken, setAccessToken] = useLocalStorage<AccessToken | null>({ key: "planika:token", defaultValue: null })

    const refreshCachedUser = async (user: User) => {
        try {
            const response = await api.get("/user", { params: { user_id: user.id } })
            if (response.data) {
                setUser(response.data)
            } else {
                setUser(null)
            }
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        if (firstRender.current && user) {
            firstRender.current = false
            refreshCachedUser(user)
        }
    }, [user, firstRender])

    useEffect(() => {
        // console.log(accessToken)
    }, [accessToken])

    return <UserContext.Provider value={{ user, setUser, accessToken, setAccessToken }}>{children}</UserContext.Provider>
}
