import { differenceInCalendarDays, format } from 'date-fns';
import { es } from 'date-fns/locale';

export const DEADLINE_TONE_CLASSES = {
    danger: 'bg-red-50 text-red-600',
    warning: 'bg-amber-50 text-amber-600',
    neutral: 'bg-slate-100 text-slate-600',
};

/**
 * Urgency info for a request's expiration date.
 * Returns null when there is no date; `tone` is danger (<=3 days / expired), warning (<=7) or neutral.
 */
export function getDeadlineInfo(expirationDate) {
    if (!expirationDate) return null;

    const date = new Date(expirationDate);
    const days = differenceInCalendarDays(date, new Date());

    let label;
    let tone;
    if (days < 0) {
        label = 'Vencida';
        tone = 'danger';
    } else if (days === 0) {
        label = 'Hoy';
        tone = 'danger';
    } else {
        label = `En ${days} ${days === 1 ? 'día' : 'días'}`;
        tone = days <= 3 ? 'danger' : days <= 7 ? 'warning' : 'neutral';
    }

    return {
        label,
        tone,
        dateLabel: format(date, 'd MMM yyyy', { locale: es }),
        shortDateLabel: format(date, 'd MMM', { locale: es }),
    };
}
