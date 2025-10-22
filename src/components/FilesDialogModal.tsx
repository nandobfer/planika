import React, { useEffect, useState } from "react"
import { Avatar, Box, Button, Dialog, LinearProgress, Typography } from "@mui/material"

interface FilesDialogModalProps {
    isOpen: boolean
    handleClose: () => void
    chooseFile: () => void
    handlePaste: (event: ClipboardEvent) => void
    loading: boolean
}

export const FilesDialogModal: React.FC<FilesDialogModalProps> = (props) => {
    useEffect(() => {
        document.addEventListener("paste", props.handlePaste)

        return () => {
            document.removeEventListener("paste", props.handlePaste)
        }
    }, [props.handlePaste])

    return (
        <Dialog open={props.isOpen} onClose={props.handleClose} sx={{}}>
            <Box sx={{ flexDirection: "column", alignItems: "center", gap: 1 }}>
                <Typography>Cole a imagem aqui ou clique no botão abaixo para acessar seus arquivos.</Typography>
                {props.loading && <LinearProgress sx={{width: 1}} />}
                <Button variant="contained" onClick={props.chooseFile}  disabled={props.loading}>
                    Procurar imagem
                </Button>
            </Box>
        </Dialog>
    )
}
