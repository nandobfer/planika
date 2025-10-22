import React from "react"
import { Avatar, Box, Button, IconButton, Paper, Typography } from "@mui/material"
import type { Artist } from "../types/server/class/Artist"
import { Close } from "@mui/icons-material"

interface ArtistTooltipProps {
    artist: Artist
}

export const ArtistTooltip: React.FC<ArtistTooltipProps> = ({ artist }) => {
    const ig_base_url = "https://instagram.com/"
    const splitted_ig = artist.instagram?.split(ig_base_url)
    const ig_user = splitted_ig && splitted_ig.length === 2 ? splitted_ig[1] : ""

    return (
        <Box sx={{ flexDirection: "column", padding: 1, alignItems: "center", gap: 1, position: "relative" }}>
            <Paper sx={{ borderRadius: "100%" }} elevation={3}>
                <Avatar src={artist.image || undefined} sx={{ width: 200, height: "auto", aspectRatio: 1 }} />
            </Paper>
            <Box sx={{ flexDirection: "column", alignItems: "center" }}>
                <Typography variant="subtitle2" sx={{ fontWeight: "bold" }} color="primary">
                    {artist.name}
                </Typography>
                <Typography variant="caption">{artist.description}</Typography>
            </Box>
            <Button
                size="small"
                color="primary"
                onClick={() => (artist.instagram ? window.open(artist.instagram, "_new") : undefined)}
                sx={{ borderBottom: "1px solid", borderRadius: 0 }}
                fullWidth
            >
                {ig_user ? `@${ig_user}` : artist.instagram}
            </Button>
            {/* <IconButton sx={{ position: "absolute", right: 0, bgcolor: "primary.main" }} color="default" size="small">
                <Close fontSize="small" />
            </IconButton> */}
        </Box>
    )
}
