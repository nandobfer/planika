import React from 'react'
import {Box} from '@mui/material'
import type { useTripForm } from '../../../hooks/useTripForm'

interface FinishedFormProps {
    tripForm: ReturnType<typeof useTripForm>
}

export const FinishedForm:React.FC<FinishedFormProps> = (props) => {
    
    return (
        <Box sx={{}}>
            mostrar o cartão?
        </Box>
    )
}