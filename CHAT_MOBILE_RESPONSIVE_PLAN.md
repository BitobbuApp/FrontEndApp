# Chat Mobile Responsiveness Plan

## Goal
Make `src/features/chat` behave like a mobile-first app while keeping desktop behavior intact and following `.rules` architecture/styling constraints.

## Rule Alignment (Mandatory)
- Keep feature boundaries: only change files inside `src/features/chat` unless a shared UI primitive is required.
- Keep Page as orchestrator: no API/query logic in `ChatPage.jsx`.
- Keep data/socket logic in hooks/services unchanged unless strictly needed for UI behavior.
- Use Tailwind + semantic tokens where possible (`bg-background`, `text-foreground`, `border-border`, `bg-muted`).
- Preserve existing brand usage (`#D2FC31`) only in branded accents.
- Mobile-first classes first, then `lg:` desktop overrides.

## Current Problems to Fix
- `ChatPage.jsx` uses a fixed split layout (`h-[calc(100vh-8rem)] flex gap-4`) that does not adapt to narrow screens.
- `ConversationList.jsx` is hard-fixed to `w-80`, forcing cramped or broken layouts on mobile.
- `ChatArea.jsx` message bubbles (`max-w-[70%]`) are too wide for small screens and can overflow with long content/attachments.
- Header/action areas in `ChatArea.jsx` and `ChatActionPanel.jsx` become dense and hard to use on small touch targets.
- Input area can clash with mobile keyboard/safe area spacing.

## Implementation Plan

### Phase 1: Layout State and Mobile Navigation
1. Update `src/features/chat/ChatPage.jsx`:
- Add `useIsMobile()` from `src/hooks/use-mobile.jsx`.
- Add local UI state:
  - `isListOpen` (mobile conversation drawer visibility)
  - `showChatPane` (whether chat detail is shown on mobile)
- Desktop (`lg:`): keep two-column split behavior.
- Mobile (`< lg`): show either conversation list or chat detail, not both at once.
- On conversation select, close list and open chat detail.
- Add a back action path from chat detail to list.

2. Mobile container behavior:
- Replace fixed desktop-first wrapper with mobile-first height/layout classes.
- Use `min-h-0`, `overflow-hidden`, and flex children with `min-h-0` to prevent nested scroll bugs.

### Phase 2: Conversation List Responsiveness
1. Update `src/features/chat/components/ConversationList.jsx`:
- Replace fixed `w-80` with responsive width model:
  - Mobile: full width
  - Desktop: constrained sidebar width (`lg:w-80` or `lg:w-[22rem]`)
- Keep search input sticky/visible while list scrolls.
- Increase tap target size for conversation rows (`min-h`, spacing).
- Prevent text overflow in name/last message/time badge combination.

2. Optional mobile drawer pattern:
- Use existing `src/components/ui/sheet.jsx` for list on mobile.
- Trigger button lives in chat header (`ChatArea`) when on mobile.

### Phase 3: Chat Area Mobile UX
1. Update `src/features/chat/components/ChatArea.jsx`:
- Add optional props from page:
  - `isMobile`
  - `onBack`
  - `onOpenConversationList`
- Header:
  - Show back button on mobile when a conversation is selected.
  - Move secondary actions to compact icon-only controls.
- Message area:
  - Bubble widths: mobile `max-w-[85%]`, desktop `lg:max-w-[70%]`.
  - Add safe word wrapping (`break-words`) for long URLs/text.
  - Ensure attachment links wrap and do not overflow.
- Input row:
  - Keep controls one row on medium+ and compact stack/flex on very small widths.
  - Respect touch target sizes (`h-10`/`h-11` minimum).
  - Add bottom safe-area spacing for mobile webview/keyboard overlap (`pb-[env(safe-area-inset-bottom)]` where useful).

### Phase 4: Action Panel Simplification on Mobile
1. Update `src/features/chat/components/ChatActionPanel.jsx`:
- Keep existing business actions and mutation flow unchanged.
- Rework dense button groups for mobile:
  - Stack action groups vertically on small screens.
  - Prevent horizontal overflow in forms (`price`, `quantity`, `terms`).
  - Use wrapping containers and full-width controls on mobile.
- Keep desktop compact toolbar with `sm:`/`lg:` overrides.

### Phase 5: Styling Token Cleanup
1. In chat UI components, replace non-brand hardcoded slate colors used for surfaces/text with semantic tokens where possible.
2. Keep readability in both themes.
3. Preserve existing brand green only for accent CTA/badges.

## File-by-File Change List
- `src/features/chat/ChatPage.jsx`
  - Add mobile layout state and pane switching logic.
- `src/features/chat/components/ConversationList.jsx`
  - Responsive width + touch + overflow improvements.
- `src/features/chat/components/ChatArea.jsx`
  - Mobile header controls, message bubble sizing, input safe-area behavior.
- `src/features/chat/components/ChatActionPanel.jsx`
  - Mobile action layout refactor without changing domain behavior.
- Optional: `src/features/chat/components/ChatMobileHeader.jsx`
  - Only if extracting mobile header improves clarity and keeps page/component responsibilities clean.

## Acceptance Criteria
- On widths `< 768px`, UI works as mobile app flow:
  - User sees list first.
  - Selecting conversation opens chat detail.
  - Back action returns to list.
- No horizontal scrolling in chat list, message area, action panel, or input area.
- Message bubbles and file attachments never overflow viewport.
- Composer remains usable when mobile keyboard is open.
- Desktop (`>= 1024px`) still shows split view and current functionality.
- No API/service/socket regressions.

## QA Checklist
1. Manual viewport tests:
- 360x640
- 390x844
- 412x915
- 768x1024
- 1024x768
- 1280x800

2. Functional tests:
- Open conversations list, search, select conversation.
- Send text message.
- Attach file and send.
- Verify unread badge behavior.
- Verify reconnection/offline status badges still render.
- Verify action panel buttons remain accessible and trigger current mutations.

3. Regression checks:
- `npm run build` passes.
- Existing chat real-time behavior unchanged (new messages, optimistic rendering, read indicators).

## Rollout Strategy
1. Implement Phase 1 and Phase 2 first, validate mobile navigation flow.
2. Implement Phase 3 and Phase 4, validate usability with keyboard and long content.
3. Apply Phase 5 token cleanup only after behavior is stable.
4. Run build and smoke test before merge.

## Out of Scope
- Backend/chat protocol changes.
- New chat features unrelated to responsiveness.
- Rewriting socket/query architecture.
