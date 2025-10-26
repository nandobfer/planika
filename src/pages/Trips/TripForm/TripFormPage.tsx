import React from "react"
import { Box, Paper, Typography } from "@mui/material"
import { useMuiTheme } from "../../../hooks/useMuiTheme"
import { TripFormStepper } from "./TripFormStepper"
import { useTripForm } from "../../../hooks/useTripForm"
import { BasicInfoForm } from "./BasicInfoForm"
import { ParticipantsForm } from "./ParticipantsForm"
import { FinishedForm } from "./FinishedForm"

interface TripFormPageProps {}

export const TripFormPage: React.FC<TripFormPageProps> = (props) => {
    // const { gradientStyle, invertedGradientStyle } = useMuiTheme()
    const tripForm = useTripForm()

    return (
        <Box sx={{ flexDirection: "column", gap: 5, flex: 1 }}>
            <TripFormStepper tripForm={tripForm} />
            <Box
                sx={{
                    flexDirection: "column",
                    // padding: 5,
                    // flex: 1,
                    // ...gradientStyle,
                }}
            >
                {tripForm.step === 0 && <BasicInfoForm tripForm={tripForm} />}
                {tripForm.step === 1 && <ParticipantsForm tripForm={tripForm} />}
                {tripForm.step === 2 && <FinishedForm tripForm={tripForm} />}
            </Box>
        </Box>
    )
}
