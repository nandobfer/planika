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
import { io, Socket } from "socket.io-client"
import { api_url } from "../backend/api"

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
    const socket = useRef<Socket | null>(null)

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

    // Build complete tree from trip data
    const rebuildTree = useCallback(() => {
        if (!trip) return

        const allNodes: Node[] = []
        const allEdges: Edge[] = []

        // Add root placeholder (for adding top-level nodes) - only if canEdit
        if (canEdit) {
            const rootPlaceholderId = "placeholder_root"
            allNodes.push({
                id: rootPlaceholderId,
                type: "placeholder",
                position: { x: 0, y: 0 },
                data: { parentId: null },
            })
        }

        // Build tree for each root node
        trip.nodes.forEach((rootNode) => {
            const result = buildTreeNodes(rootNode)
            allNodes.push(...result.nodes)
            allEdges.push(...result.edges)
        })

        // Apply layout and update state
        const layouted = updateLayout(allNodes, allEdges)
        const edgesWithColors = updateEdgeColors(layouted.nodes, layouted.edges)
        setNodes(layouted.nodes)
        setEdges(edgesWithColors)
    }, [trip, theme, canEdit, updateEdgeColors])

    // Add a new node (to be called when clicking placeholder)
    const addNodeAndEdge = useCallback(
        (parentId?: string, data?: ExpenseNodeData) => {
            // Create new expense node data
            const now = Date.now()
            const newNodeId = data?.id || uid()
            const newExpenseData: ExpenseNodeData = data || {
                id: newNodeId,
                tripId: tripHelper.tripId,
                description: "",
                active: true,
                locked: false,
                createdAt: now,
                updatedAt: now,
                notes: [],
                totalExpenses: 0,
                totalLocations: [],
                children: [],
                parentId,
            }

            // Update trip data via API
            if (!data) {
                socket.current?.emit("trip:node", newExpenseData)
            }

            const result = buildTreeNodes(newExpenseData as unknown as ExpenseNode, parentId)

            // Filter out nodes and edges that already exist
            const existingNodeIds = new Set(nodes.map((n) => n.id))
            const existingEdgeIds = new Set(edges.map((e) => e.id))

            const newNodes = result.nodes.filter((n) => !existingNodeIds.has(n.id))
            const newEdges = result.edges.filter((e) => !existingEdgeIds.has(e.id))

            const layouted = updateLayout([...nodes, ...newNodes], [...edges, ...newEdges])
            const edgesWithColors = updateEdgeColors(layouted.nodes, layouted.edges)
            setNodes(layouted.nodes)
            setEdges(edgesWithColors)

            // Focus on the new node
            const addedNode = layouted.nodes.find((n) => n.id === newNodeId)
            if (addedNode && !data) {
                fitNodeView(addedNode)
            }
        },
        [nodes, edges, tripHelper, updateEdgeColors]
    )

    const updateNode = useCallback(
        (updatedData: ExpenseNodeData, silent = false) => {
            setNodes((nds) => {
                const updatedNodes = nds.map((node) => (node.id === updatedData.id ? { ...node, data: { ...updatedData } } : node))

                // Update edge colors if active state changed
                setEdges((eds) => updateEdgeColors(updatedNodes, eds))

                return updatedNodes
            })
            if (!silent) {
                socket.current?.emit("trip:node", updatedData)
            }
        },
        [setNodes, setEdges, updateEdgeColors]
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

    const handleIncomingNodeUpdate = useCallback(
        (node: ExpenseNodeData) => {
            const existingNode = nodes.find((n) => n.id === node.id)

            if (existingNode) {
                // Node exists, update it
                console.log("Incoming node update:", node)
                updateNode(node, true)
            } else {
                console.log("Incoming new node:", node)
                // New node, add it
                addNodeAndEdge(node.parentId, node)
            }
        },
        [nodes, updateNode, addNodeAndEdge]
    )

    const handleNodeDelete = useCallback(
        (nodeId: string, silent = false) => {
            // Recursively collect all descendant node IDs
            const collectDescendants = (id: string): string[] => {
                const descendants: string[] = [id]

                nodes.forEach((node) => {
                    if (node.type === "expense") {
                        const data = node.data as ExpenseNodeData
                        if (data.parentId === id) {
                            // Add this child and all its descendants
                            descendants.push(...collectDescendants(node.id))
                        }
                    } else if (node.type === "placeholder" && node.id === `placeholder_${id}`) {
                        // Also collect placeholder nodes
                        descendants.push(node.id)
                    }
                })

                return descendants
            }

            const nodesToDelete = new Set(collectDescendants(nodeId))

            // Filter out deleted nodes
            const remainingNodes = nodes.filter((node) => !nodesToDelete.has(node.id))
            const remainingNodeIds = new Set(remainingNodes.map((n) => n.id))

            // Clean up edges: remove any edge that references deleted nodes
            const remainingEdges = edges.filter((edge) => remainingNodeIds.has(edge.source) && remainingNodeIds.has(edge.target))

            // Re-layout the tree with remaining nodes and edges
            const layouted = updateLayout(remainingNodes, remainingEdges)
            const edgesWithColors = updateEdgeColors(layouted.nodes, layouted.edges)

            setNodes(layouted.nodes)
            setEdges(edgesWithColors)

            if (!silent) {
                socket.current?.emit("trip:node:delete", trip?.id, nodeId)
            }
        },
        [nodes, edges, trip?.id, updateEdgeColors]
    )

    const handleIncomingNodeDelete = useCallback(
        (nodeId: string) => {
            console.log("Incoming node delete:", nodeId)
            handleNodeDelete(nodeId, true)
        },
        [handleNodeDelete]
    )

    // Setup socket connection separately to avoid recreation on every trip change
    useEffect(() => {
        if (trip) {
            socket.current = io(api_url)
            socket.current.emit("join", trip.id)
            socket.current.on("trip:node", handleIncomingNodeUpdate)
            socket.current.on("trip:node:delete", handleIncomingNodeDelete)

            return () => {
                socket.current?.emit("leave", trip.id)
                socket.current?.off("trip:node", handleIncomingNodeUpdate)
                socket.current?.off("trip:node:delete", handleIncomingNodeDelete)
                socket.current?.disconnect()
                socket.current = null
            }
        }
    }, [trip?.id, handleIncomingNodeUpdate, handleIncomingNodeDelete])

    useEffect(() => {
        rebuildTree()
    }, [trip])

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
        addNodeAndEdge,
        onInit: (flowInstance: ReactFlowInstance<Node, Edge>) => (instance.current = flowInstance),
        nodeWidth,
        nodeHeight,
        viewport_duration,
        updateNode,
        getAncestors,
        trip,
        authenticatedApi,
        user,
        canEdit,
        zoom,
        currency,
        handleNodeDelete,
    }
}
