import React, { useEffect, useState } from "react"
import { AppBar, Avatar, Box, Button, Divider, IconButton, Menu, Toolbar, Typography, useMediaQuery } from "@mui/material"
import { useUser } from "../hooks/useUser"
import { AccountCircle, Menu as MenuIcon } from "@mui/icons-material"
import { AccountMenu } from "./AccountMenu"
import { LoginFormMenu } from "./LoginFormMenu"
import { useNavigate } from "react-router-dom"
import { ThemeModeSwitch } from "./ThemeModeSwitch"
import { useMuiTheme } from "../hooks/useMuiTheme"

interface HeaderProps {}

export const Header: React.FC<HeaderProps> = (props) => {
    const { user } = useUser()
    const navigate = useNavigate()
    const isMobile = useMediaQuery("(orientation: portrait)")
    const { mode } = useMuiTheme()

    const [accountMenuAnchor, setAccountMenuAnchor] = useState<null | HTMLElement>(null)

    const handleAccountMenuClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAccountMenuAnchor(event.currentTarget)
    }
    const handleAccountMenuClose = () => {
        setAccountMenuAnchor(null)
    }

    useEffect(() => {
        setAccountMenuAnchor(null)
    }, [user])

    return (
        <AppBar enableColorOnDark position="sticky" color={mode === "light" ? "primary" : "default"}>
            <Toolbar sx={{ justifyContent: "space-between" }}>
                <Box sx={{ gap: 0.5, alignItems: "center" }}>
                    <Button color="inherit" onClick={() => navigate("/")} sx={{ gap: 1 }}>
                        {/* <Avatar src="/logo.png" variant="square" sx={{ bgcolor: "transparent!important" }} /> */}
                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                            Planika
                        </Typography>
                    </Button>
                    {/* <Routes /> */}
                </Box>
                <Box sx={{ alignItems: "center", gap: 3 }}>
                    {user ? (
                        <Button
                            onClick={() => navigate("/my-trips")}
                            variant="contained"
                            size="small"
                            color={mode === "light" ? "secondary" : "primary"}
                        >
                            Minhas viagens
                        </Button>
                    ) : (
                        <Box sx={{ gap: 1 }}>
                            <Button
                                onClick={handleAccountMenuClick}
                                variant="contained"
                                size="small"
                                color={mode === "light" ? "secondary" : "primary"}
                            >
                                Entrar
                            </Button>
                            <Button
                                onClick={() => navigate("/signup")}
                                variant="contained"
                                size="small"
                                color={mode === "light" ? "secondary" : "secondary"}
                            >
                                Cadastre-se
                            </Button>
                        </Box>
                    )}
                    <IconButton onClick={handleAccountMenuClick}>
                        {user ? <Avatar src={user.picture || undefined} /> : <AccountCircle fontSize="large" sx={{}} />}
                    </IconButton>
                </Box>
            </Toolbar>
            <Menu
                anchorEl={accountMenuAnchor}
                open={!!accountMenuAnchor}
                onClose={handleAccountMenuClose}
                disableEscapeKeyDown
                slotProps={{
                    paper: {
                        sx: {
                            flexDirection: "column",
                            bgcolor: "background.default",
                            width: { xs: "80vw", md: "20vw" },
                            alignItems: "center",
                            gap: 1,
                        },
                    },
                }}
            >
                <Box sx={{ flexDirection: "column", gap: 1 }}>
                    {user ? (
                        <AccountMenu user={user} handleAccountMenuClose={handleAccountMenuClose} />
                    ) : (
                        <LoginFormMenu handleAccountMenuClose={handleAccountMenuClose} />
                    )}
                    <Divider />
                    <Box sx={{ justifyContent: "center", alignItems: "center" }}>
                        <ThemeModeSwitch />
                    </Box>
                </Box>
            </Menu>
            {/* <Popper open={!!accountMenuAnchor} anchorEl={accountMenuAnchor} placement="bottom-end">
                <ClickAwayListener onClickAway={handleAccountMenuClose}>
                    <Paper
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                        }}
                        elevation={8}
                    >
                        {user ? <AccountMenu user={user} /> : <LoginFormMenu />}
                    </Paper>
                </ClickAwayListener>
            </Popper> */}
        </AppBar>
    )
}
