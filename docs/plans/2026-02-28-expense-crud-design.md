# Expense CRUD — Design

## Goal

Allow users to **add**, **edit**, and **delete** expenses from the UI. The app is web-first but must be responsive on phones.

## Decisions

| Decision | Choice |
|---|---|
| Add trigger | FAB on mobile, toolbar button on web (responsive switch) |
| Form presentation | Modal/dialog overlay |
| Edit/Delete trigger | Action buttons (✏️ / 🗑️) on each expense card |
| Delete safety | Confirmation dialog before delete |
| Code structure | Single shared `ExpenseFormModal` for create & edit |

---

## Architecture

### New Components

#### 1. `ExpenseFormModal`
- **Props**: `visible`, `expense` (null = create, existing = edit), `categories`, `onSave`, `onClose`
- **Fields**: description, amount, category (dropdown from existing categories + free text), recipient, currency (EUR | RON toggle)
- **Behavior**:
  - Create mode: empty fields, title "Add Expense", submit calls `ExpenseService.createExpense()`
  - Edit mode: pre-filled fields, title "Edit Expense", submit calls `ExpenseService.updateExpense()`
- **Validation**: amount > 0, description required, recipient required
- **Responsive**: full-width on mobile (< 768px), centered card (max-width ~500px) on web

#### 2. `ConfirmDeleteDialog`
- **Props**: `visible`, `expenseDescription`, `onConfirm`, `onCancel`
- **Simple modal**: "Are you sure you want to delete '{description}'?" with Cancel and Delete buttons
- **Delete button** styled in red/danger color for clarity

#### 3. `AddExpenseButton`
- **Responsive component** that renders:
  - **Web (≥ 768px)**: "Add Expense" button in the toolbar area next to the search/filter bar
  - **Mobile (< 768px)**: Floating Action Button (FAB) with `+` icon, positioned bottom-right
- Uses `useWindowDimensions()` for the responsive breakpoint

### Modified Components

#### `ExpenseCard`
- Add a row of small action icons (edit ✏️ / delete 🗑️) to the card
- Icons appear in the bottom-right area of the card, alongside the existing date
- Uses `Ionicons` (already installed): `create-outline` for edit, `trash-outline` for delete
- **Props added**: `onEdit(expense)`, `onDelete(expense)`

#### `ExpensesList`
- Pass through `onEdit` and `onDelete` callbacks to each `ExpenseCard`

#### `index.tsx` (main page)
- Manages modal visibility state (`showFormModal`, `showDeleteDialog`)
- Manages currently selected expense for edit/delete
- Handles CRUD callbacks:
  - `handleCreate`: calls service, refreshes list + header stats
  - `handleUpdate`: calls service, refreshes list + header stats
  - `handleDelete`: calls service, refreshes list + header stats
- Refresh logic: after any mutation, re-fetch expenses (respecting current search/filter state)

---

## Data Flow

```
User taps "Add" / Edit icon / Delete icon
         ↓
  index.tsx sets modal state
         ↓
  Modal renders (form or confirm dialog)
         ↓
  User submits / confirms
         ↓
  index.tsx calls ExpenseService method
         ↓
  On success: re-fetch current view (respecting active search/filter)
         ↓
  State updates → UI re-renders with fresh data
```

---

## UI Styling

- **Matches existing dark theme**: `#121212` background, `#1E1E1E` card surfaces, `#BB86FC` accent
- **Modal backdrop**: `rgba(0,0,0,0.6)` — same as existing category dropdown modal
- **Form inputs**: styled like the existing search input (`#1E1E1E` bg, `#333` border, `#E0E0E0` text)
- **Currency toggle**: two-option segmented control (EUR / RON) using accent color for selected
- **Delete button**: `#CF6679` (Material dark theme error color)
- **FAB**: circular, `#BB86FC` background, white `+` icon, shadow/elevation

---

## Error Handling

- **Network errors**: show a simple error message below the form (inline, not a toast)
- **Validation errors**: highlight invalid fields with red border + helper text
- **Loading state**: disable submit button and show a spinner while request is in flight


