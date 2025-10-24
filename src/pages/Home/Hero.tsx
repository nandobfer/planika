import React from "react"
import { Box, Typography } from "@mui/material"
import { Image } from "@mantine/core"
import { CtaButtons } from "../../components/CtaButtons"
import { useMuiTheme } from "../../hooks/useMuiTheme"
import { InlineTypography } from "../../components/InlineTypography"

interface HeroProps {}

export const Hero: React.FC<HeroProps> = (props) => {
    const { invertedGradientStyle } = useMuiTheme()
    return (
        <Box
            sx={{
                flexDirection: "column",
                gap: 5,
                alignItems: "center",
                padding: 10,
                ...invertedGradientStyle,
                // borderRadius: 8,
            }}
        >
            {/* <Box sx={{ position: "absolute", width: "100%", height: "200vh", zIndex: 0, top: 0 }}>
                <Particles
                    particleColors={[theme.palette.primary.main]}
                    particleCount={200}
                    particleSpread={10}
                    speed={0.1}
                    particleBaseSize={100}
                    moveParticlesOnHover={true}
                    alphaParticles={false}
                    disableRotation={false}
                />
            </Box> */}
            <Box sx={{ flexDirection: "column", gap: 5, alignItems: "center", width: 0.7, zIndex: 1 }}>
                <Typography variant="h1" sx={{ fontWeight: "bold", textAlign: "center" }}>
                    Planeje sua viagem <InlineTypography highlight>Juntos</InlineTypography>
                </Typography>

                <Typography variant="h5" sx={{ textAlign: "center" }}>
                    Vá além de simples listas de bagagem. O Planika ajuda grupos a planejar orçamentos de viagem visualmente com categorias
                    estruturadas e colaboração em tempo real.
                </Typography>
                <CtaButtons />
            </Box>

            <Image src={"/hero-dashboard.jpg"} width="100%" fit="contain" style={{ borderRadius: 8, zIndex: 1 }} />
        </Box>
    )
}
