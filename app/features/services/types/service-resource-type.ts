import type { ResourceTypes } from "~/features/resource-types/types/resource-types";

export interface ServiceResourceType extends ResourceTypes {
    pivot: {
        service_id: string | number;
        resource_type_id: string | number;
        quantity: number;
    }
}