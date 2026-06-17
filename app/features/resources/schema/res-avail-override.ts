import z from "zod";

const resAvailOverrideSchema = z.object({
    start_datetime: z.string().min(1, "Start time is required"),
    end_datetime: z.string().min(1, "End time is required"),
    status: z.enum(["available", "unavailable"]),
    notes: z.string().optional(),
})

export type ResAvailOverrideSchema = z.infer<typeof resAvailOverrideSchema>;

