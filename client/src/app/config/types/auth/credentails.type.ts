import { UserInterface } from '@config/types/user/user.interface';

export type LoginRequest = Pick<UserInterface, 'email' | 'password'>;
export type LoginResponse = Pick<UserInterface, 'accessToken'>;

export type RegisterRequest = Pick<
    UserInterface,
    'email' | 'password' | 'username'
>;
export type RegisterResponse = Pick<UserInterface, 'id'>;

export interface BodyRequestInterface {
    ids: string[];
    status: boolean;
    delete: boolean;
}
