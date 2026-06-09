import { api } from "~/lib/axios";
import type { DashboardResponse } from "../types/dashboard";

export async function getDashboardData() {
    const response =
        await api.get<DashboardResponse>(
            "/dashboard"
        );

    return response.data;
}