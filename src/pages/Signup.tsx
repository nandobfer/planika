import React from "react"
import { Box, useMediaQuery } from "@mui/material"
import { SignupForm } from "../components/SignupForm"

interface SignupProps {}

export const Signup: React.FC<SignupProps> = (props) => {
    const isMobile = useMediaQuery((theme) => theme.breakpoints.down("md"))
    return (
        <Box
            sx={{
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                height: "100%",
                padding: { xs: 5, md: 10 },
                position: "relative",
            }}
        >
            <SignupForm width={isMobile ? 300 : 400} />
        </Box>
    )
}
