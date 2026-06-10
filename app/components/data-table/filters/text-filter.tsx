import { Input } from "../../ui/input"

type Props = {
    value?: string
    onChange: (value: string) => void
}

export function TextFilter({
    value,
    onChange,
}: Props) {
    return (
        <Input
            value={value ?? ""}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Cari..."
            className="h-8"
        />
    )
}