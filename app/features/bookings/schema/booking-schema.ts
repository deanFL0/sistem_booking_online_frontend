import z from "zod";

export const bookingSchema = z.object({
    service_id: z.string().min(1, "Service wajib dipilih"),
    customer_name: z.string().min(3, "Nama customer minimal 3 karakter"),
    customer_email: z.string().email("Email tidak valid"),
    customer_phone: z.string().min(10, "No. Telp customer minimal 10 karakter"),
    start_datetime: z.string().min(1, "Tanggal & Jam booking wajib diisi"),
})

export type BookingSchema = z.infer<typeof bookingSchema>;