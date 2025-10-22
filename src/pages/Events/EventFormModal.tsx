import React, { useEffect, useState } from "react"
import { Autocomplete, Avatar, Box, Button, Checkbox, CircularProgress, Dialog, IconButton, Skeleton, Tab, Tabs, TextField } from "@mui/material"
import { Title } from "../../components/Title"
import { AddPhotoAlternate, Close, Edit } from "@mui/icons-material"
import { useFormModal } from "../../hooks/useFormModal"
import { useFormik } from "formik"
import { useUser } from "../../hooks/useUser"
import { useMediaQuery } from "@mantine/hooks"
import type { EventForm } from "../../types/server/class/Event"
import { useQuery } from "@tanstack/react-query"
import { getWeekNumber } from "../../tools/getWeekNumber"
import type { Band } from "../../types/server/class/Band"
import dayjs from "dayjs"
import { searchCep } from "../../tools/searchCep"
import MaskedInputComponent from "../../components/MaskedInput"
import { MobileDateTimePicker } from "@mui/x-date-pickers/MobileDateTimePicker"
import { currencyMask } from "../../tools/numberMask"
import { handleCurrencyInput } from "../../tools/handleCurrencyInput"
import type { Artist } from "../../types/server/class/Artist"
import { useFilesDialogModal } from "../../hooks/useFilesDialogModal"

interface EventFormModalProps {}

const endpoint = "/event"
const now = new Date().getTime().toString()

export const EventFormModal: React.FC<EventFormModalProps> = (props) => {
    const [loading, setLoading] = useState(false)
    const [searchingCep, setSearchingCep] = useState(false)
    const [currentTab, setCurrentTab] = useState<"basic" | "location" | "details">("basic")

    const isMobile = useMediaQuery("(orientation: portrait)")
    const context = useFormModal()
    const fileDialogModal = useFilesDialogModal({ endpoint, onUpload: (data) => context.setEvent(data) })

    const { data: artists, isFetching: loadingArtists } = useQuery<Artist[]>({
        initialData: [],
        queryKey: ["artistsData"],
        queryFn: async () => (await api.get("/artist")).data,
    })
    const { data: bands, isFetching: loadingBands } = useQuery<Band[]>({
        initialData: [],
        queryKey: ["bandsData"],
        queryFn: async () => (await api.get("/band")).data,
    })
    const { adminApi: api } = useUser()

    const formik = useFormik<EventForm>({
        initialValues: context.event
            ? {
                  title: context.event.title,
                  description: context.event.description,
                  datetime: context.event.datetime,
                  location: context.event.location,
                  week: context.event.week,
                  price: context.event.price,
                  ticketUrl: context.event.ticketUrl,
                  artists: context.event.artists || [],
                  bands: context.event.bands || [],
                  image: context.event.image || undefined,
              }
            : {
                  title: "",
                  description: "",
                  datetime: now,
                  location: { cep: "", complement: "", district: "", number: "", street: "" },
                  artists: [],
                  bands: [],
                  price: 0,
                  ticketUrl: "",
                  week: -1,
              },
        async onSubmit(values, formikHelpers) {
            if (loading) return

            if (!values.title || !values.datetime) {
                // ! mostrar erro
                return
            }

            try {
                setLoading(true)

                values.week = getWeekNumber(values.datetime)
                console.log(values)

                const response = context.event
                    ? await api.patch(endpoint, values, { params: { event_id: context.event.id } })
                    : await api.post(endpoint, values)

                if (context.event) {
                    context.close()
                } else {
                    context.setEvent(response.data)
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
        if (context.event) {
            console.log(context.event)
            console.log(getWeekNumber(context.event.datetime))
        }
    }, [context.event])

    useEffect(() => {
        return () => {
            formik.resetForm()
            setCurrentTab("basic")
        }
    }, [context.isOpen])

    useEffect(() => {
        if (formik.values.location.cep.length === 10) {
            setSearchingCep(true)
            searchCep(formik.values.location.cep)
                .then((result) => {
                    formik.setFieldValue("location.street", result?.street)
                    formik.setFieldValue("location.district", result?.neighborhood)
                })
                .finally(() => {
                    setSearchingCep(false)
                })
        }
    }, [formik.values.location.cep])

    useEffect(() => {
        if (context.event) fileDialogModal.setTargetId(context.event.id)
    }, [context.event])

    return (
        <Dialog open={context.isOpen === "event"} onClose={context.close}>
            <Title
                name={context.event?.title ? `Editar ${context.event.title}` : "Cadastrar evento"}
                right={
                    <IconButton onClick={context.close}>
                        <Close />
                    </IconButton>
                }
            />

            <Tabs value={currentTab} onChange={(_, value) => setCurrentTab(value)} variant="fullWidth">
                <Tab label="Informações básicas" value={"basic"} />
                <Tab label="Localização" value={"location"} disabled={!context.event} />
                <Tab label="Detalhes" value={"details"} disabled={!context.event} />
            </Tabs>
            <Box sx={{ flexDirection: "column", gap: 2, overflowY: "auto", margin: -2, padding: 2 }}>
                <form onSubmit={formik.handleSubmit}>
                    {context.event && currentTab === "basic" && (
                        <Button
                            onClick={() => (isMobile ? fileDialogModal.chooseFile() : fileDialogModal.openModal())}
                            sx={{ width: 1, alignSelf: "center", position: "relative" }}
                        >
                            {fileDialogModal.loading ? (
                                <Skeleton variant="rounded" animation="wave" sx={{ flex: 1, height: "auto", aspectRatio: 2 }} />
                            ) : (
                                <Avatar
                                    variant="rounded"
                                    src={context.event.image || undefined}
                                    sx={{ width: 1, height: "auto", bgcolor: "transparent", color: "primary.main", maxWidth: 300 }}
                                    // slotProps={{ img: { style: { objectFit: "contain" } } }}
                                >
                                    <AddPhotoAlternate sx={{ width: 0.5, height: 0.5 }} />
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

                    {currentTab === "basic" && (
                        <>
                            <MobileDateTimePicker
                                label="Data e hora"
                                slotProps={{ textField: { size: "small", required: true } }}
                                value={dayjs(Number(formik.values.datetime))}
                                onChange={(value) => formik.setFieldValue("datetime", value?.toDate().getTime().toString())}
                                ampm={false}
                                // disablePast
                                orientation="portrait"
                            />

                            <TextField label="Nome" value={formik.values.title} name="title" onChange={formik.handleChange} size="small" required />

                            {context.event && (
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
                                </>
                            )}
                        </>
                    )}

                    {currentTab === "location" && (
                        <>
                            <TextField
                                label="CEP"
                                value={formik.values.location.cep}
                                name="location.cep"
                                onChange={formik.handleChange}
                                size="small"
                                type="tel"
                                slotProps={{
                                    input: {
                                        inputComponent: MaskedInputComponent,
                                        inputProps: { mask: "00.000-000" },
                                        endAdornment: searchingCep ? <CircularProgress /> : null,
                                    },
                                }}
                            />
                            <TextField
                                label="Rua"
                                value={formik.values.location.street}
                                name="location.street"
                                onChange={formik.handleChange}
                                size="small"
                            />

                            <Box sx={{ gap: 2 }}>
                                <TextField
                                    label="Número"
                                    value={formik.values.location.number}
                                    name="location.number"
                                    onChange={formik.handleChange}
                                    size="small"
                                    sx={{ flex: 0.3 }}
                                />
                                <TextField
                                    label="Bairro"
                                    value={formik.values.location.district}
                                    name="location.district"
                                    onChange={formik.handleChange}
                                    size="small"
                                    sx={{ flex: 0.7 }}
                                />
                            </Box>
                            <TextField
                                label="Complemento"
                                value={formik.values.location.complement}
                                name="location.complement"
                                onChange={formik.handleChange}
                                size="small"
                            />
                        </>
                    )}

                    {currentTab === "details" && context.event && (
                        <>
                            <TextField
                                label="Preço"
                                value={currencyMask(formik.values.price)}
                                name="price"
                                onChange={(ev) => {
                                    formik.setFieldValue("price", handleCurrencyInput(ev.target.value))
                                }}
                                size="small"
                                type="tel"
                            />
                            <TextField
                                label="Ingresso"
                                value={formik.values.ticketUrl}
                                name="ticketUrl"
                                onChange={formik.handleChange}
                                size="small"
                                type="url"
                                placeholder="Link para aquisição do ingresso"
                            />
                            <Autocomplete
                                options={bands}
                                renderInput={({ inputProps, ...params }) => (
                                    <TextField {...params} label="Bandas" size="small" inputProps={{ ...inputProps, readOnly: isMobile }} />
                                )}
                                getOptionKey={(option) => option.id}
                                getOptionLabel={(option) => option.name}
                                isOptionEqualToValue={(option, value) => option.id === value.id}
                                multiple
                                value={formik.values.bands || []}
                                onChange={(_, value) => formik.setFieldValue("bands", value)}
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
                        {loading ? <CircularProgress /> : context.event ? "Salvar" : "Continuar"}
                    </Button>
                </form>
            </Box>
            {!isMobile && fileDialogModal.Modal}
        </Dialog>
    )
}
