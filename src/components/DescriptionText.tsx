import React from "react"
import { Box, Typography } from "@mui/material"
import { PendingInfoChip } from "./PendingInfoChip"
import { TextFormat } from "@mui/icons-material"

interface DescriptionTextProps {
    text?: string | null
}

export const DescriptionText: React.FC<DescriptionTextProps> = (props) => {
    return (
        <Typography
            variant="caption"
            sx={{
                display: "-webkit-box",
                WebkitBoxOrient: "vertical",
                WebkitLineClamp: 3,
                overflow: "hidden",
                textOverflow: "ellipsis",
                lineHeight: 1.5,
                maxHeight: "4.5em",
                whiteSpace: "break-spaces",
            }}
        >
            {props.text || <PendingInfoChip text="descrição pendente" icon={TextFormat} />}
        </Typography>
    )
}
