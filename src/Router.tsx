import React from "react"
import { Route, Routes } from "react-router-dom"
import { NotFound } from "./pages/NotFound"
import { Home } from "./pages/Home/Home"
import { Account } from "./pages/Account/Account"
import { Trips } from "./pages/Trips/Trips"
import { useUser } from "./hooks/useUser"
import { Signup } from "./pages/Signup"
import { GetStarted } from "./pages/GetStarted"
import { PasswordRecovery } from "./pages/PasswordRecovery/PasswordRecovery"
import { AcceptInvitePage } from "./pages/AcceptInvitePage"
import { TripPage } from "./pages/TripPage/TripPage"

export interface RouteItem {
    path: string
    index?: boolean
    element: React.ReactNode
    label: string
    id: string
}
interface RouterProps {}

export const routes: RouteItem[] = [
    { path: "/", index: true, element: <Home />, label: "Início", id: "home" },
    { path: "/signup", element: <Signup />, label: "Cadastro", id: "signup" },
    { path: "/get-started", element: <GetStarted />, label: "Começar", id: "get-started" },
    { path: "/recovery/*", element: <PasswordRecovery />, label: "Recuperação de conta", id: "recovery" },
    { path: "/accept-invite", element: <AcceptInvitePage />, label: "Aceitar convite", id: "accept-invite" },
]

export const authenticatedRoutes: RouteItem[] = [
    { path: "/account/*", element: <Account />, label: "Minha conta", id: "account" },
    { path: "/my-trips/*", element: <Trips />, label: "Minhas viagens", id: "trips" },
    { path: "/trips/:id/*", element: <TripPage />, label: "Viagem", id: "trip" },
]

export const Router: React.FC<RouterProps> = (props) => {
    const { user } = useUser()

    return (
        <Routes>
            {routes.map((route) => (
                <Route key={route.path} path={route.path} index={route.index} element={route.element} />
            ))}
            {user && authenticatedRoutes.map((route) => <Route key={route.path} path={route.path} index={route.index} element={route.element} />)}
            <Route path="*" element={<NotFound />} />
        </Routes>
    )
}
