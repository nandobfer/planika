import React, { useState, useMemo } from 'react'
import {Box, Typography, Button, Collapse, Paper, IconButton, Chip} from '@mui/material'
import { FilterList, Close, ExpandMore, ExpandLess } from '@mui/icons-material'
import type { useExpenses } from '../../../hooks/useExpenses'
import { StatusFilter } from './StatusFilter'
import { ParticipantFilter } from './ParticipantFilter'
import { LocationFilter } from './LocationFilter'
import { DatetimeFilter } from './DatetimeFilter'

interface FiltersProps {
    api: ReturnType<typeof useExpenses>
}

export const Filters: React.FC<FiltersProps> = (props) => {
    const [isOpen, setIsOpen] = useState(false)
    const filters = props.api.activeFilters
    
    // Count total active filter values
    const activeFilterCount = useMemo(() => {
        let count = 0
        filters.forEach((values) => {
            count += values.size
        })
        return count
    }, [filters])

    const handleClearAll = () => {
        props.api.clearAllFilters()
    }

    const toggleOpen = () => {
        setIsOpen(!isOpen)
    }
    
    return (
        <Paper 
            elevation={3}
            sx={{
                position: 'absolute', 
                top: 16, 
                left: 16, 
                zIndex: 10, 
                width: {xs: 200, md: 300},
                transition: 'width 0.3s ease-in-out',
                overflow: 'hidden',
                borderRadius: 2,
                flexDirection: 'column'
            }}
        >
            {/* Header Button */}
            <Box 
                sx={{
                    padding: 1,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 1,
                    '&:hover': {
                        backgroundColor: 'action.hover'
                    },
                    transition: 'background-color 0.2s ease',
                }}
                onClick={toggleOpen}
            >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <FilterList fontSize='small' />
                    <Typography variant="caption" sx={{ fontWeight: 500 }}>
                        {activeFilterCount === 0 ? 'Aplicar Filtros' : `${activeFilterCount} Filtro${activeFilterCount > 1 ? 's' : ''}`}
                    </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    {activeFilterCount > 0 && (
                        <Chip 
                            label={activeFilterCount} 
                            size="small" 
                            color="primary"
                            sx={{ 
                                height: 24,
                                minWidth: 24,
                                '& .MuiChip-label': {
                                    px: 0.75
                                }
                            }}
                        />
                    )}
                    <IconButton size="small" >
                        {isOpen ? <ExpandLess fontSize='small' /> : <ExpandMore fontSize='small' />}
                    </IconButton>
                </Box>
            </Box>

            {/* Expandable Filters */}
            <Collapse in={isOpen} timeout={300}>
                <Box sx={{
                    flexDirection: 'column', 
                    padding: 2,
                    paddingTop: 1,
                    gap: 2,
                    borderTop: '1px solid',
                    borderColor: 'divider'
                }}>
                    <StatusFilter api={props.api} />
                    <ParticipantFilter api={props.api} />
                    <LocationFilter api={props.api} />
                    <DatetimeFilter api={props.api} />
                    
                    {/* Clear All Button */}
                    {activeFilterCount > 0 && (
                        <Button
                            fullWidth
                            variant="outlined"
                            color="error"
                            size="small"
                            startIcon={<Close />}
                            onClick={handleClearAll}
                            sx={{
                                marginTop: 1,
                                transition: 'all 0.2s ease'
                            }}
                        >
                            Limpar Todos
                        </Button>
                    )}
                </Box>
            </Collapse>
        </Paper>
    )
}