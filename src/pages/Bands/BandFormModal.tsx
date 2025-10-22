import React, { useEffect, useState } from "react"
import { Autocomplete, Avatar, Box, Button, Checkbox, CircularProgress, Dialog, IconButton, Skeleton, TextField } from "@mui/material"
import { Title } from "../../components/Title"
import { Close, Edit, Groups } from "@mui/icons-material"
import { useFormModal } from "../../hooks/useFormModal"
import { useFormik } from "formik"
import { useUser } from "../../hooks/useUser"
import { useFileDialog, useMediaQuery } from "@mantine/hooks"
import type { BandForm } from "../../types/server/class/Band"
import { useQuery } from "@tanstack/react-query"
import type { Artist } from "../../types/server/class/Artist"
import { useFilesDialogModal } from "../../hooks/useFilesDialogModal"

interface BandFormModalProps {}

const endpoint = "/band"

export const BandFormModal: React.FC<BandFormModalProps> = (props) => {
    const [loading, setLoading] = useState(false)

    const isMobile = useMediaQuery("(orientation: portrait)")
    const context = useFormModal()

    const { data: artists, isFetching: loadingArtists } = useQuery<Artist[]>({
        initialData: [],
        queryKey: ["artistsData"],
        queryFn: async () => (await api.get("/artist")).data,
    })
    const { adminApi: api } = useUser()

    const fileDialogModal = useFilesDialogModal({ endpoint, onUpload: (data) => context.setBand(data) })

    const formik = useFormik<BandForm>({
        initialValues: context.band
            ? {
                  name: context.band.name,
                  description: context.band.description || undefined,
                  image: context.band.image || undefined,
                  instagram: context.band.instagram || undefined,
                  artists: context.band.artists || [],
              }
            : { name: "" },
        async onSubmit(values, formikHelpers) {
            if (loading) return

            try {
                setLoading(true)

                const response = context.band
                    ? await api.patch(endpoint, values, { params: { band_id: context.band.id } })
                    : await api.post(endpoint, values)

                if (context.band) {
                    context.close()
                } else {
                    context.setBand(response.data)
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
        if (context.band) fileDialogModal.setTargetId(context.band.id)
    }, [context.band])

    return (
        <Dialog open={context.isOpen === "band"} onClose={context.close}>
            <Title
                name={context.band?.name ? `Editar ${context.band.name}` : "Cadastrar banda"}
                right={
                    <IconButton onClick={context.close}>
                        <Close />
                    </IconButton>
                }
            />

            <Box sx={{ flexDirection: "column", gap: 2, maxHeight: "60vh", overflowY: "auto", margin: -2, padding: 2 }}>
                <form onSubmit={formik.handleSubmit}>
                    {context.band && (
                        <Button
                            onClick={() => (isMobile ? fileDialogModal.chooseFile() : fileDialogModal.openModal())}
                            sx={{ width: 1, alignSelf: "center", position: "relative" }}
                        >
                            {fileDialogModal.loading ? (
                                <Skeleton variant="rounded" animation="wave" sx={{ flex: 1, height: "auto", aspectRatio: 2 }} />
                            ) : (
                                <Avatar
                                    variant="rounded"
                                    src={context.band.image || undefined}
                                    sx={{ flex: 1, height: "auto", aspectRatio: 2, bgcolor: "background.default", color: "primary.main" }}
                                >
                                    <Groups sx={{ width: 1, height: 1 }} />
                                </Avatar>
                            )}
                            <Edit
                                sx={{
                                    position: "absolute",
                                    top: 15,
                                    right: 15,
                                    color: "background.default",
                                    bgcolor: "primary.main",
                                    borderRadius: "100%",
                                    width: 30,
                                    height: "auto",
                                    padding: 0.5,
                                }}
                            />
                        </Button>
                    )}
                    <TextField label="Nome" value={formik.values.name} name="name" onChange={formik.handleChange} size="small" required />

                    {context.band && (
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
                            {/* {isMobile ? (
                                <TextField
                                    select
                                    label="Artistas"
                                    value={formik.values.artists?.map((item) => item.id) || []}
                                    onChange={(ev) =>
                                        formik.setFieldValue(
                                            "artists",
                                            (ev.target.value as unknown as string[]).map((id) => artists.find((artist) => artist.id === id))
                                        )
                                    }
                                    name="artists"
                                    slotProps={{
                                        select: {
                                            multiple: true,
                                            value: formik.values.artists,
                                            renderValue: (value) => (
                                                <Box sx={{ gap: 1 }}>
                                                    {(value as Artist[]).map((item) => (
                                                        <Chip size="small" label={item.name} color="primary" key={item.id} />
                                                    ))}
                                                </Box>
                                            ),
                                        },
                                    }}
                                    size="small"
                                >
                                    {artists.map((artist) => (
                                        <MenuItem key={artist.id} value={artist.id} sx={{}}>
                                            <Checkbox checked={!!formik.values.artists?.find((item) => item.id === artist.id)} />
                                            {artist.name}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            ) : (
                                <Autocomplete
                                    options={artists}
                                    renderInput={(params) => <TextField {...params} label="Artistas" size="small" />}
                                    getOptionKey={(option) => option.id}
                                    getOptionLabel={(option) => option.name}
                                    isOptionEqualToValue={(option, value) => option.id === value.id}
                                    multiple
                                    value={formik.values.artists || []}
                                    onChange={(_, value) => formik.setFieldValue("artists", value)}
                                    ChipProps={{ size: "small", color: "primary" }}
                                    disableCloseOnSelect
                                />
                            )} */}
                            <Autocomplete
                                options={artists}
                                renderInput={({ inputProps, ...params }) => (
                                    <TextField {...params} label="Artistas" size="small" inputProps={{ ...inputProps, readOnly: isMobile }} />
                                )}
                                getOptionKey={(option) => option.id}
                                getOptionLabel={(option) => option.name}
                                isOptionEqualToValue={(option, value) => option.id === value.id}
                                multiple
                                value={formik.values.artists || []}
                                onChange={(_, value) => formik.setFieldValue("artists", value)}
                                ChipProps={{ size: "small", color: "primary" }}
                                disableCloseOnSelect
                                renderOption={(props, option, { selected }) => {
                                    const { key, ...optionProps } = props
                                    return (
                                        <li key={key} {...optionProps}>
                                            <Checkbox style={{ marginRight: 8 }} checked={selected} />
                                            {option.name}
                                        </li>
                                    )
                                }}
                            />
                        </>
                    )}

                    <Button variant="contained" type="submit" sx={{ alignSelf: "flex-end" }}>
                        {loading ? <CircularProgress /> : context.band ? "Salvar" : "Continuar"}
                    </Button>
                </form>
            </Box>

            {!isMobile && fileDialogModal.Modal}
        </Dialog>
    )
}
