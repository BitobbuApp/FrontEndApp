import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { appMetadataApi } from '../services/appMetadataApi';
import { geographicApi } from '../../geographic/services/geographicApi';

export const APP_METADATA_QUERY_KEY = 'appMetadata';

const DEFAULT_LANGUAGE = 'es';

const DEFAULT_COUNTRY = 1;

function normalizeList(value) {
    return Array.isArray(value) ? value : [];
}

function normalizeText(value) {
    return typeof value === 'string' ? value.trim() : '';
}

function getLocalizedLabel(item, language = DEFAULT_LANGUAGE) {
    if (!item || typeof item !== 'object') {
        return '';
    }

    const preferred = language === 'en'
        ? [item.name_en, item.name_es]
        : [item.name_es, item.name_en];

    return preferred.find((value) => normalizeText(value))
        || normalizeText(item.name)
        || normalizeText(item.abbreviation);
}

function toSelectOption(item, label) {
    return {
        id: item.id,
        value: String(item.id),
        label,
        raw: item,
    };
}

export function findOptionValueById(options, id) {
    if (id == null || id === '') {
        return '';
    }
    return options.find((option) => option.id === Number(id))?.value || '';
}

export function findOptionValueByLabel(options, label) {
    const normalizedLabel = normalizeText(label).toLowerCase();
    if (!normalizedLabel) {
        return '';
    }

    return options.find((option) => {
        const optionLabel      = normalizeText(option.label).toLowerCase();
        const optionName       = normalizeText(option.raw?.name).toLowerCase();
        const optionAbbr       = normalizeText(option.raw?.abbreviation).toLowerCase();
        const optionEnglish    = normalizeText(option.raw?.name_en).toLowerCase();
        const optionSpanish    = normalizeText(option.raw?.name_es).toLowerCase();

        return [optionLabel, optionName, optionAbbr, optionEnglish, optionSpanish]
            .includes(normalizedLabel);
    })?.value || '';
}

export function toNumberIdList(values) {
    return values
        .map((value) => Number(value))
        .filter((value) => Number.isInteger(value) && value > 0);
}

export default function useAppMetadata({ language = DEFAULT_LANGUAGE, enabled = true } = {}) {
    const token = localStorage.getItem('bitobbu_token');

    const query = useQuery({
        queryKey: [APP_METADATA_QUERY_KEY, !!token],
        queryFn: async () => {
            const promises = [
                appMetadataApi.getAppMetadata(),
                geographicApi.getCountries(),
                geographicApi.getStatesByCountry(1), // 1 = Venezuela
            ];

            if (token) {
                promises.push(appMetadataApi.getDeliveryMethods(1));
            }

            const results = await Promise.all(promises);
            const [appMeta, countriesResp, statesResp, deliveryMethodsResp] = results;
            
            return {
                ...(appMeta.data || {}),
                countries: Array.isArray(countriesResp) ? countriesResp : (countriesResp?.data || []),
                states: Array.isArray(statesResp) ? statesResp : (statesResp?.data || []),
                deliveryMethods: deliveryMethodsResp 
                    ? (Array.isArray(deliveryMethodsResp) ? deliveryMethodsResp : (deliveryMethodsResp?.data || [])) 
                    : [],
            };
        },
        enabled,
        staleTime: Infinity,
        gcTime: Infinity,
    });

    const metadata = query.data || {};

    // ── Raw lists ────────────────────────────────────────────────────────────
    const {
        categories,
        companyTypes,
        notificationTypes,
        paymentMethods,
        unitsOfMeasure,
        verificationDocumentTypes,
        // New in V6
        paymentConditions,
        estimatedMonthlyTransactions,
        companySizes,
        countries,
        states,
        deliveryMethods,
    } = useMemo(() => {
        return {
            categories:                   normalizeList(metadata.categories),
            companyTypes:                 normalizeList(metadata.company_types),
            notificationTypes:            normalizeList(metadata.notification_types),
            paymentMethods:               normalizeList(metadata.payment_methods),
            unitsOfMeasure:               normalizeList(metadata.units_of_measure),
            verificationDocumentTypes:    normalizeList(metadata.verif_doc_types),
            // V6 additions
            paymentConditions:            normalizeList(metadata.payment_conditions),
            estimatedMonthlyTransactions: normalizeList(metadata.estimated_monthly_transactions),
            companySizes:                 normalizeList(metadata.company_sizes),
            // Geographic 
            countries:                    normalizeList(metadata.countries),
            states:                       normalizeList(metadata.states),
            deliveryMethods:              normalizeList(metadata.deliveryMethods),
        };
    }, [metadata]);

    // ── Select options ───────────────────────────────────────────────────────
    const {
        categoryOptions,
        companyTypeOptions,
        paymentMethodOptions,
        unitOptions,
        verificationDocumentTypeOptions,
        notificationTypeOptions,
        // New in V6
        paymentConditionOptions,
        estimatedMonthlyTransactionOptions,
        companySizeOptions,
        deliveryMethodOptions,
    } = useMemo(() => {
        return {
            categoryOptions: categories
                .filter((item) => item?.is_active !== false)
                .map((item) => toSelectOption(item, getLocalizedLabel(item, language))),

            companyTypeOptions: companyTypes
                .map((item) => toSelectOption(item, getLocalizedLabel(item, language))),

            paymentMethodOptions: paymentMethods
                .filter((item) => item?.is_active !== false)
                .map((item) => toSelectOption(item, getLocalizedLabel(item, language))),

            unitOptions: unitsOfMeasure
                .map((item) => toSelectOption(item, normalizeText(item.name))),

            verificationDocumentTypeOptions: verificationDocumentTypes
                .map((item) => toSelectOption(item, normalizeText(item.name))),

            notificationTypeOptions: notificationTypes
                .map((item) => toSelectOption(item, normalizeText(item.name))),

            // payment_conditions: bilingual name_en / name_es
            paymentConditionOptions: paymentConditions
                .filter((item) => item?.is_active !== false)
                .map((item) => toSelectOption(item, getLocalizedLabel(item, language))),

            // estimated_monthly_transactions: description / description_es
            estimatedMonthlyTransactionOptions: estimatedMonthlyTransactions
                .map((item) => {
                    const label = language === 'en'
                        ? normalizeText(item.description) || normalizeText(item.description_es)
                        : normalizeText(item.description_es) || normalizeText(item.description);
                    return toSelectOption(item, label || normalizeText(item.range_name));
                }),

            // company_sizes: display_label / display_label_es
            companySizeOptions: companySizes
                .filter((item) => item?.is_active !== false)
                .map((item) => {
                    const label = language === 'en'
                        ? normalizeText(item.display_label) || normalizeText(item.display_label_es)
                        : normalizeText(item.display_label_es) || normalizeText(item.display_label);
                    return toSelectOption(item, label || normalizeText(item.size_name));
                }),

            deliveryMethodOptions: deliveryMethods
                .filter((item) => item?.is_active !== false)
                .map((item) => toSelectOption(item, normalizeText(item.name))),
        };
    }, [
        categories,
        companyTypes,
        paymentMethods,
        unitsOfMeasure,
        verificationDocumentTypes,
        notificationTypes,
        paymentConditions,
        estimatedMonthlyTransactions,
        companySizes,
        countries,
        states,
        deliveryMethods,
        language,
    ]);

    return {
        ...query,
        metadata,

        // Raw lists
        categories,
        companyTypes,
        notificationTypes,
        paymentMethods,
        unitsOfMeasure,
        verificationDocumentTypes,
        paymentConditions,
        estimatedMonthlyTransactions,
        companySizes,
        countries,
        states,
        deliveryMethods,

        // Select options
        categoryOptions,
        companyTypeOptions,
        paymentMethodOptions,
        unitOptions,
        verificationDocumentTypeOptions,
        notificationTypeOptions,
        paymentConditionOptions,
        estimatedMonthlyTransactionOptions,
        companySizeOptions,
        deliveryMethodOptions,

        // Convenience
        defaultUnitOption: unitOptions[0] || null,
        toNumberIdList,
        resolveLocation: (countryId, stateId) => {
            if (!countryId || !stateId) return 'Por acordar';
            const country = countries.find((c) => Number(c.id) === Number(countryId));
            const state = states.find((s) => Number(s.id) === Number(stateId));
            return country && state ? `${country.name_es} / ${state.name}` : 'Por acordar';
        },
    };
}
