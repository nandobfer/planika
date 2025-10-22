import React, { useState } from "react"
import { Avatar, Box, Button, ClickAwayListener, Tooltip, Typography } from "@mui/material"
import type { Band } from "../types/server/class/Band"
import { BandTooltip } from "./BandTooltip"
import type { Artist } from "../types/server/class/Artist"
import { ArtistTooltip } from "./ArtistTooltip"

interface MiniPlayerProps {
    band?: Band
    artist?: Artist
}

export const MiniPlayer: React.FC<MiniPlayerProps> = (props) => {
    const player = props.artist || props.band
    // const [showTooltip, setShowTooltip] = useState(false)

    const ig_base_url = "https://instagram.com/"
    const splitted_ig = player?.instagram?.split(ig_base_url)
    const ig_user = splitted_ig && splitted_ig.length === 2 ? splitted_ig[1] : ""

    return (
        // <ClickAwayListener onClickAway={() => setShowTooltip(false)}>
        // <Tooltip
        //     title={props.band ? <BandTooltip band={props.band} /> : props.artist ? <ArtistTooltip artist={props.artist} /> : null}
        //     open={showTooltip}
        //     placement="auto"
        //     slotProps={{ tooltip: { sx: {} } }}
        // >
        <Button
            // onClick={() => setShowTooltip(true)}
            onClick={() => (player?.instagram ? window.open(player.instagram, "_new") : null)}
            color="inherit"
            sx={{ borderBottom: "1px solid", borderRadius: 0, gap: 1, justifyContent: "space-between", alignItems: "flex-end" }}
            fullWidth
            size="small"
        >
            <Box sx={{ gap: 1, alignItems: "center" }}>
                <Avatar
                    variant={props.artist ? "circular" : "rounded"}
                    src={player?.image || undefined}
                    sx={{ width: props.artist ? 30 : 50, height: 30, marginLeft: props.artist ? 1.2 : undefined }}
                />
                {player?.name}
            </Box>

            <Typography variant="caption" fontSize={8}>
                {ig_user ? `@${ig_user}` : ""}
            </Typography>
        </Button>
        // </Tooltip>
        // </ClickAwayListener>
    )
}
