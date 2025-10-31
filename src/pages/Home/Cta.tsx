import React from "react"
import { Box, Button, Typography, useMediaQuery } from "@mui/material"
import { CtaButtons } from "../../components/CtaButtons"
import { useMuiTheme } from "../../hooks/useMuiTheme"
import { InlineTypography } from "../../components/InlineTypography"

interface CtaProps {}

export const Cta: React.FC<CtaProps> = (props) => {
    const { gradientStyle } = useMuiTheme()
    const isMobile = useMediaQuery((theme) => theme.breakpoints.down("md"))

    return (
        <Box
            sx={{
                flexDirection: "column",
                gap: 5,
                alignItems: "center",
                width: 1,
                padding: { xs: 5, md: 10 },
                ...gradientStyle,
            }}
        >
            <Typography variant={isMobile ? "h4" : "h2"} sx={{ fontWeight: "bold", textAlign: "center" }}>
                Pronto para planejar sua próxima <InlineTypography highlight>Aventura Juntos?</InlineTypography>
            </Typography>
            <Typography variant={isMobile ? "subtitle1" : "h5"} sx={{ textAlign: "center" }}>
                Junte-se a grupos já usam o Planika para trazer clareza e colaboração ao planejamento de suas viagens.
            </Typography>
            <CtaButtons />
        </Box>
    )
}
