export interface Booking {
    id: string | number;
    user_id?: string | number;
    service_id: string | number;
    booking_code: string;
    customer_name: string;
    customer_email: string;
    customer_phone: string;
    start_datetime: string;
    end_datetime: string;
    duration_minutes: number;
    total_price: number;
    status: "pending" | "active" | "completed" | "cancelled";
    completion_notified_at?: string;
    manage_token?: string;
    created_at: string;
    updated_at: string;
}
