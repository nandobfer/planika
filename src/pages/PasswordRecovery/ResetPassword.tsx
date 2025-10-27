import React from "react"
import { Box, TextField, Typography } from "@mui/material"
import { useLocation, useNavigate } from "react-router-dom"
import type { Recovery } from "../../types/server/class/Recovery"
import { SaveButton } from "../Account/SaveButton"
import { useUser } from "../../hooks/useUser"
import { EventBus } from "../../tools/EventBus"
import { useFormik } from "formik"
import { yup_validations } from "../../tools/yup_validations"
import * as yup from "yup"

interface ResetPasswordProps {}

export const ResetPassword: React.FC<ResetPasswordProps> = (props) => {
    const recovery = useLocation().state as Recovery
    const { sendRecoveryNewPassword } = useUser()
    const navigate = useNavigate()

    const formik = useFormik<{ password: string }>({
        initialValues: { password: "" },
        onSubmit: async (values) => {
            EventBus.emit("password-recovery-loading", true)
            try {
                await sendRecoveryNewPassword(recovery, values.password)
                navigate("/recovery/success")
            } catch (error) {
                console.log(error)
            } finally {
                EventBus.emit("password-recovery-loading", false)
            }
        },
        validationSchema: yup.object().shape({
            password: yup_validations.password,
        }),
        validateOnChange: false,
    })

    return (
        <Box sx={{ display: "contents" }}>
            <Typography>Redefinir senha para {recovery.target}</Typography>
            <form onSubmit={formik.handleSubmit}>
                <TextField
                    label="Nova senha"
                    type="password"
                    value={formik.values.password}
                    onChange={formik.handleChange}
                    name="password"
                    required
                    error={!!formik.errors.password}
                    helperText={formik.errors.password}
                />
                <SaveButton>Redefinir senha</SaveButton>
            </form>
        </Box>
    )
}
