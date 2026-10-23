import React, { useMemo, useState } from 'react';
import { Check, ChevronsUpDown, Search, X } from 'lucide-react';
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

/** "Lácteos" → "lacteos": search ignores accents and case. */
const normalize = (text) => String(text ?? '')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase();

// cmdk filter: every word typed must appear in the option or group label (keywords)
const accentInsensitiveFilter = (_value, search, keywords = []) => {
    const haystack = normalize(keywords.join(' '));
    return normalize(search).split(/\s+/).filter(Boolean).every((term) => haystack.includes(term)) ? 1 : 0;
};

/**
 * Multi-select with autocomplete, grouped by sections (e.g. subcategories grouped by category).
 * The popover stays open while selecting so several options can be picked in a row;
 * the selected ones are shown below as removable chips.
 *
 * groups: [{ value, label, options: [{ value, label }] }]
 */
export default function GroupedMultiCombobox({
    groups = [],
    selectedValues = [],
    onToggle,
    placeholder = 'Buscar y agregar…',
    searchPlaceholder = 'Escribe para buscar…',
    emptyText = 'Sin resultados',
    emptySelectionText = 'Aún no seleccionaste ninguna opción.',
    className = '',
}) {
    const [open, setOpen] = useState(false);
    const selected = useMemo(() => new Set(selectedValues), [selectedValues]);

    // Selected options grouped by their section, in the same order as `groups`
    const selectedGroups = useMemo(() => groups
        .map((group) => ({ ...group, options: group.options.filter((option) => selected.has(option.value)) }))
        .filter((group) => group.options.length > 0), [groups, selected]);

    const showGroupLabels = selectedGroups.length > 1;

    return (
        <div className={cn('space-y-3', className)}>
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <button
                        type="button"
                        role="combobox"
                        aria-expanded={open}
                        aria-label={placeholder}
                        className="flex h-11 w-full items-center gap-2 rounded-md border border-input bg-background px-3 text-left text-sm text-slate-500 shadow-sm transition-colors hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#D2FC31]/40"
                    >
                        <Search className="h-4 w-4 shrink-0 opacity-60" />
                        <span className="flex-1 truncate">{placeholder}</span>
                        {selectedValues.length > 0 && (
                            <span className="rounded-full bg-[#D2FC31] px-2 py-0.5 text-xs font-semibold text-slate-900">
                                {selectedValues.length}
                            </span>
                        )}
                        <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
                    </button>
                </PopoverTrigger>
                <PopoverContent
                    className="w-[--radix-popover-trigger-width] min-w-[260px] max-w-[calc(100vw-2rem)] p-0"
                    align="start"
                >
                    <Command filter={accentInsensitiveFilter}>
                        <CommandInput placeholder={searchPlaceholder} />
                        <CommandList className="max-h-72">
                            <CommandEmpty>{emptyText}</CommandEmpty>
                            {groups.map((group) => (
                                <CommandGroup key={group.value} heading={group.label}>
                                    {group.options.map((option) => {
                                        const isSelected = selected.has(option.value);
                                        return (
                                            <CommandItem
                                                key={option.value}
                                                value={option.value}
                                                keywords={[option.label, group.label]}
                                                onSelect={() => onToggle(option.value)}
                                                className="cursor-pointer"
                                            >
                                                <span
                                                    className={cn(
                                                        'flex h-4 w-4 items-center justify-center rounded-sm border',
                                                        isSelected ? 'border-[#c4ed2d] bg-[#D2FC31] text-slate-900' : 'border-slate-300'
                                                    )}
                                                >
                                                    {isSelected && <Check className="h-3 w-3" />}
                                                </span>
                                                <span className="flex-1">{option.label}</span>
                                            </CommandItem>
                                        );
                                    })}
                                </CommandGroup>
                            ))}
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>

            {selectedGroups.length === 0 ? (
                <p className="text-xs text-slate-400">{emptySelectionText}</p>
            ) : (
                <div className="space-y-2">
                    {selectedGroups.map((group) => (
                        <div key={group.value} className="flex flex-wrap items-center gap-1.5">
                            {showGroupLabels && (
                                <span className="mr-1 text-xs font-semibold text-slate-500">{group.label}:</span>
                            )}
                            {group.options.map((option) => (
                                <span
                                    key={option.value}
                                    className="inline-flex items-center gap-1 rounded-full bg-[#D2FC31] py-0.5 pl-2.5 pr-1 text-xs font-medium text-slate-900"
                                >
                                    {option.label}
                                    <button
                                        type="button"
                                        onClick={() => onToggle(option.value)}
                                        aria-label={`Quitar ${option.label}`}
                                        className="rounded-full p-0.5 hover:bg-slate-900/10"
                                    >
                                        <X className="h-3 w-3" />
                                    </button>
                                </span>
                            ))}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
