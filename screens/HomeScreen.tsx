// screens/HomeScreen.tsx
import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  RefreshControl,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useFocusEffect } from '@react-navigation/native';
import { RootStackParamList, BudgetCategory, Expense, Paycheck } from '../constants/types';
import { storageUtils } from '../utils/storage';

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

interface Props {
  navigation: HomeScreenNavigationProp;
}

export default function HomeScreen({ navigation }: Props) {
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalBudgeted, setTotalBudgeted] = useState(0);
  const [totalSpent, setTotalSpent] = useState(0);
  const [categories, setCategories] = useState<BudgetCategory[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const loadDashboardData = async () => {
    try {
      const [paychecks, budgets, expenses] = await Promise.all([
        storageUtils.getPaychecks(),
        storageUtils.getBudgets(),
        storageUtils.getExpenses()
      ]);

      // Calculate total income from paychecks
      const income = paychecks.reduce((sum: number, paycheck: Paycheck) => sum + paycheck.amount, 0);
      
      // Calculate spending per category
      const updatedCategories = budgets.map((category: BudgetCategory) => {
        const categoryExpenses = expenses.filter((expense: Expense) => expense.categoryId === category.id);
        const spent = categoryExpenses.reduce((sum: number, expense: Expense) => sum + expense.amount, 0);
        
        return {
          ...category,
          spent
        };
      });

      const budgeted = updatedCategories.reduce((sum, cat) => sum + cat.limit, 0);
      const spent = updatedCategories.reduce((sum, cat) => sum + cat.spent, 0);

      setTotalIncome(income);
      setTotalBudgeted(budgeted);
      setTotalSpent(spent);
      setCategories(updatedCategories);
    } catch (error) {
      Alert.alert('Error', 'Failed to load dashboard data');
      console.error(error);
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadDashboardData();
    setRefreshing(false);
  }, []);

  // Reload data when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      loadDashboardData();
    }, [])
  );

  const remainingBudget = totalIncome - totalSpent;
  const budgetHealthColor = remainingBudget >= 0 ? '#22c55e' : '#ef4444';

  const ActionButton = ({ title, onPress, color = '#4f46e5' }: {
    title: string;
    onPress: () => void;
    color?: string;
  }) => (
    <TouchableOpacity
      style={[styles.actionButton, { backgroundColor: color }]}
      onPress={onPress}
    >
      <Text style={styles.actionButtonText}>{title}</Text>
    </TouchableOpacity>
  );

  return (
    <ScrollView 
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {/* Budget Summary Card */}
      <View style={styles.summaryCard}>
        <Text style={styles.cardTitle}>Budget Summary</Text>
        
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Total Income:</Text>
          <Text style={[styles.summaryValue, styles.incomeText]}>
            ${totalIncome.toFixed(2)}
          </Text>
        </View>
        
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Total Spent:</Text>
          <Text style={[styles.summaryValue, styles.expenseText]}>
            ${totalSpent.toFixed(2)}
          </Text>
        </View>
        
        <View style={[styles.summaryRow, styles.totalRow]}>
          <Text style={styles.totalLabel}>Remaining:</Text>
          <Text style={[styles.totalValue, { color: budgetHealthColor }]}>
            ${remainingBudget.toFixed(2)}
          </Text>
        </View>
      </View>

      {/* Quick Actions */}
      <View style={styles.actionsCard}>
        <Text style={styles.cardTitle}>Quick Actions</Text>
        <View style={styles.actionsGrid}>
          <ActionButton
            title="Add Paycheck"
            onPress={() => navigation.navigate('Add Paycheck')}
            color="#22c55e"
          />
          <ActionButton
            title="Log Expense"
            onPress={() => navigation.navigate('Log Expense')}
            color="#ef4444"
          />
          <ActionButton
            title="Add Budget"
            onPress={() => navigation.navigate('Add Budget')}
            color="#3b82f6"
          />
          <ActionButton
            title="View Budgets"
            onPress={() => navigation.navigate('Budgets')}
            color="#8b5cf6"
          />
        </View>
      </View>

      {/* Recent Categories Preview */}
      {categories.length > 0 && (
        <View style={styles.categoriesCard}>
          <Text style={styles.cardTitle}>Budget Categories</Text>
          {categories.slice(0, 3).map((category) => {
            const percentage = category.limit > 0 ? (category.spent / category.limit) * 100 : 0;
            const isOverBudget = percentage > 100;
            
            return (
              <View key={category.id} style={styles.categoryItem}>
                <View style={styles.categoryHeader}>
                  <Text style={styles.categoryName}>{category.name}</Text>
                  <Text style={styles.categoryAmount}>
                    ${category.spent.toFixed(2)} / ${category.limit.toFixed(2)}
                  </Text>
                </View>
                <View style={styles.progressBarContainer}>
                  <View 
                    style={[
                      styles.progressBar, 
                      { 
                        width: `${Math.min(percentage, 100)}%`,
                        backgroundColor: isOverBudget ? '#ef4444' : category.color
                      }
                    ]} 
                  />
                </View>
                <Text style={[styles.percentageText, isOverBudget && styles.overBudgetText]}>
                  {percentage.toFixed(0)}%
                </Text>
              </View>
            );
          })}
          
          {categories.length > 3 && (
            <TouchableOpacity 
              style={styles.viewMoreButton}
              onPress={() => navigation.navigate('Budgets')}
            >
              <Text style={styles.viewMoreText}>View All Categories</Text>
            </TouchableOpacity>
          )}
        </View>
      )}

      {/* Empty State */}
      {categories.length === 0 && totalIncome === 0 && (
        <View style={styles.emptyState}>
          <Text style={styles.emptyTitle}>Welcome to Budget Buddy!</Text>
          <Text style={styles.emptyText}>
            Get started by adding your first paycheck and setting up budget categories.
          </Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
    padding: 16,
  },
  summaryCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#1f2937',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  summaryLabel: {
    fontSize: 16,
    color: '#6b7280',
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: '600',
  },
  incomeText: {
    color: '#22c55e',
  },
  expenseText: {
    color: '#ef4444',
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    paddingTop: 12,
    marginTop: 8,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  totalValue: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  actionsCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  actionButton: {
    backgroundColor: '#4f46e5',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    flex: 0.48,
    alignItems: 'center',
  },
  actionButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  categoriesCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  categoryItem: {
    marginBottom: 16,
  },
  categoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
  },
  categoryAmount: {
    fontSize: 14,
    color: '#6b7280',
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: '#e5e7eb',
    borderRadius: 4,
    marginBottom: 4,
  },
  progressBar: {
    height: '100%',
    borderRadius: 4,
  },
  percentageText: {
    fontSize: 12,
    color: '#6b7280',
    textAlign: 'right',
  },
  overBudgetText: {
    color: '#ef4444',
    fontWeight: '600',
  },
  viewMoreButton: {
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  viewMoreText: {
    color: '#4f46e5',
    fontSize: 14,
    fontWeight: '600',
  },
  emptyState: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 32,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 24,
  },
});