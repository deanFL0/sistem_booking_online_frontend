import { api } from "~/lib/axios"
import { buildQueryParams } from "~/lib/query-builder"
import type { UpdateUserSchema, UserSchema } from "../schema/user-schema"

type GetUsersParams = {
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

export const userApi = {
    getAll: async (params: GetUsersParams) => {
        const query = buildQueryParams(params);

        const response = await api.get(
            `/users?${query.toString()}`
        );

        return response.data;
    },

    getById: async (id: string) => {
        const response = await api.get(
            `/users/${id}`
        );

        return response.data.data;
    },

    create: async (data: UserSchema) => {
        const response = await api.post(
            "/users",
            data
        );

        return response.data;
    },

    update: async (
        id: string,
        data: UpdateUserSchema
    ) => {
        const response = await api.put(
            `/users/${id}`,
            data
        );

        return response.data;
    },

    delete: async (id: string) => {
        const response = await api.delete(
            `/users/${id}`
        );

        return response.data;
    },
};