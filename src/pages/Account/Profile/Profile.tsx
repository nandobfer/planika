import React, { useState } from "react"
import { Avatar, Box, Button, IconButton, Skeleton, TextField, Typography } from "@mui/material"
import { useFormik } from "formik"
import type { UserForm } from "../../../types/server/class/User"
import { useUser } from "../../../hooks/useUser"
import { SaveButton } from "../SaveButton"
import { EventBus } from "../../../tools/EventBus"
import { useSnackbar } from "burgos-snackbar"

interface ProfileProps {}

const avatar_size = 150

export const Profile: React.FC<ProfileProps> = () => {
    const [file, setFile] = useState<File | null>(null)

    const { user, patch, profilePicSettings } = useUser()
    const { snackbar } = useSnackbar()

    const formik = useFormik<Partial<UserForm>>({
        initialValues: { name: user?.name, email: user?.email, picture: user?.picture },
        async onSubmit(values, formikHelpers) {
            EventBus.emit("account-loading", true)

            try {
                if (shouldPatch) {
                    await patch({ name: values.name, email: values.email })
                }
            } catch (error) {
                console.log(error)
            } finally {
                EventBus.emit("account-loading", false)
                snackbar({ text: "Perfil atualizado com sucesso!", severity: "success" })
            }
        },
        enableReinitialize: true,
    })

    const shouldPatch = formik.values.name !== formik.initialValues.name || formik.values.email !== formik.initialValues.email
    const disabledButton = !shouldPatch && !file

    return (
        <Box sx={{ flexDirection: "column", gap: 3, flex: 1 }}>
            <Box sx={{ alignItems: "center", gap: 3, flexDirection: { xs: "column", md: "row" } }}>
                <IconButton onClick={profilePicSettings.openModal}>
                    <Avatar
                        src={file ? URL.createObjectURL(file) : formik.values.picture || undefined}
                        sx={{ width: avatar_size, height: avatar_size }}
                    />
                </IconButton>
                <Button onClick={profilePicSettings.openModal}>Clique para alterar a imagem de perfil</Button>
            </Box>
            <form onSubmit={formik.handleSubmit}>
                <TextField label="Nome" value={formik.values.name} onChange={formik.handleChange} name="name" />
                <TextField label="E-mail" value={formik.values.email} onChange={formik.handleChange} name="email" />

                <SaveButton onClick={formik.submitForm} disabled={disabledButton} />
            </form>

            {profilePicSettings.Modal}
        </Box>
    )
}
