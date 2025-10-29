import { useCallback, useEffect, useState } from "react"
import type { ExpenseNode } from "../types/server/class/Trip/ExpenseNode"
import { debounce } from "@mui/material"
import { handleCurrencyInput } from "../tools/handleCurrencyInput"
import type { useExpenses } from "./useExpenses"

export const useExpenseNode = (data: ExpenseNode, helper: ReturnType<typeof useExpenses>) => {
    const expense = data

    const [expenseValue, setExpenseValue] = useState(expense.expense?.currency.toString() || "")

    const toggleActive = () => {
        helper.updateNode({ ...expense, active: !expense.active })
    }

    const updateNode = useCallback(
        (value: Partial<ExpenseNode>) => {
            helper.updateNode({ ...expense, ...value })
            console.log(value)
        },
        [expense]
    )

    const onExpenseValueChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = handleCurrencyInput(event.target.value)
        console.log(value)

        setExpenseValue(value)
        const amount = Number(value.replace(",", "."))
        updateNode({
            expense: { amount: isNaN(amount) ? 0 : amount, currency: expense.expense?.currency || "BRL" },
        })
    }

    const debouncedUpdateNode = debounce(updateNode, 500)

    useEffect(() => {
        setExpenseValue(expense.expense?.amount.toString() || "")
    }, [expense.expense?.amount])

    return { expense, expenseValue, setExpenseValue, toggleActive, onExpenseValueChange, debouncedUpdateNode, updateNode }
}
