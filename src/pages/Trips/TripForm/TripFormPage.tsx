import React, { useEffect, useState } from "react"
import { Box, LinearProgress } from "@mui/material"
import { TripFormStepper } from "./TripFormStepper"
import { useTripForm } from "../../../hooks/useTripForm"
import { BasicInfoForm } from "./BasicInfoForm"
import { ParticipantsForm } from "./ParticipantsForm"
import { FinishedForm } from "./FinishedForm"
import { EventBus } from "../../../tools/EventBus"
import { useMuiTheme } from "../../../hooks/useMuiTheme"

interface TripFormPageProps {}

export const TripFormPage: React.FC<TripFormPageProps> = (props) => {
    const { disabledStyle } = useMuiTheme()
    const tripForm = useTripForm()

    const [loading, setLoading] = useState(false)

    const handleTripsLoading = (value: boolean) => {
        setLoading(value)
    }

    useEffect(() => {
        EventBus.on("trip-loading", handleTripsLoading)

        return () => {
            EventBus.off("trip-loading", handleTripsLoading)
        }
    }, [])

    return (
        <>
            {loading && <LinearProgress sx={{ position: "absolute", top: 0, left: 0, right: 0 }} />}
            {loading && <LinearProgress sx={{ position: "absolute", bottom: 0, left: 0, right: 0 }} />}
            <Box sx={{ flexDirection: "column", gap: 5, flex: 1, ...(loading ? disabledStyle : {}) }}>
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
        </>
    )
}
