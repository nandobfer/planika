import React from "react"
import { Box } from "@mui/material"
import type { useTripForm } from "../../../hooks/useTripForm"
import { TripContainer } from "../TripContainer/TripContainer"

interface FinishedFormProps {
    tripForm: ReturnType<typeof useTripForm>
}

export const FinishedForm: React.FC<FinishedFormProps> = (props) => {
    return (
        <Box sx={{ flexDirection: "column" }}>
            {/* Trip Summary */}
            {props.tripForm.currentTrip && <TripContainer trip={props.tripForm.currentTrip} />}
        </Box>
    )
}
