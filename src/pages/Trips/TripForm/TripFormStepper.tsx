import React from "react"
import { Box, Button, Step, StepContent, StepLabel, Stepper, Typography, useMediaQuery } from "@mui/material"
import type { useTripForm } from "../../../hooks/useTripForm"

interface TripFormStepperProps {
    tripForm: ReturnType<typeof useTripForm>
}

const steps = [
    { label: "Informações Básicas", description: "Vamos começar preenchendo as informações básicas da viagem (nenhum campo é obrigatório)" },
    { label: "Participantes", description: "Você pode convidar outros colabadores ou visualizadores" },
    { label: "Despesas", description: "Pronto! Agora você pode começar a planejar as despesas da viagem!" },
]

export const TripFormStepper: React.FC<TripFormStepperProps> = (props) => {
    const isMobile = useMediaQuery((theme) => theme.breakpoints.down("md"))
    return (
        <Box sx={{ flexDirection: "column", width: 1, gap: 1 }}>
            <Stepper activeStep={props.tripForm.step} orientation={isMobile ? "vertical" : "horizontal"}>
                {steps.map((step, index) => (
                    <Step key={step.label}>
                        <StepLabel>{step.label}</StepLabel>
                        {isMobile && (
                            <StepContent>
                                <Typography>{step.description}</Typography>
                            </StepContent>
                        )}
                    </Step>
                ))}
            </Stepper>
            {!isMobile && <Typography sx={{marginLeft: 5}}>{steps[props.tripForm.step].description}</Typography>}
        </Box>
    )
}
