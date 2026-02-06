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



export const FeaturedFeatures: React.FC<FeaturedFeaturesProps> = (props) => {
    const { invertedGradientStyle, mode } = useMuiTheme()
    const isMobile = useMediaQuery((theme) => theme.breakpoints.down("md"))

    const features: FeatureItem[] = [
        {
            title: "Planeje Juntos em Tempo Real",
            description:
                "Todos os participantes podem atualizar o orçamento da viagem simultaneamente, mantendo todos alinhados nos custos e reservas.",
            items: [
                "Convites por e-mail para seu grupo de viagem",
                "Autenticação via Google para acesso seguro",
                "Atualizações ao vivo para todos os participantes",
            ],
            image: `/crdt-${mode}.webp`,
        },
        {
            title: "Adicione comentários em cada item",
            description:
                "Facilite a comunicação dentro do grupo adicionando comentários específicos para cada item do orçamento, permitindo discussões claras sobre cada despesa.",
            items: [
                "Insira comentários com texto, links ou imagens",
                "Registre informações importantes",
                "Colaboração eficiente para decisões de viagem",
            ],
            image: `/witmarsum-${mode}.webp`,
        },
    ]

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
