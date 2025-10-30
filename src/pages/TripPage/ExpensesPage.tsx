import React, { useEffect, useState } from "react"
import { Box } from "@mui/material"
import type { useTrip } from "../../hooks/useTrip"
import { useExpenses, type CursorAwareness } from "../../hooks/useExpenses"
import { Background, ConnectionLineType, ReactFlow } from "@xyflow/react"
import { TripProvider } from "../../contexts/TripContext"
import "@xyflow/react/dist/style.css"
import { ExpenseComponent } from "./ExpenseComponent/ExpenseComponent"
import { ExpensePlaceholder } from "./ExpenseComponent/ExpensePlaceholder"
import { CursorComponent } from "./CursorComponent/CursorComponent"

interface ExpensesPageProps {
    loading: boolean
    tripHook: ReturnType<typeof useTrip>
}

export const ExpensesPage: React.FC<ExpensesPageProps> = (props) => {
    const expensesHook = useExpenses(props.tripHook)
    const { nodes, edges, onNodesChange, onEdgesChange, onConnect, onInit, hocuspocusProvider } = expensesHook
    const [cursors, setCursors] = useState<CursorAwareness[]>([])

    // Listen to awareness changes and trigger re-renders (throttled)
    useEffect(() => {
        if (!hocuspocusProvider?.awareness) return

        let rafId: number | null = null
        let lastUpdate = 0
        const throttleMs = 50 // Update at most every 50ms

        const updateCursors = () => {
            const now = Date.now()
            if (now - lastUpdate < throttleMs && rafId === null) {
                // Schedule an update after the throttle period
                if (!rafId) {
                    rafId = requestAnimationFrame(() => {
                        rafId = null
                        updateCursors()
                    })
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
            setCursors(cursorsArray)
            lastUpdate = now
        }

        // Initial update
        updateCursors()

        // Listen for awareness changes
        hocuspocusProvider.awareness.on("change", updateCursors)

        return () => {
            hocuspocusProvider.awareness.off("change", updateCursors)
            if (rafId) {
                cancelAnimationFrame(rafId)
            }
        }
    }, [hocuspocusProvider])

    return (
        <Box sx={{ height: "calc(100vh - 200px)", margin: -5, marginTop: -3 }}>
            <TripProvider expensesHook={expensesHook}>
                <ReactFlow
                    nodes={nodes}
                    edges={edges}
                    onNodesChange={onNodesChange}
                    onEdgesChange={onEdgesChange}
                    onConnect={onConnect}
                    // onMove={debouncedOnMove}
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

                    {cursors.map((cursor: CursorAwareness) => (
                        <CursorComponent key={cursor.id} cursor={cursor} />
                    ))}
                </ReactFlow>
            </TripProvider>
        </Box>
    )
}
