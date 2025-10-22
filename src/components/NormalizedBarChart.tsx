import React from "react"
import { Box, LinearProgress, Typography, type AlertColor } from "@mui/material"

interface NormalizedBarChartProps {
    max?: number
    value: number
    color?: AlertColor | 'primary' | 'secondary' | 'inherit'
    
}

export const NormalizedBarChart: React.FC<NormalizedBarChartProps> = (props) => {
    const value = (props.value * 100) / (props.max || 100)
    return (
        <Box sx={{ alignItems: "center", flex: 1, gap: 1 }}>
            <LinearProgress sx={{ flex: 1 }} color={props.color || 'inherit'} variant="determinate" value={value} />
            <Typography variant="subtitle2" fontWeight="bold" color={props.color || 'inherit'}>
                {props.value}
            </Typography>
        </Box>
    )
}
