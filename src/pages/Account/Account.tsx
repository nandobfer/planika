import React from "react"
import { Box, Divider, LinearProgress, useMediaQuery } from "@mui/material"
import { Title } from "../../components/Title"
import { useAccountSettings } from "../../hooks/useAccountSettings"
import { AccountNavigation } from "./AccountNavigation"
import { Route, Routes } from "react-router-dom"
import { useMuiTheme } from "../../hooks/useMuiTheme"
import { SettingDescription } from "./SettingDescription"

interface AccountProps {}

export const Account: React.FC<AccountProps> = (props) => {
    const settings = useAccountSettings()
    const { theme } = useMuiTheme()
    const isMobile = useMediaQuery(theme.breakpoints.down("md"))

    const disabledStyle = settings.loading ? { filter: "grayscale(100%) blur(1px)", pointerEvents: "none" } : {}

    return (
        <Box sx={{ flexDirection: "column", padding: 5, gap: { xs: 2, md: 5 }, height: 1 }}>
            <Title name="Minha conta" />

            <Box sx={{ gap: { xs: 2, md: 5 }, flexDirection: { xs: "column", md: "row" }, height: 1, paddingBottom: { md: 8 } }}>
                <AccountNavigation settings={settings} flex={0.2} />

                {settings.loading ? <LinearProgress variant="indeterminate" /> : <Divider orientation={isMobile ? "horizontal" : "vertical"} />}

                <Box sx={{ flex: 0.5, flexDirection: "column", ...disabledStyle }}>
                    <Routes>
                        {settings.tabs.map((tab) => (
                            <Route key={tab.route} path={tab.route} element={tab.component} index={tab.index} />
                        ))}
                    </Routes>
                </Box>

                <Divider orientation={isMobile ? "horizontal" : "vertical"} />
                <SettingDescription flex={0.3} tab={settings.currentTab} />
            </Box>
        </Box>
    )
}
