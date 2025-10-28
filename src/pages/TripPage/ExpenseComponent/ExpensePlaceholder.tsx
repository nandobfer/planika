import React, { useContext } from "react"
import { Box, Button } from "@mui/material"
import TripContext from "../../../contexts/TripContext"
import { Add } from "@mui/icons-material"
import { Handle, Position, useNodeId } from "@xyflow/react"

interface ExpensePlaceholderProps {}

export const ExpensePlaceholder: React.FC<ExpensePlaceholderProps> = (props) => {
    const helper = useContext(TripContext)
    const nodeId = useNodeId()
    const parentId = nodeId?.split("_")[1]
    const isRoot = parentId === "root"

    const onClick = () => {
        helper.addNodeAndEdge(!isRoot ? parentId : undefined)
    }

    return (
        <Box sx={{ width: helper.nodeWidth, height: helper.nodeHeight, justifyContent: "center", alignItems: "center", border: "1px solid red" }}>
            {!isRoot && <Handle type="target" position={Position.Left} />}
            <Button onClick={onClick} variant="outlined" sx={{ borderStyle: "dashed" }} startIcon={<Add />}>
                Nova despesa
            </Button>
        </Box>
    )
}
