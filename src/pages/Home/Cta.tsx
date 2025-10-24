import React from "react"
import { Box, Button, Typography } from "@mui/material"
import { CtaButtons } from "../../components/CtaButtons"
import { useMuiTheme } from "../../hooks/useMuiTheme"
import { InlineTypography } from "../../components/InlineTypography"

interface CtaProps {}

export const Cta: React.FC<CtaProps> = (props) => {
    const { theme, gradientTo } = useMuiTheme()

    return (
        <Box
            sx={{
                flexDirection: "column",
                gap: 5,
                alignItems: "center",
                width: 1,
                padding: 10,
                background: `linear-gradient(0deg,${theme.palette.background.default} 50%, ${gradientTo} 100%)`,
            }}
        >
            <Typography variant="h1" sx={{ fontWeight: "bold", textAlign: "center" }}>
                Pronto para planejar sua próxima <InlineTypography highlight>Aventura Juntos?</InlineTypography>
            </Typography>
            <Typography variant="h5" sx={{ textAlign: "center" }}>
                Junte-se a grupos já usam o Planika para trazer clareza e colaboração ao planejamento de suas viagens.
            </Typography>
            <CtaButtons />
        </Box>
    )
}
