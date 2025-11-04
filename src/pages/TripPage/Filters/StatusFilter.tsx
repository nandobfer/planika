import React from 'react'
import type { useExpenses } from '../../../hooks/useExpenses'
import type { ExpenseStatus } from '../../../types/server/class/Trip/ExpenseNode'
import { Autocomplete, TextField } from '@mui/material'
import { formatStatus, statuses } from '../ExpenseComponent/StatusChip'

interface StatusFilterProps {
    api: ReturnType<typeof useExpenses>
}

export const StatusFilter:React.FC<StatusFilterProps> = (props) => {
    const {api} = props

    const activeFilters = api.getActiveFilterValues('status') as ExpenseStatus[]
    
    return (
        <Autocomplete 
            multiple
            options={statuses}
            value={activeFilters}
            onChange={(event, _newValue, reason, details) => {
                if (reason === 'selectOption' && details?.option) {
                    // Add the selected option
                    api.addOrRemoveFilter('status', details.option)
                } else if (reason === 'removeOption' && details?.option) {
                    // Remove the deselected option
                    api.addOrRemoveFilter('status', details.option)
                } else if (reason === 'clear') {
                    // Clear all status filters
                    api.clearFilterAttribute('status')
                }
            }}
            renderInput={(params) => (
                <TextField {...params} variant="standard" label="Status" placeholder="Selecione múltiplos"  />
            )}
            slotProps={{chip: {size: 'small'}}}
            getOptionLabel={(option => formatStatus(option))}
        />
    )
}