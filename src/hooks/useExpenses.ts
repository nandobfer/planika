import { useCallback, useEffect, useRef, useState } from "react"
import type { useTrip } from "./useTrip"
import {
    addEdge,
    ConnectionLineType,
    useEdgesState,
    useNodesState,
    type Connection,
    type Edge,
    type Node,
    type ReactFlowInstance,
    type Viewport,
} from "@xyflow/react"
import dagre from "@dagrejs/dagre"
import { uid } from "uid"
import type { WithoutFunctions } from "../types/server/class/helpers"
import { useMuiTheme } from "./useMuiTheme"
import { debounce } from "@mui/material"
import { useCurrency } from "./useCurrency"
import { api_url } from "../backend/api"
import * as Y from "yjs"
import { HocuspocusProvider } from "@hocuspocus/provider"
import type { ExpenseNode } from "../types/server/class/Trip/ExpenseNode"

export type ExpenseNodeData = WithoutFunctions<ExpenseNode>
export interface CursorAwareness {
    id: string
    name: string
    picture: string
    mouseX: number
    mouseY: number
}

const nodeWidth = 330
const nodeHeight = 180
const viewport_duration = 800

const updateLayout = (nodes: Node[], edges: Edge[]): { nodes: Node[]; edges: Edge[] } => {
    const dagreGraph = new dagre.graphlib.Graph().setDefaultEdgeLabel(() => ({}))
    dagreGraph.setGraph({
        rankdir: "LR",
        ranksep: 100,
        nodesep: 50,
        // align: "UL",
    })

    // Set custom node width and height
    nodes.forEach((node) => {
        dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight })
    })

    edges.forEach((edge) => {
        dagreGraph.setEdge(edge.source, edge.target)
    })

    dagre.layout(dagreGraph)

    const updatedNodes = nodes.map((node) => {
        const nodeWithPosition = dagreGraph.node(node.id)
        return {
            ...node,
            position: {
                x: nodeWithPosition.x - nodeWidth / 2,
                y: nodeWithPosition.y - nodeHeight / 2,
            },
        }
    })

    return { nodes: updatedNodes, edges }
}

export const useExpenses = (tripHelper: ReturnType<typeof useTrip>) => {
    const { trip, authenticatedApi, user } = tripHelper
    const instance = useRef<ReactFlowInstance<Node, Edge> | null>(null)
    const { theme } = useMuiTheme()
    const currency = useCurrency()
    const ydocRef = useRef<Y.Doc | null>(null)
    const provider = useRef<HocuspocusProvider | null>(null)
    const rebuildTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
    const firstRender = useRef(true)

    // Store all nodes/edges without filters applied
    const allNodesRef = useRef<Node[]>([])
    const allEdgesRef = useRef<Edge[]>([])

    // Active filters: Map<attribute, Set<values>>
    const [activeFilters, setActiveFilters] = useState<Map<keyof ExpenseNodeData, Set<any>>>(new Map())

    const { nodes: layoutedNodes, edges: layoutedEdges } = updateLayout([], [])
    const [nodes, setNodes, onNodesChange] = useNodesState(layoutedNodes)
    const [edges, setEdges, onEdgesChange] = useEdgesState(layoutedEdges)
    const [zoom, setZoom] = useState(1)
    const [fittingViewNode, setFittingViewNode] = useState<Node | null>(null)
    const [loading, setLoading] = useState(true)
    const [notesModal, setNotesModal] = useState<ExpenseNode | null>(null)
    const [showReports, setShowReports] = useState(false)

    const canEdit = trip?.participants?.some((p) => p.userId === user?.id && (p.role === "administrator" || p.role === "collaborator"))
    const isAdmin = trip?.participants?.some((p) => p.userId === user?.id && p.role === "administrator")

    const openReportsDrawer = () => {
        setShowReports(true)
    }

    const closeReportsDrawer = () => {
        setShowReports(false)
    }

    const openNotesModal = (expense: ExpenseNode) => {
        setNotesModal(expense)
    }

    const closeNotesModal = () => {
        setNotesModal(null)
    }

    // Apply filters to nodes and edges
    const applyFilters = useCallback(
        (allNodes: Node[], allEdges: Edge[]): { nodes: Node[]; edges: Edge[] } => {
            // If no filters, return all nodes/edges
            if (activeFilters.size === 0) {
                return { nodes: allNodes, edges: allEdges }
            }

            // Filter nodes based on active filters
            const filteredNodes = allNodes.filter((node) => {
                if (node.type !== "expense") {
                    // Always include placeholders
                    return true
                }

                const nodeData = node.data as ExpenseNodeData

                // Node must match ALL filter attributes
                for (const [attribute, values] of activeFilters.entries()) {
                    if (values.size === 0) continue // Skip empty filter sets

                    const nodeValue = nodeData[attribute]

                    // Handle array values (like responsibleParticipants)
                    if (Array.isArray(nodeValue)) {
                        // Check if any of the node's values match any filter value
                        const hasMatch = nodeValue.some((val: any) => {
                            // Compare by id if objects, otherwise direct comparison
                            const compareValue = typeof val === "object" && val?.id ? val.id : val
                            return Array.from(values).some((filterVal) => {
                                const filterCompare = typeof filterVal === "object" && filterVal?.id ? filterVal.id : filterVal
                                return compareValue === filterCompare
                            })
                        })
                        if (!hasMatch) return false
                    } else {
                        // For non-array values, check direct match
                        const compareValue = typeof nodeValue === "object" && (nodeValue as any)?.id ? (nodeValue as any).id : nodeValue
                        const hasMatch = Array.from(values).some((filterVal) => {
                            const filterCompare = typeof filterVal === "object" && filterVal?.id ? filterVal.id : filterVal
                            return compareValue === filterCompare
                        })
                        if (!hasMatch) return false
                    }
                }

                return true
            })

            const filteredNodeIds = new Set(filteredNodes.map((n) => n.id))

            // Filter edges - only include edges where both source and target are in filtered nodes
            const filteredEdges = allEdges.filter((edge) => {
                return filteredNodeIds.has(edge.source) && filteredNodeIds.has(edge.target)
            })

            // Remove placeholder nodes that don't have a parent expense node in the filtered set
            const finalNodes = filteredNodes.filter((node) => {
                if (node.type === "placeholder") {
                    const parentId = (node.data as ExpenseNodeData).parentId
                    // Keep root placeholder if no parentId
                    if (!parentId) return false
                    // Only keep placeholder if its parent expense node is in the filtered set
                    return filteredNodeIds.has(parentId)
                }
                return true
            })

            setTimeout(() => instance.current?.fitView({ duration: viewport_duration }), 300)

            return { nodes: finalNodes, edges: filteredEdges }
        },
        [activeFilters]
    )

    // Add or remove a filter value
    const addFilter = useCallback((attribute: keyof ExpenseNodeData, value: any) => {
        setActiveFilters((prev) => {
            const newFilters = new Map(prev)
            const existingValues = newFilters.get(attribute) || new Set()

            // Toggle: if value exists, remove it; otherwise add it
            const newValues = new Set(existingValues)

            // Compare by id if object, otherwise direct comparison
            const compareValue = typeof value === "object" && value?.id ? value.id : value
            let found = false

            for (const existing of newValues) {
                const existingCompare = typeof existing === "object" && existing?.id ? existing.id : existing
                if (existingCompare === compareValue) {
                    newValues.delete(existing)
                    found = true
                    break
                }
            }

            if (!found) {
                newValues.add(value)
            }

            if (newValues.size === 0) {
                newFilters.delete(attribute)
            } else {
                newFilters.set(attribute, newValues)
            }

            return newFilters
        })
    }, [])

    // Clear all filters for a specific attribute
    const clearFilterAttribute = useCallback((attribute: keyof ExpenseNodeData) => {
        setActiveFilters((prev) => {
            const newFilters = new Map(prev)
            newFilters.delete(attribute)
            return newFilters
        })
        setTimeout(() => instance.current?.fitView({ duration: viewport_duration }), 300)
    }, [])

    // Clear all filters
    const clearAllFilters = useCallback(() => {
        setActiveFilters(new Map())
        setTimeout(() => instance.current?.fitView({ duration: viewport_duration }), 300)
    }, [])

    // Get active filter values for a specific attribute
    const getActiveFilterValues = useCallback(
        (attribute: keyof ExpenseNodeData): any[] => {
            return Array.from(activeFilters.get(attribute) || [])
        },
        [activeFilters]
    )

    const onConnect = useCallback(
        (params: Connection) => setEdges((eds) => addEdge({ ...params, type: ConnectionLineType.SmoothStep, animated: true }, eds)),
        []
    )

    const onMove = useCallback((_: any, newViewport: Viewport) => {
        setZoom(newViewport.zoom)
    }, [])

    const debouncedOnMove = debounce(onMove, 200)

    const fitNodeView = (node: Node | string) => {
        console.log("a")
        const targetNode = typeof node === "string" ? nodes.find((n) => n.id === node) : node
        if (!targetNode) return
        console.log("ab")

        const { x, y } = targetNode.position
        instance.current?.setCenter(x + nodeWidth / 2, y + nodeHeight / 2, {
            zoom: 0.9,
            duration: viewport_duration,
        })

        setFittingViewNode(null)
    }

    // Helper to check if a node is active (including its ancestors)
    const isNodeActive = useCallback((nodeId: string, allNodes: Node[]): boolean => {
        const node = allNodes.find((n) => n.id === nodeId && n.type === "expense")
        if (!node) return true // placeholders are always considered "active" for edge styling

        const nodeData = node.data as ExpenseNodeData
        if (!nodeData.active) return false

        // Check all ancestors
        const isAncestorActive = (id: string): boolean => {
            const currentNode = allNodes.find((n) => n.id === id && n.type === "expense")
            if (!currentNode) return true

            const data = currentNode.data as ExpenseNodeData
            const parentId = data.parentId as string | undefined

            if (!parentId) return true

            const parentNode = allNodes.find((n) => n.id === parentId && n.type === "expense")
            if (!parentNode) return true

            const parentData = parentNode.data as ExpenseNodeData
            return parentData.active && isAncestorActive(parentId)
        }

        return isAncestorActive(nodeId)
    }, [])

    // Recursive function to build tree nodes with placeholders
    const buildTreeNodes = (expenseNode: ExpenseNode, parentId?: string): { nodes: Node[]; edges: Edge[] } => {
        const nodes: Node[] = []
        const edges: Edge[] = []

        // Add the expense node
        nodes.push({
            id: expenseNode.id,
            type: "expense",
            position: { x: 0, y: 0 }, // Will be positioned by dagre layout
            data: expenseNode as ExpenseNodeData,
        })

        // Add edge from parent if exists
        if (parentId) {
            edges.push({
                id: `edge_${parentId}-${expenseNode.id}`,
                source: parentId,
                target: expenseNode.id,
                type: ConnectionLineType.SmoothStep,
                animated: true,
            })
        }

        // Process children recursively (only if they exist and are an array)
        if (Array.isArray(expenseNode.children) && expenseNode.children.length > 0) {
            expenseNode.children.forEach((child) => {
                const childResult = buildTreeNodes(child, expenseNode.id)
                nodes.push(...childResult.nodes)
                edges.push(...childResult.edges)
            })
        }

        // Add placeholder node as last child (only if canEdit)
        if (canEdit) {
            const placeholderId = `placeholder_${expenseNode.id}`
            nodes.push({
                id: placeholderId,
                type: "placeholder",
                position: { x: 0, y: 0 }, // Will be positioned by dagre layout
                data: { parentId: expenseNode.id } as ExpenseNodeData,
            })

            // Add edge from expense node to its placeholder
            edges.push({
                id: `edge_${expenseNode.id}-${placeholderId}`,
                source: expenseNode.id,
                target: placeholderId,
                type: ConnectionLineType.SmoothStep,
                animated: true,
                style: {
                    strokeDasharray: "5,5",
                },
            })
        }

        return { nodes, edges }
    }

    // Update edge colors based on node active states
    const updateEdgeColors = useCallback(
        (allNodes: Node[], allEdges: Edge[]): Edge[] => {
            return allEdges.map((edge) => {
                const sourceActive = isNodeActive(edge.source, allNodes)
                const targetActive = isNodeActive(edge.target, allNodes)
                const bothActive = sourceActive && targetActive

                return {
                    ...edge,
                    style: {
                        ...edge.style,
                        stroke: bothActive ? theme.palette.success.main : theme.palette.action.disabled,
                    },
                    animated: bothActive,
                }
            })
        },
        [theme, isNodeActive]
    )

    // Get all ancestor nodes (parents) of a given node, tracing back to root
    const getAncestors = useCallback(
        (nodeId?: string): ExpenseNode[] => {
            if (!nodeId) return []

            const ancestors: ExpenseNode[] = []

            // Find the node with the given ID
            const findNode = (id: string): Node | undefined => {
                return nodes.find((node) => node.id === id && node.type === "expense")
            }

            let currentNode = findNode(nodeId)

            // Trace back through parents until we reach a root node
            while (currentNode) {
                const nodeData = currentNode.data as ExpenseNodeData
                const parentId = nodeData.parentId as string | undefined

                if (!parentId) break

                const parentNode = findNode(parentId)
                if (parentNode) {
                    ancestors.push(parentNode.data as unknown as ExpenseNode)
                    currentNode = parentNode
                } else {
                    break
                }
            }

            return ancestors
        },
        [nodes]
    )

    // New function: Rebuild tree from Yjs (adds UI elements to backend data)
    const rebuildTreeFromYjs = useCallback(() => {
        if (!ydocRef.current) {
            console.log("No ydoc ref")
            return
        }

        const yNodes = ydocRef.current!.getArray("nodes")
        const yEdges = ydocRef.current!.getArray("edges")

        console.log(`Yjs arrays: nodes=${yNodes.length}, edges=${yEdges.length}`)

        // Get the data nodes from Yjs - they're stored directly in the array
        const dataNodes = yNodes.toArray() as Node[]
        const dataEdges = yEdges.toArray() as Edge[]

        console.log("Rebuilding from Yjs:", {
            nodeCount: dataNodes.length,
            edgeCount: dataEdges.length,
            sampleNode: dataNodes[0],
        })

        // Calculate total expenses for each node (recursive based on parentId)
        const calculateTotalExpenses = (nodeId: string): number => {
            const node = dataNodes.find((n) => n.id === nodeId)
            if (!node || node.type !== "expense") return 0

            const nodeData = node.data as ExpenseNodeData
            if (!nodeData.active) return 0

            let total = 0

            // Add this node's own expense
            if (nodeData.expense) {
                const amount = Number(nodeData.expense.amount) || 0
                const quantity = Number(nodeData.expense.quantity?.toString().replace(/[^0-9.-]+/g, "")) || 1
                total += amount * quantity
            }

            // Find all children (nodes whose parentId matches this node's id)
            const children = dataNodes.filter((n) => {
                if (n.type !== "expense") return false
                const childData = n.data as ExpenseNodeData
                return childData.parentId === nodeId
            })

            // Add all children's totals recursively
            for (const child of children) {
                total += calculateTotalExpenses(child.id)
            }

            return total
        }

        // Update all nodes with their calculated total expenses
        const nodesWithTotals = dataNodes.map((node) => {
            if (node.type === "expense") {
                const totalExpenses = calculateTotalExpenses(node.id)
                return {
                    ...node,
                    data: {
                        ...node.data,
                        totalExpenses,
                    },
                }
            }
            return node
        })

        // Add UI-specific elements (placeholders, etc.)
        const allNodes = [...nodesWithTotals]
        const allEdges = [...dataEdges]

        // Add root placeholder if canEdit (even if there are no expense nodes yet)
        if (canEdit) {
            allNodes.push({
                id: "placeholder_root",
                type: "placeholder",
                position: { x: 0, y: 0 },
                data: { parentId: null },
            })
        }

        // Add placeholder nodes for each expense node (if canEdit)
        if (canEdit) {
            nodesWithTotals.forEach((node) => {
                if (node.type === "expense") {
                    const placeholderId = `placeholder_${node.id}`
                    allNodes.push({
                        id: placeholderId,
                        type: "placeholder",
                        position: { x: 0, y: 0 },
                        data: { parentId: node.id },
                    })

                    allEdges.push({
                        id: `edge_${node.id}-${placeholderId}`,
                        source: node.id,
                        target: placeholderId,
                        type: ConnectionLineType.SmoothStep,
                        animated: true,
                        style: {
                            strokeDasharray: "5,5",
                        },
                    })
                }
            })
        }

        // Add UI styling to edges (animations, colors, etc.)
        const styledEdges = allEdges.map((edge) => ({
            ...edge,
            type: edge.type || ConnectionLineType.SmoothStep,
            animated: edge.animated !== undefined ? edge.animated : true,
        }))

        console.log(`Total nodes with UI: ${allNodes.length}, Total edges: ${styledEdges.length}`)

        // Apply layout
        const layouted = updateLayout(allNodes, styledEdges)
        const edgesWithColors = updateEdgeColors(layouted.nodes, layouted.edges)

        // Store unfiltered nodes/edges
        allNodesRef.current = layouted.nodes
        allEdgesRef.current = edgesWithColors

        // Apply filters before setting state
        const { nodes: filteredNodes, edges: filteredEdges } = applyFilters(layouted.nodes, edgesWithColors)

        console.log("Setting nodes and edges to state")
        setNodes(filteredNodes)
        setEdges(filteredEdges)
    }, [canEdit, theme, updateEdgeColors, applyFilters])

    // Effect to fit view after nodes are updated with layout
    useEffect(() => {
        if (fittingViewNode && nodes.length > 0) {
            const nodeToFit = nodes.find((n) => n.id === fittingViewNode.id)
            console.log("useEffect checking node:", nodeToFit?.id, "position:", nodeToFit?.position)
            if (nodeToFit) {
                console.log("Fitting view to node:", nodeToFit.id, "at position:", nodeToFit.position)
                // Node has been laid out, fit the view
                const timeoutId = setTimeout(() => {
                    fitNodeView(nodeToFit.id)
                }, 100)

                return () => clearTimeout(timeoutId)
            }
        }

        if (nodes.length > 0 && firstRender.current) {
            firstRender.current = false

            setTimeout(() => {
                setLoading(false)
                instance.current?.fitView({ duration: viewport_duration })
            }, 200)
        }
    }, [nodes, fittingViewNode])

    const handleAddExpense = useCallback(
        (parentId?: string) => {
            if (!ydocRef.current || !trip) return

            const yNodes = ydocRef.current.getArray("nodes")
            const yEdges = ydocRef.current.getArray("edges")

            // Create new expense node
            const newNodeId = uid()
            const newNode: Node = {
                id: newNodeId,
                type: "expense",
                position: { x: 0, y: 0 }, // Will be positioned by layout
                data: {
                    id: newNodeId,
                    tripId: trip.id,
                    description: "",
                    active: true,
                    locked: false,
                    createdAt: Date.now(),
                    updatedAt: Date.now(),
                    notes: [],
                    totalExpenses: 0,
                    totalLocations: [],
                    children: [],
                    parentId,
                } as ExpenseNodeData,
            }

            // Create edge if there's a parent
            let newEdge: Edge | null = null
            if (parentId) {
                newEdge = {
                    id: `edge_${parentId}-${newNodeId}`,
                    source: parentId,
                    target: newNodeId,
                }
            }

            setFittingViewNode(newNode)

            // Update Yjs (this syncs to all clients and backend)
            ydocRef.current.transact(() => {
                yNodes.push([newNode])
                if (newEdge) {
                    yEdges.push([newEdge])
                }
            }, "insertion")

            // UI will update via the observer
        },
        [trip?.id]
    )

    const handleUpdateExpense = useCallback((nodeId: string, updates: Partial<ExpenseNode>) => {
        if (!ydocRef.current) return

        // Helper to calculate total expenses for a node based on current state
        const calculateTotalExpenses = (targetNodeId: string, allNodes: Node[]): number => {
            const node = allNodes.find((n) => n.id === targetNodeId)
            if (!node || node.type !== "expense") return 0

            const nodeData = node.data as ExpenseNodeData
            if (!nodeData.active) return 0

            let total = 0

            // Add this node's own expense
            if (nodeData.expense) {
                const amount = Number(nodeData.expense.amount) || 0
                const quantity = Number(nodeData.expense.quantity?.toString().replace(/[^0-9.-]+/g, "")) || 1
                total += amount * quantity
            }

            // Find all children (nodes whose parentId matches this node's id)
            const children = allNodes.filter((n) => {
                if (n.type !== "expense") return false
                const childData = n.data as ExpenseNodeData
                return childData.parentId === targetNodeId
            })

            // Add all children's totals recursively
            for (const child of children) {
                total += calculateTotalExpenses(child.id, allNodes)
            }

            return total
        }

        // FIRST: Update local React state immediately for instant UI feedback
        setNodes((currentNodes) => {
            // Update the node itself
            const updatedNodes = currentNodes.map((node) => {
                if (node.id === nodeId && node.type === "expense") {
                    return {
                        ...node,
                        data: {
                            ...node.data,
                            ...updates,
                        },
                    }
                }
                return node
            })

            // Recalculate totals for the updated node and all its ancestors
            const nodesToRecalculate = new Set<string>([nodeId])

            // Find all ancestors
            let currentId: string | undefined = nodeId
            while (currentId) {
                const currentNode = updatedNodes.find((n) => n.id === currentId && n.type === "expense")
                if (!currentNode) break

                const parentId = (currentNode.data as ExpenseNodeData).parentId as string | undefined
                if (parentId) {
                    nodesToRecalculate.add(parentId)
                    currentId = parentId
                } else {
                    break
                }
            }

            // Update totals for all affected nodes
            return updatedNodes.map((node) => {
                if (nodesToRecalculate.has(node.id) && node.type === "expense") {
                    const newTotal = calculateTotalExpenses(node.id, updatedNodes)
                    return {
                        ...node,
                        data: {
                            ...node.data,
                            totalExpenses: newTotal,
                        },
                    }
                }
                return node
            })
        })

        // THEN: Update Yjs for sync (this will trigger observer on OTHER clients only)
        const yNodes = ydocRef.current.getArray("nodes")
        const nodeIndex = yNodes.toArray().findIndex((node: any) => node.id === nodeId)

        if (nodeIndex !== -1) {
            const currentNode = yNodes.get(nodeIndex) as Node

            // Check if the update actually changes anything
            const currentData = currentNode.data as any
            let hasChanges = false

            for (const key in updates) {
                if (JSON.stringify(currentData[key]) !== JSON.stringify((updates as any)[key])) {
                    hasChanges = true
                    break
                }
            }

            if (!hasChanges) {
                return
            }

            const updatedNode = {
                ...currentNode,
                data: {
                    ...currentNode.data,
                    ...updates,
                },
            }

            // Update Yjs without triggering local observer
            ydocRef.current.transact(() => {
                yNodes.delete(nodeIndex, 1)
                yNodes.insert(nodeIndex, [updatedNode])
            }, "local") // Mark as local origin
        }
    }, [])

    const handleDeleteExpense = useCallback((nodeId: string) => {
        if (!ydocRef.current) return

        const yNodes = ydocRef.current.getArray("nodes")
        const yEdges = ydocRef.current.getArray("edges")

        const currentNodes = yNodes.toArray() as Node[]
        const currentEdges = yEdges.toArray() as Edge[]

        // Remove node and all its descendants
        const nodesToRemove = new Set<string>()

        const collectDescendants = (id: string) => {
            nodesToRemove.add(id)
            currentEdges.forEach((edge) => {
                if (edge.source === id) {
                    collectDescendants(edge.target)
                }
            })
        }

        collectDescendants(nodeId)

        // Update Yjs by removing nodes and edges
        ydocRef.current.transact(() => {
            // Remove nodes in reverse order to maintain indices
            currentNodes.forEach((node) => {
                if (nodesToRemove.has(node.id)) {
                    const actualIndex = yNodes.toArray().findIndex((n: any) => n.id === node.id)
                    if (actualIndex !== -1) {
                        yNodes.delete(actualIndex, 1)
                    }
                }
            })

            // Remove edges in reverse order
            currentEdges.forEach((edge) => {
                if (nodesToRemove.has(edge.source) || nodesToRemove.has(edge.target)) {
                    const actualIndex = yEdges.toArray().findIndex((e: any) => e.id === edge.id)
                    if (actualIndex !== -1) {
                        yEdges.delete(actualIndex, 1)
                    }
                }
            })
        }, "deletion")
    }, [])

    useEffect(() => {
        console.log({ trip })
    }, [trip])

    // Setup socket connection separately to avoid recreation on every trip change
    useEffect(() => {
        if (trip) {
            console.log(`Setting up Hocuspocus connection for trip: ${trip.id}`)
            ydocRef.current = new Y.Doc()

            const yNodes = ydocRef.current.getArray("nodes")
            const yEdges = ydocRef.current.getArray("edges")

            provider.current = new HocuspocusProvider({
                url: `${api_url}/hocuspocus`,
                name: trip.id,
                document: ydocRef.current,

                onSynced: ({ state }) => {
                    if (state) {
                        console.log("Initial sync complete, checking data...")
                        console.log(`yNodes length: ${yNodes.length}, yEdges length: ${yEdges.length}`)

                        // Add a small delay to ensure data is fully loaded
                        setTimeout(() => {
                            console.log(`After delay - yNodes length: ${yNodes.length}, yEdges length: ${yEdges.length}`)
                            rebuildTreeFromYjs()
                        }, 100)
                    }
                },
            })

            // Throttle awareness updates to reduce network traffic and improve performance
            let lastUpdate = 0
            const throttleMs = 100 // Update at most every 100ms (10 times per second)
            let rafId: number | null = null

            const updateAwareness = (event: MouseEvent) => {
                if (!instance.current) return

                const now = Date.now()
                if (now - lastUpdate < throttleMs) {
                    return
                }

                // Use requestAnimationFrame for smooth updates
                if (rafId) {
                    cancelAnimationFrame(rafId)
                }

                rafId = requestAnimationFrame(() => {
                    if (!instance.current || !provider.current) return

                    const position = instance.current.screenToFlowPosition({
                        x: event.clientX,
                        y: event.clientY,
                    })

                    // Share cursor information in ReactFlow coordinates
                    const data: CursorAwareness = {
                        id: user?.id || uid(),
                        name: user?.name || "Anonymous",
                        picture: user?.picture || "",
                        mouseX: Math.round(position.x * 10) / 10, // Round to 1 decimal place for less precision but better performance
                        mouseY: Math.round(position.y * 10) / 10,
                    }
                    provider.current?.setAwarenessField("user", data)
                    lastUpdate = now
                    rafId = null
                })
            }

            // Use the ReactFlow wrapper element for mouse tracking
            const reactFlowElement = document.querySelector(".react-flow")
            if (reactFlowElement) {
                reactFlowElement.addEventListener("mousemove", updateAwareness as EventListener)
            }

            const observer = (event: any) => {
                const origin = event.transaction.origin

                // Ignore local changes (from this client) EXCEPT placeholder_add
                if (origin === "local") {
                    console.log("Local change detected, skipping rebuild")
                    return
                }

                console.log("Changes detected from other clients or sync")
                console.log(`yNodes length: ${yNodes.length}, yEdges length: ${yEdges.length}`)
                rebuildTreeFromYjs()

                if (origin === "deletion") {
                    instance.current?.fitView({ duration: viewport_duration })
                }
            }

            yNodes.observe(observer)
            yEdges.observe(observer)

            return () => {
                console.log(`Cleaning up Hocuspocus connection for trip: ${trip.id}`)
                yNodes.unobserve(observer)
                yEdges.unobserve(observer)
                provider.current?.destroy()
                provider.current = null
                ydocRef.current = null

                // Cancel any pending animation frame
                if (rafId) {
                    cancelAnimationFrame(rafId)
                }

                const reactFlowElement = document.querySelector(".react-flow")
                if (reactFlowElement) {
                    reactFlowElement.removeEventListener("mousemove", updateAwareness as EventListener)
                }

                // Clear any pending rebuild timeout
                if (rebuildTimeoutRef.current) {
                    clearTimeout(rebuildTimeoutRef.current)
                    rebuildTimeoutRef.current = null
                }
            }
        }
    }, [trip?.id, rebuildTreeFromYjs])

    // useEffect(() => {
    //     rebuildTree()
    // }, [trip])

    // Update edge colors when theme changes
    useEffect(() => {
        setEdges((eds) => updateEdgeColors(nodes, eds))
    }, [theme, updateEdgeColors])

    // Re-apply filters when they change
    useEffect(() => {
        if (allNodesRef.current.length > 0) {
            const { nodes: filteredNodes, edges: filteredEdges } = applyFilters(allNodesRef.current, allEdgesRef.current)
            setNodes(filteredNodes)
            setEdges(filteredEdges)
        }
    }, [activeFilters, applyFilters])

    return {
        nodes,
        edges,
        onNodesChange,
        onEdgesChange,
        onConnect,
        onMove,
        debouncedOnMove,
        onInit: (flowInstance: ReactFlowInstance<Node, Edge>) => (instance.current = flowInstance),
        nodeWidth,
        nodeHeight,
        viewport_duration,
        getAncestors,
        trip,
        authenticatedApi,
        user,
        canEdit,
        zoom,
        currency,
        handleAddExpense,
        handleUpdateExpense,
        handleDeleteExpense,
        fitNodeView,
        hocuspocusProvider: provider.current,
        loading,
        notesModal,
        openNotesModal,
        closeNotesModal,
        isAdmin,
        showReports,
        openReportsDrawer,
        closeReportsDrawer,
        isNodeActive,
        // Filter functions
        addOrRemoveFilter: addFilter,
        clearFilterAttribute,
        clearAllFilters,
        getActiveFilterValues,
        activeFilters,
    }
}
