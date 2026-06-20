import type { ResourceTypes } from "~/features/resource-types/types/resource-types";
import type { OperationalHour } from "./operational-hours";

export interface Resource {
    id: string;
    name: string;
    resource_type_id: string;
    description: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;

    resource_type: ResourceTypes;
    operational_hours: OperationalHour[];
}