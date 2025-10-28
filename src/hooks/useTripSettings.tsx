import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { type Trip } from "../types/server/class/Trip/Trip"
import { BasicInfoForm } from "../pages/Trips/TripForm/BasicInfoForm"
import { useTripForm } from "./useTripForm"
import { ParticipantsForm } from "../pages/Trips/TripForm/ParticipantsForm"

export type TripSettingRoute = "info" | "participants" | "back"

export interface TripTabSetting {
    label: string
    description: string
    route: TripSettingRoute
    component: React.ReactNode
    index?: boolean
    variant?: boolean
}

export const useTripSettings = (_trip: Trip) => {
    const reactNavigate = useNavigate()

    const tripForm = useTripForm(_trip)
    const { currentTrip: trip } = tripForm

    const tabs: TripTabSetting[] = [
        {
            label: "Voltar",
            description: "voltar",
            variant: true,
            route: "back",
            component: <BasicInfoForm tripForm={tripForm} fromSettings />,
        },
        {
            label: "Informações",
            description: "Gerencie as informações básicas da viagem",
            route: "info",
            component: <BasicInfoForm tripForm={tripForm} fromSettings />,
            index: true,
        },
        {
            label: "Participantes",
            description: "Gerencie os participantes da viagem e suas funções",
            route: "participants",
            component: <ParticipantsForm tripForm={tripForm} fromSettings />,
        },
    ]

    const [currentTab, setCurrentTab] = useState<TripTabSetting>(tabs[1])

    const navigate = (tab: TripSettingRoute) => {
        setCurrentTab(tabs.find((t) => t.route === tab) || tabs[1])
    }

    useEffect(() => {
        if (trip) {
            reactNavigate(`/trips/${trip.id}/settings/${currentTab.route}`)
        } else {
            reactNavigate(`/my-trips`)
        }
    }, [currentTab])

    return { currentTab, navigate, tabs, trip: trip! }
}
