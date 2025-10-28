import React from "react"
import { Box, LinearProgress, Typography } from "@mui/material"
import { useUser } from "../../../hooks/useUser"
import { useQuery } from "@tanstack/react-query"
import { TripFromParticipant } from "./TripFromParticipant"

interface InvitationsProps {}

export const Invitations: React.FC<InvitationsProps> = () => {
    const { getPendingInvitations } = useUser()
    const { data, isFetching } = useQuery({ queryKey: ["pending-invitations"], queryFn: getPendingInvitations, initialData: [] })

    return (
        <Box sx={{ flexDirection: "column", gap: 3 }}>
            <Typography variant="h5">Convites</Typography>
            {isFetching ? (
                <LinearProgress />
            ) : data.length > 0 ? (
                data
                    .sort((a, b) => b.createdAt - a.createdAt)
                    .map((participant) => <TripFromParticipant key={participant.id} participant={participant} />)
            ) : (
                <Typography variant="body2">Nenhum convite pendente</Typography>
            )}
        </Box>
    )
}
