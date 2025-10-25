import React from "react"
import { Box, Switch } from "@mui/material"
import { useMuiTheme } from "../hooks/useMuiTheme"
import { DarkMode, LightMode } from "@mui/icons-material"

interface ThemeModeSwitchProps {}

export const ThemeModeSwitch: React.FC<ThemeModeSwitchProps> = (props) => {
    const { mode, setMode } = useMuiTheme()

    return (
        <Box sx={{ alignItems: "center", width: "min-content" }}>
            <DarkMode fontSize="small" color={mode === "dark" ? "primary" : "disabled"} />
            <Switch size="small" checked={mode === "light"} onChange={() => setMode(mode === "dark" ? "light" : "dark")} />
            <LightMode fontSize="small" color={mode === "light" ? "primary" : "disabled"} />
        </Box>
    )
}
