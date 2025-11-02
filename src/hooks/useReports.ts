import { useCallback, useMemo } from "react"
import type { useExpenses } from "./useExpenses"
import type { ExpenseNode } from "../types/server/class/Trip/ExpenseNode"

export const useReports = (expenses: ReturnType<typeof useExpenses>) => {
    const { openReportsDrawer, showReports, closeReportsDrawer } = expenses

    const validNodes = expenses.nodes.filter((node) => node.type === "expense" && expenses.isNodeActive(node.id, expenses.nodes))

    const getLocation = useCallback(
        (expense: ExpenseNode): string | undefined => {
            if (expense.location) return expense.location

            const parentNode = validNodes.find((node) => node.id === expense.parentId)
            if (parentNode) {
                const parentExpense = parentNode.data as unknown as ExpenseNode
                return getLocation(parentExpense)
            }

            return
        },
        [validNodes]
    )

    const getDate = useCallback(
        (expense: ExpenseNode): number | undefined => {
            if (expense.datetime) return expense.datetime

            const parentNode = validNodes.find((node) => node.id === expense.parentId)
            if (parentNode) {
                const parentExpense = parentNode.data as unknown as ExpenseNode
                return getDate(parentExpense)
            }

            return
        },
        [validNodes]
    )

    const calculateTotalExpenses = (expense: ExpenseNode): number => {
        if (expense.expense) {
            return Number(expense.expense.amount) * Number((expense.expense.quantity || "1").replace(/\D/g, ""))
        }
        return 0
    }

    const locations = useMemo(() => {
        const locations = new Map<string, { expenses: ExpenseNode[]; total: number }>()
        validNodes.forEach((node) => {
            const expense = { ...node.data } as unknown as ExpenseNode
            expense.totalExpenses = calculateTotalExpenses(expense)

            const location = getLocation(expense)
            if (location) {
                const { expenses, total } = locations.get(location) || { expenses: [], total: 0 }
                expenses.push(expense)
                locations.set(location, { expenses, total: total + expense.totalExpenses })
            }
        })

        return Array.from(locations.entries())
    }, [validNodes])

    const locationsTotal = useMemo(() => {
        let total = 0
        locations.forEach(([, data]) => {
            total += data.total
        })
        return total
    }, [locations])

    const datetimes = useMemo(() => {
        const datetimes = new Map<number, { expenses: ExpenseNode[]; total: number }>()
        validNodes.forEach((node) => {
            const expense = { ...node.data } as unknown as ExpenseNode
            expense.totalExpenses = calculateTotalExpenses(expense)

            const datetime = getDate(expense)
            if (datetime) {
                const dateKey = new Date(datetime).setHours(0, 0, 0, 0)
                const { expenses, total } = datetimes.get(dateKey) || { expenses: [], total: 0 }
                expenses.push(expense)
                datetimes.set(dateKey, { expenses, total: total + expense.totalExpenses })
            }
        })

        return Array.from(datetimes.entries()).sort((a, b) => a[0] - b[0])
    }, [validNodes])

    return { expenses, openReportsDrawer, showReports, closeReportsDrawer, locations, datetimes, locationsTotal }
}
