# Project Memories

Project-specific knowledge for the House Expense Tracker. Committed to git so all contributors load it via the `@`-import in `CLAUDE.md`.

## Conventions & patterns

- **No state library.** Pages own state with `useState`; `ExpenseService` is instantiated per file (`const expenseService = new ExpenseService()` at module scope).
- **No recipients/aggregation API.** The backend exposes expenses, categories, search, and by-category endpoints only. Recipient lists and report aggregations are derived **client-side** from the loaded expense list (`useMemo`), not fetched.
- **`CurrencyToggle`** (`src/components/CurrencyToggle.tsx`) is the shared currency selector. It has a typed overload: default is `'EUR' | 'RON'`; pass `showAll` to add `'All'` (type becomes `'All' | 'EUR' | 'RON'`).
- **Mixing currencies is forbidden in totals.** EUR and RON are never summed into one number. When an `All` view is needed, split results into per-currency sections, each with its own 100% base (see Reports tab).
- **Money display:** format currency amounts with `.toFixed(2)`; the backend can return long floats (e.g. `114420.65999…`). Counts stay as integers. `ExpenseHeaderCard` uses the presence of the `suffix` prop to decide whether a value is money (format) or a count (raw).

## Reports tab (`src/app/(tabs)/reports.tsx`)

- Charts (Pie/Bar) and the month/year date selector were **removed** (commit `0a5f299`). Reports now shows **all-time** data, no date filtering.
- UI: `CurrencyToggle` (with `All`) + `BreakdownToggle` (Category ↔ Recipient, one table at a time) → `ReportTable` per currency group.
- `BreakdownToggle` (`src/components/BreakdownToggle.tsx`) and `ReportTable` (`src/components/ReportTable.tsx`) are the building blocks. `ReportTable` columns: Name · Total · Count · %. Rows sorted by total desc.
- Deleted components: `ReportChart`, `ChartTypeToggle`, `MonthYearPicker`. The `react-native-gifted-charts` dependency was removed (no longer used anywhere).

## ExpenseFormModal (`src/components/ExpenseFormModal.tsx`)

- **Category pre-selection:** accepts an optional `initialCategory` prop. The expenses list (`src/app/(tabs)/index.tsx`) passes the active category filter (when not `'All'`) so "Add Expense" opens with that category pre-filled. The reset `useEffect` uses `initialCategory || ''` for new expenses.
  - The effect deliberately depends only on `[visible, expense]`, NOT `initialCategory` — re-running on `initialCategory` change could overwrite a category the user is typing. ESLint `exhaustive-deps` warns about this; the omission is intentional.
- **Recipient autocomplete:** accepts a `recipients: string[]` prop (distinct recipients derived in `index.tsx` via `useMemo` from loaded expenses). Inline suggestion list shows up to 5 case-insensitive matches while the field is focused. `onBlur` hides suggestions after a 150ms delay so a suggestion tap registers first.
