import { useContext } from "react"
import FormModalContext from "../contexts/FormModalContext"

export const useFormModal = () => {
    const context = useContext(FormModalContext)

    const close = () => {
        context.setArtist(null)
        context.setBand(null)
        context.setEvent(null)
        context.open(false)
    }

    return {...context, close}
}