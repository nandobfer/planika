import { useCallback } from "react"
import type { ExpenseNode } from "../types/server/class/Trip/ExpenseNode"
import { debounce } from "@mui/material"
import type { useExpenses } from "./useExpenses"
import { useConfirmDialog } from "burgos-confirm"

export const useExpenseNode = (data: ExpenseNode, helper: ReturnType<typeof useExpenses>) => {
    const expense = data
    const { confirm } = useConfirmDialog()

    const toggleActive = () => {
        helper.updateNode({ ...expense, active: !expense.active })
    }

    const updateNode = useCallback(
        (value: Partial<ExpenseNode>) => {
            helper.updateNode({ ...expense, ...value })
        },
        [expense, helper]
    )

    const debouncedUpdateNode = debounce(updateNode, 1000)

    const deleteNode = () => {
        confirm({
            title: "Tem certeza que deseja excluir?",
            content: "Essa ação não pode ser desfeita",
            onConfirm: () => {
                helper.handleNodeDelete(expense.id)
            },
        })
    }

    return { expense, toggleActive, debouncedUpdateNode, updateNode, deleteNode }
}
