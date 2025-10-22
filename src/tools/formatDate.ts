import dayjs from "dayjs";

export const formatDate = (timestamp: number | string) => dayjs(Number(timestamp)).format("DD/MM/YYYY - HH:mm")