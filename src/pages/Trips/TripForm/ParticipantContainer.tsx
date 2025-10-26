import React from "react"
import { Avatar, Box, Chip, Paper, Typography } from "@mui/material"
import type { ParticipantRole, TripParticipant } from "../../../types/server/class/Trip/TripParticipant"
import { useQuery } from "@tanstack/react-query"
import { api } from "../../../backend/api"
import { User } from "../../../types/server/class/User"
import { useUser } from "../../../hooks/useUser"

interface ParticipantContainerProps {
    participant: TripParticipant
}

const formatRole = (role: ParticipantRole) => {
    switch (role) {
        case "administrator":
            return "Administrador"
        case "collaborator":
            return "Colaborador"
        case "viewer":
            return "Visualizador"
        default:
            return role
    }
}

export const ParticipantContainer: React.FC<ParticipantContainerProps> = (props) => {
    const { user } = useUser()
    const { data: participantUser, isFetching } = useQuery<User | null>({
        queryKey: ["participant", props.participant.id],
        queryFn: async () =>
            props.participant.userId ? api.get("/user", { params: { user_id: props.participant.userId } }).then((res) => res.data) : null,
        initialData: null,
    })

    return (
        <Paper sx={{ padding: 2, gap: 2, alignItems: 'center' }}>
            <Avatar src={participantUser?.picture} sx={{width: 60, height: 60}} />
            <Box sx={{ flexDirection: "column", gap: 1 }}>
                <Typography variant="body2">{participantUser?.name}</Typography>
                <Box sx={{gap: 1}}>
                    <Chip variant="outlined" size="small" color="primary" label={formatRole(props.participant.role)} />
                    {props.participant.status === 'pending' && <Chip variant="outlined" size="small" color="warning" label="Convite enviado" />}
                </Box>
            </Box>
        </Paper>
    )
}
