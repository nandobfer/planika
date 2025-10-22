import React, { useEffect, useMemo, useState } from "react"
import { Box, LinearProgress, Typography, useMediaQuery } from "@mui/material"
import { useQuery } from "@tanstack/react-query"
import { api } from "../../backend/api"
import { getWeekNumber } from "../../tools/getWeekNumber"
import { WeekNavigation } from "./WeekNavigation"
import { EventDay, type WeekDay } from "./EventDay"
import { Swiper, SwiperSlide } from "swiper/react"
import { Navigation, Virtual } from "swiper/modules"
import type { Swiper as SwiperType } from "swiper"
import "swiper/swiper-bundle.css"
import { MoodBad } from "@mui/icons-material"
import type { Event as EventType } from "../../types/server/class/Event"

interface EventListProps {}

export const Events: React.FC<EventListProps> = (props) => {
    const isMobile = useMediaQuery("(orientation: portrait)")

    const [week, setWeek] = useState(getWeekNumber(new Date().getTime()))
    const [currentDayIndex, setCurrentDayIndex] = useState(new Date().getDay() === 0 ? 6 : new Date().getDay() - 1)
    const [swiper, setSwiper] = useState<SwiperType | null>(null)

    const { data, isFetching } = useQuery<EventType[]>({
        initialData: [],
        queryKey: ["eventsData", week],
        queryFn: async () => (await api.get("/event", { params: { week } })).data,
        refetchOnWindowFocus: false,
    })

    const weekEvents = useMemo(() => {
        const days: WeekDay[] = [
            { name: "Domingo", events: [] },
            { name: "Segunda-Feira", events: [] },
            { name: "Terça-Feira", events: [] },
            { name: "Quarta-Feira", events: [] },
            { name: "Quinta-Feira", events: [] },
            { name: "Sexta-Feira", events: [] },
            { name: "Sábado", events: [] },
        ]

        for (const event of data) {
            const dayIndex = new Date(Number(event.datetime)).getDay()
            days[dayIndex].events.push(event)
        }

        const sunday = days.shift()
        days.push(sunday!)

        return days
    }, [data])

    useEffect(() => {
        if (swiper) {
            swiper.slideTo(currentDayIndex)
        }
    }, [week, swiper])

    return (
        <Box sx={{ flexDirection: "column" }}>
            <WeekNavigation selectedWeek={week} setSelectedWeek={setWeek} />
            {isFetching ? (
                <LinearProgress variant="indeterminate" />
            ) : data.length > 0 ? (
                <Box sx={{ flex: 1, py: 2, mx: -2, height: 1 }}>
                    <Swiper
                        modules={[Navigation, Virtual]}
                        spaceBetween={16}
                        slidesPerView={isMobile ? 1.2 : 4.25}
                        centeredSlides
                        cssMode={isMobile}
                        initialSlide={currentDayIndex}
                        onSwiper={setSwiper}
                        onSlideChange={(swiper) => setCurrentDayIndex(swiper.activeIndex)}
                        style={{ height: "100%" }}
                    >
                        {weekEvents.map((day, index) => (
                            <SwiperSlide
                                key={index}
                                style={{
                                    height: "100%",
                                    width: "auto",
                                }}
                            >
                                <EventDay day={day} index={index} week={week} />
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </Box>
            ) : (
                <Box sx={{ flexDirection: "column", alignItems: "center" }}>
                    <Typography color="secondary" variant="subtitle2">
                        Nenhum forró essa semana
                    </Typography>
                    <MoodBad color="secondary" />
                </Box>
            )}
        </Box>
    )
}
