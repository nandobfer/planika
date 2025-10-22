import React from "react"
import { Accordion, AccordionDetails, AccordionSummary, Box, Typography } from "@mui/material"
import type { Band } from "../types/server/class/Band"
import type { Artist } from "../types/server/class/Artist"
import { GridExpandMoreIcon } from "@mui/x-data-grid"
import { MiniPlayer } from "./MiniPlayer"

interface WhoPlaysProps {
    bands: Band[]
    artists: Artist[]
}

export const WhoPlays: React.FC<WhoPlaysProps> = (props) => {
    return (
        <Box sx={{ flexDirection: "column" }}>
            <Typography variant="subtitle2" fontWeight={"bold"}>
                Quem toca:
            </Typography>
            {props.bands.map((band) => (
                <MiniPlayer key={band.id} band={band} />
            ))}
            {props.artists.map((artist) => (
                <MiniPlayer key={artist.id} artist={artist} />
            ))}
        </Box>
        // <Accordion sx={{ flexDirection: "column", my: -2 }} slots={{ root: Box }}>
        //     <AccordionSummary expandIcon={<GridExpandMoreIcon />} sx={{ padding: 0 }}>
        //         <Typography variant="subtitle2" fontWeight={"bold"}>
        //             Quem toca:
        //         </Typography>
        //     </AccordionSummary>
        //     <AccordionDetails
        //         sx={{
        //             display: "flex",
        //             flexDirection: "column",
        //             gap: 1,
        //             padding: 1,
        //             paddingTop: 0,
        //         }}
        //     >
        //         {props.bands.map((band) => (
        //             <MiniPlayer key={band.id} band={band} />
        //         ))}
        //         {props.artists.map((artist) => (
        //             <MiniPlayer key={artist.id} artist={artist} />
        //         ))}
        //     </AccordionDetails>
        // </Accordion>
    )
}
