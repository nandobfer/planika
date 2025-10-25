import React, { useState } from "react"
import { Box, Button, TextField } from "@mui/material"
import { LoginFormMenu } from "../components/LoginFormMenu"
import { GoogleLogin } from "@react-oauth/google"
import { type GoogleAuthResponse, type UserForm } from "../types/server/class/User"
import { useUser } from "../hooks/useUser"
import { useFormik } from "formik"
import { Title } from "../components/Title"
import * as yup from "yup"

interface SignupProps {}
const containerWidth = 400

export const Signup: React.FC<SignupProps> = (props) => {
    const [loading, setLoading] = useState(false)

    const { handleGoogleSuccess, trySignup } = useUser()

    const onGoogleSuccess = async (data: GoogleAuthResponse) => {
        if (loading) return
        setLoading(true)

        try {
            handleGoogleSuccess(data)
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
                await trySignup(values)
            } catch (error) {
                console.log(error)
            } finally {
                setLoading(false)
            }
        },
        validationSchema: yup.object().shape({
            name: yup.string().required(),
            email: yup.string().email("E-mail inválido.").required(),
            password: yup.string().min(6, "A senha deve ter ao menos 6 caracteres.").required(),
        }),
        validateOnChange: false,
    })

    return (
        <Box sx={{ flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", padding: 10 }}>
            <Box sx={{ flexDirection: "column", width: containerWidth, gap: 2 }}>
                <Title name="Cadastrar-se" />
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
                    />
                    <TextField
                        label="senha"
                        value={formik.values.password}
                        name="password"
                        onChange={formik.handleChange}
                        type="password"
                        disabled={loading}
                        required
                        error={!!formik.errors.password}
                        helperText={formik.errors.password}
                        autoComplete="off"
                        size="small"
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
