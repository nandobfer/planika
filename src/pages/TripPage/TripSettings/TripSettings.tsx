import React from "react"
import { Box, Divider, useMediaQuery } from "@mui/material"
import { Route, Routes, useLocation } from "react-router-dom"
import type { Trip } from "../../../types/server/class/Trip/Trip"
import { TripsSettingsNavigation } from "./TripsSettingsNavigation"
import { useTripSettings } from "../../../hooks/useTripSettings"
import { useMuiTheme } from "../../../hooks/useMuiTheme"
import { SettingDescription } from "../../Account/SettingDescription"

interface TripSettingsProps {
    loading: boolean
}

export const TripSettings: React.FC<TripSettingsProps> = (props) => {
    const initialTrip = useLocation().state as Trip
    const settings = useTripSettings(initialTrip)
    const { disabledStyle } = useMuiTheme()
    const isMobile = useMediaQuery((theme) => theme.breakpoints.down("md"))

    return (
        <Box sx={{ gap: { xs: 2, md: 5 }, flexDirection: { xs: "column", md: "row" }, flex: 1 }}>
            <TripsSettingsNavigation flex={0.2} settings={settings} />
            <Divider orientation={isMobile ? "horizontal" : "vertical"} flexItem />
            <Box sx={{ flex: 0.5, flexDirection: "column", ...(props.loading ? disabledStyle : {}) }}>
                <Routes>
                    {settings.tabs.map((tab) => (
                        <Route key={tab.route} path={tab.route} element={tab.component} index={tab.index} />
                    ))}
                </Routes>
            </Box>
            <Divider orientation={isMobile ? "horizontal" : "vertical"} flexItem />
            <SettingDescription flex={0.3}>{settings.currentTab.description}</SettingDescription>
        </Box>
    )
}
