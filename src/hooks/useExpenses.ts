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
import { ExpenseNode } from "../types/server/class/Trip/ExpenseNode"
import { debounce } from "@mui/material"
import { useCurrency } from "./useCurrency"
import { api_url } from "../backend/api"
import * as Y from "yjs"
import { HocuspocusProvider } from "@hocuspocus/provider"

export type ExpenseNodeData = WithoutFunctions<ExpenseNode>

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

    const { nodes: layoutedNodes, edges: layoutedEdges } = updateLayout([], [])
    const [nodes, setNodes, onNodesChange] = useNodesState(layoutedNodes)
    const [edges, setEdges, onEdgesChange] = useEdgesState(layoutedEdges)
    const [zoom, setZoom] = useState(1)

    const canEdit = trip?.participants?.some((p) => p.userId === user?.id && (p.role === "administrator" || p.role === "collaborator"))

    const onConnect = useCallback(
        (params: Connection) => setEdges((eds) => addEdge({ ...params, type: ConnectionLineType.SmoothStep, animated: true }, eds)),
        []
    )

    const onMove = useCallback((_: any, newViewport: Viewport) => {
        setZoom(newViewport.zoom)
    }, [])

    const debouncedOnMove = debounce(onMove, 200)

    const fitNodeView = (node: Node | string) => {
        const nodeItem = typeof node === "string" ? nodes.find((item) => item.id === node) : node
        if (!nodeItem) return

        const { x, y } = nodeItem.position
        instance.current?.setCenter(x + nodeWidth / 2, y + nodeHeight / 2, {
            zoom: 0.9,
            duration: viewport_duration,
        })
    }

    // Helper to check if a node is active (including its ancestors)
    const isNodeActive = useCallback((nodeId: string, allNodes: Node[]): boolean => {
        const node = allNodes.find((n) => n.id === nodeId && n.type === "expense")
        if (!node) return true // placeholders are always considered "active" for edge styling

        const nodeData = node.data as ExpenseNodeData
        if (!nodeData.active) return false

        // Check all ancestors
        const getAncestorsForNode = (id: string): boolean => {
            const currentNode = allNodes.find((n) => n.id === id && n.type === "expense")
            if (!currentNode) return true

            const data = currentNode.data as ExpenseNodeData
            const parentId = data.parentId as string | undefined

            if (!parentId) return true

            const parentNode = allNodes.find((n) => n.id === parentId && n.type === "expense")
            if (!parentNode) return true

            const parentData = parentNode.data as ExpenseNodeData
            return parentData.active && getAncestorsForNode(parentId)
        }

        return getAncestorsForNode(nodeId)
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

        // Add UI-specific elements (placeholders, etc.)
        const allNodes = [...dataNodes]
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
            dataNodes.forEach((node) => {
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

        console.log("Setting nodes and edges to state")
        setNodes(layouted.nodes)
        setEdges(edgesWithColors)
    }, [canEdit, theme, updateEdgeColors])

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

            // Update Yjs (this syncs to all clients and backend)
            ydocRef.current.transact(() => {
                yNodes.push([newNode])
                if (newEdge) {
                    yEdges.push([newEdge])
                }
            })

            // UI will update via the observer
        },
        [trip?.id]
    )

    const handleUpdateExpense = useCallback((nodeId: string, updates: Partial<ExpenseNode>) => {
        if (!ydocRef.current) return

        const yNodes = ydocRef.current.getArray("nodes")

        // Find and update the node
        const nodeIndex = yNodes.toArray().findIndex((node: any) => node.id === nodeId)

        if (nodeIndex !== -1) {
            const currentNode = yNodes.get(nodeIndex) as Node

            // Check if the update actually changes anything to avoid unnecessary syncs
            const currentData = currentNode.data as any
            let hasChanges = false

            for (const key in updates) {
                if (JSON.stringify(currentData[key]) !== JSON.stringify((updates as any)[key])) {
                    hasChanges = true
                    break
                }
            }

            if (!hasChanges) {
                console.log(`No changes detected for node ${nodeId}, skipping update`)
                return
            }

            const updatedNode = {
                ...currentNode,
                data: {
                    ...currentNode.data,
                    ...updates,
                    updatedAt: Date.now(), // Track when it was updated
                },
            }

            // Update Yjs
            ydocRef.current.transact(() => {
                yNodes.delete(nodeIndex, 1)
                yNodes.insert(nodeIndex, [updatedNode])
            })
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
        })
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

            const observer = () => {
                console.log("Changes detected from other clients or sync")
                console.log(`yNodes length: ${yNodes.length}, yEdges length: ${yEdges.length}`)
                rebuildTreeFromYjs()
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
    }
}
