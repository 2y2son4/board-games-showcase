# Accessibility and Keyboard Navigation

This document describes the current accessibility baseline of Board Games Showcase and how to navigate the app using only a keyboard.

## Accessibility baseline

The app targets WCAG 2.1 Level AA principles for perceivable, operable, understandable, and robust interactions.

Implemented patterns include:

- Semantic landmarks such as main content regions.
- Visible focus states for interactive controls.
- Skip links for faster keyboard navigation.
- Live status announcements in filter-heavy views.
- Keyboard shortcut support for high-frequency navigation.

## Keyboard navigation

### Global navigation

- Tab and Shift+Tab move focus forward and backward through interactive elements.
- Enter or Space activates focused buttons and controls.
- Skip to main content is available at the top of the app when focused.

### Games page shortcuts

- Skip to filters link is available on the Games page.
- Skip to Game of the Day link is available on the Games page.
- Alt+Shift+F moves focus directly to the filters region.
- Alt+Shift+G opens Game of the Day.

The shortcut is ignored while typing in fields such as input, textarea, or select, so it does not interrupt form entry.

## Filters region behavior

The filters panel is exposed as a focusable, labeled region so assistive technologies can identify it and keyboard users can land on it reliably.

- Region label: Filters
- Programmatic focus target: filters container
- Optional hint for assistive tech: keyboard shortcut description

## Quick keyboard flow

1. Open Games page.
2. Press Tab to reach Skip to filters, then Enter.
3. Press Tab again to reach Skip to Game of the Day, then Enter.
4. Or press Alt+Shift+F to jump directly to filters.
5. Or press Alt+Shift+G to open Game of the Day.
6. Continue with Tab and Shift+Tab through filter controls.
7. Use Reset to clear active filters.

## Validation checklist

- All core actions are reachable without a mouse.
- Focus remains visible while tabbing.
- Focus order follows visual order.
- No keyboard trap appears in dialogs or controls.
- Shortcut does not conflict with typing in form fields.
