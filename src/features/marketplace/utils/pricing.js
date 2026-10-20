/**
 * Unit price of a marketplace offer for a given quantity, using its pricing tiers.
 * Falls back to the base price when no tier matches (or the offer has no tiers).
 */
export function getTierUnitPrice(offer, quantity) {
    if (!offer) return null;
    const qty = Number(quantity) || 0;
    const tier = (offer.pricing_tiers || []).find((t) =>
        qty >= Number(t.min_quantity) && (t.max_quantity == null || qty <= Number(t.max_quantity))
    );
    if (tier) return Number(tier.price_usd);
    return offer.base_price_usd != null ? Number(offer.base_price_usd) : null;
}

export const formatUsd = (value) =>
    `$${Number(value || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
