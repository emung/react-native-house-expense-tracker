export default interface CreateExpenseReqBody {
  amount: number;
  description: string;
  category: string;
  recipient: string;
  currency: 'EUR' | 'RON';
  userId: number;
  date?: string;
}