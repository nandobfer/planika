import { createContext } from "react"
import type { useExpenses } from "../hooks/useExpenses"

interface TripProviderProps {
    children: React.ReactNode
    expensesHook: ReturnType<typeof useExpenses>
}

const TripContext = createContext<ReturnType<typeof useExpenses>>({} as ReturnType<typeof useExpenses>)

export default TripContext

export const TripProvider: React.FC<TripProviderProps> = ({ children, expensesHook }) => {
    return <TripContext.Provider value={expensesHook}>{children}</TripContext.Provider>
}
