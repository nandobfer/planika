import { Prisma } from "@prisma/client";
type ParticipantPrisma = Prisma.TripParticipantGetPayload<{}>;
export type ParticipantRole = 'administrator' | 'collaborator' | 'viewer';
export interface TripParticipantForm {
    role: ParticipantRole;
    identifier: string;
    idType: 'userId' | 'email';
}
export type ParticipantStatus = 'active' | 'pending';
export declare class TripParticipant {
    id: string;
    tripId: string;
    role: ParticipantRole;
    createdAt: number;
    updatedAt: number;
    status: ParticipantStatus;
    userId?: string;
    constructor(data: ParticipantPrisma);
}
export {};
