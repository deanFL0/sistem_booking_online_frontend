import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { useState } from "react";
import axios from "axios";

import {
    loginSchema,
    type LoginSchema,
} from "~/features/auth/schemas/login-schema";

import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Separator } from "~/components/ui/separator";
import { AuthLayout } from "~/features/auth/componenets/auth-layout";
import { authApi } from "~/features/auth/api/auth-api";

export default function LoginForm() {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<LoginSchema>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    const navigate = useNavigate();
    const [error, setError] = useState("");

    async function onSubmit(data: LoginSchema) {
        try {
            setError("");

            const response = await authApi.login(data);

            const role = response.user?.role

            if (role === "admin") {
                navigate("/admin/dashboard")
            } else {
                navigate("/services");
            }
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
            title="Login"
            description="Masukan email dan password Anda untuk masuk"
        >
            <form onSubmit={handleSubmit(onSubmit)} className="grid gap-5">
                {error && (
                    <div className="bg-red-50 text-red-500 p-3 rounded-md text-sm text-center font-medium">
                        {error}
                    </div>
                )}
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
                <Button type="submit" className="w-full mt-2" disabled={isSubmitting}>
                    {isSubmitting ? "Loading..." : "Login"}
                </Button>

                <Separator />

                <div className="grid gap-3">
                    <span>
                        Tidak punya akun?{" "}
                        <a href="/auth/register" className="text-sm text-primary hover:underline">Daftar</a>
                    </span>
                </div>
            </form>
        </AuthLayout>
    );
}