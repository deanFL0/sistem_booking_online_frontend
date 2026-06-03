import z from "zod";

import { api } from "~/lib/axios";

import type { RegisterSchema } from "../schemas/register-schema";

export async function register(data: RegisterSchema) {
    const response = await api.post("/register", data);
    return response.data;
}