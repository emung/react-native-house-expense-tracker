# Date Selection for Expenses

## Problem

The expense form has no way to set or modify the date of an expense, even though the backend supports a `date` field in ISO 8601 format (`"2026-03-01T14:06:09.839Z"`). New expenses always get the backend's `now()` default.

## Design Decisions

- **Default**: New expenses default to today; editing pre-fills the expense's existing date
- **Picker**: Date-only (no time picker) using `react-native-paper-dates` `DatePickerModal` in `single` mode
- **Timestamp logic**:
  - Today → `new Date().toISOString()` (captures actual current time)
  - Any other day → noon UTC (`T12:00:00.000Z`) to avoid timezone edge cases
- **UI pattern**: Tappable row matching the existing category picker style (label + value + icon)
- **Placement**: Between Recipient and Currency fields
- **Validation**: None needed — always has a valid default, picker only allows valid dates

## Files Changed

| File | Change |
|------|--------|
| `ExpenseFormModal.tsx` | Add `date` state, date picker row UI, `DatePickerModal`, include `date` in submit payload |
| `CreateExpenseReqBody.ts` | Add `date?: string` |
| `UpdateExpenseReqBody.ts` | Add `date?: string` |
