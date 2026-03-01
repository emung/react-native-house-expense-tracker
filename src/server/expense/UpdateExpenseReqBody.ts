export default interface UpdateExpenseReqBody {
  amount: number;
  description: string;
  category: string;
  recipient: string;
  currency: 'EUR' | 'RON';
  userId: number;
  date?: string;
}
