import React from "react"
import { Box, TextField } from "@mui/material"
import type { useTripForm } from "../../../hooks/useTripForm"
import { SaveButton } from "../../Account/SaveButton"
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
                <TextField label="Título" value={props.tripForm.formik.values.name} onChange={props.tripForm.formik.handleChange} name="name" />
                <TextField
                    label="Descrição"
                    value={props.tripForm.formik.values.description}
                    onChange={props.tripForm.formik.handleChange}
                    name="description"
                    multiline
                    minRows={5}
                />

                <Box sx={{ gap: 2, width: 1, flexDirection: { xs: "column", md: "row" } }}>
                    <MobileDatePicker
                        label="Data de início"
                        slotProps={{ textField: { fullWidth: true } }}
                        value={props.tripForm.formik.values.startDate ? dayjs(props.tripForm.formik.values.startDate) : null}
                        onChange={(value) => props.tripForm.formik.setFieldValue("startDate", value?.toDate().getTime())}
                        // disablePast
                        orientation="portrait"
                    />
                    <MobileDatePicker
                        label="Data de término"
                        slotProps={{ textField: { fullWidth: true } }}
                        value={props.tripForm.formik.values.endDate ? dayjs(props.tripForm.formik.values.endDate) : null}
                        onChange={(value) => props.tripForm.formik.setFieldValue("endDate", value?.toDate().getTime())}
                        // disablePast
                        orientation="portrait"
                    />
                </Box>

                <SaveButton>{props.fromSettings ? "Salvar" : "Continuar"}</SaveButton>
            </form>
        </Box>
    )
}
