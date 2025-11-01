type Days = 1 | 2 | 3 | 4 | 5 | 6 | 7

const weekdaysLong: Record<Days, string> = {
    1: "domingo",
    2: "segunda-feira",
    3: "terça-feira",
    4: "quarta-feira",
    5: "quinta-feira",
    6: "sexta-feira",
    7: "sábado",
}

export const formatChatDate = (date: Date, mode: "date-only" | "date-hours" = "date-hours"): string => {
    const formatted_time = date.toLocaleTimeString("pt-br", { hour: "2-digit", minute: "2-digit" })
    const now = new Date()
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const startOfMessageDay = new Date(date.getFullYear(), date.getMonth(), date.getDate())

    // Calculate full days difference
    const msPerDay = 1000 * 3600 * 24
    const diffInDays = (startOfDay.getTime() - startOfMessageDay.getTime()) / msPerDay

    if (diffInDays < 1) {
        return mode === "date-only" ? "Hoje" : formatted_time
    } else if (diffInDays < 2) {
        return `Ontem, ${formatted_time}`
    } else if (diffInDays < 7) {
        const weekDay = (date.getDay() + 1) as Days
        return `${weekdaysLong[weekDay]}, ${formatted_time}`
    } else {
        return `${date.getDate().toString().padStart(2, "0")}/${(date.getMonth() + 1).toString().padStart(2, "0")}/${date.getFullYear()}, ${formatted_time}`
    }
}
