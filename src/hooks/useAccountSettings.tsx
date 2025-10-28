import { useEffect, useState } from "react"
import { Security } from "../pages/Account/Security/Security"
import { Invitations } from "../pages/Account/Invitations/Invitations"
import { Collaborations } from "../pages/Account/Collaborations/Collaborations"
import { Preferences } from "../pages/Account/Preferences/Preferences"
import { Profile } from "../pages/Account/Profile/Profile"
import { History } from "../pages/Account/History/History"
import { useNavigate } from "react-router-dom"
import { EventBus } from "../tools/EventBus"

export type AccountRoute = "profile" | "security" | "preferences" | "history" | "collaborations" | "invitations"

export interface AccountSetting {
    label: string
    description: string
    route: AccountRoute
    component: React.ReactNode
    index?: boolean
}

const tabs: AccountSetting[] = [
    {
        label: "Perfil",
        description: "Gerencie suas informações pessoais e integração com conta Google",
        route: "profile",
        component: <Profile />,
        index: true,
    },
    { label: "Segurança", description: "Controle configurações de autenticação e segurança da conta", route: "security", component: <Security /> },
    {
        label: "Preferências",
        description: "Personalize moeda padrão, idioma, fuso horário e preferências de exibição",
        route: "preferences",
        component: <Preferences />,
    },
    {
        label: "Histórico",
        description: "Visualize sua atividade recente, alterações e linha do tempo de colaboração",
        route: "history",
        component: <History />,
    },
    {
        label: "Colaborações",
        description: "Gerencie orçamentos que você possui ou participa e visualize suas responsabilidades financeiras",
        route: "collaborations",
        component: <Collaborations />,
    },
    {
        label: "Convites",
        description: "Visualize e gerencie convites pendentes para colaborar em orçamentos",
        route: "invitations",
        component: <Invitations />,
    },
]

export const useAccountSettings = () => {
    const reactNavigate = useNavigate()

    const [currentTab, setCurrentTab] = useState<AccountSetting>(tabs[0])
    const [loading, setLoading] = useState(false)

    const navigate = (tab: AccountRoute) => {
        setCurrentTab(tabs.find((t) => t.route === tab) || tabs[0])
    }

    const handleAccountLoading = (value: boolean) => {
        setLoading(value)
    }

    useEffect(() => {
        reactNavigate(`/account/${currentTab.route}`)

        EventBus.on("account-loading", handleAccountLoading)

        return () => {
            EventBus.off("account-loading", handleAccountLoading)
        }
    }, [currentTab])

    return { currentTab, navigate, tabs, loading }
}
