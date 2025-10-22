import React from "react"
import { Box, Typography } from "@mui/material"
import { MoodBad } from "@mui/icons-material"

interface NotFoundProps {}

export const NotFound: React.FC<NotFoundProps> = (props) => {
    return (
        <Box color="primary.main" sx={{ justifyContent: "center", alignItems: "center", flexDirection: "column", gap: 2, height: '75vh' }}>
            <Typography variant="h1">404</Typography>
            <Typography variant="h6">Página não encontrada</Typography>
            <MoodBad sx={{width: 75, height: 'auto'}} />
        </Box>
    )
}
