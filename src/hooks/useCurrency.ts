import { useQuery } from "@tanstack/react-query"
import type { CurrencyRate } from "../types/server/api/exchangerate"
import { useUser } from "./useUser"

export const useCurrency = () => {
    const { authenticatedApi } = useUser()
    const { isFetching, data, refetch } = useQuery<CurrencyRate[]>({
        queryKey: ["currency"],
        queryFn: () => authenticatedApi.get<CurrencyRate[]>("/currency").then((res) => res.data),
        initialData: [],
    })

    return { isFetching, data, refetch }
}
