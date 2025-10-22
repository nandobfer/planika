import React from 'react'
import { AppBar, Box, Paper, Typography, useMediaQuery } from "@mui/material"
import { version } from "../version"
import { useMuiTheme } from '../hooks/useMuiTheme';

interface FooterProps {}

const Link: React.FC<{ children: React.ReactNode; link: string }> = (props) => {
    const {mode} = useMuiTheme()

    return (
    <Typography
        color={mode === 'light' ? 'secondary' : "primary"}
        variant="inherit"
        component={"span"}
        className="link"
        style={{ fontWeight: "bold" }}
        onClick={() => window.open(props.link, "_new")}
    >
        {props.children}
    </Typography>
)
}

export const Footer: React.FC<FooterProps> = ({}) => {
    const isMobile = useMediaQuery("(orientation: portrait)")
    const {mode} = useMuiTheme()

    return (
        <AppBar
            enableColorOnDark
            color={mode === 'light' ? "primary" : "default"}
            position="relative"
            sx={{ flexDirection: "column", alignItems: "center", padding: 2, borderRadius: 0 }}
        >
            <Typography variant={"caption"}>
                Desenvolvido por <Link link="https://www.instagram.com/nandoburgos/">@nandoburgos</Link>
            </Typography>
            <Typography variant={"caption"}>
                {new Date().getFullYear()} © Direitos Reservados - {version}
            </Typography>
        </AppBar>
    )
}
