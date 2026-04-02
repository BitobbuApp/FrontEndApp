import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { appMetadataApi } from '../services/appMetadataApi';

export const APP_METADATA_QUERY_KEY = ['appMetadata'];

const DEFAULT_LANGUAGE = 'es';

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

    return preferred.find((value) => normalizeText(value)) || normalizeText(item.name) || normalizeText(item.abbreviation);
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
        const optionLabel = normalizeText(option.label).toLowerCase();
        const optionName = normalizeText(option.raw?.name).toLowerCase();
        const optionAbbreviation = normalizeText(option.raw?.abbreviation).toLowerCase();
        const optionEnglish = normalizeText(option.raw?.name_en).toLowerCase();
        const optionSpanish = normalizeText(option.raw?.name_es).toLowerCase();

        return [
            optionLabel,
            optionName,
            optionAbbreviation,
            optionEnglish,
            optionSpanish,
        ].includes(normalizedLabel);
    })?.value || '';
}

export function toNumberIdList(values) {
    return values
        .map((value) => Number(value))
        .filter((value) => Number.isInteger(value) && value > 0);
}

export default function useAppMetadata({ language = DEFAULT_LANGUAGE, enabled = true } = {}) {
    const query = useQuery({
        queryKey: APP_METADATA_QUERY_KEY,
        queryFn: async () => {
            const response = await appMetadataApi.getAppMetadata();
            return response.data || {};
        },
        enabled,
        staleTime: Infinity,
        gcTime: Infinity,
    });

    const metadata = query.data || {};

    const {
        categories,
        companyTypes,
        notificationTypes,
        paymentMethods,
        unitsOfMeasure,
        verificationDocumentTypes,
    } = useMemo(() => {
        return {
            categories: normalizeList(metadata.categories),
            companyTypes: normalizeList(metadata.company_types),
            notificationTypes: normalizeList(metadata.notification_types),
            paymentMethods: normalizeList(metadata.payment_methods),
            unitsOfMeasure: normalizeList(metadata.units_of_measure),
            verificationDocumentTypes: normalizeList(metadata.verif_doc_types),
        };
    }, [metadata]);

    const {
        categoryOptions,
        companyTypeOptions,
        paymentMethodOptions,
        unitOptions,
        verificationDocumentTypeOptions,
        notificationTypeOptions,
    } = useMemo(() => {
        return {
            categoryOptions: categories
                .filter((item) => item?.is_active !== false)
                .map((item) => toSelectOption(item, getLocalizedLabel(item, language))),
            companyTypeOptions: companyTypes.map((item) =>
                toSelectOption(item, getLocalizedLabel(item, language))
            ),
            paymentMethodOptions: paymentMethods
                .filter((item) => item?.is_active !== false)
                .map((item) => toSelectOption(item, getLocalizedLabel(item, language))),
            unitOptions: unitsOfMeasure.map((item) =>
                toSelectOption(item, normalizeText(item.abbreviation) || normalizeText(item.name))
            ),
            verificationDocumentTypeOptions: verificationDocumentTypes.map((item) =>
                toSelectOption(item, normalizeText(item.name))
            ),
            notificationTypeOptions: notificationTypes.map((item) =>
                toSelectOption(item, normalizeText(item.name))
            ),
        };
    }, [
        categories,
        companyTypes,
        paymentMethods,
        unitsOfMeasure,
        verificationDocumentTypes,
        notificationTypes,
        language
    ]);

    return {
        ...query,
        metadata,
        categories,
        companyTypes,
        notificationTypes,
        paymentMethods,
        unitsOfMeasure,
        verificationDocumentTypes,
        categoryOptions,
        companyTypeOptions,
        paymentMethodOptions,
        unitOptions,
        verificationDocumentTypeOptions,
        notificationTypeOptions,
        defaultUnitOption: unitOptions[0] || null,
        toNumberIdList,
    };
}
