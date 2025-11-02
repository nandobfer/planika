import React from "react"
import { Box, Divider, Typography } from "@mui/material"
import type { useReports } from "../../../hooks/useReports"
import { currencyMask } from "../../../tools/numberMask"

interface LocationReportProps {
    api: ReturnType<typeof useReports>
}

export const LocationReport: React.FC<LocationReportProps> = (props) => {
    const { api } = props

    return (
        <Box sx={{ flexDirection: "column", flex: 1 }}>
            {api.locations.map(([location, data]) => (
                <Box key={location} sx={{ marginBottom: 2, flexDirection: "column" }}>
                    <Typography variant="subtitle1">{location}</Typography>
                    <Box sx={{ flexDirection: "column", marginLeft: 2, marginTop: 1, gap: 1 }}>
                        {data.expenses.map((expense) => (
                            <Box
                                key={expense.id}
                                sx={{ justifyContent: "space-between", marginLeft: api.expenses.getAncestors(expense.id).length * 3 }}
                            >
                                <Typography variant="body2">{expense.description}</Typography>
                                <Typography variant="body2">{expense.expense && currencyMask(expense.totalExpenses)}</Typography>
                            </Box>
                        ))}
                        <Divider />
                        <Box sx={{ justifyContent: "space-between" }}>
                            <Typography>Subtotal</Typography>
                            <Typography variant="body2" sx={{ fontWeight: "bold", textAlign: "right" }}>
                                {currencyMask(data.total)}
                            </Typography>
                        </Box>
                    </Box>
                </Box>
            ))}

            <Divider sx={{ marginY: 2 }} />
            <Box sx={{ justifyContent: "space-between" }}>
                <Typography>Sem localização</Typography>
                <Typography variant="body2" sx={{ fontWeight: "bold", textAlign: "right" }}>
                    {currencyMask(api.expenses.trip!.totalExpenses - api.locationsTotal)}
                </Typography>
            </Box>
            <Divider sx={{ marginY: 2 }} />

            <Box sx={{ justifyContent: "space-between" }}>
                <Typography>Total</Typography>
                <Typography variant="body2" sx={{ fontWeight: "bold", textAlign: "right" }}>
                    {currencyMask(api.expenses.trip!.totalExpenses)}
                </Typography>
            </Box>
        </Box>
    )
}
