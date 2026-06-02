import { api } from "~/lib/axios";
import { type Service } from "../../service/service";
import { useQuery } from "@tanstack/react-query";

type GetServicesResponse = {
    data: Service[];
};

export async function getServices(): Promise<GetServicesResponse> {
    const response = await api.get("/services", {
        params: {
            is_active: true,
        },
    });

    return response.data;
}

export function useServices() {
    return useQuery({
        queryKey: ["services"],
        queryFn: getServices,
    });
}