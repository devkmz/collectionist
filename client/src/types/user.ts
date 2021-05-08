export type UserRole =
    'USER' |
    'ADMIN'
;

export type User = {
    id: number;
    email: string;
    email_verified_at?: string | null;
    created_at?: string;
    updated_at?: string;
    role: UserRole;
    firstName?: string | null;
    lastName?: string | null;
};