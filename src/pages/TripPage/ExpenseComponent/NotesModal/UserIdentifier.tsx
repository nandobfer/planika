import React from "react"
import { Avatar, Box, Typography } from "@mui/material"
import type { User } from "../../../../types/server/class/User"

interface UserIdentifierProps {
    user: User
}

export const UserIdentifier: React.FC<UserIdentifierProps> = (props) => {
    return (
        <Box sx={{alignItems: 'center', gap: 1}}>
            <Avatar src={props.user.picture} sx={{ bgcolor: "primary.main", width: 30, aspectRatio: 1, height: "auto" }} />
            <Typography fontWeight={"bold"} variant="subtitle2">
                {props.user.name.split(" ")[0]}
            </Typography>
        </Box>
    )
}
