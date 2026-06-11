import z from "zod";

export const serviceSchema = z.object({
    name: z.string().min(1, "Nama layanan harus diisi"),
    description: z.string().optional(),
    price: z.number().min(1, "Harga layanan harus diisi"),
    pricing_type: z.enum(["one_time", "hourly"]),
    duration: z.number().min(1, "Durasi layanan harus diisi"),
    is_active: z.boolean(),
});

export type ServiceSchema = z.infer<typeof serviceSchema>;