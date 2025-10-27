import { useFormik } from "formik"
import type { Trip, TripForm } from "../types/server/class/Trip/Trip"
import { useState } from "react"
import { useUser } from "./useUser"
import { EventBus } from "../tools/EventBus"
import type { TripParticipant, TripParticipantForm } from "../types/server/class/Trip/TripParticipant"

export const useTripForm = () => {
    const [step, setStep] = useState(0)
    const [skipped, setSkipped] = useState(new Set<number>())
    const [currentTrip, setCurrentTrip] = useState<Trip | null>(null)
    const [participants, setParticipants] = useState<TripParticipant[]>([])

    const { user, authenticatedApi } = useUser()

    const formik = useFormik<TripForm>({
        initialValues: {
            name: currentTrip?.name || `Viagem de ${user?.name}`,
            description: currentTrip?.description || "",
            startDate: currentTrip?.startDate || undefined,
            endDate: currentTrip?.endDate || undefined,
        },
        async onSubmit(values, formikHelpers) {
            EventBus.emit("trip-loading", true)
            try {
                const response = await (currentTrip
                    ? authenticatedApi.patch<Trip>(`/trip`, values, { params: { trip_id: currentTrip.id } })
                    : authenticatedApi.post<Trip>("/user/trips", values))

                const trip = response.data
                setCurrentTrip(trip)
                setParticipants(trip.participants)
                handleNext()
            } catch (error) {
                console.log(error)
            } finally {
                EventBus.emit("trip-loading", false)
            }
        },
        enableReinitialize: true,
    })

    const isStepSkipped = (step: number) => {
        return skipped.has(step)
    }

    const handleNext = () => {
        let newSkipped = skipped
        if (isStepSkipped(step)) {
            newSkipped = new Set(newSkipped.values())
            newSkipped.delete(step)
        }

        setStep((prevStep) => prevStep + 1)
        setSkipped(newSkipped)
    }

    const handleBack = () => {
        setStep((prevStep) => prevStep - 1)
    }

    const inviteParticipant = async (data: TripParticipantForm) => {
        EventBus.emit("trip-loading", true)
        try {
            if (!currentTrip) return

            const response = await authenticatedApi.post<TripParticipant>(`/trip/participant`, data, {
                params: { trip_id: currentTrip.id },
            })

            const newParticipant = response.data
            setParticipants((prev) => [...prev, newParticipant])
        } catch (error) {
            console.log(error)
        } finally {
            EventBus.emit("trip-loading", false)
        }
    }

    return { formik, step, setStep, handleNext, handleBack, isStepSkipped, participants, inviteParticipant, currentTrip }
}
