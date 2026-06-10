import { Input } from "~/components/ui/input";
import { RangeFilter } from "./range-filter";

type Props = {
    value: { min?: string; max?: string }
    onChange: (value: { min?: string; max?: string }) => void
}

export function DateTimeRangeFilter({ value, onChange }: Props) {
    return (
        <RangeFilter<string>
            value={value}
            onChange={onChange}
            renderInput={(
                value,
                onValueChange
            ) => (
                <Input
                    type="datetime-local"
                    value={value ?? ""}
                    className="h-8 w-full"

                    onChange={(e) =>
                        onValueChange(
                            e.target.value || undefined
                        )
                    }
                />
            )}
        />
    )
}