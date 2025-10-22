import React from "react"
import { Route, Routes } from "react-router-dom"
import { Bands } from "./pages/Bands/Bands"
import { NotFound } from "./pages/NotFound"
import { Home } from "./pages/Home/Home"

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
    { element: <Bands />, label: "Bandas", path: "/bandas", id: "band" },
    { element: <Bands />, label: "Artistas", path: "/artistas", id: "artist" },
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
