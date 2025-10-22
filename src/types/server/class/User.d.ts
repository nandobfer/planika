import { Prisma } from "@prisma/client";
import { WithoutFunctions } from "./helpers";
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
export interface GooglePeople {
    googleId?: string | null;
    name?: string | null;
    emails?: string[];
    photo?: string | null;
    birthday?: {
        year?: number | null;
        month?: number | null;
        day?: number | null;
    } | null;
    phone?: string | null;
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
    picture?: string | null;
    static new(data: UserForm): Promise<User>;
    static login(data: LoginForm): Promise<User | null>;
    static getAll(): Promise<User[]>;
    static findById(id: string): Promise<User | null>;
    static findByEmail(email: string): Promise<User | null>;
    static delete(user_id: string): Promise<User>;
    static googleLogin(data: GoogleAuthResponse): Promise<User | undefined>;
    constructor(data: UserPrisma);
    load(data: UserPrisma): void;
    update(data: Partial<UserForm>): Promise<void>;
}
