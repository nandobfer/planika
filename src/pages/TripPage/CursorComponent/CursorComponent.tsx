import React, { useMemo } from 'react'
import {Avatar, Box} from '@mui/material'
import type { CursorAwareness } from '../../../hooks/useExpenses'
import { useViewport } from "@xyflow/react"
import { PanToolAlt } from "@mui/icons-material"

interface CursorComponentProps {
    cursor: CursorAwareness
}

export const CursorComponent: React.FC<CursorComponentProps> = (props) => {
    const { cursor } = props
    const viewport = useViewport() // This hook provides reactive viewport state

    // Calculate position with viewport transformation applied
    const transform = useMemo(() => {
        const x = cursor.mouseX * viewport.zoom + viewport.x
        const y = cursor.mouseY * viewport.zoom + viewport.y
        return `translate(${x}px, ${y}px)`
    }, [cursor.mouseX, cursor.mouseY, viewport.x, viewport.y, viewport.zoom])

    return (
        <Box
            sx={{
                position: "absolute",
                top: 0,
                left: 0,
                transform,
                pointerEvents: "none",
                zIndex: 1000,
                transition: "transform 0.05s ease-out",
                willChange: "transform", // Optimize for animation
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
            }}
        >
            <PanToolAlt sx={{ fontSize: 20, marginBottom: 0.5 }} />
            <Avatar
                src={cursor.picture}
                alt={cursor.name}
                sx={{
                    borderRadius: "50%",
                    width: 32,
                    height: 32,
                    border: "2px solid white",
                    boxShadow: 2,
                }}
            />
        </Box>
    )
}