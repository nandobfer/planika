import React from "react"
import { Box, Paper, Typography, useMediaQuery } from "@mui/material"
import { Image } from "@mantine/core"
import { CtaButtons } from "../../components/CtaButtons"
import { useMuiTheme } from "../../hooks/useMuiTheme"
import { InlineTypography } from "../../components/InlineTypography"

interface HeroProps {}

export const Hero: React.FC<HeroProps> = (props) => {
    const { invertedGradientStyle, mode } = useMuiTheme()
    const isMobile = useMediaQuery((theme) => theme.breakpoints.down("md"))

    return (
        <Box
            sx={{
                flexDirection: "column",
                gap: 5,
                alignItems: "center",
                padding: { xs: 5, md: 10 },
                ...invertedGradientStyle,
                // borderRadius: 8,
            }}
        >
            <Box sx={{ flexDirection: "column", gap: { xs: 5, md: 5 }, alignItems: "center", width: { xs: 1, md: 0.7 }, zIndex: 1 }}>
                <Typography variant={isMobile ? "h4" : "h2"} sx={{ fontWeight: "bold", textAlign: "center" }}>
                    Planeje sua viagem <InlineTypography highlight>Juntos</InlineTypography>
                </Typography>

                <Typography variant={isMobile ? "subtitle1" : "h5"} sx={{ textAlign: "center" }}>
                    Vá além de simples listas de bagagem. O Planika ajuda grupos a planejar orçamentos de viagem visualmente com categorias
                    estruturadas e colaboração em tempo real.
                </Typography>
                <CtaButtons />
            </Box>

            <Paper sx={{ borderRadius: 2, width: 1 }} elevation={5}>
                <Image src={`hero-${mode}.png`} width="100%" fit="contain" style={{ borderRadius: 8, zIndex: 1 }} />
            </Paper>
        </Box>
    )
}
