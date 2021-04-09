export type UserRole =
    'USER' |
    'ADMIN'
;

export type User = {
    id: number;
    username?: string;
    email?: string;
    firstName?: string;
    lastName?: string;
    createdAt?: string;
    role?: UserRole;
};