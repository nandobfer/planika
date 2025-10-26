import React, { useState, useMemo } from "react"
import { Autocomplete, Avatar, Box, Button, debounce, MenuItem, TextField, Typography } from "@mui/material"
import type { useTripForm } from "../../../hooks/useTripForm"
import { ParticipantContainer } from "./ParticipantContainer"
import type { User } from "../../../types/server/class/User"
import { useUser } from "../../../hooks/useUser"
import { useQuery } from "@tanstack/react-query"
import * as yup from "yup"

interface ParticipantsFormProps {
    tripForm: ReturnType<typeof useTripForm>
}

type UserOption = User | { type: "invite"; email: string }

export const ParticipantsForm: React.FC<ParticipantsFormProps> = (props) => {
    const { searchUser } = useUser()

    const [inputValue, setInputValue] = useState("")
    const [debouncedInput, setDebouncedInput] = useState("")

    // Create debounced function using MUI's debounce
    const debouncedSetInput = useMemo(
        () =>
            debounce((value: string) => {
                setDebouncedInput(value)
            }, 300),
        []
    )

    const { data: users = [], isLoading } = useQuery<User[]>({
        queryKey: ["users", "search", debouncedInput],
        queryFn: () => searchUser(debouncedInput),
        enabled: debouncedInput.length > 0,
    })

    // Create options list with invite option if no users found
    const options: UserOption[] = useMemo(() => {
        if (debouncedInput && users.length === 0 && !isLoading) {
            return [{ type: "invite", email: debouncedInput }]
        }
        return users
    }, [users, debouncedInput, isLoading])

    // Validate if input is a valid email
    const isValidEmail = useMemo(() => {
        try {
            yup.string().email().validateSync(inputValue)
            return true
        } catch {
            return false
        }
    }, [inputValue])

    const handleUserSelect = (option: UserOption | null) => {
        if (!option) return

        if ("type" in option && option.type === "invite") {
            // TODO: Implement invite by email functionality
            console.log("Invite by email:", option.email)
            // You can add your logic here later
        } else {
            // TODO: Implement add user functionality
            console.log("Add user:", option)
            // You can add your logic here later
        }

        // Clear the input after selection
        setInputValue("")
    }

    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        props.tripForm.handleNext()
    }

    return (
        <Box sx={{ flexDirection: "column", gap: 2, width: 1 }}>
            <form onSubmit={onSubmit}>
                <Autocomplete
                    options={options}
                    inputValue={inputValue}
                    onInputChange={(_, newInputValue) => {
                        setInputValue(newInputValue)
                        debouncedSetInput(newInputValue)
                    }}
                    onChange={(_, newValue) => {
                        handleUserSelect(newValue)
                    }}
                    renderInput={(params) => <TextField {...params} label="Adicionar participante" />}
                    getOptionLabel={(option) => {
                        if ("type" in option && option.type === "invite") {
                            return `Convidar ${option.email} por e-mail`
                        }
                        const user = option as User
                        return user.name
                    }}
                    renderOption={(_props, option) => {
                        if ("type" in option && option.type === "invite") {
                            return (
                                <MenuItem {..._props} disabled={!isValidEmail}>
                                    <Typography>Convidar {option.email} por e-mail</Typography>
                                </MenuItem>
                            )
                        }

                        // TypeScript now knows option is User here
                        const user = option as User
                        return (
                            <MenuItem {..._props} sx={{gap: 1}} disabled={props.tripForm.participants.some(participant => participant.userId === user.id)}>
                                <Avatar src={user.picture} sx={{}} />
                                <Box sx={{flexDirection: 'column'}}>
                                    <Typography>
                                    {user.name}
                                </Typography>
                                <Typography variant="body2">{user.email}</Typography>
                                </Box>
                            </MenuItem>
                        )
                    }}
                    loading={isLoading}
                    noOptionsText={inputValue ? "Nenhum usuário encontrado" : "Digite para buscar"}
                    freeSolo={false}
                />
                {props.tripForm.participants.map((participant) => (
                    <ParticipantContainer key={participant.id} participant={participant} />
                ))}
                <Box sx={{ width: 1, gap: 2 }}>
                    <Button onClick={props.tripForm.handleBack}>Voltar</Button>
                    <Button variant="contained" onClick={props.tripForm.handleNext}>
                        Continuar
                    </Button>
                </Box>
            </form>
        </Box>
    )
}
