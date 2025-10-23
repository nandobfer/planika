import React from "react"
import { Box, Button, Typography } from "@mui/material"
import { Image } from "@mantine/core"
import { CtaButtons } from "../../components/CtaButtons"

interface HeroProps {}

export const Hero: React.FC<HeroProps> = (props) => {
    return (
        <Box sx={{ flexDirection: "column", gap: 2, alignItems: "center", padding: 2 }}>
            <Box sx={{ flexDirection: "column", gap: 2, alignItems: "center", width: 0.7 }}>
                <Typography variant="h1" sx={{ fontWeight: "bold", textAlign: "center" }}>
                    Planeje sua viagem
                </Typography>
                <Typography color="primary" variant="h1" sx={{ fontWeight: "bold" }}>
                    Juntos
                </Typography>

                <Typography variant="h5" sx={{ textAlign: "center" }}>
                    Vá além de simples listas de bagagem. O Planika ajuda grupos a planejar orçamentos de viagem visualmente com categorias
                    estruturadas e colaboração em tempo real.
                </Typography>
                <CtaButtons />
            </Box>

            <Image src={"/hero-dashboard.jpg"} width="100%" fit="contain" style={{ borderRadius: 8 }} />
        </Box>
    )
}
