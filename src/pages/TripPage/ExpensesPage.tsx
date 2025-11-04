import React, { useEffect, useMemo, useState } from "react"
import { Box, Button, CircularProgress } from "@mui/material"
import type { useTrip } from "../../hooks/useTrip"
import { useExpenses, type CursorAwareness } from "../../hooks/useExpenses"
import { Background, ConnectionLineType, ReactFlow } from "@xyflow/react"
import { TripProvider } from "../../contexts/TripContext"
import "@xyflow/react/dist/style.css"
import { ExpenseComponent } from "./ExpenseComponent/ExpenseComponent"
import { ExpensePlaceholder } from "./ExpenseComponent/ExpensePlaceholder"
import { CursorComponent } from "./CursorComponent/CursorComponent"
import { currencyMask } from "../../tools/numberMask"
import type { ExpenseNode } from "../../types/server/class/Trip/ExpenseNode"
import { NotesModal } from "./ExpenseComponent/NotesModal/NotesModal"
import { ReportsDrawer } from "./ReportsDrawer/ReportsDrawer"
import { Assessment } from "@mui/icons-material"
import { useMuiTheme } from "../../hooks/useMuiTheme"
import { Filters } from "./Filters/Filters"

interface ExpensesPageProps {
    loading: boolean
    tripHook: ReturnType<typeof useTrip>
}

export const ExpensesPage: React.FC<ExpensesPageProps> = (props) => {
    const expensesHook = useExpenses(props.tripHook)
    const { mode } = useMuiTheme()
    const { nodes, edges, onNodesChange, onEdgesChange, onConnect, onInit, hocuspocusProvider, loading } = expensesHook
    const [cursors, setCursors] = useState<CursorAwareness[]>([])

    const totalValue = useMemo(() => {
        const value = expensesHook.nodes
            .filter((node) => !node.data.parentId && node.data.totalExpenses)
            .reduce((sum, node) => sum + (node.data as unknown as ExpenseNode).totalExpenses, 0)
        return currencyMask(value, { withoutAffix: true })
    }, [expensesHook.nodes])

    // Listen to awareness changes and trigger re-renders (heavily throttled)
    useEffect(() => {
        if (!hocuspocusProvider?.awareness) return

        let timeoutId: ReturnType<typeof setTimeout> | null = null
        let lastUpdate = 0
        const throttleMs = 50 // Update at most every 200ms (5 times per second)

        const updateCursors = () => {
            const now = Date.now()
            const timeSinceLastUpdate = now - lastUpdate

            if (timeSinceLastUpdate < throttleMs) {
                // Schedule an update after the remaining time
                if (!timeoutId) {
                    timeoutId = setTimeout(() => {
                        timeoutId = null
                        updateCursors()
                    }, throttleMs - timeSinceLastUpdate)
                }
                return
            }

            const states = hocuspocusProvider.awareness.getStates()
            const cursorsArray: CursorAwareness[] = []
            states.forEach((value: any, clientId: number) => {
                // Skip own cursor
                if (clientId === hocuspocusProvider.awareness.clientID) return
                if (value.user) {
                    cursorsArray.push(value.user as CursorAwareness)
                }
            })

            // Only update state if cursors actually changed
            setCursors((prev) => {
                if (JSON.stringify(prev) === JSON.stringify(cursorsArray)) {
                    return prev
                }
                return cursorsArray
            })

            lastUpdate = now
        }

        // Initial update
        updateCursors()

        // Listen for awareness changes
        hocuspocusProvider.awareness.on("change", updateCursors)

        return () => {
            hocuspocusProvider.awareness.off("change", updateCursors)
            if (timeoutId) {
                clearTimeout(timeoutId)
            }
        }
    }, [hocuspocusProvider])

    return (
        <Box
            sx={{
                height: "calc(100vh - 200px)",
                margin: -5,
                marginTop: -3,
            }}
        >
            <TripProvider expensesHook={expensesHook}>
                <ReactFlow
                    nodes={nodes}
                    edges={edges}
                    onNodesChange={onNodesChange}
                    onEdgesChange={onEdgesChange}
                    onConnect={onConnect}
                    // onMove={debouncedOnMove}
                    connectionLineType={ConnectionLineType.SmoothStep}
                    // fitView
                    nodeTypes={{ expense: ExpenseComponent, placeholder: ExpensePlaceholder }}
                    // style={{ margin: "-2vw",  }}
                    nodesDraggable={false}
                    onInit={onInit}
                    minZoom={0}
                    nodesConnectable={false}
                >
                    <Background size={1} />
                    {/* <NodeDrawer node={editingNode} onClose={() => setEditingNode(null)} saveNode={onEditNode} nodes={nodes} /> */}

                    <Box sx={{ position: "absolute", top: 16, right: 16, flexDirection: "column", gap: 1, zIndex: 100, pointerEvents: "none" }}>
                        <Button startIcon={props.tripHook.user?.defaultCurrency || "R$"} disabled={loading} color="success" variant="outlined">
                            {totalValue}
                        </Button>
                        <Button
                            onClick={expensesHook.openReportsDrawer}
                            startIcon={<Assessment />}
                            disabled={loading}
                            color={mode === "light" ? "info" : "primary"}
                            sx={{ pointerEvents: "auto" }}
                            variant="outlined"
                        >
                            Relatórios
                        </Button>
                    </Box>
                    <Filters api={expensesHook} />
                    {cursors.map((cursor: CursorAwareness) => (
                        <CursorComponent key={cursor.id} cursor={cursor} />
                    ))}
                </ReactFlow>
                <ReportsDrawer />
                <NotesModal />
            </TripProvider>
            {loading && (
                <Box sx={{ position: "absolute", top: 0, left: 0, width: 1, height: 1, justifyContent: "center", alignItems: "center" }}>
                    <CircularProgress variant="indeterminate" color="primary" size={200} />
                </Box>
            )}
        </Box>
    )
}
