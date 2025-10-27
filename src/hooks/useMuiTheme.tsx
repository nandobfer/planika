import { createTheme, darken, lighten, LinearProgress, useMediaQuery, type PaletteMode } from "@mui/material"
import { useMemo } from "react"
import { ptBR } from "@mui/x-data-grid/locales"
import { colors } from "../style/colors"
import { useLocalStorage } from "@mantine/hooks"

export const useMuiTheme = () => {
    const isMobile = useMediaQuery("(orientation: portrait)")
    const [mode, setMode] = useLocalStorage<PaletteMode>({ key: "themeMode", defaultValue: "light" })

    const theme = useMemo(
        () =>
            createTheme(
                {
                    typography: {
                        fontFamily: "Poppins",
                    },
                    palette: {
                        mode: mode,

                        primary: {
                            main: colors[mode].primary,
                        },
                        secondary: {
                            main: colors[mode].secondary,
                        },

                        background: {
                            default: colors[mode].background,
                            // paper: colors[mode].paper,
                        },
                        // text: {primary: colors[mode].primary}
                    },
                    components: {
                        MuiMenuList: { defaultProps: { sx: { backgroundColor: colors[mode].background } } },
                        MuiList: { defaultProps: { sx: { backgroundColor: colors[mode].background } } },
                        MuiDataGrid: {
                            styleOverrides: {
                                root: {
                                    "--DataGrid-t-color-interactive-focus": "transparent !important",
                                    "--DataGrid-hasScrollY": "0 !important",
                                },
                                columnHeader: {
                                    color: colors[mode].secondary,
                                },
                            },
                            defaultProps: {
                                slotProps: { columnHeaders: { style: { display: isMobile ? "none" : undefined } } },
                            },
                        },
                        MuiAutocomplete: {
                            styleOverrides: {
                                listbox: { width: "100%", backgroundColor: colors[mode].background },
                            },
                        },
                        MuiDialog: {
                            defaultProps: {
                                slotProps: {
                                    paper: {
                                        sx: { display: "flex", padding: 2, flexDirection: "column", gap: 2 },
                                        elevation: undefined,
                                    },
                                },
                            },
                        },
                        // MuiButton: { styleOverrides: { contained: { color: colors[mode].secondary } } },
                        MuiCircularProgress: { defaultProps: { size: "1.5rem", color: "inherit" } },
                        MuiTooltip: { defaultProps: { arrow: true } },
                        MuiAvatar: { defaultProps: { style: { backgroundColor: colors[mode].primary } } },
                    },
                },
                ptBR
            ),
        [colors, mode]
    )

    const autofillStyle = {
        "& input:-webkit-autofill": {
            "-webkit-box-shadow": `0 0 0 1000px ${theme.palette.background.default} inset !important`,
            "-webkit-text-fill-color": `${theme.palette.text.primary} !important`,
            "caret-color": `${theme.palette.text.primary}`,
        },
    }

    // const gradientTo = mode === "dark" ? theme.palette.action.disabledBackground : lighten(theme.palette.primary.main, 0.7)
    const gradientTo = mode === "dark" ? darken(theme.palette.primary.main, 0.8) : lighten(theme.palette.primary.main, 0.7)

    const gradientStyle = { background: `linear-gradient(0deg,${theme.palette.background.default} 50%, ${gradientTo} 100%)` }
    const invertedGradientStyle = { background: `linear-gradient(0deg, ${gradientTo} 50%, ${theme.palette.background.default} 100%)` }

    return { theme, mode, setMode, autofillStyle, gradientStyle, invertedGradientStyle }
}
