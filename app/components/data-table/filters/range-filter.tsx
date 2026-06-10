type RangeValue<T> = {
    min?: T
    max?: T
}

type Props<T> = {
    value?: RangeValue<T>

    onChange: (
        value: RangeValue<T>
    ) => void

    minPlaceholder?: string
    maxPlaceholder?: string

    renderInput: (
        value: T | undefined,
        onChange: (value?: T) => void,
        placeholder?: string
    ) => React.ReactNode
}

export function RangeFilter<T>({
    value,
    onChange,
    renderInput,
    minPlaceholder,
    maxPlaceholder,
}: Props<T>) {
    return (
        <div className="flex items-center gap-2 w-full">
            <div className="flex-1 min-w-0">
                {renderInput(
                    value?.min,
                    (min) =>
                        onChange({
                            ...value,
                            min,
                        }),
                    minPlaceholder
                )}
            </div>

            <span className="text-muted-foreground shrink-0 select-none">-</span>

            <div className="flex-1 min-w-0">
                {renderInput(
                    value?.max,
                    (max) =>
                        onChange({
                            ...value,
                            max,
                        }),
                    maxPlaceholder
                )}
            </div>
        </div>
    )
}