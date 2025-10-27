import { useQuery } from "@tanstack/react-query"
import type { Trip } from "../types/server/class/Trip/Trip"
import { useUser } from "./useUser"
import { TripList } from "../pages/Trips/TripList"
import type { TripParticipant } from "../types/server/class/Trip/TripParticipant"
import { useEffect, useState } from "react"
import { EventBus } from "../tools/EventBus"
import { useNavigate } from "react-router-dom"
import { TripFormPage } from "../pages/Trips/TripForm/TripFormPage"
import { api } from "../backend/api"

export type TripsPageRoute = "new-trip" | "ongoing-trips" | "completed-trips"

export interface TabSetting {
    label: string
    description: string
    route: TripsPageRoute
    component: React.ReactNode
    index?: boolean
    variant?: boolean
}

export const useTrips = () => {
    const [loading, setLoading] = useState(false)

    const navigate = (tab: TripsPageRoute) => {
        setCurrentTab(tabs.find((t) => t.route === tab) || tabs[0])
    }

    const reactNavigate = useNavigate()
    const { authenticatedApi, user, accessToken } = useUser()

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
    ]

    const [currentTab, setCurrentTab] = useState<TabSetting>(tabs[1])

    const handleTripsLoading = (value: boolean) => {
        setLoading(value)
    }

    const getTrip = async (tripId: string): Promise<Trip | null> => {
        setLoading(true)
        try {
            const response = await api.get<Trip>("/trip", { params: { trip_id: tripId } })
            return response.data
        } catch (error) {
            console.log(error)
            return null
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        reactNavigate(`/my-trips/${currentTab.route}`)

        EventBus.on("trip-loading", handleTripsLoading)

        return () => {
            EventBus.off("trip-loading", handleTripsLoading)
        }
    }, [currentTab])

    return { isFetching, data, refetch, tabs, currentTab, navigate, loading, getTrip }
}
