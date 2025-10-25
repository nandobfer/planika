import React from "react"
import { Button, type ButtonProps } from "@mui/material"

interface SaveButtonProps extends ButtonProps {}

export const SaveButton: React.FC<SaveButtonProps> = (props) => {
    return (
        <Button sx={{alignSelf: 'flex-end'}} variant="contained" type='submit' {...props}>
            Salvar
        </Button>
    )
}
