import { createContext, useState } from "react"
import React from "react"
import type { Artist } from "../types/server/class/Artist"
import type { Event } from "../types/server/class/Event"
import type { Band } from "../types/server/class/Band"

export type FormModalType = "band" | "artist" | "event" | false

interface FormModalContextValue {
    isOpen: FormModalType
    open: React.Dispatch<React.SetStateAction<FormModalType>>

    artist: Artist | null
    setArtist: React.Dispatch<React.SetStateAction<Artist | null>>

    event: Event | null
    setEvent: React.Dispatch<React.SetStateAction<Event | null>>

    band: Band | null
    setBand: React.Dispatch<React.SetStateAction<Band | null>>
}

interface FormModalProviderProps {
    children: React.ReactNode
}

const FormModalContext = createContext<FormModalContextValue>({} as FormModalContextValue)

export default FormModalContext

export const FormModalProvider: React.FC<FormModalProviderProps> = ({ children }) => {
    const [open, setOpen] = useState<FormModalType>(false)
    const [artist, setArtist] = useState<Artist | null>(null)
    const [band, setBand] = useState<Band | null>(null)
    const [event, setEvent] = useState<Event | null>(null)

    return (
        <FormModalContext.Provider value={{ isOpen: open, open: setOpen, artist, setArtist, band, setBand, event, setEvent }}>{children}</FormModalContext.Provider>
    )
}
