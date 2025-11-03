import React from "react"
import { Avatar, Box, Button, Checkbox, Dialog, IconButton, LinearProgress, MenuItem, Tooltip, Typography } from "@mui/material"
import { OutgoingMail } from "@mui/icons-material"
import { useSendReportMail } from "../../../hooks/useSendReportMail"
import type { useReports } from "../../../hooks/useReports"
import { Title } from "../../../components/Title"

interface SendReportMailProps {
    api: ReturnType<typeof useReports>
}

export const SendReportMail: React.FC<SendReportMailProps> = (props) => {
    const api = useSendReportMail(props.api)

    return (
        <>
            <Tooltip title="Enviar relatório por e-mail">
                <IconButton size="small" onClick={api.openModal}>
                    <OutgoingMail fontSize="small" />
                </IconButton>
            </Tooltip>

            <Dialog open={api.showingModal} onClose={api.closeModal} fullWidth maxWidth="sm">
                <Box sx={{ flexDirection: "column", gap: 1 }}>
                    <Title name="Enviar relatório por e-mail" onClose={api.closeModal} />
                    <Typography>Selecione os participantes para enviar o relatório:</Typography>

                    <Box sx={{ flexDirection: "column" }}>
                        {api.expenses.trip?.participants.map((participant) => {
                            const selected = api.selectedParticipants.some((p) => p.id === participant.id)
                            return (
                                <MenuItem key={participant.id} sx={{ gap: 1 }} onClick={() => api.selectParticipant(participant)} selected={selected}>
                                    <Checkbox checked={selected} />
                                    <Avatar src={participant.user?.picture} />
                                    <Box sx={{ flexDirection: "column" }}>
                                        <Typography>{participant.user?.name}</Typography>
                                        <Typography variant="caption">{participant.user?.email}</Typography>
                                    </Box>
                                </MenuItem>
                            )
                        })}
                    </Box>
                    
                    <Button variant="contained" onClick={api.sendReport} disabled={api.sending || api.selectedParticipants.length === 0} sx={{ alignSelf: "flex-end" }}>
                        Enviar relatório
                    </Button>

                    {api.sending && <LinearProgress sx={{ position: "absolute", bottom: 0, left: 0, right: 0 }} />}
                </Box>
            </Dialog>
        </>
    )
}
