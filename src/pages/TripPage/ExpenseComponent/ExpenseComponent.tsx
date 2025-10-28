import React, { useContext } from "react"
import { Box } from "@mui/material"
import type { ExpenseNode } from "../../../types/server/class/Trip/ExpenseNode"
import TripContext from "../../../contexts/TripContext"
import { Handle, Position } from "@xyflow/react"

interface ExpenseComponentProps {
    data: ExpenseNode
}

export const ExpenseComponent: React.FC<ExpenseComponentProps> = (props) => {
    const helper = useContext(TripContext)

    return (
        <Box sx={{ width: helper.nodeWidth, height: helper.nodeHeight, border: "1px solid black" }}>
            {props.data.parentId && <Handle type="target" position={Position.Left} />}
            novo sei la
            {props.data.description}
            <Handle type="source" position={Position.Right} />
        </Box>
    )
}
