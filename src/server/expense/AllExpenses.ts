import Expense from "./Expense";

export default interface AllExpenses {
  expenses: Expense[];
  amount: number;
  sums: CurrencySum[];
}

export interface CurrencySum {
  currency: string;
  sum: number;
  count: number;
}
