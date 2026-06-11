import z from "zod";

export const serviceCreateSchema = z.object({
    name: z.string().min(1, "Nama layanan harus diisi"),
    description: z.string().optional(),
    price: z.coerce.number().min(1, "Harga layanan harus diisi"),
    pricing_type: z.enum(["one_time", "hourly"], "Jenis harga tidak valid"),
    duration: z.coerce.number().min(1, "Durasi layanan harus diisi"),
    is_active: z.boolean(),
});

export type ServiceCreateSchema = z.infer<typeof serviceCreateSchema>;