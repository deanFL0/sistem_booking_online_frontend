import z from "zod";

export const serviceResourceTypeSchema = z.object({
    resource_type_id: z.number().min(1, "Tipe sumber daya harus dipilih"),
    quantity: z.number().min(1, "Jumlah harus diisi"),
});

export type ServiceResourceTypeSchema = z.infer<typeof serviceResourceTypeSchema>;
