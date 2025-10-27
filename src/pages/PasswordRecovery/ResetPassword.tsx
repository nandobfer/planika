import React from 'react'
import {Box, TextField, Typography} from '@mui/material'
import { useLocation, useNavigate } from 'react-router-dom'
import type { Recovery } from '../../types/server/class/Recovery'
import { SaveButton } from '../Account/SaveButton'
import { useUser } from '../../hooks/useUser'
import { EventBus } from '../../tools/EventBus'

interface ResetPasswordProps {
    
}

export const ResetPassword:React.FC<ResetPasswordProps> = (props) => {
    const recovery = useLocation().state as Recovery
    const { sendRecoveryNewPassword } = useUser()
    const navigate = useNavigate()

    const [newPassword, setNewPassword] = React.useState("")

    const onSubmit = async (ev: React.FormEvent) => {
        ev.preventDefault()
        EventBus.emit("password-recovery-loading", true)
        try {
            await sendRecoveryNewPassword(recovery, newPassword)
            navigate("/recovery/success")
        } catch (error) {
            console.log(error)
        } finally {
            EventBus.emit("password-recovery-loading", false)
        }
    }
    
    return (
        <Box sx={{}}>
            <Typography>Redefinir senha para {recovery.target}</Typography>
            <form onSubmit={onSubmit}>
                <TextField
                    label="Nova senha"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                />
                <SaveButton>Redefinir senha</SaveButton>
            </form>
        </Box>
    )
}