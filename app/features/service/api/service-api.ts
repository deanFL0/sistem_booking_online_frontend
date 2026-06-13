import { api } from "~/lib/axios"
import { buildQueryParams } from "~/lib/query-builder"
import type { ServiceSchema } from "../schema/service-create-schema"

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
}

export const serviceApi = {
    getAll: async (params: GetServicesParams) => {
        const query = buildQueryParams(params);

        const response = await api.get(
            `/services?${query.toString()}`
        );

        return response.data;
    },

    getById: async (id: string) => {
        const response = await api.get(
            `/services/${id}`
        );

        return response.data.data;
    },

    create: async (data: ServiceSchema) => {
        const response = await api.post(
            "/services",
            data
        );

        return response.data;
    },

    update: async (
        id: string,
        data: ServiceSchema
    ) => {
        const response = await api.put(
            `/services/${id}`,
            data
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