import React, { useMemo } from 'react'
import {Avatar, Box} from '@mui/material'
import type { CursorAwareness } from '../../../hooks/useExpenses'
import { useReactFlow } from '@xyflow/react'
import { PanToolAlt } from '@mui/icons-material'

interface CursorComponentProps {
    cursor: CursorAwareness
}

export const CursorComponent: React.FC<CursorComponentProps> = React.memo((props) => {
    const { cursor } = props
    const reactFlowInstance = useReactFlow()
    
    // Convert ReactFlow coordinates back to screen coordinates
    const screenPosition = useMemo(() => {
        return reactFlowInstance.flowToScreenPosition({
            x: cursor.mouseX,
            y: cursor.mouseY,
        })
    }, [cursor.mouseX, cursor.mouseY, reactFlowInstance])
    
    return (
        <Box sx={{
            position: 'absolute', 
            top: screenPosition.y-150, 
            left: screenPosition.x, 
            pointerEvents: 'none', 
            // transform: 'translate(-50%, -50%)', 
            zIndex: 1000,
            transition: 'top 0.1s ease-out, left 0.1s ease-out',
            willChange: 'top, left', // Optimize for animation
            flexDirection: 'column'
        }}>
            <PanToolAlt />
            <Avatar src={cursor.picture} alt={cursor.name} sx={{
                borderRadius: '50%', 
                width: 32, 
                height: 32,
                border: '2px solid white',
                boxShadow: 2,
                marginLeft: 3
            }} />
        </Box>
    )
}, (prevProps, nextProps) => {
    // Custom comparison function - only re-render if position changes significantly
    const threshold = 1 // pixels
    return (
        prevProps.cursor.id === nextProps.cursor.id &&
        Math.abs(prevProps.cursor.mouseX - nextProps.cursor.mouseX) < threshold &&
        Math.abs(prevProps.cursor.mouseY - nextProps.cursor.mouseY) < threshold
    )
})