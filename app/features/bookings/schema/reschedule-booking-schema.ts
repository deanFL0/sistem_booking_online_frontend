import z from "zod";

export const rescheduleBookingSchema = z.object({
    start_datetime: z.string().min(1, "Tanggal & Jam booking wajib diisi"),
});

export type RescheduleBookingSchema = z.infer<typeof rescheduleBookingSchema>;
