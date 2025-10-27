import React from "react"
import { Box, Divider, MenuItem, Typography } from "@mui/material"
import type { User } from "../types/server/class/User"
import { useUser } from "../hooks/useUser"
import { useNavigate } from "react-router-dom"

interface AccountMenuProps {
    user: User
    handleAccountMenuClose: () => void
}

const menuItems: { label: string; route: string }[] = [
    { label: "Viagens", route: "/my-trips" },
    { label: "Minha conta", route: "/account" },
]

export const AccountMenu: React.FC<AccountMenuProps> = (props) => {
    const { logout } = useUser()
    const navigate = useNavigate()

    const onClickMenuItem = (route: string) => {
        navigate(route)
        props.handleAccountMenuClose()
    }

    return (
        <>
            <Box sx={{ flexDirection: "column", padding: "0.5vw 16px" }}>
                <Typography variant="caption">{props.user.name}</Typography>
                <Typography variant="caption">{props.user.email}</Typography>
            </Box>
            <Box sx={{ flexDirection: "column", marginBottom: -1 }}>
                <Divider />
                {menuItems.map((item) => (
                    <MenuItem dense key={item.route} onClick={() => onClickMenuItem(item.route)}>
                        {item.label}
                    </MenuItem>
                ))}
                <MenuItem dense onClick={logout}>
                    Sair
                </MenuItem>
            </Box>
        </>
    )
}
