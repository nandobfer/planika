import React, { useState } from "react"
import { Avatar, Box, Chip, Menu, MenuItem, Paper, TextField, Typography } from "@mui/material"
import { ArrowDropDown, Email } from "@mui/icons-material"
import type { ParticipantRole, TripParticipant } from "../../../types/server/class/Trip/TripParticipant"
import { useQuery } from "@tanstack/react-query"
import { api } from "../../../backend/api"
import { User } from "../../../types/server/class/User"
import * as yup from "yup"

interface ParticipantContainerProps {
    participant: TripParticipant
    onChangeRole?: (role: ParticipantRole) => void
    onChangeEmail?: (email: string) => void
}

const roles: ParticipantRole[] = ["administrator", "collaborator", "viewer"]

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
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
    const open = Boolean(anchorEl)

    const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
        if (props.onChangeRole) {
            setAnchorEl(event.currentTarget)
        }
    }

    const handleClose = () => {
        setAnchorEl(null)
    }

    const handleRoleSelect = (role: ParticipantRole) => {
        if (props.onChangeRole) {
            props.onChangeRole(role)
        }
        handleClose()
    }

    const { data: participantUser } = useQuery<User | null>({
        queryKey: ["participant", props.participant.id],
        queryFn: async () =>
            props.participant.userId ? api.get("/user", { params: { user_id: props.participant.userId } }).then((res) => res.data) : null,
        initialData: null,
    })

    const emailError =
        props.onChangeEmail &&
        !yup
            .string()
            .required()
            .email()
            .isValidSync(participantUser?.email || props.participant.email)

    return (
        <Paper sx={{ padding: 2, gap: 2, alignItems: "center" }}>
            <Avatar src={participantUser?.picture} sx={{ width: 60, height: 60 }}>
                {props.participant.email ? <Email sx={{ width: 0.65, height: 0.65 }} /> : null}
            </Avatar>
            <Box sx={{ flexDirection: "column", gap: 1, flex: 1 }}>
                {props.onChangeEmail ? (
                    <TextField
                        variant="standard"
                        size="small"
                        label="e-mail"
                        defaultValue={participantUser?.email || props.participant.email}
                        onChange={(e) => props.onChangeEmail?.(e.target.value)}
                        slotProps={{ input: { sx: { fontSize: 12 } } }}
                        fullWidth
                        error={emailError}
                        helperText={emailError ? "E-mail inválido" : undefined}
                    />
                ) : (
                    <Typography variant="body2">{participantUser?.name || props.participant.email}</Typography>
                )}
                <Box sx={{ gap: 1, alignItems: "center" }}>
                    <Chip
                        variant="outlined"
                        size="small"
                        color="info"
                        label={formatRole(props.participant.role)}
                        onClick={props.onChangeRole ? handleClick : undefined}
                        onDelete={props.onChangeRole ? handleClick : undefined}
                        deleteIcon={props.onChangeRole ? <ArrowDropDown /> : undefined}
                        sx={{ cursor: props.onChangeRole ? "pointer" : "default" }}
                    />
                    {props.participant.status === "pending" && <Chip variant="outlined" size="small" color="warning" label="Convite enviado" />}
                </Box>
            </Box>

            {props.onChangeRole && (
                <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
                    {roles.map((role) => (
                        <MenuItem key={role} onClick={() => handleRoleSelect(role)} selected={props.participant.role === role}>
                            {formatRole(role)}
                        </MenuItem>
                    ))}
                </Menu>
            )}
        </Paper>
    )
}
