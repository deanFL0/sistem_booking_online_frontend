import { Check, ChevronsUpDown } from "lucide-react"

import { Button } from "~/components/ui/button"

import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "~/components/ui/command"

import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "~/components/ui/popover"

import { cn } from "~/lib/utils"

type Option = {
    label: string
    value: string
}

type Props = {
    value?: string[]

    onChange: (
        value: string[]
    ) => void

    options: Option[]

    placeholder?: string
}

export function MultiChoiceFilter({
    value = [],
    onChange,
    options,
    placeholder = "Select options",
}: Props) {
    function toggleOption(
        optionValue: string
    ) {
        const exists = value.includes(optionValue)

        if (exists) {
            onChange(
                value.filter(
                    (v) => v !== optionValue
                )
            )

            return
        }

        onChange([...value, optionValue])
    }

    return (
        <Popover>
            <PopoverTrigger>
                <Button
                    variant="outline"
                    role="combobox"
                    className="
                        h-8
                        w-full
                        justify-between
                        overflow-hidden
                    "
                >
                    <span className="truncate">
                        {value.length > 0
                            ? `${value.length} selected`
                            : placeholder}
                    </span>

                    <ChevronsUpDown className="ml-2 size-4 opacity-50" />
                </Button>
            </PopoverTrigger>

            <PopoverContent
                className="w-[var(--radix-popover-trigger-width)] p-0"
                align="start"
            >
                <Command>
                    <CommandInput
                        placeholder="Search..."
                    />

                    <CommandList>
                        <CommandEmpty>
                            Hasil tidak ditemukan.
                        </CommandEmpty>

                        <CommandGroup>
                            {options.map((option) => {
                                const selected =
                                    value.includes(option.value)

                                return (
                                    <CommandItem
                                        key={option.value}
                                        value={option.label}
                                        onSelect={() =>
                                            toggleOption(
                                                option.value
                                            )
                                        }
                                    >
                                        <div
                                            className={cn(
                                                "mr-2 flex size-4 items-center justify-center rounded-sm border border-primary",

                                                selected
                                                    ? "bg-primary text-primary-foreground"
                                                    : "opacity-50 [&_svg]:invisible"
                                            )}
                                        >
                                            <Check className="size-4" />
                                        </div>

                                        {option.label}
                                    </CommandItem>
                                )
                            })}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    )
}
