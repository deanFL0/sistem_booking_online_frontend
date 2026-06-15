export interface OperationalHour {
    id: string | number;
    resource_id: string | number;
    day_of_week: number;
    day_name: string;
    open_time: string;
    close_time: string;
    is_closed: boolean;
    created_at: string;
    updated_at: string;
}