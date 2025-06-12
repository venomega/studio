export interface Transaction {
  id: string;
  type: 'income' | 'expense';
  amount: number;
  date: string;
  description: string;
}

export type FilterOption = 'all' | 'monthly_expenses' | 'annual_balance' | 'monthly_income';
