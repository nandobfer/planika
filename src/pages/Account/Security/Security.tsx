import React from "react"
import { Box, TextField, Typography } from "@mui/material"
import { useFormik } from "formik"
import * as yup from "yup"
import { SaveButton } from "../SaveButton"
import { EventBus } from "../../../tools/EventBus"
import { useUser } from "../../../hooks/useUser"
import { useSnackbar } from "burgos-snackbar"
import { AxiosError } from "axios"
import type { HandledPrismaError } from "../../../types/server/class/HandledError"

interface SecurityProps {}

export const Security: React.FC<SecurityProps> = () => {
    const { tryChangePassword } = useUser()
    const { snackbar } = useSnackbar()

    const formik = useFormik({
        initialValues: { current_password: "", new_password: "", confirm_password: "" },
        onSubmit: async (values) => {
            EventBus.emit("account-loading", true)

            try {
                await tryChangePassword(values.current_password, values.new_password)
                snackbar({ text: "Senha alterada com sucesso!", severity: "success" })
                formik.resetForm()
            } catch (error) {
                if (error instanceof AxiosError && error.response?.data.key) {
                    const handledError = error.response.data as HandledPrismaError
                    formik.setFieldError(handledError.key, handledError.text)
                } else {
                    snackbar({ text: "Erro ao alterar a senha.", severity: "error" })
                }
            } finally {
                EventBus.emit("account-loading", false)
            }
        },
        validationSchema: yup.object().shape({
            current_password: yup.string().required(),
            new_password: yup.string().min(6, "A nova senha deve ter ao menos 6 caracteres.").required(),
            confirm_password: yup
                .string()
                .oneOf([yup.ref("new_password")], "As senhas não coincidem.")
                .required(),
        }),
        validateOnChange: false,
    })
    return (
        <Box sx={{ flexDirection: "column", gap: 3 }}>
            <Typography variant="h5">Segurança</Typography>
            <Typography variant="body1" color="text.secondary">
                Digite a sua senha atual para criar uma nova.
            </Typography>

            <form onSubmit={formik.handleSubmit}>
                <TextField
                    label="Senha atual"
                    value={formik.values.current_password}
                    onChange={formik.handleChange}
                    name="current_password"
                    type="password"
                    required
                    error={!!formik.errors.current_password}
                    helperText={formik.errors.current_password}
                />
                <TextField
                    label="Nova senha"
                    value={formik.values.new_password}
                    onChange={formik.handleChange}
                    name="new_password"
                    type="password"
                    required
                    error={!!formik.errors.new_password}
                    helperText={formik.errors.new_password}
                />
                <TextField
                    label="Confirme a nova senha"
                    value={formik.values.confirm_password}
                    onChange={formik.handleChange}
                    name="confirm_password"
                    type="password"
                    required
                    error={!!formik.errors.confirm_password}
                    helperText={formik.errors.confirm_password}
                />
                <SaveButton onClick={formik.submitForm} />
            </form>
        </Box>
    )
}
