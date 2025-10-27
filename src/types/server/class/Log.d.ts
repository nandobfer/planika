import { Prisma } from "@prisma/client";
export type LogPrisma = Prisma.LogGetPayload<{}>;
export declare enum LogAction {
    create = "create",
    update = "update",
    delete = "delete"
}
export declare enum LogTarget {
    artist = "artist",
    band = "band",
    event = "event"
}
export interface LogForm {
    action: LogAction;
    target: LogTarget;
    message: string;
    request_ip?: string | null;
}
export declare class Log {
    id: number;
    datetime: string;
    action: LogAction;
    target: LogTarget;
    message: string;
    request_ip: string | null;
    admin_id: string;
    admin_name: string;
    static list(): Promise<any>;
    constructor(data: LogPrisma);
}
