export interface TransactionRequest {
  description: string;
  amount: number;
  isExpense: boolean;
  categoryId: number;
  date: Date;
}
