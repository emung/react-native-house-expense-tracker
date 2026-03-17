export default interface CreateExpenseReqBody {
  amount: number;
  description: string;
  category: string;
  recipient: string;
  currency: 'EUR' | 'RON';
  date?: string;
  isRefund?: boolean;
}
