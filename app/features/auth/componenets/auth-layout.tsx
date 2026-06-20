import { GuestRoute } from "./guest-route";

interface AuthLayoutProps {
    title: string;
    description: string;
    children: React.ReactNode;
}

export function AuthLayout({ title, description, children }: AuthLayoutProps) {
    return (
        <GuestRoute>
            <div className="w-full lg:grid lg:grid-cols-2 min-h-screen bg-background text-foreground">
                {/* Left Side: Barber Shop Cinematic Background */}
                <div className="relative hidden bg-zinc-900 lg:block">
                    <img
                        src="/images/auth-bg.jpg"
                        alt="Barber Shop Background"
                        className="absolute inset-0 h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/60" />
                    <div className="absolute inset-0 flex flex-col justify-end p-12">
                        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-4">
                            Gaya Presisi, Percaya Diri Sepanjang Hari
                        </h1>
                        <p className="text-lg text-zinc-300">
                            Rasakan pengalaman cukur rambut premium dengan kapster profesional kami.
                            Tampil maksimal and lebih percaya diri.
                        </p>
                    </div>
                </div>

                {/* Right Side: Form Container */}
                <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
                    <div className="mx-auto grid w-full max-w-[400px] gap-8">
                        <div className="grid gap-2 text-center lg:text-left">
                            <h1 className="text-3xl font-bold">{title}</h1>
                            <p className="text-balance text-muted-foreground text-sm">
                                {description}
                            </p>
                        </div>
                        {children}
                    </div>
                </div>
            </div>
        </GuestRoute>
    );
}
