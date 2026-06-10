import { Button } from "../ui/button"
import { ArrowLeft } from "lucide-react"
import { Link } from "react-router"

type Props = {
    title: string
    description?: string

    backHref?: string

    actions?: React.ReactNode
}

export function AdminPageHeader({
    title,
    description,
    backHref,
    actions,
}: Props) {
    return (
        <div
            className="
        flex
        flex-col
        gap-4

        md:flex-row
        md:items-start
        md:justify-between
      "
        >
            <div className="space-y-1">
                {backHref && (
                    <Button
                        variant="ghost"
                        size="sm"
                        className="-ml-3"
                    >
                        <Link to={backHref}>
                            <ArrowLeft />
                            Back
                        </Link>
                    </Button>
                )}

                <div className="space-y-1">
                    <h1
                        className="
                            text-3xl
                            font-bold
                            tracking-tight
                            "
                    >
                        {title}
                    </h1>

                    {description && (
                        <p
                            className="
                                text-muted-foreground
                            "
                        >
                            {description}
                        </p>
                    )}
                </div>
            </div>

            {actions && (
                <div
                    className="
                        flex
                        items-center
                        gap-2
                    "
                >
                    {actions}
                </div>
            )}
        </div>
    )
}