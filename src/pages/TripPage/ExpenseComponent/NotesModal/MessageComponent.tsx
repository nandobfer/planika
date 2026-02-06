import React from "react"
import { Avatar, Box, darken, Typography } from "@mui/material"
import { useMuiTheme } from "../../../../hooks/useMuiTheme"
import type { ExpenseComment } from "../../../../types/server/class/Trip/ExpenseNode"
import type { User } from "../../../../types/server/class/User"
import { formatChatDate } from "../../../../tools/chatDateFormat"
import { UserIdentifier } from "./UserIdentifier"
import { isURL } from "../../../../tools/isUrl"

interface MessageComponentProps {
    author?: User
    message: ExpenseComment
    same_as_previous?: boolean
    same_as_next?: boolean
    last_message?: boolean
    show_datetime?: boolean
    from_me?: boolean
}

const BORDER_RADIUS = 5

export const MessageComponent: React.FC<MessageComponentProps> = (props) => {
    const { mode, theme } = useMuiTheme()

    const colors = {
        sent: mode === "dark" ? theme.palette.primary.main : theme.palette.primary.main,
        received: mode === "dark" ? darken(theme.palette.primary.main, 0.7) : theme.palette.action.disabledBackground,
    }

    const isLink = isURL(props.message.content)

    const Datetime = () => (
        <Typography variant="caption" sx={{ color: "text.secondary", opacity: 0.8 }}>
            {formatChatDate(new Date(props.message.createdAt))}
        </Typography>
    )

    return (
        <Box
            sx={{ flexDirection: "column", paddingTop: props.same_as_previous ? 0.5 : 1, paddingBottom: props.last_message ? 1 : undefined }}
            id={props.message.createdAt.toString()}
        >
            <Box sx={{ alignSelf: props.from_me ? "flex-end" : "flex-start", alignItems: "center", gap: 1 }}>
                {!props.same_as_previous &&
                    (props.author ? (
                        <Box sx={{ alignItems: "center", gap: 1 }}>
                            <Avatar src={props.author.picture} sx={{ bgcolor: "primary.main", width: 30, aspectRatio: 1, height: "auto" }} />
                            <Box sx={{ flexDirection: "column" }}>
                                <Typography fontWeight={"bold"} variant="subtitle2">
                                    {props.author.name.split(" ")[0]}
                                </Typography>
                                <Datetime />
                            </Box>
                        </Box>
                    ) : (
                        <Typography>participante removido</Typography>
                    ))}
                {props.same_as_previous && props.show_datetime && <Datetime />}
            </Box>
            {/*//* MESSAGE CONTAINER */}
            <Box
                sx={{
                    position: "relative",
                    padding: 1,
                    flexDirection: "column",
                    alignSelf: props.from_me ? "flex-end" : "flex-start",
                    // textAlign: from_me ? "end" : "start",
                    bgcolor: props.from_me ? colors.sent : colors.received,
                    transition: "0.5s",
                    maxWidth: 0.8,
                    borderRadius: BORDER_RADIUS,

                    borderTopRightRadius: props.from_me && props.same_as_previous ? BORDER_RADIUS : undefined,
                    borderBottomRightRadius: props.from_me && props.same_as_next ? BORDER_RADIUS : undefined,

                    borderTopLeftRadius: !props.from_me && props.same_as_previous ? BORDER_RADIUS : undefined,
                    borderBottomLeftRadius: !props.from_me && props.same_as_next ? BORDER_RADIUS : undefined,
                }}
            >
                {props.message.isImage ? (
                    <img src={props.message.content} alt="image" style={{ maxWidth: "100%", borderRadius: BORDER_RADIUS }} />
                ) : (
                    <Typography
                        className={isLink ? "link" : undefined}
                        variant="subtitle2"
                        sx={{
                            color: isLink ? (mode === "dark" ? "inherit" : "success.main") : "text.secondary",
                            fontWeight: isLink ? "bold" : "normal",
                            whiteSpace: "pre-line",
                            wordBreak: "break-word",
                        }}
                        onClick={isLink ? () => window.open(props.message.content, "_new") : undefined}
                    >
                        {props.message.content}
                    </Typography>
                )}
            </Box>
        </Box>
    )
}
