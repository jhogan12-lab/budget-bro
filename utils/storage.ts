// utils/storage.ts
import AsyncStorage from '@react-native-async-storage/async-storage';

export async function saveData<T>(key: string, data: T): Promise<void> {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(data));
  } catch (err) {
    console.error(`Error saving ${key}:`, err);
    throw err;
  }
}

export async function loadData<T>(key: string): Promise<T | null> {
  try {
    const json = await AsyncStorage.getItem(key);
    return json != null ? JSON.parse(json) : null;
  } catch (err) {
    console.error(`Error loading ${key}:`, err);
    return null;
  }
}

export async function removeData(key: string): Promise<void> {
  try {
    await AsyncStorage.removeItem(key);
  } catch (err) {
    console.error(`Error removing ${key}:`, err);
    throw err;
  }
}

export async function getAllKeys(): Promise<string[]> {
  try {
    const keys = await AsyncStorage.getAllKeys();
    return [...keys]; 
  } catch (err) {
    console.error('Error getting all keys:', err);
    return [];
  }
}

// Utility functions for specific data types
export const storageUtils = {
  async getIncome() {
    return await loadData<any[]>('INCOME') || [];
  },
  
  async saveIncome(income: any[]) {
    return await saveData('INCOME', income);
  },
  
  async getBudgets() {
    return await loadData<any[]>('BUDGETS') || [];
  },
  
  async saveBudgets(budgets: any[]) {
    return await saveData('BUDGETS', budgets);
  },
  
  async getExpenses() {
    return await loadData<any[]>('EXPENSES') || [];
  },
  
  async saveExpenses(expenses: any[]) {
    return await saveData('EXPENSES', expenses);
  }
};