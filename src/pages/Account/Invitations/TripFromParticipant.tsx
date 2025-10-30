import React from "react"
import type { TripParticipant } from "../../../types/server/class/Trip/TripParticipant"
import { useTrip } from "../../../hooks/useTrip"
import { TripContainer } from "../../Trips/TripContainer/TripContainer"
import { LinearProgress } from "@mui/material"

interface TripFromParticipantProps {
    participant: TripParticipant
}

export const TripFromParticipant: React.FC<TripFromParticipantProps> = (props) => {
    const { trip, acceptInvitation, loading } = useTrip(props.participant.tripId)

    return (
        <>
            {loading && <LinearProgress sx={{ position: "absolute", top: 0, left: 0, right: 0 }} />}
            <TripContainer trip={trip} onAcceptInvite={acceptInvitation} />
        </>
    )
}
