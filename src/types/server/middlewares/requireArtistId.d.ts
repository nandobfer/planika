import { NextFunction, Request, Response } from "express";
import { Artist } from "../class/Artist";
export interface ArtistRequest extends Request {
    artist?: Artist | null;
}
export declare const requireArtistId: (request: ArtistRequest, response: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
