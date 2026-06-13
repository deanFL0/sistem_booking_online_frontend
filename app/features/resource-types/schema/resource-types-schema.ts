import z from "zod";

export const resourceTypeSchema = z.object({
    name: z.string().min(1, "Nama tipe sumber daya harus diisi"),
    description: z.string().optional(),
});

export type ResourceTypeSchema = z.infer<typeof resourceTypeSchema>;