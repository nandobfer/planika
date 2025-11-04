import React from "react"
import type { useExpenses } from "../../../hooks/useExpenses"
import { Autocomplete, TextField } from "@mui/material"

interface StatusFilterProps {
    api: ReturnType<typeof useExpenses>
}

export const LocationFilter: React.FC<StatusFilterProps> = (props) => {
    const { api } = props

    const activeFilters = api.getActiveFilterValues("location")
    const locations = api.trip?.totalLocations || []

    return (
        <Autocomplete
            multiple
            options={locations}
            value={activeFilters}
            onChange={(event, _newValue, reason, details) => {
                if (reason === "selectOption" && details?.option) {
                    api.addOrRemoveFilter("location", details.option)
                } else if (reason === "removeOption" && details?.option) {
                    api.addOrRemoveFilter("location", details.option)
                } else if (reason === "clear") {
                    api.clearFilterAttribute("location")
                }
            }}
            renderInput={(params) => <TextField {...params} variant="standard" label="Localização" placeholder="Selecione" />}
        />
    )
}
