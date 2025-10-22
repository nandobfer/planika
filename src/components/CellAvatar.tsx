import React, { useState } from "react"
import { Avatar, Skeleton } from "@mui/material"
import { BrokenImage } from "@mui/icons-material"

interface CellAvatarProps {
    source?: string
}

export const CellAvatar: React.FC<CellAvatarProps> = (props) => {
    const [error, setError] = useState(false)

    return (
        <Avatar
            src={props.source}
            sx={{ width: 60, height: 60, bgcolor: "transparent", color: "primary.main" }}
            variant="circular"
            onError={() => setError(true)}
            slotProps={{ img: { style: { objectFit: "contain" } } }}
        ></Avatar>
    )
}
