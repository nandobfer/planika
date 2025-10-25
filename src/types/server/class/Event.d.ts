import { Prisma } from "@prisma/client";
import { Band } from "./Band";
import { Artist } from "./Artist";
import { UploadedFile } from "express-fileupload";
import { WithoutFunctions } from "./helpers";
export declare const event_include: {
    bands: {
        include: {
            artists: {
                include: {
                    _count: {
                        select: {
                            events: true;
                            bands: true;
                        };
                    };
                    bands: {
                        include: {
                            _count: {
                                select: {
                                    events: true;
                                };
                            };
                        };
                    };
                };
            };
            _count: {
                select: {
                    events: true;
                };
            };
        };
    };
    artists: {
        include: {
            _count: {
                select: {
                    events: true;
                    bands: true;
                };
            };
            bands: {
                include: {
                    _count: {
                        select: {
                            events: true;
                        };
                    };
                };
            };
        };
    };
};
export type EventPrisma = Prisma.EventGetPayload<{
    include: typeof event_include;
}>;
export type EventForm = Omit<WithoutFunctions<Event>, "id" | "image"> & {
    image?: string;
};
export interface Location {
    street: string;
    district: string;
    number: string;
    cep: string;
    complement: string;
}
export declare class Event {
    id: string;
    title: string;
    description: string;
    datetime: string;
    price: number;
    location: Location;
    week: number;
    bands: Band[];
    artists: Artist[];
    image: string | null;
    ticketUrl: string | null;
    static getWeek(week: number | string): Promise<any>;
    static getCurrentWeek(): Promise<any>;
    static getAll(): Promise<any>;
    static findById(id: string): Promise<Event | null>;
    static clone(originalEvent: Event): Promise<Event>;
    static new(data: EventForm): Promise<Event>;
    constructor(data: EventPrisma);
    load(data: EventPrisma): void;
    update(data: Partial<EventForm>): Promise<void>;
    updateImage(file: UploadedFile): Promise<string>;
    delete(): Promise<boolean>;
}
