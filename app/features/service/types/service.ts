export interface Service {
    id: string | number;
    name: string;
    description?: string | null;
    price: number;
    pricing_type: "one_time" | "hourly";
    duration: number;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}
