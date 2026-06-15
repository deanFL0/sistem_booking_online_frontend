// operational-hour-api.ts

import { api } from "~/lib/axios"
import type { OperationalHoursSchema } from "../schema/operational-hours-schema"

export const operationalHourApi = {
    getAll: async (resourceId: string) => {
        const response = await api.get(
            `/resources/${resourceId}/operational-hours`
        )

        return response.data
    },

    getById: async (
        resourceId: string,
        operationalHourId: string
    ) => {
        const response = await api.get(
            `/resources/${resourceId}/operational-hours/${operationalHourId}`
        )

        return response.data
    },

    create: async (
        resourceId: string,
        data: OperationalHoursSchema
    ) => {
        const response = await api.post(
            `/resources/${resourceId}/operational-hours`,
            data
        )

        return response.data
    },

    update: async (
        resourceId: string,
        operationalHourId: string,
        data: OperationalHoursSchema
    ) => {
        const response = await api.put(
            `/resources/${resourceId}/operational-hours/${operationalHourId}`,
            data
        )

        return response.data
    },

    delete: async (
        resourceId: string,
        operationalHourId: string
    ) => {
        const response = await api.delete(
            `/resources/${resourceId}/operational-hours/${operationalHourId}`
        )

        return response.data
    },
}