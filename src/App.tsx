import { BrowserRouter } from "react-router-dom"
import "./App.css"
import { Providers } from "./Providers"
import { Router } from "./Router"
import * as yup from "yup"

yup.setLocale({
    mixed: {
        required: "campo obrigatório",
    },
    string: {
        email: "e-mail inválido",
    },
})

function App() {
    return (
        <BrowserRouter>
            <Providers>
                <Router />
            </Providers>
        </BrowserRouter>
    )
}

export default App
