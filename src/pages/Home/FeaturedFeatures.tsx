import React from "react"
import { Box, Typography, useMediaQuery } from "@mui/material"
import { CheckCircle, CheckCircleOutline } from "@mui/icons-material"
import { Image } from "@mantine/core"
import { useMuiTheme } from "../../hooks/useMuiTheme"

interface FeaturedFeaturesProps {}

interface FeatureItem {
    title: string
    description: string
    image: string
    items: string[]
}

const features: FeatureItem[] = [
    {
        title: "Planeje Juntos em Tempo Real",
        description: "Todos os participantes podem atualizar o orçamento da viagem simultaneamente, mantendo todos alinhados nos custos e reservas.",
        items: [
            "Convites por e-mail para seu grupo de viagem",
            "Autenticação via Google para acesso seguro",
            "Atualizações ao vivo para todos os participantes",
        ],
        image: "/collaboration.jpg",
    },
    {
        title: "Visualize a Linha do Tempo da Sua Viagem",
        description:
            "Planeje as despesas da sua viagem cronologicamente—desde a pré-reserva de voos até as atividades diárias. Entenda os padrões de gastos e prepare-se para os dias de maior custo.",
        items: [
            "Linha do tempo interativa ao longo das datas da viagem",
            "Visualização de gastos diários e semanais",
            "Rastreamento de despesas por localização e destino",
        ],
        image: "/timeline.jpg",
    },
]

export const FeaturedFeatures: React.FC<FeaturedFeaturesProps> = (props) => {
    const { invertedGradientStyle } = useMuiTheme()
    const isMobile = useMediaQuery((theme) => theme.breakpoints.down("md"))

    return (
        <Box
            sx={{
                flexDirection: "column",
                gap: 5,
                padding: { xs: 5, md: 10 },
                ...invertedGradientStyle,
            }}
        >
            {features.map((feature, index) => (
                <Box key={index} sx={{ gap: 5, alignItems: "center", flexDirection: { xs: "column", md: index % 2 === 0 ? "row" : "row-reverse" } }}>
                    <Box sx={{ flex: 1, flexDirection: "column", gap: 2, padding: { md: 3 } }}>
                        <Box sx={{ flexDirection: "column", gap: 5 }}>
                            <Typography variant={isMobile ? "h4" : "h4"} sx={{ fontWeight: "bold", textAlign: { xs: "center", md: "left" } }}>
                                {feature.title}
                            </Typography>
                            <Typography variant={isMobile ? "subtitle1" : "h5"}>{feature.description}</Typography>
                            <Box sx={{ flexDirection: "column", gap: 1 }}>
                                {feature.items.map((item, itemIndex) => (
                                    <Box key={itemIndex} sx={{ gap: 1, alignItems: "center" }}>
                                        <CheckCircleOutline color="primary" />
                                        <Typography variant={isMobile ? "caption" : "h6"} sx={{ fontWeight: "normal" }}>
                                            {item}
                                        </Typography>
                                    </Box>
                                ))}
                            </Box>
                        </Box>
                    </Box>
                    <Box sx={{ flex: 1 }}>
                        <Image src={feature.image} alt={feature.title} width="100%" fit="contain" style={{ borderRadius: 8 }} />
                    </Box>
                </Box>
            ))}
        </Box>
    )
}
