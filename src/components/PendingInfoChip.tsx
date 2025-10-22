import React from 'react'
import {Box, Chip} from '@mui/material'
import type { MuiIcon } from '../types/MuiIcon'

interface PendingInfoChipProps {
    text: string
    icon: MuiIcon
    marginTop?: boolean
    marginBottom?: boolean
}

export const PendingInfoChip:React.FC<PendingInfoChipProps> = (props) => {
    
    return (
        <Chip icon={<props.icon />} size='small' label={props.text} sx={{ marginTop: props.marginTop ? 1 : undefined, marginBottom: props.marginBottom ? 1 : undefined}} />
    )
}