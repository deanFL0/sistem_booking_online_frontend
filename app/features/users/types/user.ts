export interface User {
    id: string | number;
    name: string;
    email: string;
    phone?: string | null;
    role: "admin" | "user";
    password: string;
    created_at: string;
    updated_at: string;
    deleted_at?: string | null;
}