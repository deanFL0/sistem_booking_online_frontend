import { api } from "~/lib/axios"
import { buildQueryParams } from "~/lib/query-builder"
import type { BookingSchema } from "../schema/booking-schema"

type GetBookingsParams = {
    pagination: {
        pageIndex: number
        pageSize: number
    }

    sorting: {
        id: string
        desc: boolean
    }[]

    filters: Record<string, unknown>
}

export const bookingApi = {
    getAll: async (params: GetBookingsParams) => {
        const query = buildQueryParams(params);

        const response = await api.get(
            `/bookings?${query.toString()}`
        );

        return response.data;
    },

    getById: async (id: string) => {
        const response = await api.get(
            `/bookings/${id}`
        );

        return response.data.data;
    },

    create: async (data: BookingSchema) => {
        const response = await api.post(
            "/bookings",
            data
        );

        return response.data;
    },

    update: async (
        id: string,
        data: BookingSchema
    ) => {
        const response = await api.put(
            `/bookings/${id}`,
            data
        );

        return response.data;
    },

    delete: async (id: string) => {
        const response = await api.delete(
            `/bookings/${id}`
        );

        return response.data;
    },
};