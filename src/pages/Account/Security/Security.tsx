import React from "react"
import { Box, Typography } from "@mui/material"

interface SecurityProps {}

export const Security: React.FC<SecurityProps> = () => {
    return (
        <Box sx={{ flexDirection: "column", gap: 3 }}>
            <Typography variant="h5">Security</Typography>
            <Typography variant="body1" color="text.secondary">
                Control authentication settings and account security
            </Typography>
            {/* Security content will be implemented here */}
        </Box>
    )
}