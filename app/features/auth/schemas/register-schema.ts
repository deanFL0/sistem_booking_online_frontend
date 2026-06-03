import z from "zod";

const passwordRegex =
    /^(?=.*[A-Za-z])(?=.*\d)/;

const phoneRegex =
    /^\+?[1-9]\d{1,14}$/;

export const registerSchema = z.object({
    name: z.string().min(1, "Nama harus diisi"),

    email: z.email("Email tidak valid"),

    phone: z.string().trim().regex(phoneRegex, "Nomor telepon tidak valid").optional().or(z.literal("")),

    password: z.string()
        .min(8, "Password minimal 8 karakter")
        .regex(
            passwordRegex,
            "Password harus mengandung minimal satu huruf dan satu angka"
        ),

    password_confirmation: z.string(),
}).refine((data) => data.password === data.password_confirmation, {
    message: "Password tidak sama",
    path: ["password_confirmation"],
});

export type RegisterSchema = z.infer<typeof registerSchema>;