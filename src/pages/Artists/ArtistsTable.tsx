import React, { useEffect, useState } from "react"
import { Box, Chip, LinearProgress, Tooltip, Typography, useMediaQuery } from "@mui/material"
import { useQuery } from "@tanstack/react-query"
import { api } from "../../backend/api"
import { DataGrid, Toolbar, type GridColDef } from "@mui/x-data-grid"
import { CellAvatar } from "../../components/CellAvatar"
import { DataGridToolbar, toolbar_style } from "../../components/DataGridToolbar"
import { useFormModal } from "../../hooks/useFormModal"
import { GridActionsCellItem } from "@mui/x-data-grid"
import { useUser } from "../../hooks/useUser"
import { useConfirmDialog } from "burgos-confirm"
import { Delete, Edit, Groups } from "@mui/icons-material"
import { DescriptionText } from "../../components/DescriptionText"
import type { Artist } from "../../types/server/class/Artist"
import { InstagramRender } from "../../components/InstagramRender"
import { ArtistEventsCharts } from "./ArtistEventsCharts"

interface ArtistsTableProps {}

export const ArtistsTable: React.FC<ArtistsTableProps> = (props) => {
    const isMobile = useMediaQuery("(orientation: portrait)")
    const formContext = useFormModal()
    const { adminApi } = useUser()
    const { confirm } = useConfirmDialog()

    const [loading, setLoading] = useState(false)

    const { data, isFetching, refetch } = useQuery<Artist[]>({
        initialData: [],
        queryKey: ["artistsData"],
        queryFn: async () => (await api.get("/artist")).data,
    })

    const actionColumn: GridColDef & { field: "actions" } = {
        field: "actions",
        type: "actions",
        flex: 0.1,
        headerName: "Ações",
        getActions(params) {
            return [
                // <GridActionsCellItem label="Visualizar" showInMenu onClick={() => onDeletePress(params.row.id)} disabled icon={<Visibility />} />,
                <GridActionsCellItem label="Editar" showInMenu onClick={() => onEditPress(params.row)} icon={<Edit />} />,
                <GridActionsCellItem label="Deletar" showInMenu onClick={() => onDeletePress(params.row.id)} icon={<Delete />} />,
            ]
        },
    }

    const imageColumn: GridColDef & { field: keyof Artist } = {
        field: "image",
        width: 80,
        align: "center",
        headerName: "Foto",

        renderCell(params) {
            return <CellAvatar source={params.value} />
        },
        display: "flex",
    }

    const columns: (GridColDef & { field: keyof Artist | "actions" })[] = isMobile
        ? [
              imageColumn,
              {
                  field: "events",
                  headerName: "Nome",
                  flex: 1,
                  display: "flex",
                  valueFormatter: (_, row: Artist) => row.name + "\n" + row.description + "\n" + row.instagram,
                  renderCell(params) {
                      const artist = params.row as Artist

                      return (
                          <Box sx={{ flexDirection: "column", gap: 1, alignItems: "flex-start", width: 1 }}>
                              <Box sx={{ alignItems: "center", gap: 1 }}>
                                  {artist.bands > 0 && (
                                      <Tooltip
                                          title={
                                              <Typography>
                                                  {" "}
                                                  integrante de{" "}
                                                  <Typography color="primary" component={"span"} sx={{ fontWeight: "bold" }}>
                                                      {artist.bands}
                                                  </Typography>{" "}
                                                  banda
                                                  {artist.bands > 1 ? "s" : ""}{" "}
                                              </Typography>
                                          }
                                      >
                                          <Chip icon={<Groups />} label={`${artist.bands}`} size="small" color="primary" />
                                      </Tooltip>
                                  )}
                                  <Typography variant="subtitle2">{artist.name}</Typography>
                              </Box>
                              <DescriptionText text={artist.description} />
                              <InstagramRender instagram_url={artist.instagram} />
                              <ArtistEventsCharts artist={artist} artists={data} />
                          </Box>
                      )
                  },
              },
              actionColumn,
          ]
        : [
              imageColumn,
              { field: "name", headerName: "Nome", flex: 0.1 },
              {
                  field: "description",
                  headerName: "Descrição",
                  flex: 0.25,
                  display: "flex",
                  renderCell(params) {
                      return <DescriptionText text={params.value} />
                  },
              },
              {
                  field: "instagram",
                  headerName: "Instagram",
                  flex: 0.15,
                  display: "flex",
                  renderCell(params) {
                      return <InstagramRender instagram_url={params.value} />
                  },
              },
              {
                  field: "bands",
                  headerName: "Bandas",
                  display: "flex",
                  flex: 0.05,
                  align: "center",
                  headerAlign: "center",
                  renderCell(params) {
                      return <Chip label={params.value} color={params.value ? "primary" : undefined} />
                  },
              },
              {
                  field: "events",
                  headerName: "Eventos",
                  display: "flex",
                  flex: 0.15,
                  renderCell(params) {
                      return <ArtistEventsCharts artist={params.row} artists={data} />
                  },
              },

              actionColumn,
          ]

    const onDeletePress = async (artist_id: string) => {
        confirm({
            title: "Tem certeza?",
            content: "Essa ação é irreversível",
            onConfirm: async () => {
                setLoading(true)
                try {
                    const response = await adminApi.delete("/artist", { params: { artist_id } })
                    refetch()
                } catch (error) {
                    console.log(error)
                } finally {
                    setLoading(false)
                }
            },
        })
    }

    const onEditPress = (artist: Artist) => {
        formContext.setArtist(artist)
        formContext.open("artist")
    }

    useEffect(() => {
        if (formContext.artist) {
            return () => {
                refetch()
            }
        }
    }, [formContext.artist])

    return (
        <Box sx={{ flexDirection: "column" }}>
            <DataGrid
                loading={isFetching || loading}
                rows={data}
                columns={columns}
                initialState={{
                    pagination: { paginationModel: { page: 0, pageSize: 100 } },
                    sorting: { sortModel: [{ field: "events", sort: "desc" }] },
                }}
                pageSizeOptions={[10, 20, 50]}
                sx={{ border: 0 }}
                rowHeight={isMobile ? 400 : 175}
                showToolbar
                hideFooterPagination
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
                                title="Artistas"
                                add={() => formContext.open("artist")}
                            />
                        </Toolbar>
                    ),
                }}
            />
        </Box>
    )
}
