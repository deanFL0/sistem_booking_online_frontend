import { api } from "~/lib/axios";

import type { LoginSchema } from "../schemas/login-schema";

export async function login(data: LoginSchema) {
    const response = await api.post("/login", data);

    return response.data;
}