import React from "react"
import { Box } from "@mui/material"
import type { useTrip } from "../../hooks/useTrip"
import { useExpenses } from "../../hooks/useExpenses"
import { Background, ConnectionLineType, ReactFlow } from "@xyflow/react"
import { TripProvider } from "../../contexts/TripContext"
import "@xyflow/react/dist/style.css"
import { ExpenseComponent } from "./ExpenseComponent/ExpenseComponent"
import { ExpensePlaceholder } from "./ExpenseComponent/ExpensePlaceholder"

interface ExpensesPageProps {
    loading: boolean
    tripHook: ReturnType<typeof useTrip>
}

export const ExpensesPage: React.FC<ExpensesPageProps> = (props) => {
    const expensesHook = useExpenses(props.tripHook)
    const { nodes, edges, onNodesChange, onEdgesChange, onConnect, onInit } = expensesHook

    return (
        <Box sx={{ height: "calc(100vh - 200px)", margin: -5, marginTop: -3 }}>
            <TripProvider expensesHook={expensesHook}>
                <ReactFlow
                    nodes={nodes}
                    edges={edges}
                    onNodesChange={onNodesChange}
                    onEdgesChange={onEdgesChange}
                    onConnect={onConnect}
                    connectionLineType={ConnectionLineType.SmoothStep}
                    fitView
                    nodeTypes={{ expense: ExpenseComponent, placeholder: ExpensePlaceholder }}
                    // style={{ margin: "-2vw",  }}
                    nodesDraggable={false}
                    onInit={onInit}
                    minZoom={0}
                >
                    <Background size={1} />
                    {/* <NodeDrawer node={editingNode} onClose={() => setEditingNode(null)} saveNode={onEditNode} nodes={nodes} /> */}
                </ReactFlow>
            </TripProvider>
        </Box>
    )
}
