import React from "react"
import { Box, Typography } from "@mui/material"

interface CollaborationsProps {}

export const Collaborations: React.FC<CollaborationsProps> = () => {
    return (
        <Box sx={{ flexDirection: "column", gap: 3 }}>
            <Typography variant="h5">Collaborations</Typography>
            <Typography variant="body1" color="text.secondary">
                Manage budgets you own or participate in and view your financial responsibilities
            </Typography>
            {/* Collaborations content will be implemented here */}
        </Box>
    )
}