import React from "react"
import { SpeedDial, SpeedDialAction, SpeedDialIcon } from "@mui/material"
import { useUser } from "../hooks/useUser"
import { Edit, EditOff, Event as EventIcon, Groups, Home, Person } from "@mui/icons-material"
import { useNavigate } from "react-router-dom"
import type { MuiIcon } from "../types/MuiIcon"
import { useDisclosure } from "@mantine/hooks"
import { ArtistFormModal } from "../pages/Artists/ArtistFormModal"
import { BandFormModal } from "../pages/Bands/BandFormModal"
import { EventFormModal } from "../pages/Events/EventFormModal"

interface AdminDialProps {}

export type AdminTarget = "event" | "band" | "artist" | ""
export interface AdminActionItem {
    label: string
    target: AdminTarget
    icon: MuiIcon
}

const actions: AdminActionItem[] = [
    { label: "Evento", target: "event", icon: EventIcon },
    { label: "Banda", target: "band", icon: Groups },
    { label: "Artista", target: "artist", icon: Person },
    { label: "Início", target: "", icon: Home },
]

export const AdminDial: React.FC<AdminDialProps> = (props) => {
    const { user } = useUser()
    const navigate = useNavigate()

    const [editOpened, editHandlers] = useDisclosure(false)

    const handleEditClick = (target: AdminTarget) => {
        // const route = target ? adminRoutes.find((item) => item.id === target) : { path: "/" }
        // if (route) {
        //     navigate(route.path)
        //     editHandlers.close()
        // }
    }

    return (
        <>
            {/* <SpeedDial
                open={createOpened}
                onClose={createHandlers.close}
                onOpen={createHandlers.open}
                hidden={!user?.admin}
                ariaLabel="admin create actions"
                sx={{ position: "fixed", bottom: 16, right: 16 }}
                icon={<SpeedDialIcon />}
            >
                {actions.map((action) => (
                    <SpeedDialAction
                        key={action.label}
                        icon={<action.icon />}
                        slotProps={{ tooltip: { title: action.label, arrow: true } }}
                        onClick={() => handleCreateClick(action.target)}
                    />
                ))}
            </SpeedDial> */}
            <SpeedDial
                open={editOpened}
                onClose={editHandlers.close}
                onOpen={editHandlers.open}
                hidden={!user?.admin}
                ariaLabel="admin create actions"
                sx={{ position: "fixed", bottom: 16, right: 16 }}
                icon={<SpeedDialIcon icon={<Edit />} openIcon={<EditOff sx={{ rotate: "90deg" }} />} />}
            >
                {actions.map((action) => (
                    <SpeedDialAction
                        key={action.label}
                        icon={<action.icon color="primary" />}
                        slotProps={{ tooltip: { title: action.label, arrow: true } }}
                        onClick={() => handleEditClick(action.target)}
                    />
                ))}
            </SpeedDial>

            <ArtistFormModal />
            <BandFormModal />
            <EventFormModal />
        </>
    )
}
