import React, { useContext } from "react"
import { Box, Drawer, IconButton } from "@mui/material"
import { Title } from "../../../components/Title"
import TripContext from "../../../contexts/TripContext"
import { Close } from "@mui/icons-material"
import { useReports } from "../../../hooks/useReports"
import { LocationReport } from "./LocationReport"
import { DatetimeChart } from "./DatetimeChart"
import { SankeyChart } from "./SankeyChart"

interface ReportsDrawerProps {}

export const ReportsDrawer: React.FC<ReportsDrawerProps> = (props) => {
    const api = useReports(useContext(TripContext))

    return (
        <Drawer anchor="right" open={api.showReports} onClose={api.closeReportsDrawer} slotProps={{ paper: { elevation: 1 } }}>
            <Box sx={{ flexDirection: "column", padding: 3, height: "100%", gap: 1, width: {xs: "100vw", md: 500} }}>
                <Title
                    name="Relatório"
                    right={
                        <IconButton onClick={api.closeReportsDrawer} size="small">
                            <Close fontSize="small" />
                        </IconButton>
                    }
                />
                {/* <DatetimeChart api={api} /> */}
                <SankeyChart api={api} />
                <LocationReport api={api} />
            </Box>
        </Drawer>
    )
}
