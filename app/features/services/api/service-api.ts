import { api } from "~/lib/axios"
import { buildQueryParams } from "~/lib/query-builder"
import type { ServiceSchema } from "../schema/service-schema"

type GetServicesParams = {
    pagination: {
        pageIndex: number
        pageSize: number
    }

    sorting: {
        id: string
        desc: boolean
    }[]

    filters: Record<string, unknown>

    includes?: string[]
}

function buildServiceFormData(data: ServiceSchema) {
    const formData = new FormData();

    formData.append("name", data.name);
    formData.append("description", data.description ?? "");
    formData.append("price", String(data.price));
    formData.append("pricing_type", data.pricing_type);
    formData.append("duration", String(data.duration));
    formData.append("is_active", data.is_active ? "1" : "0");

    if (data.image instanceof File) {
        formData.append("image", data.image);
    }

    return formData;
}

export const serviceApi = {
    getAll: async (params: GetServicesParams) => {
        const query = buildQueryParams(params);

        const response = await api.get(
            `/services?${query.toString()}`
        );

        return response.data;
    },

    getAllServiceOption: async () => {
        const response = await api.get(
            "/options/services"
        );

        return response.data;
    },

    getById: async (id: string) => {
        const response = await api.get(
            `/services/${id}`
        );

        return response.data.data;
    },

    getAvailableDates: async (id: string) => {
        const response = await api.get(
            `/services/${id}/available-dates`
        );

        return response.data;
    },

    getAvailableTimes: async (id: string, date: string) => {
        const response = await api.get(
            `/services/${id}/available-time-slots`,
            {
                params: {
                    date
                }
            }
        );

        return response.data;
    },

    create: async (data: ServiceSchema) => {
        const response = await api.post(
            "/services",
            buildServiceFormData(data)
        );

        return response.data;
    },

    update: async (id: string, data: ServiceSchema) => {
        const formData = buildServiceFormData(data);

        formData.append("_method", "PUT");

        const response = await api.post(
            `/services/${id}`,
            formData
        );

        return response.data;
    },

    delete: async (id: string) => {
        const response = await api.delete(
            `/services/${id}`
        );

        return response.data;
    },
};