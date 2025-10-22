import React, { useState } from "react"
import { Box, Paper, Typography } from "@mui/material"
import type { Event } from "../../types/server/class/Event"
import { useMuiTheme } from "../../hooks/useMuiTheme"
import { EventContainer } from "./EventContainer"
import { MoodBad } from "@mui/icons-material"
import { getWeekNumber } from "../../tools/getWeekNumber"

interface EventDayProps {
    day: WeekDay
    index: number
    week: number
}

export interface WeekDay {
    name: string
    events: Event[]
}

const borderRadius = 30

export const EventDay: React.FC<EventDayProps> = ({ day, index, week }) => {
    const theme = useMuiTheme()
    const today = new Date().getDay()
    const isToday = (index === 6 ? today === 0 : index === today - 1) && week === getWeekNumber(Date.now())

    const [expandedEventId, setExpandedEventId] = useState(
        day.events.length > 0 ? day.events.sort((a, b) => Number(a.datetime) - Number(b.datetime))[0].id : ""
    )

    return (
        <Paper sx={{ flexDirection: "column", borderTopRightRadius: borderRadius, borderTopLeftRadius: borderRadius, overflow: "hidden" }}>
            <Paper
                sx={{
                    flexDirection: "column",
                    padding: 1,
                    borderTopRightRadius: borderRadius,
                    borderTopLeftRadius: borderRadius,
                    bgcolor: isToday ? "primary.main" : theme.palette.divider,
                    cursor: "col-resize",
                }}
            >
                <Typography variant="h6" sx={{ alignSelf: "center" }}>
                    {day.name}
                </Typography>
            </Paper>
            <Paper sx={{ flexDirection: "column", padding: 2 }}>
                {day.events
                    .sort((a, b) => Number(a.datetime) - Number(b.datetime))
                    .map((event, index) => (
                        <EventContainer
                            key={event.id}
                            event={event}
                            divider={index !== day.events.length - 1}
                            expandedId={expandedEventId}
                            handleAccordeonClick={(id) => setExpandedEventId(id)}
                        />
                    ))}
                {day.events.length === 0 && (
                    <Box sx={{ flexDirection: "column", alignItems: "center" }}>
                        <Typography variant="subtitle2">Sem forró nesse dia</Typography>
                        <MoodBad />
                    </Box>
                )}
            </Paper>
        </Paper>
    )
}
