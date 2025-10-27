import React, { useEffect, useState } from "react"
import { Box, Button, Dialog, Typography } from "@mui/material"
import type { User } from "../../../types/server/class/User"
import { Title } from "../../../components/Title"
import { ParticipantContainer } from "./ParticipantContainer"
import type { ParticipantRole, TripParticipantForm } from "../../../types/server/class/Trip/TripParticipant"
import type { useTripForm } from "../../../hooks/useTripForm"
import * as yup from "yup"

interface ParticipantInviteModalProps {
    target: string | User | null
    onClose: () => void
    tripForm: ReturnType<typeof useTripForm>
}

export const ParticipantInviteModal: React.FC<ParticipantInviteModalProps> = (props) => {
    const open = !!props.target

    const targetUser = typeof props.target !== "string" ? (props.target as User) : null

    const [role, setRole] = useState<ParticipantRole>("collaborator")
    const [email, setEmail] = useState("")

    console.log({ email })

    const resetEmail = () => setEmail(targetUser ? "" : (props.target as string))

    const onSubmit = async () => {
        if (!props.tripForm.currentTrip) return

        if (!targetUser && (!email || !yup.string().email().isValidSync(email))) return

        const data: TripParticipantForm = {
            identifier: targetUser ? targetUser.id : email,
            idType: targetUser ? "userId" : "email",
            role,
            tripId: props.tripForm.currentTrip?.id || "",
        }

        props.tripForm.inviteParticipant(data)
        props.onClose()
    }

    useEffect(() => {
        resetEmail()
    }, [props.target, targetUser])

    return (
        <Dialog open={open} onClose={props.onClose} maxWidth="sm" fullWidth>
            <Box sx={{ padding: 1, flexDirection: "column", gap: 2 }}>
                <Title name="Convidar participante" />
                <ParticipantContainer
                    participant={{
                        createdAt: 0,
                        id: "",
                        role,
                        status: "active",
                        tripId: "",
                        updatedAt: 0,
                        userId: targetUser?.id,
                        email: targetUser ? undefined : email,
                    }}
                    onChangeRole={(newRole) => setRole(newRole)}
                    onChangeEmail={(email) => setEmail(email)}
                />

                <Box sx={{ justifyContent: "flex-end", gap: 1 }}>
                    <Button onClick={props.onClose}>Cancelar</Button>
                    <Button onClick={onSubmit} variant="contained">
                        Enviar convite
                    </Button>
                </Box>
            </Box>
        </Dialog>
    )
}
