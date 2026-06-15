import z from "zod";

const phoneRegex =
    /^\+?[1-9]\d{1,14}$/;

export const bookingSchema = z.object({
    service_id: z.string().min(1, "Service wajib dipilih"),
    customer_name: z.string().min(3, "Nama customer minimal 3 karakter"),
    customer_email: z.string().email("Email tidak valid"),
    customer_phone: z
        .string()
        .trim()
        .nullable()
        .optional()
        .transform(val => val === "" ? undefined : val)
        .refine(
            (val) => {
                if (!val) return true;
                return phoneRegex.test(val);
            },
            { message: "Nomor telepon tidak valid" }
        ),
    start_datetime: z.string().min(1, "Tanggal & Jam booking wajib diisi"),
})

export type BookingSchema = z.infer<typeof bookingSchema>;