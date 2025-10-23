import type { ChipPropsColorOverrides } from "@mui/material";

export type MuiColor = OverridableStringUnion<"default" | "primary" | "secondary" | "error" | "info" | "success" | "warning", ChipPropsColorOverrides>