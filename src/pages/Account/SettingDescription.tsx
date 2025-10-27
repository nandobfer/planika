import React from "react"
import { Box, Paper, Typography } from "@mui/material"
import type { AccountSetting } from "../../hooks/useAccountSettings"
import { useMuiTheme } from "../../hooks/useMuiTheme"

interface SettingDescriptionProps {
    flex: number
    children: React.ReactNode
}

export const SettingDescription: React.FC<SettingDescriptionProps> = (props) => {
    const { gradientStyle, invertedGradientStyle } = useMuiTheme()
    return (
        <Paper
            sx={{
                flexDirection: "column",
                padding: 5,
                flex: props.flex,
                ...gradientStyle,
            }}
        >
            <Typography>{props.children}</Typography>
        </Paper>
    )
}
