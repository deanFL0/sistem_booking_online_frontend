import z from "zod";

export const resourceSchema = z.object({
    name: z.string(),
    resource_type_id: z.string(),
    description: z.string(),
    is_active: z.boolean(),
});

export type ResourceSchema = z.infer<typeof resourceSchema>;