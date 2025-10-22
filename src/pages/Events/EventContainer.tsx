import React, { useState } from "react"
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Avatar,
    Box,
    Button,
    ClickAwayListener,
    Divider,
    Menu,
    Tooltip,
    Typography,
} from "@mui/material"
import type { Event } from "../../types/server/class/Event"
import { BrokenImage, LocationPin, Reply } from "@mui/icons-material"
import dayjs from "dayjs"
import { currencyMask } from "../../tools/numberMask"
import { EventLocation } from "../../components/EventLocation"
import { WhoPlays } from "../../components/WhoPlays"
import { GridExpandMoreIcon } from "@mui/x-data-grid"

interface EventContainerProps {
    event: Event
    divider?: boolean
    expandedId: string
    handleAccordeonClick: (id: string) => void
}

export const EventContainer: React.FC<EventContainerProps> = (props) => {
    const [menuAnchor, setMenuAnchor] = useState<HTMLButtonElement | null>(null)
    const [showLocation, setShowLocation] = useState(false)

    const event = props.event

    const closeMenu = () => {
        setMenuAnchor(null)
    }

    return (
        <Box sx={{ flexDirection: "column", gap: 1, width: 1 }}>
            <Accordion
                sx={{ flexDirection: "column" }}
                slots={{ root: Box }}
                expanded={props.expandedId === props.event.id}
                onChange={(_, expanded) => props.handleAccordeonClick(expanded ? props.event.id : "")}
            >
                <AccordionSummary expandIcon={<GridExpandMoreIcon />} sx={{ padding: 0 }}>
                    <Box sx={{ alignItems: "center", justifyContent: "space-between" }}>
                        <Box sx={{ flexDirection: "column", width: 1 }}>
                            <Box sx={{ justifyContent: "space-between", width: 1, alignItems: "center", gap: 1 }}>
                                <Typography variant="subtitle2" sx={{ fontWeight: "bold" }} color="primary">
                                    {dayjs(Number(event.datetime)).format("HH:mm")}
                                </Typography>
                                <Typography variant="subtitle2" sx={{ fontWeight: "bold" }}>
                                    {event.title}
                                </Typography>
                            </Box>
                            <Typography variant="body1" color="success" sx={{ fontWeight: "bold" }}>
                                {event.price ? currencyMask(event.price) : "GRÁTIS"}
                            </Typography>
                        </Box>
                    </Box>
                </AccordionSummary>
                <AccordionDetails
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 1,
                        padding: 1,
                        paddingTop: 0,
                    }}
                >
                    {event.image && (
                        <Avatar
                            src={event.image || undefined}
                            sx={{ width: 1, height: "auto", bgcolor: "background.paper", color: "primary.main" }}
                            variant="rounded"
                            slotProps={{ img: { style: { objectFit: "cover" } } }}
                        >
                            <BrokenImage sx={{ width: 1, height: 1 }} />
                        </Avatar>
                    )}

                    <Typography variant="subtitle2">{event.description}</Typography>

                    {(event.bands.length > 0 || event.artists.length > 0) && <WhoPlays artists={event.artists} bands={event.bands} />}

                    {!!event.location.street && (
                        <ClickAwayListener onClickAway={() => setShowLocation(false)}>
                            <Tooltip
                                title={<EventLocation location={event.location} />}
                                open={showLocation}
                                placement="auto-end"
                                slotProps={{ tooltip: { sx: { padding: 0, bgcolor: "transparent" } } }}
                                // arrow={false}
                            >
                                <Button
                                    size="small"
                                    onClick={() => setShowLocation(true)}
                                    sx={{ borderBottom: "1px solid", borderRadius: 0 }}
                                    // variant="contained"
                                    endIcon={<LocationPin sx={{ rotate: "180deg", transform: "scale(1, -1)" }} />}
                                    color="info"
                                >
                                    Como chegar
                                </Button>
                            </Tooltip>
                        </ClickAwayListener>
                    )}

                    {event.ticketUrl && (
                        <Button
                            size="small"
                            onClick={() => window.open(event.ticketUrl!, "_new")}
                            sx={{ borderBottom: "1px solid", borderRadius: 0 }}
                            // variant="contained"
                            endIcon={<Reply sx={{ rotate: "180deg", transform: "scale(1, -1)" }} />}
                        >
                            Adquirir ingresso
                        </Button>
                    )}
                </AccordionDetails>
            </Accordion>
            {props.divider && <Divider sx={{}} />}

            <Menu open={!!menuAnchor} anchorEl={menuAnchor} onClose={closeMenu}></Menu>
        </Box>
    )
}
