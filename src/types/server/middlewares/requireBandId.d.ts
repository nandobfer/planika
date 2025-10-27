import { NextFunction, Request, Response } from "express";
import { Band } from "../class/Band";
export interface BandRequest extends Request {
    band?: Band | null;
}
export declare const requireBandId: (request: BandRequest, response: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
