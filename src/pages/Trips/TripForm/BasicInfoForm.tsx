import React from "react"
import { Box, Button, TextField } from "@mui/material"
import type { useTripForm } from "../../../hooks/useTripForm"
import { MobileDatePicker } from "@mui/x-date-pickers/MobileDatePicker"
import dayjs from "dayjs"

interface BasicInfoProps {
    tripForm: ReturnType<typeof useTripForm>
    fromSettings?: boolean
}

export const BasicInfoForm: React.FC<BasicInfoProps> = (props) => {
    // const onSubmit = (e: React.FormEvent) => {
    //     e.preventDefault()
    //     props.tripForm.handleNext()
    // }

    return (
        <Box sx={{ flexDirection: "column", gap: 2 }}>
            <form onSubmit={props.tripForm.formik.handleSubmit}>
                <TextField
                    label="Título"
                    value={props.tripForm.formik.values.name}
                    onChange={props.tripForm.formik.handleChange}
                    name="name"
                    disabled={!props.tripForm.isAdmin}
                />
                <TextField
                    label="Descrição"
                    value={props.tripForm.formik.values.description}
                    onChange={props.tripForm.formik.handleChange}
                    name="description"
                    multiline
                    minRows={5}
                    disabled={!props.tripForm.isAdmin}
                />

                <Box sx={{ gap: 2, width: 1, flexDirection: { xs: "column", md: "row" } }}>
                    <MobileDatePicker
                        label="Data de início"
                        slotProps={{ textField: { fullWidth: true } }}
                        value={props.tripForm.formik.values.startDate ? dayjs(props.tripForm.formik.values.startDate) : null}
                        onChange={(value) => props.tripForm.formik.setFieldValue("startDate", value?.toDate().getTime())}
                        // disablePast
                        orientation="portrait"
                        disabled={!props.tripForm.isAdmin}
                    />
                    <MobileDatePicker
                        label="Data de término"
                        slotProps={{ textField: { fullWidth: true } }}
                        value={props.tripForm.formik.values.endDate ? dayjs(props.tripForm.formik.values.endDate) : null}
                        onChange={(value) => props.tripForm.formik.setFieldValue("endDate", value?.toDate().getTime())}
                        // disablePast
                        orientation="portrait"
                        disabled={!props.tripForm.isAdmin}
                    />
                </Box>

                <Box sx={{ alignSelf: "flex-end", gap: 2 }}>
                    {props.fromSettings && props.tripForm.isAdmin && (
                        <Button color="error" onClick={props.tripForm.deleteTrip}>
                            Deletar
                        </Button>
                    )}
                    {props.tripForm.isAdmin && (
                        <Button type="submit" variant="contained">
                            {props.fromSettings ? "Salvar" : "Continuar"}
                        </Button>
                    )}
                </Box>
            </form>
        </Box>
    )
}
