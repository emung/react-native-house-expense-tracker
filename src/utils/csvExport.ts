import Expense from '@/src/server/expense/Expense';

const HEADERS = ['ID', 'Date', 'Description', 'Category', 'Recipient', 'Amount', 'Currency', 'Refund'];

/**
 * Escapes a CSV field per RFC 4180:
 * - Wraps in double-quotes if the value contains commas, double-quotes, or newlines
 * - Escapes internal double-quotes by doubling them
 */
function escapeField(value: string | number | boolean | undefined | null): string {
  const str = value == null ? '' : String(value);
  const needsQuoting = str.includes(',') || str.includes('"') || str.includes('\n') || str.includes('\r');
  if (!needsQuoting) {
    return str;
  }
  return `"${str.replace(/"/g, '""')}"`;
}

function row(fields: (string | number | boolean | undefined | null)[]): string {
  return fields.map(escapeField).join(',');
}

export function expensesToCsv(expenses: Expense[]): string {
  const lines: string[] = [row(HEADERS)];

  for (const e of expenses) {
    lines.push(
      row([
        e.id,
        e.date,
        e.description,
        e.category,
        e.recipient,
        e.amount,
        e.currency,
        e.isRefund ? 'Yes' : 'No',
      ])
    );
  }

  // RFC 4180 recommends CRLF, which also works on all platforms
  return lines.join('\r\n');
}
