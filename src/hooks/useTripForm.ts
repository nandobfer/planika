import { useFormik } from "formik"
import type { Trip, TripForm } from "../types/server/class/Trip/Trip"
import { useState } from "react"
import { useUser } from "./useUser"
import { EventBus } from "../tools/EventBus"
import type { ParticipantRole, TripParticipant, TripParticipantForm } from "../types/server/class/Trip/TripParticipant"
import { useNavigate } from "react-router-dom"
import { useConfirmDialog } from "burgos-confirm"

export const useTripForm = (initialTrip?: Trip) => {
    const [step, setStep] = useState(0)
    const [skipped, setSkipped] = useState(new Set<number>())
    const [currentTrip, setCurrentTrip] = useState<Trip | null>(initialTrip || null)
    const [participants, setParticipants] = useState<TripParticipant[]>(currentTrip?.participants || [])

    const navigate = useNavigate()
    const { confirm } = useConfirmDialog()
    const { user, authenticatedApi } = useUser()
    const isAdmin = participants.length > 0 ? participants.find((p) => p.userId === user?.id)?.role === "administrator" : true

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
                EventBus.emit("trip-updated")
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
            setCurrentTrip((current) => {
                if (!current) return current

                current.participants.push(newParticipant)
                return current
            })
        } catch (error) {
            console.log(error)
        } finally {
            EventBus.emit("trip-loading", false)
        }
    }

    const updateParticipantRole = async (participantId: string, role: ParticipantRole) => {
        EventBus.emit("trip-loading", true)
        const data: Partial<TripParticipantForm> = { role }
        try {
            const response = await authenticatedApi.patch<TripParticipant>("/trip/participant", data, { params: { participant_id: participantId } })
            setParticipants((prev) => prev.map((p) => (p.id === participantId ? response.data : p)))
            return response.data
        } catch (error) {
            console.error("Error updating participant role:", error)
        } finally {
            EventBus.emit("trip-loading", false)
        }
    }

    const deleteParticipant = async (participantId: string) => {
        confirm({
            title: "Remover participante",
            content: "Tem certeza que deseja remover esse participante da viagem?",
            async onConfirm() {
                EventBus.emit("trip-loading", true)
                try {
                    await authenticatedApi.delete(`/trip/participant`, { params: { participant_id: participantId } })
                    setParticipants((prev) => prev.filter((p) => p.id !== participantId))
                    setCurrentTrip((current) => {
                        if (!current) return current

                        current.participants = current.participants.filter((p) => p.id !== participantId)
                        return current
                    })
                } catch (error) {
                    console.log(error)
                } finally {
                    EventBus.emit("trip-loading", false)
                }
            },
        })
    }

    const deleteTrip = async () => {
        if (!currentTrip) return

        confirm({
            title: "Deletar viagem",
            content: "Tem certeza que deseja deletar essa viagem? Essa ação não pode ser desfeita.",
            async onConfirm() {
                EventBus.emit("trip-loading", true)
                try {
                    await authenticatedApi.delete(`/trip`, { params: { trip_id: currentTrip.id } })
                    setCurrentTrip(null)
                    navigate("/my-trips")
                } catch (error) {
                    console.log(error)
                } finally {
                    EventBus.emit("trip-loading", false)
                }
            },
        })
    }

    return {
        formik,
        step,
        setStep,
        handleNext,
        handleBack,
        isStepSkipped,
        participants,
        inviteParticipant,
        currentTrip,
        updateParticipantRole,
        isAdmin,
        deleteTrip,
        deleteParticipant,
    }
}
