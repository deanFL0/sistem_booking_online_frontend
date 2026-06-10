type Props = {
    children: React.ReactNode
}

export function AdminPage({
    children,
}: Props) {
    return (
        <div
            className="
                flex
                flex-col
                gap-6
                p-6
            "
        >
            {children}
        </div>
    )
}