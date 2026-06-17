export interface ResAvailOverride {
    id: number | string;
    resource_id: number | string;
    start_datetime: string;
    end_datetime: string;
    status: "available" | "unavailable";
    reason?: string | null;
    created_at: string;
    updated_at: string | null;
}