import React from "react"
import { Box, Typography } from "@mui/material"

interface InvitationsProps {}

export const Invitations: React.FC<InvitationsProps> = () => {
    return (
        <Box sx={{ flexDirection: "column", gap: 3 }}>
            <Typography variant="h5">Invitations</Typography>
            <Typography variant="body1" color="text.secondary">
                Send email invitations to new collaborators and track pending invites
            </Typography>
            {/* Invitations content will be implemented here */}
        </Box>
    )
}