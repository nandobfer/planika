import React from "react"
import type { TripParticipant } from "../../../types/server/class/Trip/TripParticipant"
import { useTrip } from "../../../hooks/useTrip"
import { TripContainer } from "../../Trips/TripContainer/TripContainer"

interface TripFromParticipantProps {
    participant: TripParticipant
}

export const TripFromParticipant: React.FC<TripFromParticipantProps> = (props) => {
    const { trip, acceptInvitation } = useTrip(props.participant.tripId)

    return <TripContainer trip={trip} onAcceptInvite={acceptInvitation} />
}
