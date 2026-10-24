import React, { useMemo, useState } from 'react';
import { Check, ChevronsUpDown, X } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from '@/components/ui/command';
import { cn } from '@/lib/utils';
import { accentInsensitiveFilter } from './comboboxSearch';

/**
 * Single-select with autocomplete (accent-insensitive). Options can be grouped:
 * groups: [{ value, label, options: [{ value, label }] }]  — or a flat `options` list.
 * onChange receives the selected value, or '' when cleared.
 */
export default function SearchableSelect({
    groups,
    options,
    value = '',
    onChange,
    placeholder = 'Seleccionar…',
    searchPlaceholder = 'Escribe para buscar…',
    emptyText = 'Sin resultados',
    allowClear = true,
    disabled = false,
    className = '',
    triggerClassName = '',
}) {
    const [open, setOpen] = useState(false);
    const sections = useMemo(
        () => groups ?? [{ value: '__all__', label: null, options: options ?? [] }],
        [groups, options]
    );

    const selected = useMemo(() => {
        for (const section of sections) {
            const option = section.options.find((item) => item.value === value);
            if (option) return { option, section };
        }
        return null;
    }, [sections, value]);

    const select = (nextValue) => {
        onChange(nextValue === value ? '' : nextValue);
        setOpen(false);
    };

    return (
        <div className={cn('relative', className)}>
            <Popover open={open} onOpenChange={(next) => !disabled && setOpen(next)}>
                <PopoverTrigger asChild>
                    <button
                        type="button"
                        role="combobox"
                        aria-expanded={open}
                        aria-label={placeholder}
                        disabled={disabled}
                        className={cn(
                            'flex h-11 w-full items-center gap-2 rounded-md border border-input bg-background px-3 text-left text-sm shadow-sm transition-colors hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#D2FC31]/40 disabled:cursor-not-allowed disabled:opacity-50',
                            allowClear && selected && 'pr-9',
                            triggerClassName
                        )}
                    >
                        <span className={cn('flex-1 truncate', !selected && 'text-muted-foreground')}>
                            {selected ? selected.option.label : placeholder}
                        </span>
                        <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
                    </button>
                </PopoverTrigger>
                <PopoverContent
                    className="w-[--radix-popover-trigger-width] min-w-[240px] max-w-[calc(100vw-2rem)] p-0"
                    align="start"
                >
                    <Command filter={accentInsensitiveFilter}>
                        <CommandInput placeholder={searchPlaceholder} />
                        <CommandList className="max-h-72">
                            <CommandEmpty>{emptyText}</CommandEmpty>
                            {sections.map((section) => (
                                <CommandGroup key={section.value} heading={section.label ?? undefined}>
                                    {section.options.map((option) => (
                                        <CommandItem
                                            key={option.value}
                                            value={option.value}
                                            keywords={[option.label, section.label ?? '']}
                                            onSelect={() => select(option.value)}
                                            className="cursor-pointer"
                                        >
                                            <Check className={cn('h-4 w-4', option.value === value ? 'opacity-100' : 'opacity-0')} />
                                            <span className="flex-1">{option.label}</span>
                                        </CommandItem>
                                    ))}
                                </CommandGroup>
                            ))}
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>
            {allowClear && selected && !disabled && (
                <button
                    type="button"
                    onClick={() => onChange('')}
                    aria-label="Limpiar selección"
                    className="absolute right-8 top-1/2 -translate-y-1/2 rounded-full p-0.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                >
                    <X className="h-3.5 w-3.5" />
                </button>
            )}
        </div>
    );
}
