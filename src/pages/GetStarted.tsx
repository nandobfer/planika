import React from "react"
import { Box, Divider, useMediaQuery } from "@mui/material"
import { SignupForm } from "../components/SignupForm"
import { LoginFormMenu } from "../components/LoginFormMenu"
import { Title } from "../components/Title"

interface SignupProps {
    onSuccess?: () => void
}

export const GetStarted: React.FC<SignupProps> = (props) => {
    const isMobile = useMediaQuery((theme) => theme.breakpoints.down("md"))
    const containerWidth = isMobile ? 300 : 400
    return (
        <Box
            sx={{
                flexDirection: { xs: "column", md: "row" },
                justifyContent: "center",
                padding: { xs: 5, md: 10 },
                gap: { xs: 5, md: 10 },
                position: "relative",
            }}
        >
            <Box sx={{ flexDirection: "column" }}>
                <Title name="Entrar" />
                <LoginFormMenu width={containerWidth} loadingPosition="top" onSuccess={props.onSuccess} />
            </Box>
            <Divider orientation={isMobile ? "horizontal" : "vertical"} flexItem />
            <SignupForm width={containerWidth} onSuccess={props.onSuccess} />
        </Box>
    )
}
