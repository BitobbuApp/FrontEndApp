/**
 * Builds the `offer` passed in router state to /Requests/new so the RFQ is sent
 * directly to the supplier that owns the product (see useRequestForm `directOffer`).
 */
export function buildDirectOffer(product, tradeName) {
    return {
        id: product.id,
        name: product.name,
        company_id: product.company_id,
        category_id: product.category_id,
        subcategory_id: product.subcategory_id,
        unit_id: product.unit_id,
        unit_of_measure: product.unit_of_measure,
        moq: product.moq,
        base_price_usd: product.base_price_usd,
        pricing_tiers: product.pricing_tiers || [],
        trade_name: tradeName,
    };
}
