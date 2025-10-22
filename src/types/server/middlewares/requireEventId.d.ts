import { NextFunction, Request, Response } from "express";
import { Event } from "../class/Event";
export interface EventRequest extends Request {
    event?: Event | null;
}
export declare const requireEventId: (request: EventRequest, response: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
