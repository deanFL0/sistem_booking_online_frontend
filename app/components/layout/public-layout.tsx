import type { ReactNode } from "react"
import { Navbar } from "./navbars/navbar"
import { Footer } from "./footer"
import { getUser } from "~/lib/auth"
import { AuthNavbar } from "./navbars/auth-navbar"

export function PublicLayout({ children }: { children: ReactNode }) {
    const user = getUser()

    return (
        <div>
            {user ? <AuthNavbar /> : <Navbar />}
            <main className="min-h-screen bg-background text-freground px-4 py-4">
                {children}
            </main>
            <Footer />
        </div>
    )
}