import React, { useState } from "react"
import { Box, Button, IconButton, LinearProgress, TextField } from "@mui/material"
import { GoogleLogin } from "@react-oauth/google"
import { useUser } from "../hooks/useUser"
import { useFormik } from "formik"
import { Title } from "./Title"
import * as yup from "yup"
import { Visibility, VisibilityOff } from "@mui/icons-material"
import { AxiosError } from "axios"
import type { HandledPrismaError } from "../types/server/class/HandledError"
import { useMuiTheme } from "../hooks/useMuiTheme"
import { yup_validations } from "../tools/yup_validations"
import type { GoogleAuthResponse, UserForm } from "../types/server/class/User"

interface SignupFormProps {
    width?: number
    onSuccess?: () => void
}

export const SignupForm: React.FC<SignupFormProps> = (props) => {
    const containerWidth = props.width || 400
    const [loading, setLoading] = useState(false)
    const [seePassword, setSeePassword] = useState(false)
    const { autofillStyle } = useMuiTheme()

    const { handleGoogleSuccess, trySignup } = useUser()

    const onGoogleSuccess = async (data: GoogleAuthResponse) => {
        if (loading) return
        setLoading(true)

        try {
            handleGoogleSuccess(data, props.onSuccess)
        } catch (error) {
            onGoogleError()
        } finally {
            setLoading(false)
        }
    }

    const onGoogleError = () => {
        console.log("Login Failed")
    }

    const formik = useFormik<UserForm>({
        initialValues: { name: "", email: "", password: "" },
        onSubmit: async (values) => {
            if (loading) return
            setLoading(true)

            try {
                await trySignup(values, props.onSuccess)
            } catch (error) {
                if (error instanceof AxiosError && error.response?.data.key) {
                    const handledError = error.response.data as HandledPrismaError
                    console.log(handledError)
                    formik.setFieldError(handledError.key, handledError.text)
                }
            } finally {
                setLoading(false)
            }
        },
        validationSchema: yup.object().shape({
            name: yup.string().required(),
            email: yup.string().email("E-mail inválido.").required(),
            password: yup_validations.password,
        }),
        validateOnChange: false,
    })

    return (
        <Box sx={{ flexDirection: "column", pointerEvents: loading ? "none" : undefined, alignItems: "center" }}>
            <Title name="Cadastrar-se" />
            {loading && <LinearProgress variant="indeterminate" sx={{ width: 1, position: "absolute", top: 0, left: 0 }} />}
            <Box sx={{ flexDirection: "column", width: containerWidth, gap: 2 }}>
                <form onSubmit={formik.handleSubmit}>
                    <TextField
                        label="nome"
                        value={formik.values.name}
                        name="name"
                        onChange={formik.handleChange}
                        disabled={loading}
                        required
                        error={!!formik.errors.name}
                        helperText={formik.errors.name}
                        autoComplete="off"
                        size="small"
                        variant="standard"
                    />
                    <TextField
                        label="e-mail"
                        value={formik.values.email}
                        name="email"
                        onChange={formik.handleChange}
                        type="email"
                        disabled={loading}
                        required
                        error={!!formik.errors.email}
                        helperText={formik.errors.email}
                        autoComplete="off"
                        size="small"
                        variant="standard"
                        sx={autofillStyle}
                    />
                    <TextField
                        label="senha"
                        value={formik.values.password}
                        name="password"
                        onChange={formik.handleChange}
                        type={seePassword ? "text" : "password"}
                        disabled={loading}
                        required
                        error={!!formik.errors.password}
                        helperText={formik.errors.password}
                        autoComplete="off"
                        variant="standard"
                        size="small"
                        sx={autofillStyle}
                        slotProps={{
                            input: {
                                endAdornment: (
                                    <IconButton size="small" onClick={() => setSeePassword(!seePassword)}>
                                        {seePassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                                    </IconButton>
                                ),
                            },
                        }}
                    />
                    <Button variant="contained" type="submit" fullWidth disabled={loading}>
                        Cadastrar
                    </Button>
                </form>
                <GoogleLogin
                    width={containerWidth}
                    onSuccess={(credentialResponse) => {
                        if (credentialResponse.credential) onGoogleSuccess(credentialResponse as GoogleAuthResponse)
                    }}
                    onError={onGoogleError}
                />
            </Box>
        </Box>
    )
}
