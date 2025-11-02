import React from 'react'
import {Box, Paper, Typography} from '@mui/material'
import type { useReports } from '../../../hooks/useReports'
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { useMuiTheme } from '../../../hooks/useMuiTheme';
import dayjs from 'dayjs';
import { currencyMask } from '../../../tools/numberMask';

interface DatetimeChartProps {
    api: ReturnType<typeof useReports>
}

export const DatetimeChart:React.FC<DatetimeChartProps> = (props) => {
    const {theme} = useMuiTheme()
    const {api} = props

    const data = api.datetimes.map(([key, value]) => ({
        date: dayjs(key).format('DD/MM/YYYY'),
        totalExpenses: value.total
    }))

    return (
            <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={data}>
                <XAxis dataKey={"date"} />
                <YAxis />
                <Tooltip
                    content={({ payload }) => {
                        if (!payload || payload.length === 0) return null
                        const { date, totalExpenses } = payload[0].payload
                        return (
                            <Paper elevation={5} style={{ flexDirection: "column", padding: 5 }}>
                                <Typography>
                                    Despesa em {date}:
                                </Typography>
                                <Typography>
                                    {currencyMask(totalExpenses)}
                                </Typography>
                            </Paper>
                        )
                    }}
                />
                {/* <Legend /> */}
                <CartesianGrid strokeDasharray="3 3" />

                <Area dataKey={'totalExpenses'} fill={theme.palette.primary.main} type="monotone" />
            </AreaChart>
        </ResponsiveContainer>
    )
}