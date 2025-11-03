import React, { useContext } from "react"
import { Box, Button } from "@mui/material"
import TripContext from "../../../contexts/TripContext"
import { Add } from "@mui/icons-material"
import { Handle, Position, useNodeId } from "@xyflow/react"
import { useMuiTheme } from "../../../hooks/useMuiTheme"

interface ExpensePlaceholderProps {}

export const ExpensePlaceholder: React.FC<ExpensePlaceholderProps> = (props) => {
    const helper = useContext(TripContext)
    const nodeId = useNodeId()
    const parentId = nodeId?.split("_")[1]
    const isRoot = parentId === "root"
    const { mode } = useMuiTheme()

    const onClick = () => {
        helper.handleAddExpense(!isRoot ? parentId : undefined)
    }

    return (
        <Box
            sx={{
                width: helper.nodeWidth,
                height: helper.nodeHeight,
                justifyContent: isRoot ? "center" : undefined,
                alignItems: "center",
                // border: "1px solid red",
            }}
        >
            <Button
                color={mode === "light" ? "info" : "primary"}
                onClick={onClick}
                variant="outlined"
                sx={{ borderStyle: "dashed" }}
                startIcon={<Add />}
            >
                {!isRoot && <Handle type="target" position={Position.Left} isConnectable={false} />}
                Nova despesa
            </Button>
        </Box>
    )
}
