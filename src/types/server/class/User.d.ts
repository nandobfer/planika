import { Prisma } from "@prisma/client";
import { WithoutFunctions } from "./helpers";
import { UploadedFile } from "express-fileupload";
export type UserPrisma = Prisma.UserGetPayload<{}>;
export type UserForm = Omit<WithoutFunctions<User>, "id"> & {
    password: string;
    id?: string | null;
};
export interface GoogleAuthResponse {
    credential: string;
    clientId: string;
    select_by: string;
}
export interface GoogleLoginData {
    aud: string;
    azp: string;
    email: string;
    email_verified: true;
    exp: number;
    family_name: string;
    given_name: string;
    iat: number;
    iss: string;
    jti: string;
    name: string;
    nbf: number;
    picture: string;
    sub: string;
}
export interface LoginForm {
    login: string;
    password: string;
}
export interface AccessToken {
    value: string;
    exp: number;
    iat: number;
}
export declare class User {
    id: string;
    name: string;
    email: string;
    defaultCurrency?: string;
    picture?: string;
    static new(data: UserForm): Promise<User>;
    static login(data: LoginForm): Promise<User | null>;
    static getAll(): Promise<User[]>;
    static findById(id: string): Promise<User | null>;
    static findByEmail(email: string): Promise<User | null>;
    static delete(user_id: string): Promise<User>;
    static googleLogin(data: GoogleAuthResponse): Promise<User | undefined>;
    static tryChangePassword(user_id: string, current_password: string, new_password: string): Promise<void>;
    constructor(data: UserPrisma);
    load(data: UserPrisma): void;
    update(data: Partial<UserForm>): Promise<void>;
    updateImage(file: UploadedFile): Promise<string>;
    delete(): Promise<this>;
    getToken(): string;
}
