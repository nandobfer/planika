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
    const { theme, disabledStyle } = useMuiTheme()
    const isMobile = useMediaQuery(theme.breakpoints.down("md"))

    return (
        <Box sx={{ flexDirection: "column", padding: 5, gap: { xs: 2, md: 5 }, height: 1, position: "relative" }}>
            <Title name="Minha conta" />

            {settings.loading && <LinearProgress sx={{ width: 1, position: "absolute", top: 0, right: 0, left: 0 }} variant="indeterminate" />}
            <Box sx={{ gap: { xs: 2, md: 5 }, flexDirection: { xs: "column", md: "row" }, height: 1, paddingBottom: { md: 8 } }}>
                <AccountNavigation settings={settings} flex={0.2} />

                <Divider orientation={isMobile ? "horizontal" : "vertical"} />

                <Box sx={{ flex: 0.5, flexDirection: "column", ...(settings.loading ? disabledStyle : {}) }}>
                    <Routes>
                        {settings.tabs.map((tab) => (
                            <Route key={tab.route} path={tab.route} element={tab.component} index={tab.index} />
                        ))}
                    </Routes>
                </Box>

                <Divider orientation={isMobile ? "horizontal" : "vertical"} />
                <SettingDescription flex={0.3}>{settings.currentTab.description}</SettingDescription>
            </Box>
        </Box>
    )
}
