import React from "react"
import type { useExpenses } from "../../../hooks/useExpenses"
import { Autocomplete, TextField } from "@mui/material"

interface StatusFilterProps {
    api: ReturnType<typeof useExpenses>
}

export const ParticipantFilter: React.FC<StatusFilterProps> = (props) => {
    const { api } = props

    const activeFilters = api.getActiveFilterValues("responsibleParticipantId")

    return (
        <Autocomplete
            multiple
            options={api.trip?.participants.map((participant) => participant.id) || []}
            value={activeFilters}
            onChange={(event, _newValue, reason, details) => {
                if (reason === "selectOption" && details?.option) {
                    api.addOrRemoveFilter("responsibleParticipantId", details.option)
                } else if (reason === "removeOption" && details?.option) {
                    api.addOrRemoveFilter("responsibleParticipantId", details.option)
                } else if (reason === "clear") {
                    api.clearFilterAttribute("responsibleParticipantId")
                }
            }}
            renderInput={(params) => <TextField {...params} variant="standard" label="Responsável" placeholder="Selecione" />}
            getOptionLabel={(option) => api.trip?.participants.find((participant) => participant.id === option)?.user?.name || ""}
        />
    )
}
