import React from 'react'
import {Box, Typography} from '@mui/material'

interface HomeProps {
    
}

export const Home:React.FC<HomeProps> = (props) => {
    
    return (
        <Box sx={{flexDirection: 'column', gap: 2}}>
            <Typography>landing page com descrições e CTA para login/cadastro?</Typography>
        </Box>
    )
}