import z from "zod";

const phoneRegex =
    /^\+?[0-9]\d{1,14}$/;

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

export const updateBookingSchema = bookingSchema.extend({
    status: z.enum(["pending", "confirmed", "ongoing", "completed", "cancelled", "no_show"], {
        required_error: "Status wajib diisi",
    }),
    has_conflict: z.boolean().optional(),
    conflict_details: z.string().nullable(),
});

export type BookingSchema = z.infer<typeof bookingSchema>;
export type UpdateBookingSchema = z.infer<typeof updateBookingSchema>;