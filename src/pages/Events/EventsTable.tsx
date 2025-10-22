import React, { useEffect, useState } from "react"
import { Avatar, Badge, Box, Button, Chip, LinearProgress, Typography, useMediaQuery } from "@mui/material"
import { useFormModal } from "../../hooks/useFormModal"
import { useQuery } from "@tanstack/react-query"
import { api } from "../../backend/api"
import { DataGrid, GridActionsCellItem, type GridColDef } from "@mui/x-data-grid"
import type { Event } from "../../types/server/class/Event"
import { Toolbar } from "@mui/x-data-grid"
import { DataGridToolbar, toolbar_style } from "../../components/DataGridToolbar"
import { EventTableCell } from "./EventTableCell"
import { formatDate } from "../../tools/formatDate"
import { getWeekNumber } from "../../tools/getWeekNumber"
import { WeekNavigation } from "./WeekNavigation"
import { BrokenImage, ContentCopy, Delete, Edit, Groups, Link, LocationPin, Person, Reply } from "@mui/icons-material"
import { DescriptionText } from "../../components/DescriptionText"
import { PendingInfoChip } from "../../components/PendingInfoChip"
import { currencyMask } from "../../tools/numberMask"
import { useConfirmDialog } from "burgos-confirm"
import { useUser } from "../../hooks/useUser"
import { formatAddress } from "../../tools/formatAddress"

interface EventsTableProps {}

export const EventsTable: React.FC<EventsTableProps> = (props) => {
    const formContext = useFormModal()
    const { confirm } = useConfirmDialog()
    const { adminApi } = useUser()
    const isMobile = useMediaQuery("(orientation: portrait)")

    const [week, setWeek] = useState(getWeekNumber(new Date().getTime()))
    const [loading, setLoading] = useState(false)

    const { data, isFetching, refetch } = useQuery<Event[]>({
        initialData: [],
        queryKey: ["eventsData", week],
        queryFn: async () => (await api.get("/event", { params: { week } })).data,
    })

    const onDeletePress = async (event_id: string) => {
        confirm({
            title: "Tem certeza?",
            content: "Essa ação é irreversível",
            onConfirm: async () => {
                setLoading(true)
                try {
                    const response = await adminApi.delete("/event", { params: { event_id } })
                    refetch()
                } catch (error) {
                    console.log(error)
                } finally {
                    setLoading(false)
                }
            },
        })
    }

    const onEditPress = (event: Event) => {
        formContext.setEvent(event)
        formContext.open("event")
    }

    const onClonePress = async (id: string) => {
        setLoading(true)
        try {
            const response = await adminApi.post("/event/clone", null, { params: { event_id: id } })
            onEditPress(response.data)
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }

    const columns: (GridColDef & { field: keyof Event | "actions" })[] = [
        {
            field: "title",
            headerName: "Nome",
            flex: 1,
            display: "flex",
            renderCell(params) {
                return (
                    <EventTableCell
                        event={params.row}
                        loading={loading}
                        refetch={refetch}
                        setLoading={setLoading}
                        onDeletePress={onDeletePress}
                        onEditPress={onEditPress}
                        onClonePress={onClonePress}
                    />
                )
            },
            valueFormatter: (_, row: Event) =>
                row.title +
                "\n" +
                row.description +
                "\n" +
                formatDate(row.datetime) +
                "\n" +
                row.artists.map((item) => item.name).join("\n") +
                "\n" +
                row.bands.map((item) => item.name).join("\n") +
                "\n" +
                (row.price || "gratis") +
                "\n" +
                row.ticketUrl,
        },
    ]

    const desktopColumns: (GridColDef & { field: keyof Event | "actions" })[] = [
        {
            field: "image",
            width: 150,
            align: "center",
            headerName: "Foto",

            renderCell(params) {
                return (
                    <Avatar
                        src={params.value || undefined}
                        sx={{ width: 1, height: 75, bgcolor: "transparent", color: "primary.main" }}
                        variant="rounded"
                        slotProps={{ img: { style: { objectFit: "contain" } } }}
                    >
                        <BrokenImage sx={{ width: 1, height: 1 }} />
                    </Avatar>
                )
            },
            display: "flex",
        },
        {
            field: "datetime",
            headerName: "Data e Hora",
            valueFormatter: (value) => formatDate(value),
            flex: 0.13,
            display: "flex",
            renderCell(params) {
                return (
                    <Typography variant="subtitle2" sx={{ textWrap: "wrap" }}>
                        {formatDate(params.value).replace("-", "")}
                    </Typography>
                )
            },
        },
        {
            field: "title",
            headerName: "Título",
            flex: 0.2,
            display: "flex",
            renderCell(params) {
                return (
                    <Typography variant="subtitle2" sx={{ fontWeight: "bold", textWrap: "wrap" }}>
                        {params.value}
                    </Typography>
                )
            },
        },
        {
            field: "description",
            headerName: "Descrição",
            flex: 0.4,
            display: "flex",
            renderCell(params) {
                return <DescriptionText text={params.value} />
            },
        },
        {
            field: "location",
            headerName: "Local",
            flex: 0.3,
            display: "flex",
            renderCell(params) {
                const event = params.row as Event
                return event.location.street ? (
                    <Typography variant="caption" sx={{ textWrap: "wrap" }}>
                        {formatAddress(event.location)}
                    </Typography>
                ) : (
                    <PendingInfoChip icon={LocationPin} text="Local não cadastrado" />
                )
            },
        },
        {
            field: "ticketUrl",
            headerName: "Preço e ingresso",
            flex: 0.15,
            display: "flex",
            renderCell(params) {
                const event = params.row as Event

                return (
                    <Box sx={{ flexDirection: "column", alignItems: "center" }}>
                        <Typography variant="body1" color="success" sx={{ fontWeight: "bold" }}>
                            {event.price ? currencyMask(event.price) : "GRÁTIS"}
                        </Typography>
                        {event.ticketUrl ? (
                            <Button
                                size="small"
                                onClick={() => window.open(params.value!, "_new")}
                                sx={{ borderBottom: "1px solid", borderRadius: 0 }}
                                endIcon={<Reply sx={{ rotate: "180deg", transform: "scale(1, -1)" }} />}
                            >
                                Ingresso
                            </Button>
                        ) : (
                            <PendingInfoChip text="ingresso" icon={Link} />
                        )}
                    </Box>
                )
            },
        },
        {
            field: "bands",
            headerName: "Bandas",
            display: "flex",
            flex: 0.3,
            renderCell(params) {
                const event = params.row as Event
                return (
                    <Box sx={{ gap: 1, flexWrap: "wrap", maxWidth: 1, overflowY: "auto", height: 1, alignItems: "center", alignContent: "center" }}>
                        {event.bands.length === 0 ? (
                            <PendingInfoChip text="nenhuma banda" icon={Groups} />
                        ) : (
                            <Badge badgeContent={event.bands.length} color="primary" sx={{ marginRight: 1 }}>
                                <Groups />
                            </Badge>
                        )}
                        {event.bands.map((band) => (
                            <Chip size="small" label={band.name} key={band.id} color="primary" />
                        ))}
                    </Box>
                )
            },
        },
        {
            field: "artists",
            headerName: "Artistas",
            display: "flex",
            flex: 0.3,
            renderCell(params) {
                const event = params.row as Event
                return (
                    <Box sx={{ gap: 1, flexWrap: "wrap", maxWidth: 1, overflowY: "auto", height: 1, alignItems: "center", alignContent: "center" }}>
                        {event.artists.length === 0 ? (
                            <PendingInfoChip text="nenhum artista" icon={Person} />
                        ) : (
                            <Badge badgeContent={event.artists.length} color="primary" sx={{ marginRight: 1 }}>
                                <Person />
                            </Badge>
                        )}
                        {event.artists.map((artist) => (
                            <Chip size="small" label={artist.name} key={artist.id} color="primary" />
                        ))}
                    </Box>
                )
            },
        },
        {
            field: "actions",
            type: "actions",
            flex: 0.1,
            headerName: "Ações",
            getActions(params) {
                return [
                    // <GridActionsCellItem label="Visualizar" showInMenu onClick={() => onDeletePress(params.row.id)} disabled icon={<Visibility />} />,
                    <GridActionsCellItem label="Clonar" showInMenu onClick={() => onClonePress(params.row.id)} icon={<ContentCopy />} />,
                    <GridActionsCellItem label="Editar" showInMenu onClick={() => onEditPress(params.row)} icon={<Edit />} />,
                    <GridActionsCellItem label="Deletar" showInMenu onClick={() => onDeletePress(params.row.id)} icon={<Delete />} />,
                ]
            },
        },
    ]

    useEffect(() => {
        if (formContext.event) {
            return () => {
                refetch()
            }
        }
    }, [formContext.event])

    return (
        <Box
            sx={{
                flexDirection: "column",
                minHeight: 200,
                // height: data.length * 550 + 100,
            }}
        >
            <DataGrid
                loading={isFetching || loading}
                rows={data}
                columns={isMobile ? columns : desktopColumns}
                initialState={{
                    pagination: { paginationModel: { page: 0, pageSize: 100 } },
                    sorting: { sortModel: [{ field: isMobile ? "title" : "datetime", sort: "asc" }] },
                }}
                pageSizeOptions={[10, 20, 50]}
                sx={{ border: 0 }}
                rowHeight={isMobile ? 550 : 200}
                showToolbar
                hideFooterPagination
                rowSelection={!isMobile}
                // autoPageSize
                density="compact"
                slotProps={{ loadingOverlay: { sx: { height: 9999 } } }}
                slots={{
                    baseLinearProgress: () => <LinearProgress sx={{ marginTop: -5 }} />,
                    toolbar: () => (
                        <Toolbar style={toolbar_style}>
                            <DataGridToolbar
                                refresh={refetch}
                                loading={isFetching || loading}
                                title="Eventos"
                                add={() => formContext.open("event")}
                                left={isMobile ? undefined : <WeekNavigation selectedWeek={week} setSelectedWeek={setWeek} />}
                            />
                        </Toolbar>
                    ),
                    columnHeaders: isMobile
                        ? () => (
                              <Box sx={{ flexDirection: "column", marginBottom: -2 }}>
                                  <WeekNavigation selectedWeek={week} setSelectedWeek={setWeek} />
                              </Box>
                          )
                        : undefined,
                }}
            />
        </Box>
    )
}
