import { useQuery } from '@tanstack/react-query';
import { transactionsApi } from '@/features/transactions/services/transactionsApi';

/**
 * Review state of the current company in a conversation waiting for reviews (`pending_review`).
 * Shares the ['transaction-detail', id] query with ReviewModal.
 */
export function useReviewState(conversation, user) {
    const isPendingReview = conversation?.status === 'pending_review';

    const { data: transaction, isLoading } = useQuery({
        queryKey: ['transaction-detail', conversation?.transaction_id],
        queryFn: () => transactionsApi.getTransactionById(conversation.transaction_id),
        enabled: isPendingReview && !!conversation?.transaction_id,
    });

    const myCompanyId = user?.companyId || user?.company_id || user?.id;
    const isSupplier = transaction?.supplier_id === myCompanyId;
    const myStatus = isSupplier ? transaction?.supplier_review_status : transaction?.buyer_review_status;

    return { transaction, isLoading, isSupplier, alreadyReviewed: isPendingReview && myStatus === 'submitted' };
}
