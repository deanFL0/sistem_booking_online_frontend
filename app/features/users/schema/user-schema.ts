import z from "zod";

const passwordRegex =
    /^(?=.*[A-Za-z])(?=.*\d)/;

const phoneRegex =
    /^\+?[0-9]\d{1,14}$/;

export const userBaseSchema = z.object({
    name: z.string().min(3, "Nama harus memiliki minimal 3 karakter"),
    email: z.string().email("Email tidak valid"),
    phone: z.string().trim().regex(phoneRegex, "Nomor telepon tidak valid").optional().or(z.literal("")).nullable(),
    role: z.enum(["admin", "customer"]),
});

export const userSchema = userBaseSchema.extend({
    password: z.string().min(8, "Password harus memiliki minimal 8 karakter").regex(passwordRegex, "Password harus mengandung minimal satu huruf dan satu angka"),
    password_confirmation: z.string().min(8, "Password harus memiliki minimal 8 karakter").regex(passwordRegex, "Password harus mengandung minimal satu huruf dan satu angka"),
}).refine((data) => data.password === data.password_confirmation, {
    message: "Password tidak cocok",
    path: ["password_confirmation"],
});

export const updateUserSchema = userBaseSchema;

export type UserSchema = z.infer<typeof userSchema>;
export type UpdateUserSchema = z.infer<typeof updateUserSchema>;