export type TransactionType = 'income' | 'expense';

export interface Client {
  id: string;
  name: string;
  email?: string;
  isRecurring: boolean;
  monthlyValue: number;
  billingDay: number;
  status: 'active' | 'inactive';
}

export interface RecurringExpense {
  id: string;
  description: string;
  amount: number;
  category: string;
  billingDay: number;
  status: 'active' | 'inactive';
}

export interface Transaction {
  id: string;
  description: string;
  amount: number;
  type: TransactionType;
  category: string;
  date: string;
  clientId?: string;
  recurringExpenseId?: string;
}

export interface CategorySummary {
  name: string;
  value: number;
  color: string;
}
