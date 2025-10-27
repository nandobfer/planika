import React from "react"
import { Box, Button, useMediaQuery } from "@mui/material"
import type { useTripSettings } from "../../../hooks/useTripSettings"
import { useNavigate } from "react-router-dom"

interface TripsSettingsNavigationProps {
    settings: ReturnType<typeof useTripSettings>
    flex: number
}

export const TripsSettingsNavigation: React.FC<TripsSettingsNavigationProps> = (props) => {
    const { currentTab, navigate, tabs } = props.settings
    const reactNavigate = useNavigate()
    const isMobile = useMediaQuery((theme) => theme.breakpoints.down("md"))

    const mobileStyle = isMobile ? { marginLeft: -5, marginRight: -5, paddingLeft: 5, paddingRight: 5, width: "100vw", overflowX: "auto" } : {}

    return (
        <Box
            sx={{
                flexDirection: { xs: "row", md: "column" },
                gap: { xs: 1, md: 0 },
                flex: { md: props.flex },
                ...mobileStyle,
            }}
        >
            {tabs.map((tab) => (
                <Button
                    sx={{ minWidth: "fit-content", fontWeight: tab.variant ? "bold" : "normal", marginBottom: { md: tab.variant ? 1 : undefined } }}
                    key={tab.route}
                    onClick={() => (tab.variant ? reactNavigate(`/trips/${props.settings.trip.id}`) : navigate(tab.route))}
                    variant={currentTab.route === tab.route ? "contained" : tab.variant ? "outlined" : "text"}
                >
                    {tab.label}
                </Button>
            ))}
        </Box>
    )
}
