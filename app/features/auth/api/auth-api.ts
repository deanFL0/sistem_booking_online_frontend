import { api } from "~/lib/axios";
import type { RegisterSchema } from "../schemas/register-schema";

import type { LoginSchema } from "../schemas/login-schema";
import { logout, setToken, setUser } from "~/lib/auth";

export const authApi = {
    login: async (data: LoginSchema) => {
        const response = await api.post("/login", data);

        setToken(response.data.token)
        setUser(response.data.user)

        return response.data;
    },

    register: async (data: RegisterSchema) => {
        const response = await api.post("/register", data);
        return response.data;
    },

    logout: async () => {
        try {
            await api.post("/logout");
        } catch (error) {
            console.error(error);
        } finally {
            logout();
        }
    }
}