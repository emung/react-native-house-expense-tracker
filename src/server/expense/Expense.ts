export default interface Expense {
  id: number;
  amount: number;
  date: string;
  description: string;
  category: string;
  recipient: string;
  currency: string;
  userId: number;
}
