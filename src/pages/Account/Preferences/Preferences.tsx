import React from "react"
import { Box, Typography } from "@mui/material"

interface PreferencesProps {}

export const Preferences: React.FC<PreferencesProps> = () => {
    return (
        <Box sx={{ flexDirection: "column", gap: 3 }}>
            <Typography variant="h5">Preferences</Typography>
            <Typography variant="body1" color="text.secondary">
                Customize default currency, timezone, and display preferences
            </Typography>
            {/* Preferences content will be implemented here */}
        </Box>
    )
}