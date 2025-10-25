import React from "react"
import { Box } from "@mui/material"
import { SignupForm } from "../components/SignupForm"

interface SignupProps {}

export const Signup: React.FC<SignupProps> = (props) => {
    return (
        <Box sx={{ flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", padding: 10, position: "relative" }}>
            <SignupForm />
        </Box>
    )
}
