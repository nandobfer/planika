import React from "react"
import { lighten, Paper, Typography } from "@mui/material"
import type { useReports } from "../../../hooks/useReports"
import { Layer, Rectangle, ResponsiveContainer, Sankey, Tooltip, useChartWidth, XAxis, YAxis } from "recharts"
import { useMuiTheme } from "../../../hooks/useMuiTheme"
import { currencyMask } from "../../../tools/numberMask"

interface SankeyChartProps {
    api: ReturnType<typeof useReports>
}

export const SankeyChart: React.FC<SankeyChartProps> = (props) => {
    const { theme, mode } = useMuiTheme()
    const { api } = props

    const data = {
        nodes: [
            { name: "Total" }, // Source node at index 0
            ...api.locations.map(([location]) => ({ name: location })), // Location nodes starting at index 1
        ],
        links: api.locations.map(([, data], index) => ({
            source: 0, // All links come from the "Total" node
            target: 1 + index, // Target the location nodes (starting at index 1)
            value: data.total,
        })),
    }

    function MyCustomSankeyNode({ x, y, width, height, index, payload }: any) {
        const containerWidth = useChartWidth()
        if (containerWidth == null) {
            return <></>
        }
        const isOut = x + width + 6 > containerWidth
        return (
            <Layer key={`CustomNode${index}`}>
                <Rectangle x={x} y={y} width={width} height={height} fill={theme.palette.success.main} fillOpacity="0.7" />
                <text
                    textAnchor={isOut ? "end" : "start"}
                    x={isOut ? x - 6 : x + width + 6}
                    y={y + height / 2}
                    fontSize="14"
                    fill={theme.palette.text.primary}
                    // stroke="#333"
                >
                    {payload.name}
                </text>
                <text
                    textAnchor={isOut ? "end" : "start"}
                    x={isOut ? x - 6 : x + width + 6}
                    y={y + height / 2 + 13}
                    fontSize="12"
                    fill={theme.palette.text.secondary}
                    // stroke="#333"
                    strokeOpacity="0.5"
                >
                    {currencyMask(payload.value)}
                </text>
            </Layer>
        )
    }

    return (
        <ResponsiveContainer width="100%" height={200}>
            <Sankey
                data={data}
                node={MyCustomSankeyNode}
                nodePadding={50}
                margin={{
                    bottom: 30,
                }}
                link={{ stroke: mode === "light" ? theme.palette.primary.main : theme.palette.action.disabled, strokeOpacity: 0.8 }}
            >
                <Tooltip
                    content={({ payload }) => {
                        if (!payload || payload.length === 0) return null
                        const { name, value } = payload[0].payload
                        return (
                            <Paper elevation={5} style={{ flexDirection: "column", padding: 5 }}>
                                <Typography>{name}:</Typography>
                                <Typography>{currencyMask(value)}</Typography>
                            </Paper>
                        )
                    }}
                />
            </Sankey>
        </ResponsiveContainer>
    )
}
