import { Box, CircularProgress, IconButton, lighten, Typography, useMediaQuery } from "@mui/material"
import { Close, Refresh } from "@mui/icons-material"
import { useMuiTheme } from "../hooks/useMuiTheme"

export const Title: React.FC<{
    name: string
    right?: React.ReactNode
    left?: React.ReactNode
    space?: boolean
    center?: boolean
    refresh?: () => void
    refreshing?: boolean
    onClose?: () => void
}> = ({ name, right, left, space, center, refresh, refreshing, onClose }) => {
    const { theme } = useMuiTheme()

    return (
        <Box
            sx={{
                color: lighten(theme.palette.secondary.main, 0.3),
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
                        color: theme.palette.primary.main,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                    }}
                >
                    {name}
                </Typography>
            </Box>
            {right && right}
            {onClose && (
                <IconButton size="small" onClick={onClose}>
                    <Close fontSize="small" />
                </IconButton>
            )}
            {refresh && (
                <IconButton size="small" onClick={refresh}>
                    {refreshing ? <CircularProgress size={"1rem"} /> : <Refresh fontSize="small" />}
                </IconButton>
            )}
        </Box>
    )
}
