import { api } from "~/lib/axios";
import { buildQueryParams } from "~/lib/query-builder";
import type { ResourceSchema } from "../schema/resource-schema";

type GetResAvailOverridesParams = {
    resourceId: string

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

export const resAvailOverrideApi = {
    getAll: async (resourceId: string, params: GetResAvailOverridesParams) => {
        const query = buildQueryParams(params);

        const response = await api.get(
            `/resources/${resourceId}/availability-overrides?${query.toString()}`
        );

        return response.data;
    },

    getById: async (resourceId: string, overrideId: string) => {
        const response = await api.get(
            `/resources/${resourceId}/availability-overrides${overrideId}`
        );

        return response.data.data;
    },

    create: async (resourceId: string, data: ResourceSchema) => {
        const response = await api.post(
            `/resources/${resourceId}/availability-overrides`,
            data
        );

        return response.data;
    },

    update: async (
        resourceId: string,
        overrideId: string,
        data: ResourceSchema
    ) => {
        const response = await api.put(
            `/resources/${resourceId}/availability-overrides${overrideId}`,
            data
        );

        return response.data;
    },

    delete: async (resourceId: string, overrideId: string) => {
        const response = await api.delete(
            `/resources/${resourceId}/availability-overrides${overrideId}`
        );

        return response.data;
    },
};