import React, { useState } from "react"
import { Box, Button, CircularProgress, LinearProgress, TextField, Typography } from "@mui/material"
import { useFormik } from "formik"
import { api } from "../backend/api"
import { useMutation } from "@tanstack/react-query"
import { useUser } from "../hooks/useUser"
import * as yup from "yup"
import type { AxiosError } from "axios"
import type { GoogleAuthResponse, LoginForm } from "../types/server/class/User"
import { GoogleLogin } from "@react-oauth/google"
import { useMuiTheme } from "../hooks/useMuiTheme"
import { useNavigate } from "react-router-dom"

interface LoginFormMenuProps {
    width?: number
    loadingPosition?: "top" | "bottom"
    handleAccountMenuClose?: () => void
    onSuccess?: () => void
}

export const LoginFormMenu: React.FC<LoginFormMenuProps> = (props) => {
    const loadingPosition = props.loadingPosition || "bottom"
    const containerWidth = props.width || 270
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    const { autofillStyle } = useMuiTheme()
    const { handleLogin, handleGoogleSuccess } = useUser()
    const { mutate } = useMutation({
        mutationFn: async (credentials: LoginForm) => await api.post<string>("/login", credentials).then((response) => response.data),
        onSuccess: (token) => {
            handleLogin(token, props.onSuccess)
        },
        onError: (error: AxiosError) => {
            if (error.response?.status === 401) {
                formik.setFieldError("password", "credenciais inválidas.")
            }
        },
        onSettled: () => setLoading(false),
    })

    const formik = useFormik<LoginForm>({
        initialValues: { login: "", password: "" },
        async onSubmit(values) {
            if (loading) return
            setLoading(true)
            mutate(values)
        },
        validationSchema: yup.object().shape({
            login: yup.string().email().required(),
            password: yup.string().required(),
        }),
        validateOnChange: false,
        validateOnBlur: true,
    })

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

    const onForgotPassword = () => {
        navigate("/recovery", { state: formik.values.login })
        props.handleAccountMenuClose?.()
    }

    return (
        <Box
            sx={{
                flexDirection: "column",
                gap: 1,
                alignItems: "center",
                width: containerWidth,
                alignSelf: "center",
                paddingTop: 1,
                ...autofillStyle,
            }}
            onKeyDown={(ev) => {
                if (ev.key === "Tab") {
                    ev.stopPropagation()
                }
            }}
        >
            {loading && <LinearProgress variant="indeterminate" sx={{ width: 1, position: "absolute", [loadingPosition]: 0, left: 0 }} />}
            {/* <Typography>Entrar</Typography> */}

            <form onSubmit={formik.handleSubmit}>
                <TextField
                    label="e-mail"
                    value={formik.values.login}
                    name="login"
                    onChange={formik.handleChange}
                    type="email"
                    size="small"
                    variant="standard"
                    disabled={loading}
                    required
                    error={!!formik.errors.password}
                    helperText={formik.errors.password}
                    autoComplete="off"
                />
                <TextField
                    label="senha"
                    value={formik.values.password}
                    name="password"
                    onChange={formik.handleChange}
                    type="password"
                    size="small"
                    variant="standard"
                    disabled={loading}
                    required
                    error={!!formik.errors.password}
                    helperText={
                        <Button size="small" onClick={onForgotPassword}>
                            Esqueci minha senha
                        </Button>
                    }
                    autoComplete="off"
                />
                <Button variant="contained" type="submit" fullWidth disabled={loading}>
                    Entrar
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
    )
}
