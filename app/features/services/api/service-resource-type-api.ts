import { api } from "~/lib/axios"
import { buildQueryParams } from "~/lib/query-builder"
import type { ServiceResourceTypeSchema } from "../schema/service-resource-type-schema"

type GetServicesResourceTypeParams = {
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

export const serviceResourceTypeApi = {
    getAll: async (params: GetServicesResourceTypeParams, serviceId: string) => {
        const query = buildQueryParams(params);

        const response = await api.get(
            `/services/${serviceId}/resource-types?${query.toString()}`
        );

        return response.data;
    },

    getAllServiceOption: async (serviceId: string) => {
        const response = await api.get(
            `/options/services/${serviceId}/resource-types`
        );

        return response.data;
    },

    getById: async (serviceId: string, serviceResourceTypeId: string) => {
        const response = await api.get(
            `/services/${serviceId}/resource-types/${serviceResourceTypeId}`
        );

        return response.data.data;
    },

    create: async (data: ServiceResourceTypeSchema, serviceId: string) => {
        const response = await api.post(
            `/services/${serviceId}/resource-types`,
            data
        );

        return response.data;
    },

    update: async (
        serviceId: string,
        serviceResourceTypeId: string,
        data: ServiceResourceTypeSchema
    ) => {
        const response = await api.put(
            `/services/${serviceId}/resource-types/${serviceResourceTypeId}`,
            data
        );

        return response.data;
    },

    delete: async (serviceId: string, serviceResourceTypeId: string) => {
        const response = await api.delete(
            `/services/${serviceId}/resource-types/${serviceResourceTypeId}`
        );

        return response.data;
    },
};