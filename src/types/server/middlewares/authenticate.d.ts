import { NextFunction, Request, Response } from "express";
import { User } from "../class/User";
export interface AuthenticatedRequest extends Request {
    user?: User | null;
    clientIp?: string;
}
export declare const authenticate: (request: AuthenticatedRequest, response: Response, next: NextFunction) => Promise<void>;
