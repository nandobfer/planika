import React from "react"
import { Box, Divider } from "@mui/material"
import { SignupForm } from "../components/SignupForm"
import { LoginFormMenu } from "../components/LoginFormMenu"
import { Title } from "../components/Title"

interface SignupProps {}

const containerWidth = 400
export const GetStarted: React.FC<SignupProps> = (props) => {
    return (
        <Box sx={{ flexDirection: "row", justifyContent: "center", padding: 10, gap: 10, position: "relative" }}>
            <Box sx={{flexDirection: 'column'}}>
                <Title name="Entrar" />
                <LoginFormMenu width={containerWidth} loadingPosition="top" />
            </Box>
            <Divider orientation="vertical" />
            <SignupForm width={containerWidth} />
        </Box>
    )
}
