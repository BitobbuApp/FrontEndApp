# WebSocket Chat UI Best Practices Implementation Plan

## Scope
Improve real-time UX and stability for server-driven events in chat by hardening:
- `src/api/socketClient.js`
- `src/features/chat/hooks/useChatData.js`
- `src/features/chat/components/GlobalSocketManager.jsx`
- Chat rendering behavior in `src/features/chat/components/ChatArea.jsx`

Goal: users should perceive fast, consistent, and non-duplicated UI updates when server events arrive, including during reconnects and tab switches.

## Current Pain Points (From Code Review)
1. Event handling is duplicated across `useChatData` and `GlobalSocketManager`, causing duplicate side effects (toasts + repeated invalidations).
2. `invalidateQueries(['conversaciones'])` is used very often, producing unnecessary refetches and UI jitter.
3. No explicit socket connection-state surfaced to the UI (`connected`, `reconnecting`, `offline`).
4. `mark_read` is emitted immediately on every incoming message while viewing a chat, without throttling/debounce.
5. Event payload normalization is missing (different events may have different fields), increasing brittle conditionals.
6. Toast strategy is not centralized and may notify for low-value internal transitions.
7. Message update flow mixes optimistic updates + server echo without a formal dedup contract beyond `id` checks.
8. No reconnection/backfill strategy to catch missed events after temporary disconnect.

## Target Architecture
1. Single source of truth for socket event registration and dispatch.
2. Event-to-action map with normalized payload schema.
3. Query cache patch-first strategy, fallback invalidation only when patching is impossible.
4. UI-level connection status indicator and reconnect feedback.
5. Idempotent message processing (by `message.id` and `client_msg_id` where available).
6. Controlled notifications (toast policy by event type + actor).

## Phased Plan

## Phase 1: Harden Socket Client Foundation
Files:
- `src/api/socketClient.js`

Actions:
1. Add explicit client options for resilience:
   - `transports`, `reconnection`, `reconnectionAttempts`, `reconnectionDelay`, `timeout`.
2. Export minimal socket state helpers:
   - `isSocketConnected()`
   - optional `getSocketId()`
3. Add connection lifecycle listeners:
   - `connect`, `disconnect`, `reconnect_attempt`, `reconnect`, `connect_error`.
4. Define token refresh hook point:
   - update `socket.auth` before reconnect attempt.
5. Add defensive guards:
   - avoid duplicate `connect()` calls while `socket.active`/connecting.

Deliverable:
- Stable socket connection behavior with predictable reconnect logs/state.

## Phase 2: Centralize Chat Event Contracts
Files:
- `src/features/chat/hooks/useChatData.js`
- `src/features/chat/components/GlobalSocketManager.jsx`
- new: `src/features/chat/socket/chatSocketEvents.js`

Actions:
1. Create a centralized event catalog:
   - array/constants of all chat + quote + transaction events.
2. Add payload normalizer per event family:
   - guarantees `conversation_id`, `quote_response_id`, `transaction_id`, `action`, `actor_company_id`, `timestamp`.
3. Refactor listeners to use shared handlers/utilities.
4. Prevent duplicate subscriptions:
   - ensure one registration path per event group.
5. Keep responsibility split clear:
   - `GlobalSocketManager`: cross-app/global notifications + broad cache sync.
   - `useChatData`: selected-conversation message list and read-state behavior.

Deliverable:
- Deterministic event flow with no duplicated toasts or duplicate invalidations.

## Phase 3: Query Cache Update Strategy (Patch First)
Files:
- `src/features/chat/hooks/useChatData.js`
- optional new helper: `src/features/chat/socket/chatCacheUpdater.js`

Actions:
1. Replace frequent `invalidateQueries` with targeted `setQueryData` updates for:
   - conversation last message
   - unread counters
   - conversation status transitions
2. Use selective invalidation only when:
   - normalized payload lacks required identifiers
   - cache record not found locally.
3. Add immutable helpers to reduce repeated map logic and avoid accidental cache shape drift.

Deliverable:
- Faster perceived updates and reduced network load under active chats.

## Phase 4: UX Reliability for Message Lifecycle
Files:
- `src/features/chat/hooks/useChatData.js`
- `src/features/chat/components/ChatArea.jsx`

Actions:
1. Introduce message state model:
   - `pending` (optimistic), `sent`, `failed`, `read`.
2. For send flow:
   - insert optimistic message with `client_msg_id`.
   - reconcile on server ack/echo by `client_msg_id` then `id`.
   - show retry action for `failed` messages.
3. Throttle/debounce `mark_read` emits while conversation is open.
4. Guard auto-scroll behavior:
   - auto-scroll only if user is near bottom.
   - preserve scroll position when reading older messages.

Deliverable:
- Smooth message UX with fewer jumps and clear delivery feedback.

## Phase 5: Connection-Aware UI Feedback
Files:
- `src/features/chat/components/ChatArea.jsx`
- `src/features/chat/components/ConversationList.jsx`
- optional new hook: `src/features/chat/hooks/useSocketConnectionState.js`

Actions:
1. Expose socket status to UI (`connected`, `reconnecting`, `offline`).
2. Show lightweight banner/state chip in chat header.
3. Disable send button only when truly offline (or queue pending sends if chosen).
4. On reconnect, trigger one backfill sync for active conversation.

Deliverable:
- Users understand connection state and trust message delivery behavior.

## Phase 6: Toast and Notification Policy
Files:
- `src/features/chat/components/GlobalSocketManager.jsx`
- `src/features/chat/hooks/useChatData.js`
- optional new: `src/features/chat/socket/chatToastPolicy.js`

Actions:
1. Centralize toast decision rules:
   - ignore events triggered by same actor (`actor_company_id === myCompanyId`).
   - only toast high-signal events.
2. Deduplicate repeated toasts using event fingerprint (`event + entityId + timestampBucket`).
3. Standardize copy by event type and severity.

Deliverable:
- Less noisy, more meaningful real-time notifications.

## Phase 7: Observability and Safety Nets
Files:
- `src/features/chat/...` (multiple)

Actions:
1. Add debug-only logging utility behind environment flag.
2. Add counters/metrics hooks (if analytics exists):
   - reconnect count
   - duplicate event drops
   - optimistic message failures.
3. Add tests (unit + integration):
   - duplicate event idempotency
   - cache update correctness
   - reconnect backfill behavior
   - toast suppression for own actions.

Deliverable:
- Easier diagnosis of real-time issues and confidence in regressions.

## Priority Order
1. Phase 1 + 2 (foundation and event centralization)
2. Phase 3 (cache patching)
3. Phase 4 (message lifecycle UX)
4. Phase 5 + 6 (connection UX + toast policy)
5. Phase 7 (observability/tests)

## Acceptance Criteria
1. No duplicate toasts for a single server event.
2. No duplicate messages rendered after ack + echo paths.
3. Conversation list updates instantly without full-list refetch in normal cases.
4. During reconnect, user sees status and conversation recovers without manual refresh.
5. Read receipts are updated with reduced socket chatter (throttled `mark_read`).
6. Event listeners are registered once and cleaned up correctly on unmount/change.

## Implementation Notes
1. Keep incremental rollout behind small PRs per phase to reduce risk.
2. Validate with two browser sessions (different users) to verify actor-based notification suppression.
3. Prefer shared utilities under `src/features/chat/socket/` to avoid repeated event logic in hooks/components.
