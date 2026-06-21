import type { Resource } from "~/features/resources/types/resource";
import type { Service } from "~/features/services/types/service";
import type { User } from "~/features/users/types/user";

export interface Booking {
    id: string | number;
    user_id?: string | number;
    service_id: string | number;
    booking_code: string;
    customer_name: string;
    customer_email: string;
    customer_phone?: string;
    start_datetime: string;
    end_datetime: string;
    duration_minutes: number;
    total_price: number;
    formatted_total_price: string;
    status: "pending" | "confirmed" | "ongoing" | "completed" | "cancelled" | "no_show";
    completion_notified_at?: string;
    manage_token?: string;
    has_conflict: boolean;
    conflict_details: string;
    created_at: string;
    updated_at: string;

    service?: Service;
    resources?: Resource[];
    user?: User;
}
