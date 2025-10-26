import { Prisma } from "@prisma/client";
import { TripParticipant } from "./TripParticipant";
import { Node } from "./Node";
import { WithoutFunctions } from "../helpers";
export declare const trip_includes: {
    participants: true;
};
type PrismaTrip = Prisma.TripGetPayload<{
    include: typeof trip_includes;
}>;
export type TripStatus = "planning" | "ongoing" | "completed";
export type TripForm = Omit<WithoutFunctions<Partial<Trip>>, "id" | "createdAt" | "updatedAt" | "participants" | "nodes" | "totalExpenses" | "status">;
export declare class Trip {
    id: string;
    name: string;
    description: string;
    createdAt: number;
    updatedAt: number;
    startDate?: number;
    endDate?: number;
    participants: TripParticipant[];
    nodes: Node[];
    totalExpenses: number;
    status: TripStatus;
    static new(data: TripForm, userId: string): Promise<Trip>;
    static findById(id: string): Promise<Trip | null>;
    constructor(data: PrismaTrip);
    load(data: PrismaTrip): void;
    getStatus(): TripStatus;
    update(data: Partial<TripForm>): Promise<void>;
}
export {};
