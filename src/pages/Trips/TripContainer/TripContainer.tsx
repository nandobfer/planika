import React from "react"
import { Avatar, Box, Button, Divider, IconButton, Paper, TextField, Tooltip, Typography } from "@mui/material"
import type { Trip } from "../../../types/server/class/Trip/Trip"
import { CalendarMonth, EventAvailable } from "@mui/icons-material"
import { SaveButton } from "../../Account/SaveButton"
import { ParticipantContainer } from "../TripForm/ParticipantContainer"

interface TripContainerProps {
    trip: Trip
}

const max_participants_displayed = 2

export const TripContainer: React.FC<TripContainerProps> = (props) => {
    return (
        <Paper sx={{ flexDirection: "column", padding: 2, gap: 2 }}>
            <Box sx={{ justifyContent: "space-between", alignItems: "center" }}>
                <Typography variant="subtitle1" sx={{ opacity: !props.trip.name ? 0.5 : undefined }}>
                    {props.trip.name || "Viagem sem nome"}
                </Typography>
                <Typography variant="caption" sx={{ opacity: 0.5 }}>
                    Última edição:{" "}
                    {new Date(props.trip.updatedAt).toLocaleString("pt-br", {
                        hour: "2-digit",
                        minute: "2-digit",
                        day: "2-digit",
                        month: "2-digit",
                        year: "2-digit",
                    })}
                </Typography>
            </Box>

            {props.trip.description && <TextField multiline value={props.trip.description} slotProps={{ input: { readOnly: true } }} />}

            <Box sx={{ gap: 2, alignItems: "center" }}>
                {props.trip.startDate && (
                    <Box sx={{ gap: 1 }}>
                        <CalendarMonth fontSize="small" />
                        <Typography variant="body2">Início: {new Date(props.trip.startDate).toLocaleDateString()}</Typography>
                    </Box>
                )}
                {props.trip.startDate && props.trip.endDate && <Divider orientation="vertical" sx={{ height: 15 }} />}
                {props.trip.endDate && (
                    <Box sx={{ gap: 1 }}>
                        <EventAvailable fontSize="small" />
                        <Typography variant="body2">Fim: {new Date(props.trip.endDate).toLocaleDateString()}</Typography>
                    </Box>
                )}
            </Box>

            <Box sx={{ position: "relative", alignItems: "center", width: 1 }}>
                {props.trip.participants.slice(0, max_participants_displayed).map((participant) => (
                    <Paper
                        key={participant.id}
                        sx={{
                            width: 40,
                            height: 40,
                            borderRadius: "100%",
                            overflow: "hidden",
                            position: "absolute",
                            left: `${props.trip.participants.indexOf(participant) * 30}px`,
                            boxShadow: 3,
                        }}
                    >
                        <Tooltip
                            slotProps={{ tooltip: { sx: { bgcolor: "transparent", maxWidth: "100vw" } } }}
                            title={<ParticipantContainer participant={participant} />}
                        >
                            <Avatar src={participant.user?.picture} sx={{ width: 40, height: 40 }} />
                        </Tooltip>
                    </Paper>
                ))}
                {props.trip.participants.length > max_participants_displayed && (
                    <Paper
                        sx={{
                            width: 40,
                            height: 40,
                            borderRadius: "100%",
                            overflow: "hidden",
                            position: "absolute",
                            left: `${max_participants_displayed * 30}px`,
                            boxShadow: 3,
                            bgcolor: "primary.main",
                            alignItems: "center",
                            justifyContent: "center",
                            display: "flex",
                        }}
                    >
                        <Typography variant="body2">+{props.trip.participants.length - max_participants_displayed}</Typography>
                    </Paper>
                )}
                <Button variant="contained" sx={{ marginLeft: "auto" }}>
                    Acessar
                </Button>
            </Box>
        </Paper>
    )
}
