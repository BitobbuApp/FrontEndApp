import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { quoteResponsesApi } from '@/features/requests/services/quoteResponsesApi';
import { transactionsApi } from '@/features/transactions/services/transactionsApi';
import { getDealStage } from '../utils/dealStage';

/**
 * Deal stage of a conversation. Shares the query keys of ChatActionPanel
 * (['quote-response-detail', id] / ['transaction-detail', id]) so there are no extra requests
 * and socket-driven invalidations refresh it automatically.
 */
export function useDealState(conversation, user) {
    const myId = user?.companyId || user?.company_id || user?.id;
    const hasTransaction = !!conversation?.transaction_id;
    const quoteId = conversation?.quote_response_id;

    const { data: quoteResponse } = useQuery({
        queryKey: ['quote-response-detail', quoteId],
        queryFn: () => quoteResponsesApi.getQuoteResponseWithSupplier(quoteId),
        enabled: !hasTransaction && !!quoteId,
    });

    const { data: transaction } = useQuery({
        queryKey: ['transaction-detail', conversation?.transaction_id],
        queryFn: () => transactionsApi.getTransactionById(conversation.transaction_id),
        enabled: hasTransaction,
    });

    const stage = useMemo(
        () => getDealStage({ conversation, quote: quoteResponse?.data, transaction, myId }),
        [conversation, quoteResponse, transaction, myId]
    );

    return { stage };
}
