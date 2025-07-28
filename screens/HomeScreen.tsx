import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  RefreshControl,
  Modal
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useFocusEffect } from '@react-navigation/native';
import { RootStackParamList, BudgetCategory, Expense, Paycheck } from '../constants/types';
import { storageUtils } from '../utils/storage';
import { styles } from '../styles/HomeScreen.styles'

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

interface Props {
  navigation: HomeScreenNavigationProp;
}

export default function HomeScreen({ navigation }: Props) {
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalBudgeted, setTotalBudgeted] = useState(0);
  const [totalSpent, setTotalSpent] = useState(0);
  const [categories, setCategories] = useState<BudgetCategory[]>([]);
  const [paychecks, setPaychecks] = useState<Paycheck[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [selectedPaycheckId, setSelectedPaycheckId] = useState<string>('');
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [expenseMenuVisible, setExpenseMenuVisible] = useState(false);
  const [selectedExpenseId, setSelectedExpenseId] = useState<string>('');

  const loadDashboardData = async () => {
    try {
      const [paycheckData, budgets, expenseData] = await Promise.all([
        storageUtils.getPaychecks(),
        storageUtils.getBudgets(),
        storageUtils.getExpenses()
      ]);

      // Calculate total income from paychecks
      const income = paycheckData.reduce((sum: number, paycheck: Paycheck) => sum + paycheck.amount, 0);

      // Calculate total spent directly from all expenses
      const spent = expenseData.reduce((sum: number, expense: Expense) => sum + expense.amount, 0);

      // Calculate spending per category
      const updatedCategories = budgets.map((category: BudgetCategory) => {
        const categoryExpenses = expenseData.filter((expense: Expense) => expense.categoryId === category.id);
        const categorySpent = categoryExpenses.reduce((sum: number, expense: Expense) => sum + expense.amount, 0);

        return {
          ...category,
          spent: categorySpent
        };
      });

      const budgeted = updatedCategories.reduce((sum, cat) => sum + cat.limit, 0);

      setTotalIncome(income);
      setTotalBudgeted(budgeted);
      setTotalSpent(spent); // Now uses direct calculation from expenses
      setCategories(updatedCategories);
      setPaychecks(paycheckData);
      setExpenses(expenseData); // Fixed variable name
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

  const showPaycheckMenu = (paycheckId: string) => {
    setSelectedPaycheckId(paycheckId);
    setShowMenu(true);
  };

  const viewPaycheckDetails = (paycheckId: string) => {
    const paycheck = paychecks.find(p => p.id === paycheckId);
    if (paycheck) {
      Alert.alert(
        'Paycheck Details',
        `Label: ${paycheck.label}\nAmount: $${paycheck.amount.toFixed(2)}\nDate: ${new Date(paycheck.date).toLocaleDateString()}\nRecurring: ${paycheck.isRecurring ? 'Yes' : 'No'}${paycheck.frequency ? `\nFrequency: ${paycheck.frequency}` : ''}`
      );
    }
  };

  const deletePaycheck = async (paycheckId: string) => {
    Alert.alert(
      'Delete Paycheck',
      'Are you sure you want to delete this paycheck?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const updatedPaychecks = paychecks.filter(p => p.id !== paycheckId);
              await storageUtils.savePaychecks(updatedPaychecks);
              await loadDashboardData();
              Alert.alert('Success', 'Paycheck deleted successfully');
            } catch (error) {
              Alert.alert('Error', 'Failed to delete paycheck');
              console.error(error);
            }
          }
        }
      ]
    );
  };

  const showExpenseMenu = (expenseId: string) => {
    setSelectedExpenseId(expenseId);
    setExpenseMenuVisible(true);
  };

  const viewExpenseDetails = (expenseId: string) => {
    const expense = expenses.find(e => e.id === expenseId);
    const category = categories.find(cat => cat.id === expense?.categoryId);
    if (expense) {
      Alert.alert(
        'Expense Details',
        `Category: ${category ? category.name : 'Unknown'}\nAmount: $${expense.amount.toFixed(2)}\nNote: ${expense.note || 'None'}\nDate: ${new Date(expense.date).toLocaleDateString()}`
      );
    }
  };

  const deleteExpense = async (expenseId: string) => {
    Alert.alert(
      'Delete Expense',
      'Are you sure you want to delete this expense?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const updatedExpenses = expenses.filter(e => e.id !== expenseId);
              await storageUtils.saveExpenses(updatedExpenses);
              await loadDashboardData();
              Alert.alert('Success', 'Expense deleted successfully');
            } catch (error) {
              Alert.alert('Error', 'Failed to delete expense');
              console.error(error);
            }
          }
        }
      ]
    );
  };

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
      {/* Empty State */}
      {categories.length === 0 && totalIncome === 0 && paychecks.length === 0 && (
        <View style={styles.emptyState}>
          <Text style={styles.emptyTitle}>Welcome to Budget Buddy!</Text>
          <Text style={styles.emptyText}>
            Get started by adding your first paycheck and setting up budget categories.
          </Text>
        </View>
      )}

      {/* Budget Summary Card */}
      <View style={styles.summaryCard}>
        <Text style={styles.cardTitle}>Budget Summary</Text>

        <View style={styles.summaryRow}>
          <Text style={styles.totalIncome}>Total Income:</Text>
          <Text style={[styles.summaryValue, styles.incomeText]}>
            ${totalIncome.toFixed(2)}
          </Text>
        </View>

        <View style={styles.summaryRow}>
          <Text style={styles.totalIncome}>Total Spent:</Text>
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

      {/* Income Section */}
      <View style={styles.incomeCard}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>Income</Text>
          <TouchableOpacity
            style={styles.viewButton}
            onPress={() => navigation.navigate('Income')}
          >
            <Text style={styles.viewButtonText}>Manage Income</Text>
          </TouchableOpacity>
        </View>

        {paychecks.length > 0 ? (
          <>
            {paychecks.map((paycheck) => (
              <View key={paycheck.id} style={styles.incomeItem}>
                <View style={styles.incomeHeader}>
                  <View style={styles.incomeMainInfo}>
                    <TouchableOpacity
                      style={styles.menuButton}
                      onPress={() => showPaycheckMenu(paycheck.id)}
                    >
                      <Text style={styles.menuDots}>⋯</Text>
                    </TouchableOpacity>
                    <View style={styles.incomeNameAndDate}>
                      <Text style={styles.incomeName}>{paycheck.label}</Text>
                      <Text style={styles.dateDot}> • </Text>
                      <Text style={styles.incomeDate}>
                        {new Date(paycheck.date).toLocaleDateString()}
                      </Text>
                    </View>
                  </View>
                  <Text style={[styles.incomeAmount, styles.incomeText]}>
                    +${paycheck.amount.toFixed(2)}
                  </Text>
                </View>
                <View style={styles.incomeDetails}>
                  {paycheck.isRecurring && (
                    <View style={styles.recurringBadge}>
                      <Text style={styles.recurringText}>
                        {paycheck.frequency?.replace('-', ' ').toUpperCase()}
                      </Text>
                    </View>
                  )}
                </View>
              </View>
            ))}

            {/* Total Income Row */}
            <View style={[styles.summaryRow, styles.totalRow]}>
              <Text style={styles.totalLabel}>Total Income:</Text>
              <Text style={[styles.totalValue, styles.incomeText]}>
                ${totalIncome.toFixed(2)}
              </Text>
            </View>
          </>
        ) : (
          <View style={styles.emptyIncomeState}>
            <Text style={styles.emptyIncomeText}>No income added yet</Text>
            <Text style={styles.emptyIncomeSubtext}>
              Tap "Add Paycheck" to start tracking your income
            </Text>
          </View>
        )}
      </View>

      {/* Expenses Section */}
            <View style={styles.incomeCard}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>Expenses</Text>
          <TouchableOpacity
            style={styles.viewButton}
            onPress={() => navigation.navigate('ManageExpenses')}
          >
            <Text style={styles.viewButtonText}>Manage Expenses</Text>
          </TouchableOpacity>
        </View>

        {expenses.length > 0 ? (
          <>
            {expenses.slice(0, 5).map((expense) => {
              const category = categories.find(cat => cat.id === expense.categoryId);
              return (
                <View key={expense.id} style={styles.expenseItem}>
                  <View style={styles.expenseHeader}>
                    <View style={styles.expenseMainInfo}>
                      <TouchableOpacity
                        style={styles.menuButton}
                        onPress={() => showExpenseMenu(expense.id)}
                      >
                        <Text style={styles.menuDots}>⋯</Text>
                      </TouchableOpacity>
                      <View style={styles.expenseNameAndDate}>
                        <Text style={styles.expenseName}>
                          {category ? category.name : 'Unknown Category'}
                          {expense.note && ` - ${expense.note}`}
                        </Text>
                        <Text style={styles.dateDot}> • </Text>
                        <Text style={styles.expenseDate}>
                          {new Date(expense.date).toLocaleDateString()}
                        </Text>
                      </View>
                    </View>
                    <Text style={[styles.expenseAmount, styles.expenseText]}>
                      -${expense.amount.toFixed(2)}
                    </Text>
                  </View>
                </View>
              );
            })}

            {/* Total Spent Row */}
            <View style={[styles.summaryRow, styles.totalRow]}>
              <Text style={styles.totalLabel}>Total Spent:</Text>
              <Text style={[styles.totalValue, styles.expenseText]}>
                ${totalSpent.toFixed(2)}
              </Text>
            </View>
          </>
        ) : (
          <View style={styles.emptyExpensesState}>
            <Text style={styles.emptyExpensesText}>No expenses logged yet</Text>
            <Text style={styles.emptyExpensesSubtext}>
              Tap "Log Expense" to start tracking your spending
            </Text>
          </View>
        )}
      </View>

      {/* Actions */}
      <View style={styles.actionsCard}>
        <Text style={styles.cardTitle}>Add Items</Text>
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
            title="My Budgets"
            onPress={() => navigation.navigate('Add Budget')}
            color="#3b82f6"
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

      {/* Custom Menu Modal */}
      <Modal
        visible={showMenu}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowMenu(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          onPress={() => setShowMenu(false)}
          activeOpacity={1}
        >
          <View style={styles.menuModal}>
            <TouchableOpacity
              style={styles.menuOption}
              onPress={() => {
                setShowMenu(false);
                viewPaycheckDetails(selectedPaycheckId);
              }}
            >
              <Text style={styles.menuOptionText}>View Details</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.menuOption, styles.deleteOption]}
              onPress={() => {
                setShowMenu(false);
                deletePaycheck(selectedPaycheckId);
              }}
            >
              <Text style={[styles.menuOptionText, styles.deleteText]}>Delete</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.menuOption}
              onPress={() => setShowMenu(false)}
            >
              <Text style={styles.menuOptionText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Expense Menu Modal */}
      <Modal
        visible={expenseMenuVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setExpenseMenuVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          onPress={() => setExpenseMenuVisible(false)}
          activeOpacity={1}
        >
          <View style={styles.menuModal}>
            <TouchableOpacity
              style={styles.menuOption}
              onPress={() => {
                setExpenseMenuVisible(false);
                viewExpenseDetails(selectedExpenseId);
              }}
            >
              <Text style={styles.menuOptionText}>View Details</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.menuOption, styles.deleteOption]}
              onPress={() => {
                setExpenseMenuVisible(false);
                deleteExpense(selectedExpenseId);
              }}
            >
              <Text style={[styles.menuOptionText, styles.deleteText]}>Delete</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.menuOption}
              onPress={() => setExpenseMenuVisible(false)}
            >
              <Text style={styles.menuOptionText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </ScrollView>
  );
}