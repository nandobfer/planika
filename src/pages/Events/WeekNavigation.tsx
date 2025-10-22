import React from "react"
import { Box, IconButton, Typography } from "@mui/material"
import { ArrowLeft, ArrowRight, NavigateBefore, NavigateNext } from "@mui/icons-material"
import { getDateRangeFromWeekNumber } from "../../tools/getWeekDays"
import { getWeekNumber } from "../../tools/getWeekNumber"

interface WeekNavigationProps {
    selectedWeek: number
    setSelectedWeek: React.Dispatch<React.SetStateAction<number>>
}

const formatDateText = (date: Date) => date.toLocaleDateString("pt-br", { day: "2-digit", month: "short" })

export const WeekNavigation: React.FC<WeekNavigationProps> = (props) => {
    const currentWeek = getWeekNumber(new Date().getTime())
    const range = getDateRangeFromWeekNumber(props.selectedWeek)

    const changeWeek = (direction: "backward" | "forward") => {
        props.setSelectedWeek((week) => week + (direction === "forward" ? 1 : -1))
    }

    return (
        <Box sx={{ alignItems: "center", justifyContent: "space-between" }} color={"primary.main"}>
            <IconButton color="primary" onClick={() => changeWeek("backward")}>
                <NavigateBefore sx={{ width: 30, height: "auto" }} />
            </IconButton>
            <Typography variant="subtitle2" color={currentWeek === props.selectedWeek ? "primary" : "secondary"}>
                {formatDateText(range.monday)} - {formatDateText(range.sunday)}
            </Typography>
            <IconButton color="primary" onClick={() => changeWeek("forward")}>
                <NavigateNext sx={{ width: 30, height: "auto" }} />
            </IconButton>
        </Box>
    )
}
