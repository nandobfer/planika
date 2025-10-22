import React from 'react'
import {Box, Typography} from '@mui/material'
import { PendingInfoChip } from './PendingInfoChip'
import { Instagram } from '@mui/icons-material'

interface InstagramRenderProps {
    instagram_url?: string | null
}

export const InstagramRender:React.FC<InstagramRenderProps> = (props) => {
const ig_base_url = "https://instagram.com/"
        const splitted_ig = props.instagram_url?.split(ig_base_url)
        let ig_user = ""

        if (splitted_ig && splitted_ig.length === 2) {
            ig_user = splitted_ig[1]
        }

        return (
            <Typography
                variant="subtitle2"
                color={ig_user ? "primary" : undefined}
                sx={{ textDecoration: "underline", width: "min-content" }}
                className="link"
                onClick={() => (props.instagram_url ? window.open(props.instagram_url, "_new") : undefined)}
            >
                {ig_user ? `@${ig_user}` : props.instagram_url || <PendingInfoChip text="instagram pendente" icon={Instagram} />}
            </Typography>
        )
}

