// constants/types.ts
export type Income = {
  id: string;
  label: string;
  amount: number;
  date: string;
  isRecurring?: boolean;
  frequency?: 'weekly' | 'bi-weekly' | 'monthly' | 'semi-monthly';
};

export type BudgetCategory = {
  id: string;
  name: string;
  limit: number;
  spent: number;
  color: string;
  icon?: string;
};

export type Expense = {
  id: string;
  categoryId: string;
  amount: number;
  note?: string;
  date: string;
  merchant?: string;
  description: string;
  isRecurring?: boolean;
  frequency?: 'weekly' | 'bi-weekly' | 'monthly' | 'semi-monthly';
};

export type BudgetSummary = {
  totalIncome: number;
  totalBudgeted: number;
  totalSpent: number;
  remainingBudget: number;
  categories: BudgetCategory[];
};

export const STORAGE_KEYS = {
  INCOME: 'INCOME',
  BUDGETS: 'BUDGETS',
  EXPENSES: 'EXPENSES',
} as const;

export const CATEGORY_COLORS = [
  '#ef4444', // red
  '#f97316', // orange
  '#eab308', // yellow
  '#22c55e', // green
  '#06b6d4', // cyan
  '#3b82f6', // blue
  '#8b5cf6', // violet
  '#ec4899', // pink
] as const;

// Navigation types
export type RootStackParamList = {
  Home: undefined;
  'Add Income': undefined;
  'Add Budget': undefined;
  'Log Expense': undefined;
  'Edit Expense': { expenseId: string };
  'Edit Income': { incomeId: string };
  Budgets: undefined;
  Income: undefined;
  ManageExpenses: undefined;
  Profile: undefined;
  Support: undefined;
  Contact: undefined;
};