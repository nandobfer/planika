import React, { useState, useMemo } from "react"
import { Autocomplete, Avatar, Box, Button, debounce, MenuItem, TextField, Typography } from "@mui/material"
import type { useTripForm } from "../../../hooks/useTripForm"
import { ParticipantContainer } from "./ParticipantContainer"
import type { User } from "../../../types/server/class/User"
import { useUser } from "../../../hooks/useUser"
import { useQuery } from "@tanstack/react-query"
import * as yup from "yup"
import { ParticipantInviteModal } from "./ParticipantInviteModal"

interface ParticipantsFormProps {
    tripForm: ReturnType<typeof useTripForm>
    fromSettings?: boolean
}

type UserOption = User | { type: "invite"; email: string }

export const ParticipantsForm: React.FC<ParticipantsFormProps> = (props) => {
    const { searchUser, user } = useUser()

    const [inputValue, setInputValue] = useState("")
    const [debouncedInput, setDebouncedInput] = useState("")
    const [inviteTarget, setInviteTarget] = useState<string | null | User>(null)

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

        // console.log("Selected option:", option)

        if ("type" in option && option.type === "invite") {
            setInviteTarget(option.email)
        } else {
            // console.log("Add user:", option)
            setInviteTarget(option as User)
        }

        // Clear the input after selection
        setInputValue("")
        setDebouncedInput("")
    }

    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        props.tripForm.handleNext()
    }

    return (
        <Box sx={{ flexDirection: "column", gap: 2, width: 1 }}>
            <form onSubmit={onSubmit}>
                <Autocomplete
                    disabled={!props.tripForm.isAdmin}
                    options={options}
                    inputValue={inputValue}
                    onInputChange={(_, newInputValue) => {
                        setInputValue(newInputValue)
                        debouncedSetInput(newInputValue)
                    }}
                    onChange={(_, newValue) => {
                        handleUserSelect(newValue)
                    }}
                    renderInput={(params) => <TextField {...params} label="Convidar participante" placeholder="fulano@exemplo.com" />}
                    getOptionLabel={(option) => {
                        if ("type" in option && option.type === "invite") {
                            return `Convidar ${option.email}`
                        }
                        const user = option as User
                        return user.name
                    }}
                    filterOptions={(options) => options}
                    getOptionKey={(option) => option.email}
                    renderOption={(_props, option) => {
                        if ("type" in option && option.type === "invite") {
                            return (
                                <MenuItem {..._props} disabled={!isValidEmail}>
                                    <Typography>Convidar {option.email}</Typography>
                                </MenuItem>
                            )
                        }

                        // TypeScript now knows option is User here
                        const user = option as User
                        return (
                            <MenuItem
                                {..._props}
                                sx={{ gap: 1 }}
                                disabled={props.tripForm.participants.some((participant) => participant.userId === user.id)}
                            >
                                <Avatar src={user.picture} sx={{}} />
                                <Box sx={{ flexDirection: "column" }}>
                                    <Typography>{user.name}</Typography>
                                    <Typography variant="body2">{user.email}</Typography>
                                </Box>
                            </MenuItem>
                        )
                    }}
                    loading={isLoading}
                    noOptionsText={inputValue ? "Nenhum usuário encontrado" : "Digite para buscar ou convidar por e-mail"}
                    freeSolo={false}
                />
                {props.tripForm.participants.map((participant) => {
                    const canEdit = props.tripForm.isAdmin && participant.userId !== user?.id
                    return (
                        <ParticipantContainer
                            key={participant.id}
                            participant={participant}
                            onChangeRole={canEdit ? (role) => props.tripForm.updateParticipantRole(participant.id, role) : undefined}
                        />
                    )
                })}
                {!props.fromSettings && (
                    <Box sx={{ width: 1, gap: 2, justifyContent: "flex-end" }}>
                        <Button onClick={props.tripForm.handleBack}>Voltar</Button>
                        <Button variant="contained" onClick={props.tripForm.handleNext}>
                            Continuar
                        </Button>
                    </Box>
                )}
            </form>

            <ParticipantInviteModal target={inviteTarget} onClose={() => setInviteTarget(null)} tripForm={props.tripForm} />
        </Box>
    )
}
