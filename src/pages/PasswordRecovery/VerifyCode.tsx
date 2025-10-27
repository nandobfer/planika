import React from "react"
import { Typography } from "@mui/material"
import { Title } from "../../components/Title"
import VerificationInput from "react-verification-input"
import { useLocation, useNavigate } from "react-router-dom"
import { EventBus } from "../../tools/EventBus"
import { useUser } from "../../hooks/useUser"
import { useSnackbar } from "burgos-snackbar"
import { AxiosError } from "axios"

interface VerifyCodeProps {}

export const VerifyCode: React.FC<VerifyCodeProps> = (props) => {
    const email = useLocation().state as string
    const { sendCodeVerification } = useUser()
    const navigate = useNavigate()
    const { snackbar } = useSnackbar()

    const onSubmit = async (ev?: React.FormEvent) => {
        ev?.preventDefault()
    }

    const onComplete = async (code: string) => {
        EventBus.emit("password-recovery-loading", true)
        try {
            const recovery = await sendCodeVerification(email, code)
            navigate("/recovery/reset-password", { state: recovery })
        } catch (error) {
            if (error instanceof AxiosError && error.response?.data) {
                snackbar({ text: error.response.data as string, severity: "error" })
            }
            console.log(error)
        } finally {
            EventBus.emit("password-recovery-loading", false)
        }
    }

    return (
        <form onSubmit={onSubmit}>
            <Title name="Verificação de código" />
            <Typography>Insira o código de verificação enviado para o seu e-mail.</Typography>

            <VerificationInput
                autoFocus
                length={5}
                placeholder=""
                validChars="0-9"
                onComplete={onComplete}
                classNames={{ character: "recovery-character", characterSelected: "recovery-character-selected" }}
            />
        </form>
    )
}
