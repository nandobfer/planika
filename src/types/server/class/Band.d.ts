import { Prisma } from "@prisma/client";
import { Artist } from "./Artist";
import { UploadedFile } from "express-fileupload";
export declare const band_include: {
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
export type BandPrisma = Prisma.BandGetPayload<{
    include: typeof band_include;
}>;
export interface BandForm {
    name: string;
    description?: string;
    image?: string;
    instagram?: string;
    artists?: Artist[];
}
export declare class Band {
    id: string;
    name: string;
    description: string | null;
    image: string | null;
    instagram: string | null;
    artists: Artist[];
    events: number;
    static new(data: BandForm): Promise<Band>;
    static getAll(): Promise<any>;
    static findById(id: string): Promise<Band | null>;
    constructor(data: BandPrisma);
    load(data: BandPrisma): void;
    update(data: Partial<BandForm>): Promise<void>;
    updateImage(file: UploadedFile): Promise<string>;
    getEvents(): Promise<any>;
    delete(): Promise<boolean>;
}
