import React, { useMemo } from "react"
import { Box, Typography } from "@mui/material"
import { NormalizedBarChart } from "../../components/NormalizedBarChart"
import type { Artist } from "../../types/server/class/Artist"

const Text: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <Typography variant="caption" sx={{ lineHeight: "0.5em", fontWeight: "bold" }}>
        {children}
    </Typography>
)

interface ArtistEventsChartsProps {
    artist: Artist
    artists: Artist[]
}

export const ArtistEventsCharts: React.FC<ArtistEventsChartsProps> = (props) => {
    const artist = props.artist

    const higherEvents = useMemo(() => props.artists.reduce((max, artist) => (artist.events > max ? artist.events : max), 0), [props.artists])
    const higherEventsWithoutBand = useMemo(
        () => props.artists.reduce((max, artist) => (artist.eventsWithoutBand > max ? artist.eventsWithoutBand : max), 0),
        [props.artists]
    )
    const higherEventsAsBands = useMemo(
        () => props.artists.reduce((max, artist) => (artist.eventsAsBand > max ? artist.eventsAsBand : max), 0),
        [props.artists]
    )

    return (
        <Box sx={{ flexDirection: "column", width: 1 }}>
            <Text>Eventos</Text>
            <NormalizedBarChart max={higherEventsWithoutBand} value={artist.eventsWithoutBand} color="warning" />
            {!!artist.bands && (
                <>
                    <Text>Eventos como banda</Text>
                    <NormalizedBarChart max={higherEventsAsBands} value={artist.eventsAsBand} color="warning" />
                </>
            )}
            <Text>Eventos (total)</Text>
            <NormalizedBarChart max={higherEvents} value={artist.events} color="primary" />
        </Box>
    )
}
