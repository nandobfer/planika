import React from "react"
import { Autocomplete, Box, TextField, Typography } from "@mui/material"
import { useCurrency } from "../../../hooks/useCurrency"
import type { CurrencyRate } from "../../../types/server/api/exchangerate"
import { useUser } from "../../../hooks/useUser"
import { useFormik } from "formik"
import type { UserForm } from "../../../types/server/class/User"
import { EventBus } from "../../../tools/EventBus"
import { ThemeModeSwitch } from "../../../components/ThemeModeSwitch"
import { SaveButton } from "../SaveButton"

interface PreferencesProps {}

export const formatCurrencyOption = (currency: CurrencyRate) => `${currency.code} - ${currency.symbol} - ${currency.name}`

export const Preferences: React.FC<PreferencesProps> = () => {
    const { user, patch } = useUser()
    const currency = useCurrency()

    const formik = useFormik<Partial<UserForm>>({
        initialValues: { defaultCurrency: user?.defaultCurrency },
        onSubmit: async () => {
            EventBus.emit("account-loading", true)

            try {
                await patch({ defaultCurrency: formik.values.defaultCurrency })
            } catch (error) {
                console.log(error)
            } finally {
                EventBus.emit("account-loading", false)
            }
        },
        enableReinitialize: true,
    })

    const shouldPatch = formik.values.defaultCurrency !== formik.initialValues.defaultCurrency
    const disabledButton = !shouldPatch

    return (
        <Box sx={{ flexDirection: "column", gap: 3 }}>
            <Typography variant="h5">Preferências</Typography>

            <form onSubmit={formik.handleSubmit}>
                <Autocomplete
                    options={currency.data}
                    getOptionLabel={(option) => formatCurrencyOption(option)}
                    renderInput={(params) => <TextField {...params} label="Moeda Preferida" />}
                    loading={currency.isFetching}
                    loadingText="Carregando moedas..."
                    value={formik.values.defaultCurrency ? currency.data.find((c) => c.code === formik.values.defaultCurrency) || null : null}
                    onChange={(_, value) => formik.setFieldValue("defaultCurrency", value?.code || undefined)}
                />

                <Box sx={{ gap: 1, alignItems: "center" }}>
                    <Typography variant="body2">Modo de Tema:</Typography>
                    <ThemeModeSwitch />
                </Box>
                <SaveButton disabled={disabledButton} />
            </form>
        </Box>
    )
}
