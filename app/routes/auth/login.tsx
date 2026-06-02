import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import {
    loginSchema,
    type LoginSchema,
} from "~/features/auth/schemas/login-schema";

import { login } from "~/features/auth/api/login";

import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";

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

    async function onSubmit(data: LoginSchema) {
        try {
            const response = await login(data);

            console.log(response);
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
        >
            <div>
                <Input
                    type="email"
                    placeholder="Email"
                    {...register("email")}
                />

                {errors.email && (
                    <p className="text-sm text-red-500">
                        {errors.email.message}
                    </p>
                )}
            </div>

            <div>
                <Input
                    type="password"
                    placeholder="Password"
                    {...register("password")}
                />

                {errors.password && (
                    <p className="text-sm text-red-500">
                        {errors.password.message}
                    </p>
                )}
            </div>

            <Button disabled={isSubmitting}>
                {isSubmitting ? "Loading..." : "Login"}
            </Button>
        </form>
    );
}