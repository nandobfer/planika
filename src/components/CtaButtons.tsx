import React from "react"
import { Box, Button } from "@mui/material"

interface CtaButtonsProps {}

export const CtaButtons: React.FC<CtaButtonsProps> = (props) => {
    return (
        <Box sx={{ gap: 5, flexDirection: { xs: "column", sm: "row" } }}>
            <Button variant="contained" color="primary" size="large">
                Começar agora
            </Button>
            <Button variant="contained" color="secondary" size="large">
                Assistir demonstração
            </Button>
        </Box>
    )
}
