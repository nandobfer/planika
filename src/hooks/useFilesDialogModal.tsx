import { useCallback, useState } from "react"
import { FilesDialogModal } from "../components/FilesDialogModal"
import { useFileDialog } from "@mantine/hooks"

export interface FileDialogInterface<T> {
    request: (formData: FormData) => Promise<T>
    accept?: string
}

export function useFilesDialogModal<T>(options: FileDialogInterface<T>) {
    const accept = options.accept || "image/*"

    const [isOpen, setIsOpen] = useState(false)
    const [loading, setLoading] = useState(false)

    const handleClose = () => {
        setIsOpen(false)
    }

    const openModal = () => setIsOpen(true)

    const handleImageChange = async (files: FileList | null | File[]) => {
        if (files) {
            setLoading(true)
            try {
                const formData = new FormData()
                formData.append("image", files[0])
                const response = await options.request(formData)
                return response
            } catch (error) {
                console.log(error)
            } finally {
                handleClose()
                setLoading(false)
                fileDialog.reset()
            }
        }
    }
    const fileDialog = useFileDialog({ accept, multiple: false, onChange: handleImageChange })
    const chooseFile = fileDialog.open

    const handlePaste = useCallback(
        (event: ClipboardEvent) => {
            const items = event.clipboardData?.items
            if (items) {
                const files = Array.from(items)
                    .filter((item) => item.type.indexOf("image") >= 0)
                    .map((item) => item.getAsFile())
                    .filter((file): file is File => file !== null)

                if (files.length > 0) {
                    const originalFile = files[0]

                    const renamedFile = new File([originalFile], `${Date.now()}_${originalFile.name}`, {
                        type: originalFile.type,
                    })

                    handleImageChange([renamedFile])
                }
            }
        },
        [handleImageChange]
    )

    const Modal = <FilesDialogModal loading={loading} handleClose={handleClose} chooseFile={chooseFile} isOpen={isOpen} handlePaste={handlePaste} />

    return { Modal, handleClose, isOpen, loading, openModal, chooseFile, handlePaste }
}
