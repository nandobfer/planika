import { Prisma } from "@prisma/client";
type RecoveryPrisma = Prisma.RecoveryGetPayload<{}>;
export declare class Recovery {
    id: number;
    target: string;
    code: number[];
    datetime: number;
    constructor(data: RecoveryPrisma);
    static new(target: string): Promise<Recovery>;
    static verifyCode(target: string, code: number[]): Promise<Recovery | null>;
    static finish(target: string): Promise<Prisma.BatchPayload>;
}
export {};
