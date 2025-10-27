import React, { useEffect, useState } from "react"
import { Box, LinearProgress, Typography } from "@mui/material"
import { Route, Routes } from "react-router-dom"
import { SendRecoveryEmail } from "./SendRecoveryEmail"
import { VerifyCode } from "./VerifyCode"
import { useMuiTheme } from "../../hooks/useMuiTheme"
import { EventBus } from "../../tools/EventBus"
import { ResetPassword } from "./ResetPassword"

interface PasswordRecoveryProps {}

export const PasswordRecovery: React.FC<PasswordRecoveryProps> = (props) => {
    const [loading, setLoading] = useState(false)

    const { disabledStyle } = useMuiTheme()

    const handleLoadingUpdate = (isLoading: boolean) => {
        setLoading(isLoading)
    }

    useEffect(() => {
        EventBus.on("password-recovery-loading", handleLoadingUpdate)
        return () => {
            EventBus.off("password-recovery-loading", handleLoadingUpdate)
        }
    }, [])

    return (
        <Box sx={{ flexDirection: "column", padding: 5, position: "relative" }}>
            {loading && <LinearProgress sx={{ position: "absolute", top: 0, left: 0, right: 0 }} />}
            <Box
                sx={{
                    flexDirection: "column",
                    gap: 3,
                    ...(loading ? disabledStyle : {}),
                    "& .recovery-character": {
                        borderRadius: 2,
                        bgcolor: "background.default",
                        color: "text.primary",
                        borderColor: "secondary.main",
                    },
                    "& .recovery-character-selected": {
                        outlineColor: "primary.main",
                        borderColor: "transparent",

                    }
                }}
            >
                <Routes>
                    <Route path="" index element={<SendRecoveryEmail />} />
                    <Route path="code" element={<VerifyCode />} />
                    <Route path="reset-password" element={<ResetPassword />} />
                    <Route path="success" element={<Typography>Senha redefinida com sucesso! Agora você pode fazer login.</Typography>} />
                </Routes>
            </Box>
        </Box>
    )
}
