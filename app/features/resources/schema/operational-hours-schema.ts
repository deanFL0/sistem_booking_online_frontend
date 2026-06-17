import z from "zod";

export const operationalHoursSchema = z.object({
    day_of_week: z.number().min(0).max(6),
    open_time: z.string(),
    close_time: z.string(),
    is_closed: z.boolean(),
});

export type OperationalHoursSchema = z.infer<typeof operationalHoursSchema>;