import React from "react"
import { Box } from "@mui/material"
import { Features } from "./Features"
import { Hero } from "./Hero"
import { FeaturedFeatures } from "./FeaturedFeatures"
import { Cta } from "./Cta"

interface HomeProps {}

export const Home: React.FC<HomeProps> = (props) => {
    return (
        <Box sx={{ flexDirection: "column", alignItems: "center" }}>
            <Hero />
            <Features />
            <FeaturedFeatures />
            <Cta />
        </Box>
    )
}
