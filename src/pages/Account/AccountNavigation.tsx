import React from "react"
import { Box, Button, useMediaQuery } from "@mui/material"
import type { useAccountSettings } from "../../hooks/useAccountSettings"
import { useMuiTheme } from "../../hooks/useMuiTheme"

interface AccountNavigationProps {
    settings: ReturnType<typeof useAccountSettings>
    flex: number
}

export const AccountNavigation: React.FC<AccountNavigationProps> = (props) => {
    const { currentTab, navigate, tabs } = props.settings
    const { theme } = useMuiTheme()
    const isMobile = useMediaQuery(theme.breakpoints.down("md"))

    const mobileStyle = isMobile ? { marginLeft: -5, marginRight: -5, paddingLeft: 5, paddingRight: 5, width: "100vw", overflowX: "auto" } : {}

    return (
        <Box
            sx={{
                flexDirection: { xs: "row", md: "column" },
                gap: { xs: 1, md: 0 },
                flex: { md: props.flex },
                ...mobileStyle,
            }}
        >
            {tabs.map((tab) => (
                <Button
                    sx={{
                        flexShrink: 0,
                        minWidth: "fit-content",
                        whiteSpace: "nowrap",
                    }}
                    key={tab.route}
                    onClick={() => navigate(tab.route)}
                    variant={currentTab.route === tab.route ? "contained" : "text"}
                >
                    {tab.label}
                </Button>
            ))}
        </Box>
    )
}
