import React, { useContext, useMemo } from "react"
import { Box, Button, debounce, TextField } from "@mui/material"
import type { ExpenseNode } from "../../../types/server/class/Trip/ExpenseNode"
import TripContext from "../../../contexts/TripContext"
import { Handle, Position } from "@xyflow/react"

interface ExpenseComponentProps {
    data: ExpenseNode
}

export const ExpenseComponent: React.FC<ExpenseComponentProps> = (props) => {
    const helper = useContext(TripContext)
    const expense = props.data
    const ancestors = helper.getAncestors(expense.id)
    const ancestorsActive = ancestors.every((ancestor) => ancestor.active)
    const active = expense.active && ancestorsActive

    const toggleActive = () => {
        helper.updateNode({ ...expense, active: !expense.active })
    }

    const onChangeDescription = useMemo(
        () =>
            debounce((value: string) => {
                helper.updateNode({ ...expense, description: value })
                console.log(value)
            }, 500),
        []
    )

    return (
        <Button
            onClick={helper.canEdit ? toggleActive : undefined}
            color={active ? "success" : "inherit"}
            variant="outlined"
            sx={{
                width: helper.nodeWidth,
                height: helper.nodeHeight,
                justifyContent: "flex-start",
                alignItems: "flex-start",
                padding: 1,
                whiteSpace: "normal",
            }}
            disabled={!ancestorsActive}
        >
            {props.data.parentId && <Handle type="target" position={Position.Left} />}

            <Box sx={{ flexDirection: "column", flex: 1 }}>
                <TextField
                    placeholder="Descrição da despesa"
                    variant="standard"
                    onChange={helper.canEdit ? (e) => onChangeDescription(e.target.value) : undefined}
                    onClick={(e) => e.stopPropagation()}
                    onFocus={(e) => e.stopPropagation()}
                />
            </Box>

            <Handle type="source" position={Position.Right} />
        </Button>
    )
}
