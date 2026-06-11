import { api } from "~/lib/axios";

export async function deleteService(id: string) {
    const response = await api.delete(`/services/${id}`);
    return response.data;
}