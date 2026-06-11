import { api } from "~/lib/axios";

export async function getServiceDetail(id: string) {
    const response = await api.get(
        `/services/${id}`
    );

    return response.data;
}