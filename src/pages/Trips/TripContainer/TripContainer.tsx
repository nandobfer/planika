import React from "react"
import { Avatar, Box, Button, Divider, Paper, Skeleton, TextField, Tooltip, Typography } from "@mui/material"
import type { Trip } from "../../../types/server/class/Trip/Trip"
import { CalendarMonth, EventAvailable } from "@mui/icons-material"
import { ParticipantContainer } from "../TripForm/ParticipantContainer"
import { useNavigate } from "react-router-dom"
import { currencyMask } from "../../../tools/numberMask"

interface TripContainerProps {
    trip?: Trip | null
    onAcceptInvite?: () => Promise<void>
}

const max_participants_displayed = 5
const avatar_size = 40

export const TripContainer: React.FC<TripContainerProps> = (props) => {
    const navigate = useNavigate()

    const onAccessClick = async () => {
        if (props.onAcceptInvite) {
            await props.onAcceptInvite()
        }

        if (props.trip) {
            navigate(`/trips/${props.trip.id}`)
        }
    }

    return (
        <Paper sx={{ flexDirection: "column", padding: 2, gap: 2, flex: 1 }}>
            <Box sx={{ justifyContent: "space-between", alignItems: "center" }}>
                <Typography variant="subtitle1" sx={{ opacity: props.trip && !props.trip.name ? 0.5 : undefined }}>
                    {props.trip ? props.trip.name || "Viagem sem nome" : <Skeleton width={300} />}
                </Typography>
                <Typography variant="caption" sx={{ opacity: 0.5 }}>
                    Última edição:{" "}
                    {props.trip ? (
                        new Date(props.trip.updatedAt).toLocaleString("pt-br", {
                            hour: "2-digit",
                            minute: "2-digit",
                            day: "2-digit",
                            month: "2-digit",
                            year: "2-digit",
                        })
                    ) : (
                        <Skeleton />
                    )}
                </Typography>
            </Box>

            {props.trip?.description && <TextField multiline value={props.trip.description} slotProps={{ input: { readOnly: true } }} />}

            <Box sx={{ gap: 2, alignItems: "center", flexDirection: { xs: "column", md: "row" } }}>
                <Box sx={{ gap: 2, alignItems: "center" }}>
                    {props.trip?.startDate && (
                        <Box sx={{ gap: 1 }}>
                            <CalendarMonth fontSize="small" />
                            <Typography variant="caption">Início: {new Date(props.trip.startDate).toLocaleDateString()}</Typography>
                        </Box>
                    )}
                    {props.trip?.startDate && props.trip?.endDate && <Divider orientation="vertical" sx={{ height: 15 }} />}
                    {props.trip?.endDate && (
                        <Box sx={{ gap: 1 }}>
                            <EventAvailable fontSize="small" />
                            <Typography variant="caption">Fim: {new Date(props.trip.endDate).toLocaleDateString()}</Typography>
                        </Box>
                    )}
                </Box>
            </Box>

            <Box sx={{ gap: 2, flexDirection: { xs: "row", md: "row" } }}>
                <Box sx={{ gap: 2, flexDirection: { xs: "column-reverse", md: "row" } }}>
                    {props.trip && (
                        <Box sx={{ gap: 2, alignItems: "center" }}>
                            <Tooltip title="Total de gastos previstos na viagem">
                                <Typography variant="subtitle1" color={"success"}>
                                    {currencyMask(props.trip.totalExpenses)}
                                </Typography>
                            </Tooltip>
                            {props.trip.participants.length > 1 && (
                                <>
                                    <Divider flexItem orientation="vertical" />
                                    <Tooltip title={`Valor para cada participante`}>
                                        <Typography variant="caption" color="success">
                                            {props.trip.participants.length}x{" "}
                                            {currencyMask(props.trip.totalExpenses / props.trip.participants.length)}
                                        </Typography>
                                    </Tooltip>
                                </>
                            )}
                        </Box>
                    )}
                    <Box sx={{ position: "relative", alignItems: "center", height: avatar_size }}>
                        {props.trip ? (
                            props.trip.participants.slice(0, max_participants_displayed).map((participant) => (
                                <Paper
                                    key={participant.id}
                                    sx={{
                                        width: avatar_size,
                                        height: avatar_size,
                                        borderRadius: "100%",
                                        overflow: "hidden",
                                        position: "absolute",
                                        left: `${props.trip!.participants.indexOf(participant) * 30}px`,
                                        boxShadow: 3,
                                    }}
                                >
                                    <Tooltip
                                        slotProps={{ tooltip: { sx: { bgcolor: "transparent", maxWidth: "100vw" } } }}
                                        title={<ParticipantContainer participant={participant} />}
                                    >
                                        <Avatar src={participant.user?.picture} sx={{ width: avatar_size, height: avatar_size }} />
                                    </Tooltip>
                                </Paper>
                            ))
                        ) : (
                            <Skeleton variant="circular" width={avatar_size} height={avatar_size} />
                        )}
                        {props.trip && props.trip.participants.length > max_participants_displayed && (
                            <Paper
                                sx={{
                                    width: avatar_size,
                                    height: avatar_size,
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
                    </Box>
                </Box>
                <Button variant="contained" sx={{ marginLeft: "auto", marginTop: "auto", height: "min-content" }} onClick={onAccessClick}>
                    {props.onAcceptInvite ? "Aceitar e acessar" : "Acessar"}
                </Button>
            </Box>
        </Paper>
    )
}
