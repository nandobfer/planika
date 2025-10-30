import React, { useContext } from "react"
import { Autocomplete, Box, Button, IconButton, Paper, TextField, Tooltip, Typography } from "@mui/material"
import type { ExpenseNode } from "../../../types/server/class/Trip/ExpenseNode"
import TripContext from "../../../contexts/TripContext"
import { Handle, Position } from "@xyflow/react"
import { Add, AttachMoney, CalendarMonth, Circle, Close, Delete, LocationPin, TimesOneMobiledata } from "@mui/icons-material"
import dayjs from "dayjs"
import { MobileDatePicker } from "@mui/x-date-pickers/MobileDatePicker"
import type { CurrencyRate } from "../../../types/server/api/exchangerate"
import { useExpenseNode } from "../../../hooks/useExpenseNode"
import { currencyMask } from "../../../tools/numberMask"

interface ExpenseComponentProps {
    data: ExpenseNode
}

const formatCurrencyOption = (currency: CurrencyRate) => `${currency.symbol} - ${currency.code}`

export const ExpenseComponent: React.FC<ExpenseComponentProps> = (props) => {
    const helper = useContext(TripContext)
    const { expense, toggleActive, debouncedUpdateNode, updateNode, deleteNode } = useExpenseNode(props.data, helper)
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
                outlineWidth: 2 / zoom,
                outlineStyle: "solid",
            }}
        >
            {props.data.parentId && <Handle type="target" position={Position.Left} />}

            <Box sx={{ flexDirection: "column", flex: 1, height: 1, gap: 1 }}>
                <Box sx={{ gap: 1 }}>
                    <TextField
                        placeholder="Descrição da despesa"
                        variant="standard"
                        defaultValue={expense.description}
                        onChange={helper.canEdit ? (e) => debouncedUpdateNode({ description: e.target.value }) : undefined}
                        slotProps={{
                            input: {
                                sx: { fontWeight: "bold" },
                                readOnly: !helper.canEdit,
                                endAdornment: helper.canEdit && (
                                    <Tooltip title="Excluir despesa">
                                        <IconButton size="small" onClick={deleteNode}>
                                            <Delete fontSize="small" />
                                        </IconButton>
                                    </Tooltip>
                                ),
                            },
                        }}
                    />
                    <Tooltip title={active ? "Desativar grupo" : "Ativar grupo"}>
                        <IconButton size="small" onClick={helper.canEdit ? toggleActive : undefined}>
                            <Circle fontSize="small" color={active ? "success" : "disabled"} />
                        </IconButton>
                    </Tooltip>
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
                                value={helper.currency.data.find((c) => c.symbol === expense.expense?.currency) || null}
                                onChange={(_, value) =>
                                    debouncedUpdateNode({
                                        expense: {
                                            amount: expense.expense!.amount,
                                            currency: value?.symbol || "R$",
                                            quantity: expense.expense!.quantity,
                                        },
                                    })
                                }
                            />
                            <TextField
                                placeholder="Valor da despesa"
                                variant="standard"
                                autoFocus
                                sx={{ flex: 0.4 }}
                                defaultValue={expense.expense.amount}
                                // value={expenseValue}
                                onChange={
                                    helper.canEdit
                                        ? (e) =>
                                              debouncedUpdateNode({
                                                  expense: {
                                                      amount: Number(e.target.value.replace(",", ".").replace(/[^0-9.]/g, "")),
                                                      currency: expense.expense!.currency,
                                                      quantity: expense.expense!.quantity,
                                                  },
                                              })
                                        : undefined
                                }
                                slotProps={{
                                    input: {
                                        sx: { fontSize: 10, marginBottom: 1 },
                                        readOnly: !helper.canEdit,
                                    },
                                }}
                                size="small"
                            />
                            {expense.expense.quantity ? (
                                <TextField
                                    placeholder="Quantidade"
                                    variant="standard"
                                    autoFocus
                                    sx={{ flex: 0.2 }}
                                    defaultValue={expense.expense.quantity}
                                    // value={expenseValue}
                                    onChange={
                                        helper.canEdit
                                            ? (e) =>
                                                  debouncedUpdateNode({
                                                      expense: {
                                                          amount: expense.expense!.amount,
                                                          quantity: Number(e.target.value.replace(",", ".").replace(/[^0-9.]/g, "")),
                                                          currency: expense.expense!.currency,
                                                      },
                                                  })
                                            : undefined
                                    }
                                    slotProps={{
                                        input: {
                                            sx: { fontSize: 10, marginBottom: 1 },
                                            readOnly: !helper.canEdit,
                                            startAdornment: <Close sx={{ width: 10, height: 10 }} />,
                                        },
                                    }}
                                    size="small"
                                />
                            ) : (
                                <IconButton
                                    size="small"
                                    disabled={!helper.canEdit}
                                    onClick={() =>
                                        updateNode({ expense: { amount: expense.expense!.amount, currency: expense.expense!.currency, quantity: 1 } })
                                    }
                                >
                                    <TimesOneMobiledata fontSize="small" />
                                </IconButton>
                            )}
                        </Box>
                    ) : (
                        <Button
                            startIcon={<AttachMoney />}
                            size="small"
                            sx={{ alignSelf: "flex-start" }}
                            onClick={() => updateNode({ expense: { amount: 0, currency: "R$" } })}
                            disabled={!helper.canEdit}
                        >
                            Adicionar custo
                        </Button>
                    )}
                    <Typography variant="caption" sx={{ alignSelf: "flex-end" }} color={active ? "success" : "textDisabled"}>
                        {currencyMask(expense.totalExpenses, { affix: expense.expense?.currency || "R$" })}
                    </Typography>
                </Box>
            </Box>

            <Handle type="source" position={Position.Right} />
        </Paper>
    )
}
