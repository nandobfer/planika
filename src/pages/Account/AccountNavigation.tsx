import React from "react"
import { Box, Button } from "@mui/material"
import type { useAccountSettings } from "../../hooks/useAccountSettings"

interface AccountNavigationProps {
    settings: ReturnType<typeof useAccountSettings>
    flex: number
}

export const AccountNavigation: React.FC<AccountNavigationProps> = (props) => {
    const { currentTab, navigate, tabs } = props.settings

    return (
        <Box
            sx={{
                flexDirection: { xs: "row", md: "column" },
                gap: { xs: 1, md: undefined },
                flex: props.flex,
            }}
        >
            {tabs.map((tab) => (
                <Button
                    sx={{ flex: { xs: 1, md: 0 } }}
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
