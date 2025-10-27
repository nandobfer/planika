import { useEffect, useState } from "react"
import { EventBus } from "../tools/EventBus"
import { useQuery } from "@tanstack/react-query"
import type { Trip } from "../types/server/class/Trip/Trip"
import { api } from "../backend/api"
import { useUser } from "./useUser"

export const useTrip = (tripId: string) => {
    const [loading, setLoading] = useState(false)

    const { authenticatedApi } = useUser()
    const { data: trip } = useQuery({ queryKey: ["trip", tripId], queryFn: () => fetchTrip(), initialData: null })

    const handleTripsLoading = (value: boolean) => {
        setLoading(value)
    }

    const fetchTrip = async (): Promise<Trip | null> => {
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

    const acceptInvitation = async () => {
        setLoading(true)
        try {
            await authenticatedApi.get("/trip/participant/accept", { params: { trip_id: tripId } })
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        EventBus.on("trip-loading", handleTripsLoading)

        return () => {
            EventBus.off("trip-loading", handleTripsLoading)
        }
    }, [])

    return { trip, loading, acceptInvitation }
}
