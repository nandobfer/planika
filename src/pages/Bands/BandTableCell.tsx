import React, { useState } from "react"
import { Avatar, Box, Chip, IconButton, Menu, Typography } from "@mui/material"
import type { Band } from "../../types/server/class/Band"
import { Delete, Edit, Groups, Instagram, MoreVert } from "@mui/icons-material"
import { GridActionsCellItem } from "@mui/x-data-grid"
import { PendingInfoChip } from "../../components/PendingInfoChip"
import { DescriptionText } from "../../components/DescriptionText"
import { NormalizedBarChart } from "../../components/NormalizedBarChart"

interface BandTableCellProps {
    band: Band
    loading: boolean
    higherEvents: number
    setLoading: React.Dispatch<React.SetStateAction<boolean>>
    refetch: () => void
    onDeletePress: (band_id: string) => void
    onEditPress: (band: Band) => void
}

export const BandTableCell: React.FC<BandTableCellProps> = (props) => {
    const [menuAnchor, setMenuAnchor] = useState<HTMLButtonElement | null>(null)

    const band = props.band
    const ig_base_url = "https://instagram.com/"
    const splitted_ig = band.instagram?.split(ig_base_url)
    let ig_user = ""

    if (splitted_ig && splitted_ig.length === 2) {
        ig_user = splitted_ig[1]
    }

    const closeMenu = () => {
        setMenuAnchor(null)
    }

    const onActionClick = (callback: () => void) => {
        callback()
        closeMenu()
    }

    return (
        <Box sx={{ flexDirection: "column", gap: 1, width: 1 }}>
            <Box sx={{ alignItems: "center", justifyContent: "space-between", marginBottom: -1 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: "bold" }}>
                    {band.name}
                </Typography>
                <IconButton size="small" onClick={(ev) => setMenuAnchor(ev.currentTarget)} sx={{ margin: 1, marginRight: 0 }}>
                    <MoreVert />
                </IconButton>
            </Box>
            <Avatar
                src={band.image || undefined}
                sx={{ width: 1, height: 150, bgcolor: "transparent", color: "primary.main" }}
                variant="rounded"
                slotProps={{ img: { style: { objectFit: "contain" } } }}
            >
                <Groups sx={{ width: 1, height: 1 }} />
            </Avatar>
            <Box sx={{ flexDirection: "column" }}>
                <DescriptionText text={band.description} />
                <Typography
                    variant="subtitle2"
                    color={ig_user ? "primary" : undefined}
                    sx={{ textDecoration: "underline", width: "min-content" }}
                    className="link"
                    onClick={() => (band.instagram ? window.open(band.instagram, "_new") : undefined)}
                >
                    {ig_user ? `@${ig_user}` : band.instagram || <PendingInfoChip text="instagram pendente" icon={Instagram} />}
                </Typography>
            </Box>
            <Box sx={{ gap: 1, overflowX: "auto", mx: -1, px: 1 }}>
                {band.artists.map((artist) => (
                    <Chip size="small" label={artist.name} key={artist.id} color="primary" />
                ))}
                {band.artists.length === 0 && <PendingInfoChip text="nenhum integrante selecionado" icon={Groups} />}
            </Box>

            <Box sx={{ flexDirection: "column", marginTop: 0 }}>
                <Typography variant="caption" sx={{ lineHeight: "0.5em" }}>
                    Eventos
                </Typography>
                <NormalizedBarChart max={props.higherEvents} value={band.events} color="primary" />
            </Box>

            <Menu open={!!menuAnchor} anchorEl={menuAnchor} onClose={closeMenu}>
                {/* <GridActionsCellItem label="Visualizar" showInMenu disabled icon={<Visibility />} /> */}
                <GridActionsCellItem label="Editar" showInMenu icon={<Edit />} onClick={() => onActionClick(() => props.onEditPress(band))} />
                <GridActionsCellItem label="Deletar" showInMenu icon={<Delete />} onClick={() => onActionClick(() => props.onDeletePress(band.id))} />
            </Menu>
        </Box>
    )
}
