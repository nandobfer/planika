import React, { useContext, useEffect, useRef, useState } from "react"
import { Box, Dialog, IconButton, TextField } from "@mui/material"
import TripContext from "../../../../contexts/TripContext"
import { AddPhotoAlternate, Close, Image, ImageSearch, Send } from "@mui/icons-material"
import { Title } from "../../../../components/Title"
import type { ExpenseComment, ExpenseNode } from "../../../../types/server/class/Trip/ExpenseNode"
import { NoComment } from "./NoComment"
import { Virtuoso, type VirtuosoHandle } from "react-virtuoso"
import { MessageComponent } from "./MessageComponent"
import { isURL } from "../../../../tools/isUrl"
import { useFilesDialogModal } from "../../../../hooks/useFilesDialogModal"

interface NotesModalProps {}

export const NotesModal: React.FC<NotesModalProps> = (props) => {
    const { notesModal, closeNotesModal, handleUpdateExpense, user, nodes, trip, canEdit, authenticatedApi } = useContext(TripContext)
    const expense = nodes.find((n) => n.id === notesModal?.id)?.data as ExpenseNode | undefined
    const notes = expense?.notes
    const virtuosoRef = useRef<VirtuosoHandle>(null)
    const filesDialogModal = useFilesDialogModal({
        request: async (formData) => uploadImage(formData),
    })

    const [inputText, setInputText] = useState("")

    const maxInputLength = isURL(inputText) ? Infinity : 100

    const newNote = (note: ExpenseComment) => {
        if (!expense || !user) return

        const updatedNotes: ExpenseComment[] = [...(expense.notes || []), note]

        handleUpdateExpense(expense.id, { notes: updatedNotes })
    }

    const onSubmit = (ev: React.FormEvent<HTMLFormElement>) => {
        ev.preventDefault()
        if (!inputText || inputText.length > maxInputLength) return

        newNote({
            authorId: user!.id,
            content: inputText,
            createdAt: Date.now(),
        })

        setInputText("")
    }

    const uploadImage = async (formData: FormData) => {
        const response = await authenticatedApi.post<string>("/trip/media", formData, { params: { trip_id: trip?.id } })
        console.log(response.data)
        newNote({
            authorId: user!.id,
            content: response.data,
            createdAt: Date.now(),
            isImage: true,
        })
    }

    const handlePaste = (event: ClipboardEvent) => {
        if (filesDialogModal.handlePaste(event)) {
            filesDialogModal.openModal()
        }
    }

    useEffect(() => {
        document.addEventListener("paste", handlePaste)

        return () => {
            document.removeEventListener("paste", handlePaste)
        }
    }, [handlePaste])

    return (
        <Dialog open={!!expense} onClose={closeNotesModal} maxWidth="sm" fullWidth>
            <Box sx={{ flexDirection: "column", gap: 2 }}>
                <Title
                    name="Comentários"
                    right={
                        <IconButton size="small" onClick={closeNotesModal}>
                            <Close fontSize="small" />
                        </IconButton>
                    }
                />
                <Box sx={{ flexDirection: "column", height: 300 }}>
                    {notes && notes.length > 0 ? (
                        <Virtuoso
                            ref={virtuosoRef}
                            style={
                                {
                                    // borderTopLeftRadius: isMobile ? "2vw" : "4px",
                                    // borderTopRightRadius: isMobile ? "2vw" : "4px",
                                    // border: mode ? `1px solid ${custom_colors.darkMode_border}` : `1px solid ${custom_colors.lightMode_border}`,
                                    // borderBottom: "none",
                                    // backgroundColor: darkMode ? custom_colors.darkMode_chatBackground : custom_colors.lightMode_chatBackground,
                                    // width: "100%",
                                }
                            }
                            data={notes.sort((a, b) => a.createdAt - b.createdAt)}
                            // components={{ Item: HeightPreservingItem }}
                            itemContent={(index, note) => {
                                const previous_message = notes[index - 1]
                                const next_message = notes[index + 1]
                                const author = trip?.participants.find((participant) => participant.userId === note.authorId)!.user
                                const is_first = !previous_message
                                const is_last = !next_message
                                // ! mostrando horário caso a diferença entre a mensagem e a anterior ultrapasse 5 minutos
                                const show_datetime = note.createdAt - (previous_message?.createdAt || 0) > 1000 * 60 * 5
                                return (
                                    <MessageComponent
                                        message={note}
                                        same_as_previous={previous_message?.authorId === note.authorId}
                                        same_as_next={next_message?.authorId === note.authorId}
                                        last_message={is_last}
                                        author={author}
                                        show_datetime={show_datetime}
                                        from_me={note.authorId === user?.id}
                                    />
                                )
                            }}
                            initialTopMostItemIndex={notes.length - 1}
                            followOutput={"smooth"}
                            // alignToBottom={true}
                        />
                    ) : (
                        <NoComment />
                    )}
                </Box>

                {canEdit && (
                    <form onSubmit={onSubmit}>
                        <TextField
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                            fullWidth
                            size="small"
                            variant="outlined"
                            placeholder="Adicionar um comentário"
                            error={inputText.length > maxInputLength}
                            helperText={inputText.length > maxInputLength ? `${inputText.length} / ${maxInputLength} caracteres.` : ""}
                            slotProps={{
                                input: {
                                    startAdornment: (
                                        <IconButton size="small" sx={{ marginLeft: -1 }} onClick={filesDialogModal.openModal}>
                                            <AddPhotoAlternate fontSize="small" />
                                        </IconButton>
                                    ),
                                    endAdornment: (
                                        <IconButton type="submit" size="small" disabled={!inputText || inputText.length > maxInputLength}>
                                            <Send fontSize="small" />
                                        </IconButton>
                                    ),
                                },
                            }}
                        />
                    </form>
                )}

                {filesDialogModal.Modal}
            </Box>
        </Dialog>
    )
}
