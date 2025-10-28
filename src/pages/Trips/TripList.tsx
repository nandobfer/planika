import React from "react"
import { Box, Grid, Typography, useMediaQuery } from "@mui/material"
import type { Trip } from "../../types/server/class/Trip/Trip"
import { TripContainer } from "./TripContainer/TripContainer"

interface TripListProps {
    trips: Trip[]
}

export const TripList: React.FC<TripListProps> = (props) => {
    const isMobile = useMediaQuery((theme) => theme.breakpoints.down("md"))

    return (
        <Box sx={{ flexDirection: "column", gap: 5 }}>
            {props.trips.length > 0 ? (
                props.trips.sort((a, b) => b.updatedAt - a.updatedAt).map((trip) => <TripContainer key={trip.id} trip={trip} />)
            ) : (
                <Typography variant="body2">Nenhuma viagem para exibir</Typography>
            )}
        </Box>
    )
}
