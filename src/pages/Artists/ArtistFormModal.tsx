import React, { useEffect, useState } from "react"
import { Avatar, Box, Button, CircularProgress, Dialog, IconButton, Skeleton, TextField, useMediaQuery } from "@mui/material"
import { Title } from "../../components/Title"
import { Close, Edit } from "@mui/icons-material"
import { useFormModal } from "../../hooks/useFormModal"
import { useFormik } from "formik"
import { useUser } from "../../hooks/useUser"
import type { ArtistForm } from "../../types/server/class/Artist"
import { useFilesDialogModal } from "../../hooks/useFilesDialogModal"

interface ArtistFormModalProps {}

const endpoint = "/artist"

export const ArtistFormModal: React.FC<ArtistFormModalProps> = (props) => {
    const [loading, setLoading] = useState(false)

    const isMobile = useMediaQuery("(orientation: portrait)")
    const context = useFormModal()
    const { adminApi: api } = useUser()

    const fileDialogModal = useFilesDialogModal({ endpoint, onUpload: (data) => context.setArtist(data) })

    const formik = useFormik<ArtistForm>({
        initialValues: context.artist
            ? {
                  name: context.artist.name,
                  birthdate: context.artist.birthdate || undefined,
                  description: context.artist.description || undefined,
                  image: context.artist.image || undefined,
                  instagram: context.artist.instagram || undefined,
              }
            : { name: "" },
        async onSubmit(values, formikHelpers) {
            if (loading) return

            try {
                setLoading(true)

                const response = context.artist
                    ? await api.patch(endpoint, values, { params: { artist_id: context.artist.id } })
                    : await api.post(endpoint, values)

                if (context.artist) {
                    context.close()
                } else {
                    context.setArtist(response.data)
                }
            } catch (error) {
                console.log(error)
            } finally {
                setLoading(false)
            }
        },
        enableReinitialize: true,
    })

    useEffect(() => {
        return () => {
            formik.resetForm()
        }
    }, [context.isOpen])

    useEffect(() => {
        if (context.artist) fileDialogModal.setTargetId(context.artist.id)
    }, [context.artist])

    return (
        <Dialog open={context.isOpen === "artist"} onClose={context.close}>
            <Title
                name={context.artist?.name ? `Editar ${context.artist.name}` : "Cadastrar artista"}
                right={
                    <IconButton onClick={context.close}>
                        <Close />
                    </IconButton>
                }
            />

            <Box sx={{ flexDirection: "column", gap: 2 }}>
                <form onSubmit={formik.handleSubmit}>
                    {context.artist && (
                        <IconButton
                            onClick={() => (isMobile ? fileDialogModal.chooseFile() : fileDialogModal.openModal())}
                            sx={{ width: "min-content", alignSelf: "center", position: "relative" }}
                        >
                            {fileDialogModal.loading ? (
                                <Skeleton variant="rounded" width={150} height={150} animation="wave" sx={{ borderRadius: "100%" }} />
                            ) : (
                                <Avatar
                                    src={context.artist.image || undefined}
                                    sx={{ width: 150, aspectRatio: 1, height: "auto", bgcolor: "background.default", color: "primary.main" }}
                                ></Avatar>
                            )}
                            <Edit
                                sx={{
                                    position: "absolute",
                                    top: 10,
                                    right: 10,
                                    color: "background.default",
                                    bgcolor: "primary.main",
                                    borderRadius: "100%",
                                    width: 30,
                                    height: "auto",
                                    padding: 0.5,
                                }}
                            />
                        </IconButton>
                    )}
                    <TextField label="Nome" value={formik.values.name} name="name" onChange={formik.handleChange} size="small" required />

                    {context.artist && (
                        <>
                            <TextField
                                label="Descrição"
                                multiline
                                value={formik.values.description}
                                name="description"
                                onChange={formik.handleChange}
                                size="small"
                                minRows={3}
                                maxRows={5}
                            />
                            <TextField
                                label="Instagram"
                                value={formik.values.instagram}
                                name="instagram"
                                onChange={formik.handleChange}
                                size="small"
                                placeholder="Insira a URL do perfil"
                                type="url"
                            />
                        </>
                    )}

                    <Button variant="contained" type="submit" sx={{ alignSelf: "flex-end" }}>
                        {loading ? <CircularProgress /> : context.artist ? "Salvar" : "Continuar"}
                    </Button>
                </form>
            </Box>

            {!isMobile && fileDialogModal.Modal}
        </Dialog>
    )
}
