import { Box, CircularProgress, IconButton, lighten, Typography, useMediaQuery } from "@mui/material"
import { colors } from "../style/colors"
import { Refresh } from "@mui/icons-material"

export const Title: React.FC<{
    name: string
    right?: React.ReactNode
    left?: React.ReactNode
    space?: boolean
    center?: boolean
    refresh?: () => void
    refreshing?: boolean
}> = ({ name, right, left, space, center, refresh, refreshing }) => {


    return (
        <Box
            sx={{
                color: lighten(colors.secondary, 0.3),
                fontWeight: "bold",
                borderBottom: "2px solid",
                borderColor: "primary.main",
                width: "100%",
                justifyContent: "space-between",
                alignItems: "center",
                flexDirection: "row",
                display: "flex",
            }}
        >
            <Box sx={{ alignItems: "center", gap: 1, flex: 1, maxWidth: left && right ? "80%" : undefined }}>
                {left && <Box>{left}</Box>}
                <Typography
                    variant="h6"
                    sx={{
                        color: colors.primary,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                    }}
                >
                    {name}
                </Typography>
            </Box>
            {right && right}
            {refresh && <IconButton onClick={refresh}>{refreshing ? <CircularProgress size="1.5rem" /> : <Refresh />}</IconButton>}
        </Box>
    )
}