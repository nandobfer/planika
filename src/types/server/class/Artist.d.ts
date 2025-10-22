import { Prisma } from "@prisma/client";
import { UploadedFile } from "express-fileupload";
export declare const artist_include: {
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
export type ArtistPrisma = Prisma.ArtistGetPayload<{
    include: typeof artist_include;
}>;
export interface ArtistForm {
    name: string;
    description?: string;
    image?: string;
    instagram?: string;
    birthdate?: string;
}
export declare class Artist {
    id: string;
    name: string;
    description: string | null;
    image: string | null;
    instagram: string | null;
    birthdate: string | null;
    events: number;
    bands: number;
    eventsWithoutBand: number;
    eventsAsBand: number;
    static new(data: ArtistForm): Promise<Artist>;
    static getAll(): Promise<any>;
    static findById(id: string): Promise<Artist | null>;
    constructor(data: ArtistPrisma);
    load(data: ArtistPrisma): void;
    update(data: Partial<ArtistForm>): Promise<void>;
    updateImage(file: UploadedFile): Promise<string>;
    getBands(): Promise<any>;
    getEvents(): Promise<any>;
    delete(): Promise<boolean>;
}
