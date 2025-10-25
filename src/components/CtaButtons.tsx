import React from "react"
import { Box, Button } from "@mui/material"
import { useNavigate } from "react-router-dom"

interface CtaButtonsProps {}

export const CtaButtons: React.FC<CtaButtonsProps> = (props) => {
    const navigate = useNavigate()

    return (
        <Box sx={{ gap: 5, flexDirection: { xs: "column", sm: "row" } }}>
            <Button variant="contained" color="primary" size="large" onClick={() => navigate("/get-started")}>
                Começar agora
            </Button>
            <Button variant="contained" color="secondary" size="large">
                Assistir demonstração
            </Button>
        </Box>
    )
}
