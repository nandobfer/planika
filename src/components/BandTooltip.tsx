import React from "react"
import { Avatar, Box, Button, IconButton, Paper, Typography } from "@mui/material"
import type { Band } from "../types/server/class/Band"
import { Close } from "@mui/icons-material"

interface BandTooltipProps {
    band: Band
}

export const BandTooltip: React.FC<BandTooltipProps> = ({ band }) => {
    const ig_base_url = "https://instagram.com/"
    const splitted_ig = band.instagram?.split(ig_base_url)
    const ig_user = splitted_ig && splitted_ig.length === 2 ? splitted_ig[1] : ""

    return (
        <Box sx={{ flexDirection: "column", padding: 1, alignItems: "center", gap: 1, position: "relative" }}>
            <Paper sx={{ borderRadius: "100%" }} elevation={3}>
                <Avatar src={band.image || undefined} variant="rounded" sx={{ width: 1, height: "auto", aspectRatio: 2 }} />
            </Paper>
            <Box sx={{ flexDirection: "column", alignItems: "center" }}>
                <Typography variant="subtitle2" sx={{ fontWeight: "bold" }} color="primary">
                    {band.name}
                </Typography>
                <Typography variant="caption">{band.description}</Typography>
            </Box>
            <Button
                size="small"
                color="primary"
                onClick={() => (band.instagram ? window.open(band.instagram, "_new") : undefined)}
                sx={{ borderBottom: "1px solid", borderRadius: 0 }}
                fullWidth
            >
                {ig_user ? `@${ig_user}` : band.instagram}
            </Button>
            {/* <IconButton sx={{ position: "absolute", right: 0, bgcolor: "primary.main" }} color="default" size="small">
                <Close fontSize="small" />
            </IconButton> */}
        </Box>
    )
}
