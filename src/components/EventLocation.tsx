import React, { useEffect, useState } from "react"
import { Box, IconButton, LinearProgress, Paper, Typography, useMediaQuery } from "@mui/material"
import type { Location } from "../types/server/class/Event"
import { Close } from "@mui/icons-material"
import { formatAddress } from "../tools/formatAddress"

interface EventLocationProps {
    location: Location
}

const key = "AIzaSyAMO4fcnbJMBY3zFBSj3XjLHHTv-abvKLc"

export const EventLocation: React.FC<EventLocationProps> = (props) => {
    const isMobile = useMediaQuery("(orientation: portrait)")
    const location = props.location
    const [loading, setLoading] = useState(true)

    const addressQuery = encodeURIComponent(`${location.street}, ${location.number}, ${location.district}, Curitiba - PR, ${location.cep}`)

    // Proper Google Maps embed URL that will actually show the address
    const mapUrl = `https://www.google.com/maps/embed/v1/place?key=${key}&q=${addressQuery}&zoom=15`

    // const mapUrl =
    //     "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3656.3637485805743!2d-46.6847374247874!3d-23.591284162691924!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94ce57450581cdb1%3A0xf327d87d58a240fd!2sAv.%20Pres.%20Juscelino%20Kubitschek%2C%201327%20-%20Vila%20Nova%20Concei%C3%A7%C3%A3o%2C%20S%C3%A3o%20Paulo%20-%20SP%2C%2004543-011!5e0!3m2!1spt-BR!2sbr!4v1738522248848!5m2!1spt-BR!2sbr"

    return (
        <Paper elevation={2} sx={{ flexDirection: "column", position: "relative", width: isMobile ? undefined : 600 }}>
            <Box sx={{ padding: 1, flexDirection: "column" }}>
                <Box sx={{ justifyContent: "space-between" }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: "bold" }} color="primary">
                        Endereço:
                    </Typography>
                    <IconButton sx={{ margin: -1 }} color="primary" size="small">
                        <Close fontSize="small" />
                    </IconButton>
                </Box>
                <Typography variant="subtitle2">{formatAddress(location)}</Typography>
            </Box>
            <iframe
                src={mapUrl}
                style={{ border: 0, width: "100%", borderRadius: 5, height: isMobile ? 300 : 400 }}
                loading="lazy"
                allowFullScreen
                onLoad={() => setLoading(false)}
                referrerPolicy="no-referrer-when-downgrade"
            />
            {loading && <LinearProgress variant="indeterminate" sx={{ width: 1, borderRadius: 5 }} />}
        </Paper>
    )
}
