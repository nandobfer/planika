import React, { useContext } from "react"
import { Autocomplete, Box, Button, IconButton, Paper, TextField } from "@mui/material"
import type { ExpenseNode } from "../../../types/server/class/Trip/ExpenseNode"
import TripContext from "../../../contexts/TripContext"
import { Handle, Position } from "@xyflow/react"
import { AttachMoney, CalendarMonth, Circle, LocationPin } from "@mui/icons-material"
import dayjs from "dayjs"
import { MobileDatePicker } from "@mui/x-date-pickers/MobileDatePicker"
import type { CurrencyRate } from "../../../types/server/api/exchangerate"
import { useExpenseNode } from "../../../hooks/useExpenseNode"

interface ExpenseComponentProps {
    data: ExpenseNode
}

const formatCurrencyOption = (currency: CurrencyRate) => `${currency.symbol} - ${currency.code}`

export const ExpenseComponent: React.FC<ExpenseComponentProps> = (props) => {
    const helper = useContext(TripContext)
    const { expense, expenseValue, toggleActive, onExpenseValueChange, debouncedUpdateNode, updateNode } = useExpenseNode(props.data, helper)
    const ancestors = helper.getAncestors(expense.id)
    const ancestorsActive = ancestors.every((ancestor) => ancestor.active)
    const active = expense.active && ancestorsActive
    const zoom = helper.zoom

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

            <Box sx={{ flexDirection: "column", flex: 1, justifyContent: "space-between", height: 1 }}>
                <Box sx={{ gap: 1 }}>
                    <TextField
                        placeholder="Descrição da despesa"
                        variant="standard"
                        defaultValue={expense.description}
                        onChange={helper.canEdit ? (e) => debouncedUpdateNode({ description: e.target.value }) : undefined}
                        slotProps={{ input: { sx: { fontWeight: "bold" }, readOnly: !helper.canEdit } }}
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
                            autoFocus
                            defaultValue={expense.location}
                            onChange={helper.canEdit ? (e) => debouncedUpdateNode({ location: e.target.value }) : undefined}
                            slotProps={{
                                input: {
                                    startAdornment: (
                                        <IconButton size="small" disableRipple>
                                            <LocationPin fontSize="small" />
                                        </IconButton>
                                    ),
                                    sx: { fontSize: 10, marginBottom: 1 },
                                    readOnly: !helper.canEdit,
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
                            disabled={!helper.canEdit}
                        >
                            Adicionar localização
                        </Button>
                    )}
                    {expense.datetime !== undefined ? (
                        <MobileDatePicker
                            readOnly={!helper.canEdit}
                            slotProps={{
                                textField: {
                                    autoFocus: true,
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
                            disabled={!helper.canEdit}
                        >
                            Adicionar data e hora
                        </Button>
                    )}
                    {expense.expense ? (
                        <Box sx={{ gap: 1 }}>
                            <Autocomplete
                                options={helper.currency.data}
                                getOptionLabel={(option) => formatCurrencyOption(option)}
                                size="small"
                                sx={{ flex: 0.4 }}
                                readOnly={!helper.canEdit}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        placeholder="Moeda Preferida"
                                        size="small"
                                        variant="standard"
                                        slotProps={{
                                            input: {
                                                ...params.InputProps,
                                                sx: { fontSize: 10, marginBottom: 1, paddingLeft: 1 },
                                            },
                                        }}
                                    />
                                )}
                                loading={helper.currency.isFetching}
                                loadingText="Carregando moedas..."
                                value={helper.currency.data.find((c) => c.code === expense.expense?.currency) || null}
                                onChange={(_, value) =>
                                    debouncedUpdateNode({
                                        expense: { amount: expense.expense!.amount, currency: value?.code || helper.user?.defaultCurrency || "BRL" },
                                    })
                                }
                            />
                            <TextField
                                placeholder="Valor da despesa"
                                variant="standard"
                                autoFocus
                                sx={{ flex: 0.6 }}
                                value={expenseValue}
                                onChange={helper.canEdit ? onExpenseValueChange : undefined}
                                slotProps={{
                                    input: { sx: { fontSize: 10, marginBottom: 1 }, readOnly: !helper.canEdit },
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
                            disabled={!helper.canEdit}
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
