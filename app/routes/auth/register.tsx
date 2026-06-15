import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { useState } from "react";
import axios from "axios";
import { registerSchema, type RegisterSchema } from "~/features/auth/schemas/register-schema";

import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Separator } from "~/components/ui/separator";
import { AuthLayout } from "~/features/auth/componenets/auth-layout";
import { toast } from "sonner";
import { authApi } from "~/features/auth/api/auth-api";

export default function RegisterForm() {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<RegisterSchema>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            name: "",
            email: "",
            phone: "",
            password: "",
            password_confirmation: "",
        },
    });

    const navigate = useNavigate();
    const [error, setError] = useState("");

    async function onSubmit(data: RegisterSchema) {
        try {
            setError("");

            await authApi.register(data);

            // toast success
            toast.success("Akun berhasil dibuat");

            // wait 500ms
            await new Promise((resolve) => setTimeout(resolve, 500));

            navigate("/auth/login")
        } catch (error) {
            if (axios.isAxiosError(error)) {
                const serverMessage = error.response?.data?.message || error.response?.data?.error;
                setError(serverMessage || "Gagal menghubungi server. Silakan coba lagi.");
            } else {
                setError("Terjadi kesalahan yang tidak diketahui.");
            }
        }
    }

    return (
        <AuthLayout
            title="Daftar"
            description="Masukan data Anda untuk membuat akun"
        >
            <form onSubmit={handleSubmit(onSubmit)} className="grid gap-5">
                {error && (
                    <div className="bg-red-50 text-red-500 p-3 rounded-md text-sm text-center font-medium">
                        {error}
                    </div>
                )}
                <div className="grid gap-2">
                    <label htmlFor="name" className="text-sm font-medium leading-none">
                        Nama Lengkap
                    </label>
                    <Input
                        id="name"
                        type="text"
                        placeholder="Nama Lengkap"
                        {...register("name")}
                    />
                    {errors.name && (
                        <span className="text-sm text-red-500">{errors.name.message}</span>
                    )}
                </div>
                <div className="grid gap-2">
                    <label htmlFor="email" className="text-sm font-medium leading-none">
                        Email
                    </label>
                    <Input
                        id="email"
                        type="email"
                        placeholder="name@example.com"
                        {...register("email")}
                    />
                    {errors.email && (
                        <span className="text-sm text-red-500">{errors.email.message}</span>
                    )}
                </div>
                <div className="grid gap-2">
                    <label htmlFor="phone" className="text-sm font-medium leading-none">
                        Nomor Telepon
                    </label>
                    <Input
                        id="phone"
                        type="tel"
                        placeholder="Nomor Telepon"
                        {...register("phone")}
                    />
                    {errors.phone && (
                        <span className="text-sm text-red-500">{errors.phone.message}</span>
                    )}
                </div>
                <div className="grid gap-2">
                    <label htmlFor="password" className="text-sm font-medium leading-none">
                        Password
                    </label>
                    <Input
                        id="password"
                        type="password"
                        {...register("password")}
                    />
                    {errors.password && (
                        <span className="text-sm text-red-500">{errors.password.message}</span>
                    )}
                </div>
                <div className="grid gap-2">
                    <label htmlFor="password_confirmation" className="text-sm font-medium leading-none">
                        Konfirmasi Password
                    </label>
                    <Input
                        id="password_confirmation"
                        type="password"
                        {...register("password_confirmation")}
                    />
                    {errors.password_confirmation && (
                        <span className="text-sm text-red-500">{errors.password_confirmation.message}</span>
                    )}
                </div>
                <Button type="submit" className="w-full mt-2" disabled={isSubmitting}>
                    {isSubmitting ? "Loading..." : "Daftar"}
                </Button>

                <Separator />

                <div className="grid gap-3">
                    <span>
                        Sudah punya akun?{" "}
                        <a href="/auth/login" className="text-sm text-primary hover:underline">Login</a>
                    </span>
                </div>
            </form>
        </AuthLayout>
    );
}