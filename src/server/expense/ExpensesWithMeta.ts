import Expense from './Expense';

export default interface ExpensesWithMeta {
  expenses: Expense[];
  amount: number;
  sums: CurrencyMetadata[];
}

export interface CurrencyMetadata {
  currency: string;
  sum: number;
  count: number;
}
