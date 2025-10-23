import React from "react"
import { Box, Button, Typography } from "@mui/material"
import { CtaButtons } from "../../components/CtaButtons"
import { useMuiTheme } from "../../hooks/useMuiTheme"

interface CtaProps {}

export const Cta: React.FC<CtaProps> = (props) => {
    const {theme, mode} = useMuiTheme()

    const gradientTo = mode === "dark" ? theme.palette.action.disabled : theme.palette.primary.main

    return (
        <Box
            sx={{
                flexDirection: "column",
                gap: 2,
                alignItems: "center",
                padding: 5,
                width: '100vw',
                borderRadius: 8,
                background: `linear-gradient(0deg,${theme.palette.background.default} 50%, ${gradientTo} 100%)`,
            }}
        >
            <Typography variant="h1" sx={{ fontWeight: "bold", textAlign: "center" }}>
                Pronto para planejar sua próxima
            </Typography>
            <Typography color="primary" variant="h1" sx={{ fontWeight: "bold", textAlign: "center" }}>
                Aventura Juntos?
            </Typography>
            <Typography variant="h5" sx={{ textAlign: "center" }}>
                Junte-se a grupos já usam o Planika para trazer clareza e colaboração ao planejamento de suas viagens.
            </Typography>
            <CtaButtons />
        </Box>
    )
}
