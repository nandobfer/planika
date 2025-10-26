import React from 'react'
import {Box} from '@mui/material'
import type { Trip } from '../../types/server/class/Trip/Trip'

interface TripListProps {
    trips: Trip[]
}

export const TripList:React.FC<TripListProps> = (props) => {
    
    return (
        <Box sx={{}}>
            {props.trips.map((trip) => (
                <Box key={trip.id}>
                    {trip.name}
                </Box>
            ))}
        </Box>
    )
}