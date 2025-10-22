import React from "react"
import { Box, Button } from "@mui/material"
import { routes } from "../Router"
import { useLocation, useNavigate } from "react-router-dom"
import { colors } from "../style/colors"

interface RoutesProps {}

export const Routes: React.FC<RoutesProps> = (props) => {
    const location = useLocation()
    const navigate = useNavigate()

    const pathname = location.pathname

    return (
        <Box sx={{ gap: 0 }}>
            {routes.map((route) => {
                const isCurrentRoute = pathname === route.path
                return (
                    <Button
                        sx={{
                            borderBottom:  isCurrentRoute ? `1px solid ${colors.background}` : undefined,
                            fontWeight: isCurrentRoute ? 'bold' : undefined,
                            fontSize: 12,
                            padding: 0.2
                        }}
                        size="small"
                        color={"inherit"}
                        key={route.path}
                        onClick={() => navigate(route.path)}
                    >
                        {route.label}
                    </Button>
                )
            })}
        </Box>
    )
}
