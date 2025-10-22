export function getDateRangeFromWeekNumber(weekNumber: number): { monday: Date; sunday: Date } {
    // Reference point (Monday, January 5, 1970 - first Monday after Unix epoch)
    const firstMonday = new Date(Date.UTC(1970, 0, 6))

    // Calculate the Monday of the target week
    const monday = new Date(firstMonday)
    monday.setUTCDate(firstMonday.getUTCDate() + weekNumber * 7)
    monday.setUTCHours(0, 0, 0, 0)

    // Calculate the Sunday of the target week (6 days after Monday)
    const sunday = new Date(monday)
    sunday.setUTCDate(monday.getUTCDate() + 5)
    sunday.setUTCHours(23, 59, 59, 999) // End of day

    return { monday, sunday }
}
