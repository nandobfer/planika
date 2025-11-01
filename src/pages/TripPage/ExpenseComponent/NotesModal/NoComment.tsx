import React from "react"
import { Box, Typography } from "@mui/material"

interface NoCommentProps {}

export const NoComment: React.FC<NoCommentProps> = (props) => {
    return (
        <Box sx={{ justifyContent: "center", alignItems: "center", flexDirection: 'column' }}>
            <Typography>Nenhum comentário</Typography>
            
        </Box>
    )
}
