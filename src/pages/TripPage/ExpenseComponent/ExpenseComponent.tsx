import React, { useCallback, useContext } from "react"
import { Box, Button, debounce, IconButton, Paper, TextField } from "@mui/material"
import type { ExpenseNode } from "../../../types/server/class/Trip/ExpenseNode"
import TripContext from "../../../contexts/TripContext"
import { Handle, Position } from "@xyflow/react"
import { handleCurrencyInput } from "../../../tools/handleCurrencyInput"
import { AttachMoney, CalendarMonth, Circle, LocationPin } from "@mui/icons-material"
import { MobileDateTimePicker } from "@mui/x-date-pickers/MobileDateTimePicker"
import dayjs from "dayjs"

interface ExpenseComponentProps {
    data: ExpenseNode
}

export const ExpenseComponent: React.FC<ExpenseComponentProps> = (props) => {
    const helper = useContext(TripContext)
    const expense = props.data
    const ancestors = helper.getAncestors(expense.id)
    const ancestorsActive = ancestors.every((ancestor) => ancestor.active)
    const active = expense.active && ancestorsActive
    const zoom = helper.zoom

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

    const debouncedUpdateNode = debounce(updateNode, 500)

    return (
        <Paper
            variant="outlined"
            sx={{
                width: helper.nodeWidth,
                height: helper.nodeHeight,
                justifyContent: "flex-start",
                alignItems: "flex-start",
                padding: 1,
                whiteSpace: "normal",
                outlineColor: active ? "success.main" : "action.disabled",
                transition: "0.3s",
                borderWidth: 0,
                outlineWidth: 1 / zoom,
                outlineStyle: "solid",
            }}
        >
            {props.data.parentId && <Handle type="target" position={Position.Left} />}

            <Box sx={{ flexDirection: "column", flex: 1, gap: 1 }}>
                <Box sx={{ gap: 1 }}>
                    <TextField
                        placeholder="Descrição da despesa"
                        variant="standard"
                        onChange={helper.canEdit ? (e) => debouncedUpdateNode({ description: e.target.value }) : undefined}
                    />
                    <IconButton size="small" onClick={helper.canEdit ? toggleActive : undefined}>
                        <Circle fontSize="small" color={active ? "success" : "disabled"} />
                    </IconButton>
                </Box>

                <Box sx={{ flexDirection: "column" }}>
                    {expense.location !== undefined ? (
                        <TextField
                            placeholder="Localização"
                            variant="standard"
                            onChange={helper.canEdit ? (e) => debouncedUpdateNode({ location: e.target.value }) : undefined}
                            slotProps={{
                                input: {
                                    startAdornment: (
                                        <IconButton size="small" disableRipple>
                                            <LocationPin fontSize="small" />
                                        </IconButton>
                                    ),
                                    sx: { fontSize: 10, marginBottom: 1 },
                                },
                            }}
                            size="small"
                        />
                    ) : (
                        <Button
                            startIcon={<LocationPin />}
                            size="small"
                            sx={{ alignSelf: "flex-start" }}
                            onClick={() => updateNode({ location: "" })}
                        >
                            Adicionar localização
                        </Button>
                    )}
                    {expense.datetime !== undefined ? (
                        <MobileDateTimePicker
                            slotProps={{
                                textField: {
                                    fullWidth: true,
                                    size: "small",
                                    variant: "standard",
                                    InputProps: { sx: { flexDirection: "row-reverse", fontSize: 10, marginBottom: 1 } },
                                },
                                openPickerIcon: { fontSize: "small" },
                                openPickerButton: { size: "small" },
                            }}
                            value={expense.datetime ? dayjs(expense.datetime) : null}
                            onChange={(value) => debouncedUpdateNode({ datetime: value?.toDate().getTime() })}
                            // disablePast
                            orientation="portrait"
                            sx={{ "& .MuiInputAdornment-root": { marginLeft: 0 } }}
                        />
                    ) : (
                        <Button
                            startIcon={<CalendarMonth />}
                            size="small"
                            sx={{ alignSelf: "flex-start" }}
                            onClick={() => updateNode({ datetime: 0 })}
                        >
                            Adicionar data e hora
                        </Button>
                    )}
                    {expense.expense ? (
                        <Box>
                            <TextField
                                placeholder="Valor da despesa"
                                variant="standard"
                                onChange={
                                    helper.canEdit
                                        ? (e) =>
                                              debouncedUpdateNode({
                                                  expense: {
                                                      amount: Number(handleCurrencyInput(e.target.value)),
                                                      currency: expense.expense!.currency,
                                                  },
                                              })
                                        : undefined
                                }
                                slotProps={{
                                    input: {
                                        startAdornment: (
                                            <IconButton size="small" disableRipple>
                                                <AttachMoney fontSize="small" />
                                            </IconButton>
                                        ),
                                        sx: { fontSize: 10, marginBottom: 1 },
                                    },
                                }}
                                size="small"
                            />
                        </Box>
                    ) : (
                        <Button
                            startIcon={<AttachMoney />}
                            size="small"
                            sx={{ alignSelf: "flex-start" }}
                            onClick={() => updateNode({ expense: { amount: 0, currency: "BRL" } })}
                        >
                            Adicionar custo
                        </Button>
                    )}
                </Box>
            </Box>

            <Handle type="source" position={Position.Right} />
        </Paper>
    )
}
