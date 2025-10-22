import React from "react"
import { Route, Routes } from "react-router-dom"
import { NotFound } from "./pages/NotFound"
import { Home } from "./pages/Home/Home"
import { Account } from "./pages/Account/Account"
import { Trips } from "./pages/Trips/Trips"

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
    { path: "/account", element: <Account />, label: "Minha conta", id: "account" },
    { path: "/trips", element: <Trips />, label: "Minhas viagens", id: "trips" },
]

export const Router: React.FC<RouterProps> = (props) => {
    return (
        <Routes>
            {routes.map((route) => (
                <Route key={route.path} path={route.path} index={route.index} element={route.element} />
            ))}
            <Route path="*" element={<NotFound />} />
        </Routes>
    )
}
