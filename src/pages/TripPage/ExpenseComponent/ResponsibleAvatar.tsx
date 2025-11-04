import React, { useState, type HtmlHTMLAttributes } from "react"
import { Avatar, Box, Chip, IconButton, Menu, MenuItem, Paper, Tooltip } from "@mui/material"
import type { useExpenseNode } from "../../../hooks/useExpenseNode"
import { ArrowDropDown, PersonAddAlt1 } from "@mui/icons-material"
import { useMuiTheme } from "../../../hooks/useMuiTheme"

interface ResponsibleAvatarProps {
    api: ReturnType<typeof useExpenseNode>
}

export const ResponsibleAvatar: React.FC<ResponsibleAvatarProps> = (props) => {
    const { api } = props
    const { theme } = useMuiTheme()

    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
    const open = Boolean(anchorEl)

    const participants = api.trip?.participants || []
    const responsibleParticipant = api.trip?.participants.find((p) => p.id === api.expense.responsibleParticipantId)

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget)
    }

    const handleClose = () => {
        setAnchorEl(null)
    }

    const handleParticipantSelect = (participantId: string | null) => {
        api.updateNode({ responsibleParticipantId: participantId })
        handleClose()
    }

    return (
        <>
            <Tooltip title="Responsável pela despesa">
                <IconButton size="small" onClick={api.canEdit ? handleClick : undefined} sx={{ padding: 0 }}>
                    <Paper sx={{ borderRadius: "100%" }}>
                        <Avatar
                            src={responsibleParticipant?.user?.picture || undefined}
                            sx={{ width: 24, height: 24 }}
                            style={{ backgroundColor: responsibleParticipant?.user ? theme.palette.primary.main : undefined }}
                        >
                            {responsibleParticipant?.user ? responsibleParticipant.user.name[0] : <PersonAddAlt1 fontSize="small" />}
                        </Avatar>
                    </Paper>
                </IconButton>
            </Tooltip>
            {api.canEdit && (
                <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
                    <MenuItem onClick={() => handleParticipantSelect(null)} selected={!api.expense.responsibleParticipantId}>
                        Sem responsável
                    </MenuItem>
                    {participants.map((participant) => (
                        <MenuItem
                            key={participant.id}
                            onClick={() => handleParticipantSelect(participant.id)}
                            selected={api.expense.responsibleParticipantId === participant.id}
                        >
                            <Avatar src={participant.user?.picture || undefined} sx={{ width: 24, height: 24, marginRight: 1 }} />
                            {participant.user?.name}
                        </MenuItem>
                    ))}
                </Menu>
            )}
        </>
    )
}
