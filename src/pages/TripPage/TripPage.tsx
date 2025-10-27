import React from "react"
import { Box, IconButton, LinearProgress } from "@mui/material"
import { Route, Routes, useNavigate, useParams } from "react-router-dom"
import { Title } from "../../components/Title"
import { useTrip } from "../../hooks/useTrip"
import { useMuiTheme } from "../../hooks/useMuiTheme"
import { Settings } from "@mui/icons-material"
import { TripSettings } from "./TripSettings/TripSettings"
import { ExpensesPage } from "./ExpensesPage"

interface TripPageProps {}

export const TripPage: React.FC<TripPageProps> = (props) => {
    const tripId = useParams<{ id: string }>().id || ""
    const { trip, loading } = useTrip(tripId)
    const { disabledStyle } = useMuiTheme()
    const navigate = useNavigate()

    const onSettingsClick = () => {
        navigate(`/trips/${tripId}/settings`, { state: trip })
    }

    return (
        <Box sx={{ flexDirection: "column", padding: 5, position: "relative" }}>
            {loading && <LinearProgress variant="indeterminate" sx={{ width: 1, position: "absolute", top: 0, left: 0 }} />}

            <Box sx={{ flexDirection: "column", gap: 3, ...(loading ? disabledStyle : {}) }}>
                <Title
                    name={trip?.name || "Carregando..."}
                    right={
                        <IconButton size="small" onClick={onSettingsClick}>
                            <Settings fontSize="small" />
                        </IconButton>
                    }
                />

                <Routes>
                    <Route path="" index element={<ExpensesPage />} />
                    <Route path="settings/*" element={<TripSettings />} />
                </Routes>
            </Box>
        </Box>
    )
}
