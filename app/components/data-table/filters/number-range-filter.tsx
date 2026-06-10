import { Input } from "~/components/ui/input"
import { RangeFilter } from "./range-filter"

type Props = {
    value: { min?: number; max?: number }
    onChange: (value: { min?: number; max?: number }) => void
}

export function NumberRangeFilter({
    value,
    onChange,
}: Props) {
    return (
        <RangeFilter<number>
            value={value}
            onChange={onChange}
            minPlaceholder="Min"
            maxPlaceholder="Maks"
            renderInput={(
                value,
                onValueChange,
                placeholder
            ) => (
                <Input
                    type="number"
                    value={value ?? ""}
                    placeholder={placeholder}
                    className="h-8 w-full"

                    onChange={(e) => {
                        const value = e.target.value

                        onValueChange(
                            value === ""
                                ? undefined
                                : Number(value)
                        )
                    }}
                />
            )}
        />
    )
}