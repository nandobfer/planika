import React from "react"
import { Box } from "@mui/material"
import { Features } from "./Features"
import { Hero } from "./Hero"
import { FeaturedFeatures } from "./FeaturedFeatures"
import { Cta } from "./Cta"

interface HomeProps {}

export const Home: React.FC<HomeProps> = (props) => {
    return (
        <Box sx={{ flexDirection: "column", gap: 5, alignItems: "center", padding: 2 }}>
            <Hero />
            <Features />
            <FeaturedFeatures />
            <Cta />
        </Box>
    )
}
