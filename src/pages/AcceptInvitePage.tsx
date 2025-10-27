import React from "react"
import { Box, Divider, LinearProgress, Typography } from "@mui/material"
import { useSearchParams } from "react-router-dom"
import { useUser } from "../hooks/useUser"
import { NotFound } from "./NotFound"
import { GetStarted } from "./GetStarted"
import { Title } from "../components/Title"
import { useTrip } from "../hooks/useTrip"
import { useMuiTheme } from "../hooks/useMuiTheme"
import { TripContainer } from "./Trips/TripContainer/TripContainer"
import { SettingDescription } from "./Account/SettingDescription"

interface AcceptInvitePageProps {}

export const AcceptInvitePage: React.FC<AcceptInvitePageProps> = (props) => {
    const [searchParams] = useSearchParams()
    const email = searchParams.get("email") || ""
    const tripId = searchParams.get("trip") || ""
    const { user } = useUser()
    const { trip, loading, acceptInvitation } = useTrip(tripId)
    const { disabledStyle } = useMuiTheme()

    const participant = trip?.participants.find((p) => p.email === email)


    if (user && user.email !== email) {
        return <NotFound />
    }

    if (!email || !tripId) {
        return <NotFound />
    }

    return (
        <Box sx={{ flexDirection: "column", gap: 3, padding: 5, position: "relative" }}>
            {loading && <LinearProgress variant="indeterminate" sx={{ width: 1, position: "absolute", top: 0, left: 0 }} />}
            <Box sx={{ flexDirection: "column", width: 1, gap: 3, ...(loading ? disabledStyle : {}) }}>
                <Title name="Aceitar convite" />
                {user && user.email === email ? (
                    <Box sx={{ width: 1, gap: 3, flexDirection: { xs: "column", md: "column" } }}>
                        <SettingDescription flex={0.3}>
                            Aceite o convite para participar desse planejamento.
                            <br />
                            <br />
                            {participant?.role === "administrator"
                                ? "Como administrador, você terá controle total sobre a viagem."
                                : participant?.role === "collaborator"
                                ? "Como colaborador, você pode adicionar e gerenciar despesas."
                                : "Como visualizador, você poderá ver os detalhes da viagem, mas não poderá editá-los."}
                        </SettingDescription>
                        <Box sx={{ flex: 0.7 }}>{trip && <TripContainer trip={trip} onAcceptInvite={acceptInvitation} />}</Box>
                        <Divider orientation={"horizontal"} />
                    </Box>
                ) : (
                    <>
                        <Typography>Você foi convidado para a viagem {trip?.name}.</Typography>
                        <GetStarted onSuccess={() => null} />
                    </>
                )}
            </Box>
        </Box>
    )
}
