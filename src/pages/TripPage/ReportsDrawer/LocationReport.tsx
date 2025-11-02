import React, { useState } from "react"
import { Box, Collapse, Divider, IconButton, Typography } from "@mui/material"
import { ExpandMore, ExpandLess } from "@mui/icons-material"
import type { useReports } from "../../../hooks/useReports"
import { currencyMask } from "../../../tools/numberMask"
import type { ExpenseNode } from "../../../types/server/class/Trip/ExpenseNode"

interface LocationReportProps {
    api: ReturnType<typeof useReports>
}

export const LocationReport: React.FC<LocationReportProps> = (props) => {
    const { api } = props
    const [expandedLocations, setExpandedLocations] = useState<Set<string>>(new Set())
    const [expandedExpenses, setExpandedExpenses] = useState<Set<string>>(new Set())

    const toggleLocation = (location: string) => {
        setExpandedLocations((prev) => {
            const next = new Set(prev)
            if (next.has(location)) {
                next.delete(location)
            } else {
                next.add(location)
            }
            return next
        })
    }

    const toggleExpense = (expenseId: string) => {
        setExpandedExpenses((prev) => {
            const next = new Set(prev)
            if (next.has(expenseId)) {
                next.delete(expenseId)
            } else {
                next.add(expenseId)
            }
            return next
        })
    }

    const getChildren = (parentId: string, expenses: ExpenseNode[]) => {
        return expenses.filter((expense) => expense.parentId === parentId)
    }

    const getRootExpenses = (expenses: ExpenseNode[]) => {
        const expenseIds = new Set(expenses.map((e) => e.id))
        return expenses.filter((expense) => !expense.parentId || !expenseIds.has(expense.parentId))
    }

    const ExpenseItem: React.FC<{ expense: ExpenseNode; expenses: ExpenseNode[]; depth?: number }> = ({ expense, expenses, depth = 0 }) => {
        const children = getChildren(expense.id, expenses)
        const hasChild = children.length > 0
        const isExpanded = expandedExpenses.has(expense.id)

        return (
            <Box sx={{ flexDirection: "column" }}>
                <Box
                    sx={{
                        justifyContent: "space-between",
                        alignItems: "center",
                        paddingLeft: depth * 3,
                        paddingY: 0.5,
                        cursor: hasChild ? "pointer" : "default",
                        "&:hover": { backgroundColor: "action.hover" },
                        borderRadius: 1,
                    }}
                    onClick={hasChild ? () => toggleExpense(expense.id) : undefined}
                >
                    <Box sx={{ alignItems: "center", gap: 0.5 }}>
                        {hasChild ? (
                            <IconButton size="small" sx={{ padding: 0, width: 20, height: 20 }}>
                                {isExpanded ? <ExpandLess fontSize="small" /> : <ExpandMore fontSize="small" />}
                            </IconButton>
                        ) : (
                            <Box sx={{ width: 20 }} />
                        )}
                        <Typography variant="body2">{expense.description}</Typography>
                    </Box>
                    <Typography variant="body2">{currencyMask(expense.totalExpenses)}</Typography>
                </Box>

                {hasChild && (
                    <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                        <Box sx={{ flexDirection: "column" }}>
                            {children.map((child) => (
                                <ExpenseItem key={child.id} expense={child} expenses={expenses} depth={depth + 1} />
                            ))}
                        </Box>
                    </Collapse>
                )}
            </Box>
        )
    }

    return (
        <Box sx={{ flexDirection: "column", flex: 1 }}>
            {api.locations.map(([location, data]) => {
                const rootExpenses = getRootExpenses(data.expenses)
                return (
                    <Box key={location} sx={{ flexDirection: "column", marginBottom: 1 }}>
                        <Box
                            sx={{
                                justifyContent: "space-between",
                                alignItems: "center",
                                cursor: "pointer",
                                padding: 1,
                                "&:hover": { backgroundColor: "action.hover" },
                                borderRadius: 1,
                            }}
                            onClick={() => toggleLocation(location)}
                        >
                            <Box sx={{ alignItems: "center", gap: 1 }}>
                                <IconButton size="small" sx={{ padding: 0 }}>
                                    {expandedLocations.has(location) ? <ExpandLess /> : <ExpandMore />}
                                </IconButton>
                                <Typography variant="subtitle1">{location}</Typography>
                            </Box>
                            <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                                {currencyMask(data.total)}
                            </Typography>
                        </Box>

                        <Collapse in={expandedLocations.has(location)} timeout="auto" unmountOnExit>
                            <Box sx={{ flexDirection: "column", paddingLeft: 4, paddingRight: 2, marginTop: 1 }}>
                                {rootExpenses.map((expense) => (
                                    <ExpenseItem key={expense.id} expense={expense} expenses={data.expenses} />
                                ))}
                            </Box>
                        </Collapse>

                        <Divider sx={{ marginTop: 1 }} />
                    </Box>
                )
            })}

            <Box sx={{ justifyContent: "space-between", padding: 1 }}>
                <Typography>Sem localização</Typography>
                <Typography variant="body2" sx={{ fontWeight: "bold", textAlign: "right" }}>
                    {currencyMask(api.expenses.trip!.totalExpenses - api.locationsTotal)}
                </Typography>
            </Box>
            <Divider sx={{ marginY: 1 }} />

            <Box sx={{ justifyContent: "space-between", padding: 1 }}>
                <Typography variant="h6">Total</Typography>
                <Typography variant="h6" sx={{ fontWeight: "bold", textAlign: "right" }}>
                    {currencyMask(api.expenses.trip!.totalExpenses)}
                </Typography>
            </Box>
        </Box>
    )
}
