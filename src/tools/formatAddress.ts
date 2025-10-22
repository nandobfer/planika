import type { Location } from "../types/server/class/Event"

export const formatAddress = (location: Location) => {
    return `${location.street}, ${location.number}${location.complement ? `, ${location.complement}` : ""}. ${location.district}. ${location.cep}`
}
