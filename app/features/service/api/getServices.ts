import { api } from "~/lib/axios"
import { buildQueryParams } from "~/lib/query-builder"

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

export async function getServices(
    paramsData: GetServicesParams
) {
    const params = buildQueryParams(paramsData);

    const response = await api.get(
        `/services?${params.toString()}`
    );

    return response.data;
}