import * as React from "react";
import {
    Controller,
    type FieldValues,
    type Path,
    type UseFormReturn,
} from "react-hook-form";
import { Check, ChevronsUpDown, Search } from "lucide-react";
import { cn } from "~/lib/utils";
import { Field, FieldError, FieldLabel } from "../ui/field";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "../ui/command";

type SelectOption = {
    value: any;
    label: string;
};

type FormSearchableSelectProps<T extends FieldValues> = {
    form: UseFormReturn<T>;
    name: Path<T>;
    label: string;
    placeholder?: string;
    options: SelectOption[];
    disabled?: boolean;
    limit?: number;
};

export function FormSearchableSelect<T extends FieldValues>({
    form,
    name,
    label,
    placeholder = "Pilih opsi",
    options,
    disabled = false,
    limit = 5,
}: FormSearchableSelectProps<T>) {
    const [open, setOpen] = React.useState(false);
    const [search, setSearch] = React.useState("");

    // Reset search when popover closes
    React.useEffect(() => {
        if (!open) {
            setSearch("");
        }
    }, [open]);

    return (
        <Field>
            <FieldLabel>{label}</FieldLabel>

            <Controller
                name={name}
                control={form.control}
                render={({ field }) => {
                    const selectedOption = options.find(
                        (option) => String(option.value) === String(field.value)
                    );

                    const filteredOptions = React.useMemo(() => {
                        if (!search) return options;
                        const lowerQuery = search.toLowerCase();
                        return options.filter((option) =>
                            option.label.toLowerCase().includes(lowerQuery)
                        );
                    }, [options, search]);

                    const hasMoreData = React.useMemo(() => {
                        return filteredOptions.length > limit;
                    }, [filteredOptions.length, limit]);

                    const displayedOptions = React.useMemo(() => {
                        const sliced = filteredOptions.slice(0, limit);

                        // If the selected option is not in the sliced list, but matches search, prepend it.
                        if (
                            selectedOption &&
                            !sliced.some((opt) => String(opt.value) === String(selectedOption.value)) &&
                            filteredOptions.some((opt) => String(opt.value) === String(selectedOption.value))
                        ) {
                            return [selectedOption, ...sliced];
                        }

                        return sliced;
                    }, [filteredOptions, selectedOption, limit]);

                    return (
                        <Popover open={open} onOpenChange={setOpen}>
                            <PopoverTrigger
                                className={cn(
                                    "flex h-8 w-full items-center justify-between gap-1.5 rounded-lg border border-input bg-transparent py-2 pr-2 pl-2.5 text-sm whitespace-nowrap transition-colors outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:bg-input/30 dark:hover:bg-input/50 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
                                    !selectedOption && "text-muted-foreground"
                                )}
                                aria-invalid={!!form.formState.errors[name]}
                                disabled={disabled}
                            >
                                <span className="truncate">
                                    {selectedOption ? selectedOption.label : placeholder}
                                </span>
                                <ChevronsUpDown className="pointer-events-none size-4 text-muted-foreground opacity-50" />
                            </PopoverTrigger>

                            <PopoverContent
                                className="w-(--anchor-width) min-w-36 p-0"
                                align="start"
                            >
                                <Command shouldFilter={false}>
                                    <CommandInput
                                        placeholder="Cari..."
                                        value={search}
                                        onValueChange={setSearch}
                                    />
                                    <CommandList>
                                        <CommandEmpty>Hasil tidak ditemukan.</CommandEmpty>
                                        <CommandGroup>
                                            {displayedOptions.map((option) => (
                                                <CommandItem
                                                    key={String(option.value)}
                                                    value={option.label}
                                                    data-checked={String(field.value) === String(option.value)}
                                                    onSelect={() => {
                                                        field.onChange(option.value);
                                                        setOpen(false);
                                                    }}
                                                >
                                                    {option.label}
                                                </CommandItem>
                                            ))}

                                            {/* Indicator for truncated results */}
                                            {hasMoreData && (
                                                <div className="px-2 py-1.5 text-xs text-muted-foreground border-t border-border mt-1 pt-2">
                                                    <div className="flex items-center gap-1.5">
                                                        <Search className="size-3" />
                                                        <span>
                                                            +{filteredOptions.length - limit} lainnya.
                                                            Ketik untuk mencari...
                                                        </span>
                                                    </div>
                                                </div>
                                            )}
                                        </CommandGroup>
                                    </CommandList>
                                </Command>
                            </PopoverContent>
                        </Popover>
                    );
                }}
            />

            <FieldError
                errors={[
                    form.formState.errors[name] as {
                        message?: string;
                    },
                ]}
            />
        </Field>
    );
}