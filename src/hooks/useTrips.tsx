import { useQuery } from "@tanstack/react-query"
import type { Trip } from "../types/server/class/Trip/Trip"
import { useUser } from "./useUser"
import { TripList } from "../pages/Trips/TripList"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { TripFormPage } from "../pages/Trips/TripForm/TripFormPage"
import { Invitations } from "../pages/Account/Invitations/Invitations"

export type TripsPageRoute = "new-trip" | "ongoing-trips" | "completed-trips" | "invitations"

export interface TabSetting {
    label: string
    description: string
    route: TripsPageRoute
    component: React.ReactNode
    index?: boolean
    variant?: boolean
}

export const useTrips = () => {
    const navigate = (tab: TripsPageRoute) => {
        setCurrentTab(tabs.find((t) => t.route === tab) || tabs[0])
    }

    const reactNavigate = useNavigate()
    const { authenticatedApi } = useUser()

    const { isFetching, data, refetch } = useQuery<Trip[]>({
        queryKey: ["trips"],
        queryFn: () => authenticatedApi.get<Trip[]>("/user/trips").then((res) => res.data),
        initialData: [],
    })

    const completedTrips = data.filter((trip) => trip.status === "completed")
    const ongoingTrips = data.filter((trip) => trip.status !== "completed")

    const tabs: TabSetting[] = [
        {
            label: "Nova viagem",
            description: "Crie uma nova viagem para começar a planejar",
            route: "new-trip",
            component: <TripFormPage />,
            variant: true,
        },
        {
            label: "Viagens em andamento",
            description: "Visualize e gerencie suas viagens ativas",
            route: "ongoing-trips",
            component: <TripList trips={ongoingTrips} />,
            index: true,
        },
        {
            label: "Viagens concluídas",
            description: "Revise suas viagens passadas e seus detalhes",
            route: "completed-trips",
            component: <TripList trips={completedTrips} />,
        },
        {
            label: "Convites Pendentes",
            description: "Gerencie os convites que você recebeu para planos de viagens",
            route: "invitations",
            component: <Invitations />,
        },
    ]

    const [currentTab, setCurrentTab] = useState<TabSetting>(tabs[1])

    useEffect(() => {
        reactNavigate(`/my-trips/${currentTab.route}`)
    }, [currentTab])

    return { isFetching, data, refetch, tabs, currentTab, navigate }
}
