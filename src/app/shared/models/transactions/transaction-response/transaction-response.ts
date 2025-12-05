export interface TransactionResponse {
  id: number;
  description: string;
  amount: number;
  isExpense: boolean;
  categoryName: string;
  date: Date;
}
