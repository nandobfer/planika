import React, { useState } from "react"
import type { useExpenses } from "../../../hooks/useExpenses"
import { Autocomplete, TextField, Chip, Box } from "@mui/material"
import { MobileDatePicker } from "@mui/x-date-pickers"
import dayjs from "dayjs"
import { CalendarMonth } from "@mui/icons-material"

interface StatusFilterProps {
    api: ReturnType<typeof useExpenses>
}

export const DatetimeFilter: React.FC<StatusFilterProps> = (props) => {
    const { api } = props
    const [pickerOpen, setPickerOpen] = useState(false)

    const activeFilters = api.getActiveFilterValues("datetime")

    // Format date for display
    const formatDate = (timestamp: number) => {
        return dayjs(timestamp).format("DD/MM/YYYY")
    }

    return (
        <Box sx={{ position: "relative" , flexDirection: 'column'}}>
            <Autocomplete
                multiple
                options={[]}
                value={activeFilters}
                open={false}
                freeSolo
                onChange={(_event, _newValue, reason) => {
                    if (reason === "clear") {
                        api.clearFilterAttribute("datetime")
                    }
                }}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        variant="standard"
                        label="Data"
                        placeholder="Selecione datas"
                        onClick={(e) => {
                            // Don't open picker if clicking on clear button or chips
                            const target = e.target as HTMLElement
                            if (target.closest('.MuiAutocomplete-clearIndicator') || target.closest('.MuiChip-root')) {
                                return
                            }
                            setPickerOpen(true)
                        }}
                        InputProps={{
                            ...params.InputProps,
                            endAdornment: (
                                <>
                                    {params.InputProps.endAdornment}
                                    <CalendarMonth 
                                        sx={{ cursor: "pointer", color: "action.active" }} 
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            setPickerOpen(true)
                                        }} 
                                    />
                                </>
                            ),
                        }}
                    />
                )}
                renderTags={(value, getTagProps) =>
                    value.map((option, index) => (
                        <Chip
                            label={formatDate(option as number)}
                            size="small"
                            {...getTagProps({ index })}
                            onDelete={() => {
                                api.addOrRemoveFilter("datetime", option)
                            }}
                        />
                    ))
                }
            />

            <MobileDatePicker
                open={pickerOpen}
                onClose={() => setPickerOpen(false)}
                label="Selecione uma data"
                slotProps={{
                    textField: {
                        sx: { display: "none" },
                    },
                    actionBar: {
                        actions: ["clear", "accept"],
                    },
                }}
                localeText={{
                    clearButtonLabel: "Limpar",
                    cancelButtonLabel: "Cancelar",
                    okButtonLabel: "Confirmar",
                }}
                value={null}
                onChange={(value) => {
                    if (value) {
                        // Add the new date (normalized to start of day)
                        const dateTimestamp = value.startOf("day").valueOf()
                        api.addOrRemoveFilter("datetime", dateTimestamp)
                    }
                    setPickerOpen(false)
                }}
                onAccept={() => setPickerOpen(false)}
                orientation="portrait"
            />
        </Box>
    )
}
