export interface UserInterface {
    id: string;
    username: string;
    email: string;
    password: string;
    createdAt: Date;
    lastLoginAt: Date;
    accessToken: string;
    isBlocked: boolean;
}

export type Users = Array<Partial<UserInterface>>;
