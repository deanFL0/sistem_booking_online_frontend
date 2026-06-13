import { api } from "~/lib/axios";
import { buildQueryParams } from "~/lib/query-builder";
import type { ResourceSchema } from "../schema/resource-schema";

type GetResourcesParams = {
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

export const resourceApi = {
    getAll: async (params: GetResourcesParams) => {
        const query = buildQueryParams(params);

        const response = await api.get(
            `/resources?${query.toString()}`
        );

        return response.data;
    },

    getById: async (id: string) => {
        const response = await api.get(
            `/resources/${id}`
        );

        return response.data.data;
    },

    create: async (data: ResourceSchema) => {
        const response = await api.post(
            "/resources",
            data
        );

        return response.data;
    },

    update: async (
        id: string,
        data: ResourceSchema
    ) => {
        const response = await api.put(
            `/resources/${id}`,
            data
        );

        return response.data;
    },

    delete: async (id: string) => {
        const response = await api.delete(
            `/resources/${id}`
        );

        return response.data;
    },
};