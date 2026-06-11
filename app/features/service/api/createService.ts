import type { ServiceCreateSchema } from "../schema/service-create-schema";
import { api } from "~/lib/axios";

export async function createService(data: ServiceCreateSchema) {
    const response = await api.post("/services", data);
    return response.data;
}