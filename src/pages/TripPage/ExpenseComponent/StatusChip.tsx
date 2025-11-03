import React, { useState } from "react"
import { Box, Chip, Menu, MenuItem } from "@mui/material"
import type { useExpenseNode } from "../../../hooks/useExpenseNode"
import { ArrowDropDown } from "@mui/icons-material"
import type { ExpenseStatus } from "../../../types/server/class/Trip/ExpenseNode"
import { useMuiTheme } from "../../../hooks/useMuiTheme"

interface StatusChipProps {
    api: ReturnType<typeof useExpenseNode>
}

const statuses: ExpenseStatus[] = ["pending", "reserved", "paid"]

const formatStatus = (status?: ExpenseStatus) => {
    switch (status) {
        case "pending":
            return "Pendente"
        case "reserved":
            return "Reservado"
        case "paid":
            return "Pago"
        default:
            return "Sem status"
    }
}

const getStatusColor = (status?: ExpenseStatus) => {
    switch (status) {
        case "pending":
            return "warning"
        case "reserved":
            return "info"
        case "paid":
            return "success"
        default:
            return "default"
    }
}

export const StatusChip: React.FC<StatusChipProps> = (props) => {
    const { api } = props
    const { mode } = useMuiTheme()

    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
    const open = Boolean(anchorEl)

    const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
        setAnchorEl(event.currentTarget)
    }

    const handleClose = () => {
        setAnchorEl(null)
    }

    const handleStatusSelect = (status: ExpenseStatus | null) => {
        api.updateNode({ status })
        handleClose()
    }

    return (
        <>
            <Chip
                size="small"
                variant={api.expense.status ? (mode === "light" ? "filled" : api.expense.status === "paid" ? "filled" : "outlined") : "outlined"}
                label={formatStatus(api.expense.status)}
                color={getStatusColor(api.expense.status)}
                onClick={api.canEdit ? handleClick : undefined}
                onDelete={api.canEdit ? handleClick : undefined}
                deleteIcon={api.canEdit ? <ArrowDropDown /> : undefined}
                sx={{ cursor: api.canEdit ? "pointer" : "default" }}
            />
            {api.canEdit && (
                <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
                    <MenuItem onClick={() => handleStatusSelect(null)} selected={!api.expense.status}>
                        Sem status
                    </MenuItem>
                    {statuses.map((status) => (
                        <MenuItem key={status} onClick={() => handleStatusSelect(status)} selected={api.expense.status === status}>
                            {formatStatus(status)}
                        </MenuItem>
                    ))}
                </Menu>
            )}
        </>
    )
}
