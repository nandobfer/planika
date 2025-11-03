import { useState } from "react"
import type { useReports } from "./useReports"
import type { TripParticipant } from "../types/server/class/Trip/TripParticipant"
import { useUser } from "./useUser"
import { useSnackbar } from "burgos-snackbar"

export const useSendReportMail = (expensesApi: ReturnType<typeof useReports>) => {
    const [showingModal, setShowingModal] = useState(false)
    const [selectedParticipants, setSelectedParticipants] = useState<TripParticipant[]>([])
    const [sending, setSending] = useState(false)

    const { authenticatedApi } = useUser()
    const { snackbar } = useSnackbar()

    const sendReport = async () => {
        setSending(true)
        try {
            const result = await authenticatedApi.post(
                "/trip/report/email",
                { destinations: selectedParticipants.map((item) => item.user?.email) },
                { params: { trip_id: expensesApi.expenses.trip?.id } }
            )
            setShowingModal(false)
            setSelectedParticipants([])
            snackbar({ severity: "success", text: "Relatório enviado com sucesso" })
        } catch (error) {
            snackbar({ severity: "error", text: "Erro ao enviar o relatório" })
        } finally {
            setSending(false)
        }
    }

    const selectParticipant = (participant: TripParticipant) => {
        setSelectedParticipants((prev) => {
            if (prev.find((p) => p.id === participant.id)) {
                return prev.filter((p) => p.id !== participant.id)
            } else {
                return [...prev, participant]
            }
        })
    }

    const openModal = () => {
        setShowingModal(true)
    }

    const closeModal = () => {
        setShowingModal(false)
    }

    return {
        showingModal,
        openModal,
        closeModal,
        selectedParticipants,
        selectParticipant,
        sendReport,
        sending,
        ...expensesApi,
    }
}
