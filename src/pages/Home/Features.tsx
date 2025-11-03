import React from "react"
import { Box, Grid, lighten, Paper, Typography, useMediaQuery } from "@mui/material"
import type { MuiIcon } from "../../types/MuiIcon"
import type { MuiColor } from "../../types/MuiColor"
import { AccountTree, Assessment, CalendarMonth, CheckCircle, FilterAlt, Groups } from "@mui/icons-material"
import { useMuiTheme } from "../../hooks/useMuiTheme"

interface FeaturesProps {}

interface FeatureItem {
    title: string
    description: string
    icon: MuiIcon
    color: MuiColor
}

const features: FeatureItem[] = [
    {
        icon: AccountTree,
        title: "Árvore Interativa",
        description: "Organize o orçamento da sua viagem hierarquicamente e veja o total de custos de cada ramificação na própria despesa.",
        color: "primary",
    },
    {
        icon: FilterAlt,
        title: "Filtragem Dinâmica",
        description:
            "Clique em qualquer localização, viajante, data ou status da reserva para filtrar toda a visão da sua viagem. Explore os custos de forma interativa.",
        color: "info",
    },
    {
        icon: Groups,
        title: "Colaboração Simultânea",
        description:
            "Convide companheiros de viagem por e-mail e veja as atualizações instantaneamente enquanto todos adicionam despesas e comentários.",
        color: "warning",
    },
    {
        icon: CalendarMonth,
        title: "Cronograma",
        description: "Planeje despesas ao longo das datas da sua viagem. Identifique os dias de maior gasto e acompanhe os custos do itinerário.",
        color: "primary",
    },
    {
        icon: CheckCircle,
        title: "Rastreamento de Status",
        description:
            "Marque itens como Pendentes, Reservados ou Pagos. Atribua quem está reservando o quê para esclarecer responsabilidades entre os companheiros de viagem.",
        color: "info",
    },
    {
        icon: Assessment,
        title: "Relatórios",
        description: "Gere relatórios com detalhes de despesas por localização e os exporte em formatos populares ou envie por e-mail.",
        color: "warning",
    },
]

const FeatureComponent: React.FC<{ feature: FeatureItem; mode: "light" | "dark"; mobile?: boolean }> = ({ feature, mode, mobile }) => {
    const { theme } = useMuiTheme()
    return (
        <Paper sx={{ padding: 3, flexDirection: "column", flex: 1, height: { md: 1 }, width: mobile ? "max-content" : 1, gap: 2 }}>
            <Box sx={{ justifyContent: "space-between", gap: 5 }}>
                <Typography variant={mobile ? "subtitle1" : "h5"} sx={{ fontWeight: "bold" }}>
                    {feature.title}
                </Typography>
                <Paper
                    elevation={mode === "dark" ? 5 : undefined}
                    sx={{
                        justifyContent: "center",
                        alignItems: "center",
                        padding: 1.5,
                        marginTop: -3,
                        marginRight: -3,
                        bgcolor: mode === "light" ? lighten(theme.palette.primary.main, 0.85) : undefined,
                        height: "min-content",
                    }}
                >
                    <feature.icon color={feature.color} sx={{ height: "auto", width: 30 }} />
                </Paper>
            </Box>
            <Typography variant={mobile ? "body2" : "body1"}>{feature.description}</Typography>
        </Paper>
    )
}

export const Features: React.FC<FeaturesProps> = (props) => {
    const isMobile = useMediaQuery((theme) => theme.breakpoints.down("md"))
    const { gradientStyle, mode } = useMuiTheme()

    return (
        <Box
            sx={{
                flexDirection: "column",
                gap: 5,
                padding: { xs: 5, md: 10 },
                ...gradientStyle,
            }}
        >
            <Typography variant={isMobile ? "h4" : "h2"} sx={{ fontWeight: "bold", textAlign: "center" }}>
                Tudo que você precisa para planejar suas viagens
            </Typography>

            <Typography variant={isMobile ? "subtitle1" : "h5"} sx={{ textAlign: "center" }}>
                Recursos poderosos projetados para grupos que desejam clareza e controle sobre as despesas da viagem.
            </Typography>

            {isMobile ? (
                <Box sx={{ gap: 5, width: "100vw", overflowX: "auto", padding: 5, margin: -5 }}>
                    {features.map((feature, index) => (
                        <FeatureComponent feature={feature} mode={mode} mobile />
                    ))}
                </Box>
            ) : (
                <Grid container spacing={5} columns={3}>
                    {features.map((feature, index) => (
                        <Grid size={1} key={index}>
                            <FeatureComponent feature={feature} mode={mode} />
                        </Grid>
                    ))}
                </Grid>
            )}
        </Box>
    )
}
