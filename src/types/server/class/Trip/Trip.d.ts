import { Prisma } from "@prisma/client";
import { TripParticipant, TripParticipantForm } from "./TripParticipant";
import { ExpenseNode } from "./ExpenseNode";
import { WithoutFunctions } from "../helpers";
export declare const trip_includes: {
    participants: {
        include: {
            user: true;
        };
    };
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
    nodes: ExpenseNode[];
    totalExpenses: number;
    status: TripStatus;
    static new(data: TripForm, userId: string): Promise<Trip>;
    static findById(id: string): Promise<Trip | null>;
    constructor(data: PrismaTrip);
    load(data: PrismaTrip): void;
    getStatus(): TripStatus;
    update(data: Partial<TripForm>): Promise<void>;
    inviteParticipant(data: TripParticipantForm): Promise<TripParticipant>;
    acceptInvitation(email: string): Promise<TripParticipant>;
}
export {};
