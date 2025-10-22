import React, { useState } from "react"
import { Avatar, Box, Button, ClickAwayListener, IconButton, Paper, Tooltip, Typography } from "@mui/material"
import type { Artist } from "../types/server/class/Artist"
import { ArtistTooltip } from "./ArtistTooltip"

interface MiniArtistProps {
    artist: Artist
}

export const MiniArtist: React.FC<MiniArtistProps> = ({ artist }) => {
    const [showTooltip, setShowTooltip] = useState(false)

    return (
        <ClickAwayListener onClickAway={() => setShowTooltip(false)}>
            <Tooltip title={<ArtistTooltip artist={artist} />} open={showTooltip} placement="auto" slotProps={{ tooltip: { sx: {} } }}>
                <Box sx={{ width: 1, gap: 1, alignItems: "center" }} onClick={() => setShowTooltip(true)}>
                    <Avatar src={artist.image || undefined} sx={{ width: 60, height: 60 }} />
                    <Box sx={{ flexDirection: "column" }}>
                        <Typography variant="subtitle2">{artist.name}</Typography>

                        <Button
                            size="small"
                            color="primary"
                            onClick={() => setShowTooltip(true)}
                            sx={{ borderBottom: "1px solid", borderRadius: 0, marginRight: "auto" }}
                        >
                            Quem é
                        </Button>
                    </Box>
                </Box>
            </Tooltip>
        </ClickAwayListener>
    )
}
