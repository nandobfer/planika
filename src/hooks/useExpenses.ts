import { useCallback, useEffect, useRef } from "react"
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
} from "@xyflow/react"
import dagre from "@dagrejs/dagre"
import { uid } from "uid"
import type { WithoutFunctions } from "../types/server/class/helpers"
import { useMuiTheme } from "./useMuiTheme"
import { ExpenseNode } from "../types/server/class/Trip/ExpenseNode"

export type ExpenseNodeData = Record<keyof WithoutFunctions<ExpenseNode>, unknown>

const nodeWidth = 300
const nodeHeight = 150
const viewport_duration = 800

const updateLayout = (nodes: Node[], edges: Edge[]): { nodes: Node[]; edges: Edge[] } => {
    const dagreGraph = new dagre.graphlib.Graph().setDefaultEdgeLabel(() => ({}))
    dagreGraph.setGraph({
        rankdir: "LR",
        ranksep: 100,
        nodesep: 100,
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
    const { trip } = tripHelper
    const instance = useRef<ReactFlowInstance<Node, Edge> | null>(null)
    const { theme } = useMuiTheme()

    const { nodes: layoutedNodes, edges: layoutedEdges } = updateLayout([], [])
    const [nodes, setNodes, onNodesChange] = useNodesState(layoutedNodes)
    const [edges, setEdges, onEdgesChange] = useEdgesState(layoutedEdges)

    const onConnect = useCallback(
        (params: Connection) => setEdges((eds) => addEdge({ ...params, type: ConnectionLineType.SmoothStep, animated: true }, eds)),
        []
    )

    const fitNodeView = (node: Node | string) => {
        const nodeItem = typeof node === "string" ? nodes.find((item) => item.id === node) : node
        if (!nodeItem) return

        const { x, y } = nodeItem.position
        instance.current?.setCenter(x + nodeWidth / 2, y + nodeHeight / 2, {
            zoom: 0.9,
            duration: viewport_duration,
        })
    }

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
                style: {
                    stroke: theme.palette.primary.main,
                },
            })
        }

        // Process children recursively
        if (expenseNode.children && expenseNode.children.length > 0) {
            expenseNode.children.forEach((child) => {
                const childResult = buildTreeNodes(child, expenseNode.id)
                nodes.push(...childResult.nodes)
                edges.push(...childResult.edges)
            })
        }

        // Add placeholder node as last child
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
                stroke: theme.palette.primary.main,
                strokeDasharray: "5,5",
            },
        })

        return { nodes, edges }
    }

    // Build complete tree from trip data
    const rebuildTree = useCallback(() => {
        if (!trip) return

        const allNodes: Node[] = []
        const allEdges: Edge[] = []

        // Add root placeholder (for adding top-level nodes)
        const rootPlaceholderId = "placeholder_root"
        allNodes.push({
            id: rootPlaceholderId,
            type: "placeholder",
            position: { x: 0, y: 0 },
            data: { parentId: null } as ExpenseNodeData,
        })

        // Build tree for each root node
        trip.nodes.forEach((rootNode) => {
            const result = buildTreeNodes(rootNode)
            allNodes.push(...result.nodes)
            allEdges.push(...result.edges)
        })

        // Apply layout and update state
        const layouted = updateLayout(allNodes, allEdges)
        setNodes(layouted.nodes)
        setEdges(layouted.edges)
    }, [trip, theme])

    // Add a new node (to be called when clicking placeholder)
    const addNodeAndEdge = useCallback(
        (parentId?: string) => {
            // Create new expense node data
            const now = Date.now()
            const newNodeId = uid()
            const newExpenseData = {
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

            // TODO: Add this node to your trip data structure
            // tripHelper.addNode(newExpenseData)
            
            // For now, just add to the visual tree
            const result = buildTreeNodes(newExpenseData as unknown as ExpenseNode, parentId)
            
            const layouted = updateLayout([...nodes, ...result.nodes], [...edges, ...result.edges])
            setNodes(layouted.nodes)
            setEdges(layouted.edges)

            // Focus on the new node
            const addedNode = layouted.nodes.find((n) => n.id === newNodeId)
            if (addedNode) {
                fitNodeView(addedNode)
            }
        },
        [nodes, edges, tripHelper]
    )

    // Initialize tree when trip changes
    useEffect(() => {
        rebuildTree()
    }, [trip])

    return {
        nodes,
        edges,
        onNodesChange,
        onEdgesChange,
        onConnect,
        addNodeAndEdge,
        onInit: (flowInstance: ReactFlowInstance<Node, Edge>) => (instance.current = flowInstance),
        nodeWidth,
        nodeHeight,
        viewport_duration,
    }
}
