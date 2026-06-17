import z from "zod";

export const resAvailOverrideSchema = z.object({
    start_datetime: z.string().min(1, "Start time is required"),
    end_datetime: z.string().min(1, "End time is required"),
    status: z.enum(["available", "unavailable"]),
    reason: z.string().optional(),
})

export type ResAvailOverrideSchema = z.infer<typeof resAvailOverrideSchema>;

