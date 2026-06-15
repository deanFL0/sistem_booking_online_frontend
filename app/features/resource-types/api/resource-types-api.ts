import { api } from "~/lib/axios"
import { buildQueryParams } from "~/lib/query-builder"
import type { ResourceTypeSchema } from "../schema/resource-types-schema"

type GetResourceTypesParams = {
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

export const ResourceTypesApi = {
    getAll: async (params: GetResourceTypesParams) => {
        const query = buildQueryParams(params);

        const response = await api.get(
            `/resource-types?${query.toString()}`
        );

        return response.data;
    },

    getById: async (id: string) => {
        const response = await api.get(
            `/resource-types/${id}`
        );

        return response.data.data;
    },

    getAllResourceTypes: async () => {
        const response = await api.get(
            `/options/resource-types`
        );

        return response.data;
    },

    create: async (data: ResourceTypeSchema) => {
        const response = await api.post(
            "/resource-types",
            data
        );

        return response.data;
    },

    update: async (
        id: string,
        data: ResourceTypeSchema
    ) => {
        const response = await api.put(
            `/resource-types/${id}`,
            data
        );

        return response.data;
    },

    delete: async (id: string) => {
        const response = await api.delete(
            `/resource-types/${id}`
        );

        return response.data;
    },
};