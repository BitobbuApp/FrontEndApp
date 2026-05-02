// src/features/notifications/services/notificationsApi.js

import apiClient from '@/api/axiosClient';

/**
 * GET /notifications
 * Returns paginated notifications for the authenticated company.
 * @param {Object} params - { page, limit, only_unread }
 */
export async function getNotifications({ page = 1, limit = 20, only_unread = false } = {}) {
    const res = await apiClient.get('/notifications', {
        params: { page, limit, only_unread },
    });
    return res.data;
}

/**
 * PATCH /notifications/:id/read
 * Marks a single notification as read.
 * @param {string} id - Notification UUID
 */
export async function markNotificationRead(id) {
    const res = await apiClient.patch(`/notifications/${id}/read`);
    return res.data;
}

/**
 * PATCH /notifications/read-all
 * Marks all notifications of the authenticated company as read.
 */
export async function markAllNotificationsRead() {
    const res = await apiClient.patch('/notifications/read-all');
    return res.data;
}
