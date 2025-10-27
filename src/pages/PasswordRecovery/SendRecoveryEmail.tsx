import React, { useState } from 'react'
import {Box, TextField, Typography} from '@mui/material'
import { useLocation, useNavigate } from 'react-router-dom'
import { useUser } from '../../hooks/useUser'
import { Title } from '../../components/Title'
import { SaveButton } from '../Account/SaveButton'
import { EventBus } from '../../tools/EventBus'
import { useSnackbar } from 'burgos-snackbar'

interface SendRecoveryEmailProps {
    
}

export const SendRecoveryEmail: React.FC<SendRecoveryEmailProps> = (props) => {
    const initialEmail = useLocation().state as string | undefined
    const { sendPasswordRecoveryEmail } = useUser()
    const navigate = useNavigate()
    const { snackbar } = useSnackbar()

    const [email, setEmail] = useState(initialEmail || "")

    const onSubmit = async (ev: React.FormEvent) => {
        ev.preventDefault()
        EventBus.emit("password-recovery-loading", true)
        try {
            await sendPasswordRecoveryEmail(email)
            navigate("/recovery/code", { state: email })
        } catch (error) {
            console.log(error)
            snackbar({text: "Erro ao enviar e-mail de recuperação.", severity: "error"})
        } finally {
            EventBus.emit("password-recovery-loading", false)
        }
    }

    return (
            <form onSubmit={onSubmit}>
                <Title name="Esqueci minha senha" />
                <Typography>Enviaremos um e-mail para o endereço abaixo contendo um código de verificação.</Typography>

                <TextField value={email} onChange={(e) => setEmail(e.target.value)} label="e-mail" />
                <SaveButton>Enviar código</SaveButton>
            </form>
    )
}