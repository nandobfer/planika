import React, { useContext, useRef, useEffect, useMemo } from "react"
import { Autocomplete, Badge, Box, Button, Divider, IconButton, Paper, TextField, Tooltip, Typography } from "@mui/material"
import type { ExpenseNode } from "../../../types/server/class/Trip/ExpenseNode"
import TripContext from "../../../contexts/TripContext"
import { Handle, Position } from "@xyflow/react"
import { AttachMoney, CalendarMonth, Chat, Circle, Close, Delete, LocationPin, TimesOneMobiledata } from "@mui/icons-material"
import dayjs from "dayjs"
import { MobileDatePicker } from "@mui/x-date-pickers/MobileDatePicker"
import type { CurrencyRate } from "../../../types/server/api/exchangerate"
import { useExpenseNode } from "../../../hooks/useExpenseNode"
import { currencyMask } from "../../../tools/numberMask"
import { handleCurrencyInput } from "../../../tools/handleCurrencyInput"

interface ExpenseComponentProps {
    data: ExpenseNode
}

const formatCurrencyOption = (currency: CurrencyRate) => `${currency.symbol}`

export const ExpenseComponent: React.FC<ExpenseComponentProps> = (props) => {
    const helper = useContext(TripContext)
    const { expense, toggleActive, updateNode, deleteNode, debouncedUpdateNode } = useExpenseNode(props.data, helper)
    const active = helper.isNodeActive(expense.id, helper.nodes)

    // Refs for uncontrolled inputs
    const descriptionRef = useRef<HTMLInputElement>(null)
    const locationRef = useRef<HTMLInputElement>(null)
    const expenseQuantityRef = useRef<HTMLInputElement>(null)

    const total = useMemo(() => {
        return expense.totalExpenses
    }, [expense.totalExpenses, expense.expense?.amount])

    // Sync refs with external changes (from other users)
    useEffect(() => {
        if (descriptionRef.current && descriptionRef.current.value !== expense.description) {
            descriptionRef.current.value = expense.description || ""
        }
    }, [expense.description])

    useEffect(() => {
        if (locationRef.current && expense.location !== undefined && locationRef.current.value !== expense.location) {
            locationRef.current.value = expense.location
        }
    }, [expense.location])

    useEffect(() => {
        if (expense.expense?.quantity !== undefined && expenseQuantityRef.current && expenseQuantityRef.current.value !== expense.expense.quantity) {
            expenseQuantityRef.current.value = expense.expense.quantity
        }
    }, [expense.expense?.quantity])

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
                outlineWidth: 2,
                outlineStyle: "solid",
                // ...(mode === "light" ? { bgcolor: "background.default" } : {}),
                color: active ? "success.main" : "action.disabled",
            }}
        >
            {props.data.parentId && <Handle type="target" position={Position.Left} />}

            <Box sx={{ flexDirection: "column", flex: 1, height: 1, gap: 1 }}>
                <Box sx={{ gap: 1 }}>
                    <TextField
                        placeholder="Descrição da despesa"
                        variant="standard"
                        defaultValue={expense.description}
                        inputRef={descriptionRef}
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
                        <IconButton size="small" onClick={helper.canEdit ? toggleActive : undefined} color="inherit">
                            <Circle fontSize="small" />
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
                            inputRef={locationRef}
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
                            color="inherit"
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
                            onChange={(value) => updateNode({ datetime: value?.toDate().getTime() })}
                            // disablePast
                            orientation="portrait"
                            sx={{ "& .MuiInputAdornment-root": { marginLeft: 0 } }}
                        />
                    ) : (
                        <Button
                            startIcon={<CalendarMonth />}
                            color="inherit"
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
                                sx={{ flex: 0.3 }}
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
                                    updateNode({
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
                                type="tel"
                                value={expense.expense.amount}
                                onChange={
                                    helper.canEdit
                                        ? (e) =>
                                              updateNode({
                                                  expense: {
                                                      amount: handleCurrencyInput(e.target.value),
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
                            {expense.expense.quantity !== undefined ? (
                                <TextField
                                    placeholder="Quantidade"
                                    inputRef={expenseQuantityRef}
                                    variant="standard"
                                    autoFocus
                                    sx={{ flex: 0.3 }}
                                    type="number"
                                    defaultValue={expense.expense.quantity}
                                    onChange={
                                        helper.canEdit
                                            ? (e) =>
                                                  debouncedUpdateNode({
                                                      expense: {
                                                          amount: expense.expense!.amount,
                                                          quantity: e.target.value,
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
                                        updateNode({
                                            expense: { amount: expense.expense!.amount, currency: expense.expense!.currency, quantity: "" },
                                        })
                                    }
                                >
                                    <TimesOneMobiledata fontSize="small" />
                                </IconButton>
                            )}
                        </Box>
                    ) : (
                        <Button
                            startIcon={<AttachMoney />}
                            color="inherit"
                            size="small"
                            sx={{ alignSelf: "flex-start" }}
                            onClick={() => updateNode({ expense: { amount: "", currency: "R$" } })}
                            disabled={!helper.canEdit}
                        >
                            Adicionar custo
                        </Button>
                    )}
                    <Divider flexItem orientation="horizontal" />
                    <Box sx={{ alignItems: "center", justifyContent: "space-between" }}>
                        <Tooltip title="Anotações e comentários">
                            <Badge
                                badgeContent={expense.notes.length}
                                color="primary"
                                overlap="circular"
                                slotProps={{
                                    badge: {
                                        style: {
                                            fontSize: 8,
                                            padding: 0,
                                            minWidth: 15,
                                            width: 15,
                                            height: 15,
                                        },
                                    },
                                }}
                            >
                                <IconButton size="small" onClick={() => helper.openNotesModal(expense)}>
                                    <Chat fontSize="small" />
                                </IconButton>
                            </Badge>
                        </Tooltip>
                        <Typography variant="subtitle1" sx={{ alignSelf: "flex-end", fontWeight: "bold" }}>
                            {currencyMask(total, { affix: expense.expense?.currency || "R$" })}
                        </Typography>
                    </Box>
                </Box>
            </Box>

            <Handle type="source" position={Position.Right} />
        </Paper>
    )
}
