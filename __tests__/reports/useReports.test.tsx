import { renderHook } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"
import { useReports } from "../../src/hooks/useReports"
import type { ExpenseNode } from "../../src/types/server/class/Trip/ExpenseNode"
import type { useExpenses } from "../../src/hooks/useExpenses"

const createExpense = (data: Partial<ExpenseNode>): ExpenseNode =>
    ({
        id: "expense",
        tripId: "trip-1",
        description: "Despesa",
        active: true,
        locked: false,
        createdAt: 1,
        updatedAt: 1,
        notes: [],
        children: [],
        totalExpenses: 0,
        totalLocations: [],
        ...data,
    }) as ExpenseNode

const createExpensesHook = (nodes: ReturnType<typeof useExpenses>["nodes"]): ReturnType<typeof useExpenses> =>
    ({
        nodes,
        openReportsDrawer: vi.fn(),
        closeReportsDrawer: vi.fn(),
        showReports: false,
        isNodeActive: vi.fn((id: string) => id !== "inactive"),
    }) as unknown as ReturnType<typeof useExpenses>

describe("useReports", () => {
    it("agrupa despesas por local herdado do pai e soma totais", () => {
        const parent = createExpense({ id: "parent", location: "Curitiba" })
        const child = createExpense({ id: "child", parentId: "parent", expense: { amount: "50", currency: "BRL", quantity: "2" } })
        const inactive = createExpense({ id: "inactive", location: "Curitiba", expense: { amount: "999", currency: "BRL" } })
        const expenses = createExpensesHook([
            { id: "parent", type: "expense", data: parent },
            { id: "child", type: "expense", data: child },
            { id: "inactive", type: "expense", data: inactive },
        ] as ReturnType<typeof useExpenses>["nodes"])

        const { result } = renderHook(() => useReports(expenses))

        expect(result.current.locations).toHaveLength(1)
        expect(result.current.locations[0]).toEqual(["Curitiba", { expenses: [parent, child], total: 100 }])
        expect(result.current.locationsTotal).toBe(100)
    })

    it("agrupa despesas por data herdada do pai", () => {
        const datetime = new Date("2026-07-29T15:30:00.000Z").getTime()
        const parent = createExpense({ id: "parent", datetime })
        const child = createExpense({ id: "child", parentId: "parent", expense: { amount: "25", currency: "BRL", quantity: "3" } })
        const expenses = createExpensesHook([
            { id: "parent", type: "expense", data: parent },
            { id: "child", type: "expense", data: child },
        ] as ReturnType<typeof useExpenses>["nodes"])

        const { result } = renderHook(() => useReports(expenses))

        const dateKey = new Date(datetime).setHours(0, 0, 0, 0)
        expect(result.current.datetimes).toEqual([[dateKey, { expenses: [{ ...parent, totalExpenses: 0 }, { ...child, totalExpenses: 75 }], total: 75 }]])
    })
})
