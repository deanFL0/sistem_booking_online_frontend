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

export type AvailableDatesResponse = {
    service_id: number;
    start_date: string;
    available_dates: string[];
};

export type AvailableTimesResponse = {
    service_id: number;
    date: string;
    available_time_slots: string[];
};