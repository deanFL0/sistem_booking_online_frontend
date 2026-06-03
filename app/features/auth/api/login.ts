import { api } from "~/lib/axios";

import type { LoginSchema } from "../schemas/login-schema";
import { setToken, setUser } from "~/lib/auth";

export async function login(data: LoginSchema) {
    const response = await api.post("/login", data);

    setToken(response.data.token)
    setUser(response.data.user)

    return response.data;
}