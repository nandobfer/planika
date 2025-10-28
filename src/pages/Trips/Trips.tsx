import React from 'react'
import { Box, Divider, LinearProgress, useMediaQuery } from "@mui/material"
import { Title } from "../../components/Title"
import { useTrips } from "../../hooks/useTrips"
import { TripsNavigation } from "./TripsNavigation"
import { Route, Routes } from "react-router-dom"

interface TripsProps {}

export const Trips: React.FC<TripsProps> = (props) => {
    const isMobile = useMediaQuery((theme) => theme.breakpoints.down("md"))
    const trips = useTrips()

    const disabledStyle = trips.isFetching ? { filter: "grayscale(100%) blur(1px)", pointerEvents: "none" } : {}

    return (
        <Box sx={{ flexDirection: "column", padding: 5, gap: { xs: 2, md: 5 }, height: 1, position: "relative" }}>
            <Title name="Minhas Viagens" refresh={trips.refetch} refreshing={trips.isFetching} />
            {trips.isFetching && <LinearProgress sx={{ width: 1, position: "absolute", top: 0, right: 0, left: 0 }} variant="indeterminate" />}
            <Box sx={{ gap: { xs: 2, md: 5 }, flexDirection: { xs: "column", md: "row" }, height: 1, paddingBottom: { md: 8 } }}>
                <TripsNavigation settings={trips} flex={0.2} />

                <Divider orientation={isMobile ? "horizontal" : "vertical"} flexItem />

                <Box sx={{ flex: 0.9, flexDirection: "column", ...disabledStyle }}>
                    <Routes>
                        {trips.tabs.map((tab) => (
                            <Route key={tab.route} path={tab.route} element={tab.component} index={tab.index} />
                        ))}
                    </Routes>
                </Box>

                <Divider orientation={isMobile ? "horizontal" : "vertical"} />
                {/* <SettingDescription flex={0.3} tab={trips.currentTab} /> */}
            </Box>
        </Box>
    )
}