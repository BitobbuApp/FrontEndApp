import React, { useState } from 'react';
import { ChevronDown, ChevronRight, Package } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import useAppMetadata from '@/features/appMetadata/hooks/useAppMetadata';
import { cn } from '@/lib/utils';

const VISIBLE_CATEGORIES = 7;

/**
 * Navigable categories panel: a category expands its subcategories;
 * clicking "Todo en …" or a subcategory filters the products below.
 */
function CategoriesPanel({ selectedCategoryId, selectedSubcategoryId, onSelectCategory, onSelectSubcategory }) {
    const { categoryOptions, getSubcategoryOptions } = useAppMetadata();
    const [expanded, setExpanded] = useState(selectedCategoryId || '');
    const [showAll, setShowAll] = useState(false);

    const visible = showAll ? categoryOptions : categoryOptions.slice(0, VISIBLE_CATEGORIES);

    return (
        <div className="hidden lg:flex lg:flex-col lg:col-span-3 bg-white rounded-2xl p-4 shadow-sm border border-slate-100 max-h-[560px]">
            <h3 className="font-bold text-lg mb-4 text-[#0B2046]">Categorías</h3>
            <div className="space-y-1 overflow-y-auto pr-1">
                {visible.map((category) => {
                    const subcategories = getSubcategoryOptions(category.value);
                    const isExpanded = expanded === category.value;
                    const isActive = selectedCategoryId === category.value;
                    return (
                        <div key={category.id}>
                            <button
                                type="button"
                                onClick={() => (subcategories.length > 0
                                    ? setExpanded(isExpanded ? '' : category.value)
                                    : onSelectCategory(category.value))}
                                aria-expanded={subcategories.length > 0 ? isExpanded : undefined}
                                className={cn(
                                    'w-full flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 text-slate-700 hover:text-[#0B2046] transition-colors group',
                                    isActive && 'bg-slate-50 text-[#0B2046]'
                                )}
                            >
                                <div className="flex items-center gap-3">
                                    <div className={cn('text-slate-400 group-hover:text-[#D2FC31]', isActive && 'text-[#0B2046]')}>
                                        <Package className="w-5 h-5" />
                                    </div>
                                    <span className="font-medium text-sm text-left">{category.label}</span>
                                </div>
                                {subcategories.length > 0 && isExpanded
                                    ? <ChevronDown className="w-4 h-4 text-[#0B2046]" />
                                    : <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-[#0B2046]" />}
                            </button>

                            {isExpanded && subcategories.length > 0 && (
                                <div className="ml-11 mb-2 mt-1 space-y-0.5 border-l border-slate-100 pl-3">
                                    <button
                                        type="button"
                                        onClick={() => onSelectCategory(category.value)}
                                        className={cn(
                                            'block w-full text-left text-xs font-semibold py-1.5 text-[#0B2046] hover:underline',
                                            isActive && !selectedSubcategoryId && 'underline'
                                        )}
                                    >
                                        Todo en {category.label}
                                    </button>
                                    {subcategories.map((subcategory) => (
                                        <button
                                            key={subcategory.id}
                                            type="button"
                                            onClick={() => onSelectSubcategory(subcategory.value, category.value)}
                                            className={cn(
                                                'block w-full text-left text-xs py-1.5 text-slate-600 hover:text-[#0B2046]',
                                                selectedSubcategoryId === subcategory.value && 'font-semibold text-[#0B2046]'
                                            )}
                                        >
                                            {subcategory.label}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
            {categoryOptions.length > VISIBLE_CATEGORIES && (
                <button
                    type="button"
                    onClick={() => setShowAll((value) => !value)}
                    className="w-full mt-4 p-3 text-sm font-bold text-[#0B2046] hover:bg-slate-50 rounded-lg flex items-center justify-center gap-2"
                >
                    {showAll ? 'Ver menos categorías' : 'Ver todas las categorías'}
                    <ChevronRight className={cn('w-4 h-4 transition-transform', showAll && '-rotate-90')} />
                </button>
            )}
        </div>
    );
}

const STEPS = [
    'Crea tu cuenta gratis',
    'Publica lo que necesitas o lo que vendes',
    'Recibe cotizaciones y conversa por chat',
];

/** Horizontal category chips for screens where the side panel is hidden. */
function CategoryChips({ selectedCategoryId, onSelectCategory }) {
    const { categoryOptions } = useAppMetadata();
    if (categoryOptions.length === 0) return null;

    return (
        <div className="lg:hidden -mx-4 px-4 sm:-mx-6 sm:px-6 overflow-x-auto">
            <div className="flex gap-2 pb-1 w-max">
                {categoryOptions.map((category) => (
                    <button
                        key={category.id}
                        type="button"
                        onClick={() => onSelectCategory(category.value)}
                        className={cn(
                            'whitespace-nowrap rounded-full border px-4 py-2 text-sm font-medium transition-colors',
                            selectedCategoryId === category.value
                                ? 'border-[#0B2046] bg-[#0B2046] text-white'
                                : 'border-slate-200 bg-white text-slate-700 hover:border-[#0B2046]'
                        )}
                    >
                        {category.label}
                    </button>
                ))}
            </div>
        </div>
    );
}

export default function HeroSection({ selectedCategoryId, selectedSubcategoryId, onSelectCategory, onSelectSubcategory }) {
    const navigate = useNavigate();

    return (
        <div id="hero-categorias" className="w-full mb-10 pt-4 space-y-4 scroll-mt-24">
            <CategoryChips selectedCategoryId={selectedCategoryId} onSelectCategory={onSelectCategory} />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                {/* Left Column: navigable categories / subcategories */}
                <CategoriesPanel
                    selectedCategoryId={selectedCategoryId}
                    selectedSubcategoryId={selectedSubcategoryId}
                    onSelectCategory={onSelectCategory}
                    onSelectSubcategory={onSelectSubcategory}
                />

                {/* Welcome banner */}
                <div className="lg:col-span-9 rounded-2xl bg-[#0B2046] p-5 sm:p-8 lg:p-12 shadow-sm flex flex-col justify-center">
                    <h2 className="text-2xl sm:text-3xl lg:text-5xl font-extrabold text-white leading-tight mb-3 tracking-tight max-w-2xl">
                        Compra y vende entre empresas de Venezuela
                    </h2>
                    <p className="text-slate-300 text-base lg:text-lg max-w-xl mb-5 lg:mb-6">
                        Pide cotizaciones o muestra tus productos. Sin intermediarios.
                    </p>
                    <div className="flex flex-col min-[400px]:flex-row gap-3 mb-6 lg:mb-8">
                        <Button
                            onClick={() => navigate('/register')}
                            className="h-11 lg:h-12 flex-1 sm:flex-none sm:px-6 bg-[#D2FC31] text-slate-900 hover:bg-[#c4ed2d] font-bold"
                        >
                            Crear cuenta gratis
                        </Button>
                        <Button
                            variant="outline"
                            onClick={() => navigate('/login')}
                            className="h-11 lg:h-12 flex-1 sm:flex-none sm:px-6 bg-transparent border-white/30 text-white hover:bg-white/10 hover:text-white font-semibold"
                        >
                            Ya tengo cuenta
                        </Button>
                    </div>

                    <div id="como-funciona" className="scroll-mt-24 border-t border-white/10 pt-5">
                        <p className="text-xs font-bold uppercase tracking-wide text-[#D2FC31] mb-3">Cómo funciona</p>
                        <ol className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                            {STEPS.map((step, index) => (
                                <li key={step} className="flex items-start gap-3 text-sm font-medium text-white">
                                    <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-[#D2FC31] text-xs font-bold text-[#0B2046]">
                                        {index + 1}
                                    </span>
                                    <span className="pt-0.5">{step}</span>
                                </li>
                            ))}
                        </ol>
                    </div>
                </div>
            </div>
        </div>
    );
}
