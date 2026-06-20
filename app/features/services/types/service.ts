import type { ServiceResourceType } from "./service-resource-type";

export interface Service {
    id: string | number;
    name: string;
    description?: string | null;
    image_url?: string | null;
    price: number;
    formatted_price: string;
    pricing_type: "one_time" | "hourly";
    duration: number;
    total_price: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;

    resource_types?: ServiceResourceType[];
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