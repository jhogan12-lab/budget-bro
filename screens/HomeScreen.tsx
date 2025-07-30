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
import { RootStackParamList, BudgetCategory, Expense, Income } from '../constants/types';
import { storageUtils } from '../utils/storage';
import { styles } from '../styles/HomeScreen.styles'
import { globalStyles } from '../styles/Global.styles';

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

interface Props {
  navigation: HomeScreenNavigationProp;
}

export default function HomeScreen({ navigation }: Props) {
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalBudgeted, setTotalBudgeted] = useState(0);
  const [totalSpent, setTotalSpent] = useState(0);
  const [categories, setCategories] = useState<BudgetCategory[]>([]);
  const [income, setIncome] = useState<Income[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [selectedIncomeId, setSelectedIncomeId] = useState<string>('');
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [expenseMenuVisible, setExpenseMenuVisible] = useState(false);
  const [selectedExpenseId, setSelectedExpenseId] = useState<string>('');

  const formatCurrency = (amount: number) => {
    return amount.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  const loadDashboardData = async () => {
    try {
      const [incomeData, budgets, expenseData] = await Promise.all([
        storageUtils.getIncome(),
        storageUtils.getBudgets(),
        storageUtils.getExpenses()
      ]);

      // Calculate total income from income
      const income = incomeData.reduce((sum: number, income: Income) => sum + income.amount, 0);

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
      setTotalSpent(spent);
      setCategories(updatedCategories);
      setIncome(incomeData);
      setExpenses(expenseData);
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

  const showIncomeMenu = (incomeId: string) => {
    setSelectedIncomeId(incomeId);
    setShowMenu(true);
  };

  const viewIncomeDetails = (incomeId: string) => {
    const item = income.find(i => i.id === incomeId);
    if (item) {
      Alert.alert(
        'Income Details',
        `Label: ${item.label}\nAmount: $${formatCurrency(item.amount)}\nDate: ${new Date(item.date).toLocaleDateString()}\nRecurring: ${item.isRecurring ? 'Yes' : 'No'}${item.frequency ? `\nFrequency: ${item.frequency}` : ''}`
      );
    }
  };

  const deleteIncome = async (incomeId: string) => {
    Alert.alert(
      'Delete Income',
      'Are you sure you want to delete this income?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const updatedIncome = income.filter(p => p.id !== incomeId);
              await storageUtils.saveIncome(updatedIncome);
              await loadDashboardData();
              Alert.alert('Success', 'Income deleted successfully');
            } catch (error) {
              Alert.alert('Error', 'Failed to delete income');
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
        `Category: ${category ? category.name : 'Unknown'}\nAmount: $ ${formatCurrency(expense.amount)}\nNote: ${expense.note || 'None'}\nDate: ${new Date(expense.date).toLocaleDateString()}`
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
      style={[globalStyles.actionButton, { backgroundColor: color }]}
      onPress={onPress}
    >
      <Text style={globalStyles.actionButtonText}>{title}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={{ flex: 1 }}>
      <ScrollView
        style={globalStyles.container}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Empty State */}
        {categories.length === 0 && totalIncome === 0 && income.length === 0 && (
          <View style={globalStyles.emptyState}>
            <Text style={globalStyles.emptyStateTitle}>Welcome to Budget Buddy!</Text>
            <Text style={globalStyles.emptyStateText}>
              Get started by adding your first income and setting up budget categories.
            </Text>
          </View>
        )}

        {/* Budget Summary Card */}
        <View style={globalStyles.cardCompact}>
          <Text style={globalStyles.cardTitle}>Budget Summary</Text>

          <View style={globalStyles.summaryRow}>
            <Text style={styles.totalIncome}>Total Income:</Text>
            <Text style={[globalStyles.summaryValue, globalStyles.incomeText]}>
              ${formatCurrency(totalIncome)}
            </Text>
          </View>

          <View style={globalStyles.summaryRow}>
            <Text style={styles.totalIncome}>Total Spent:</Text>
            <Text style={[globalStyles.summaryValue, globalStyles.expenseText]}>
              ${formatCurrency(totalSpent)}
            </Text>
          </View>

          <View style={[globalStyles.summaryRow, globalStyles.totalRow]}>
            <Text style={globalStyles.totalLabel}>Remaining:</Text>
            <Text style={[globalStyles.totalValue, { color: budgetHealthColor }]}>
              ${formatCurrency(remainingBudget)}
            </Text>
          </View>
        </View>

        {/* Income Section */}
        <View style={globalStyles.cardCompact}>
          <View style={globalStyles.cardHeader}>
            <Text style={globalStyles.cardTitle}>Income</Text>
            <TouchableOpacity
              style={globalStyles.viewButton}
              onPress={() => navigation.navigate('Income')}
            >
              <Text style={globalStyles.viewButtonText}>Manage Income</Text>
            </TouchableOpacity>
          </View>

          {income.length > 0 ? (
            <>
              {income.map((income) => (
                <View key={income.id} style={globalStyles.listItem}>
                  <View style={globalStyles.listItemHeader}>
                    <View style={globalStyles.listItemContent}>
                      <TouchableOpacity
                        style={globalStyles.menuButton}
                        onPress={() => showIncomeMenu(income.id)}
                      >
                        <Text style={globalStyles.menuDots}>⋯</Text>
                      </TouchableOpacity>
                      <View style={globalStyles.rowStart}>
                        <Text style={globalStyles.listItemName}>{income.label}</Text>
                        <Text style={globalStyles.dateDot}> • </Text>
                        <Text style={globalStyles.listItemDate}>
                          {new Date(income.date).toLocaleDateString()}
                        </Text>
                      </View>
                    </View>
                    <Text style={[globalStyles.incomeAmount, globalStyles.incomeText]}>
                      +${formatCurrency(income.amount)}
                    </Text>
                  </View>
                  <View style={styles.incomeDetails}>
                    {income.isRecurring && (
                      <View style={globalStyles.recurringBadge}>
                        <Text style={globalStyles.recurringText}>
                          {income.frequency?.replace('-', ' ').toUpperCase()}
                        </Text>
                      </View>
                    )}
                  </View>
                </View>
              ))}

              {/* Total Income Row */}
              <View style={[globalStyles.summaryRow, globalStyles.totalRow]}>
                <Text style={globalStyles.totalLabel}>Total Income:</Text>
                <Text style={[globalStyles.totalValue, globalStyles.incomeText]}>
                  ${formatCurrency(totalIncome)}
                </Text>
              </View>
            </>
          ) : (
            <View style={globalStyles.emptyStateSmall}>
              <Text style={globalStyles.emptyStateTitle}>No income added yet</Text>
              <Text style={globalStyles.emptyStateText}>
                Tap "Add Income" to start tracking your income
              </Text>
            </View>
          )}
        </View>

        {/* Expenses Section */}
        <View style={globalStyles.cardCompact}>
          <View style={globalStyles.cardHeader}>
            <Text style={globalStyles.cardTitle}>Expenses</Text>
            <TouchableOpacity
              style={globalStyles.viewButton}
              onPress={() => navigation.navigate('ManageExpenses')}
            >
              <Text style={globalStyles.viewButtonText}>Manage Expenses</Text>
            </TouchableOpacity>
          </View>

          {expenses.length > 0 ? (
            <>
              {expenses.slice(0, 5).map((expense) => {
                const category = categories.find(cat => cat.id === expense.categoryId);
                return (
                  <View key={expense.id} style={globalStyles.listItem}>
                    <View style={globalStyles.listItemHeader}>
                      <View style={globalStyles.listItemContent}>
                        <TouchableOpacity
                          style={globalStyles.menuButton}
                          onPress={() => showExpenseMenu(expense.id)}
                        >
                          <Text style={globalStyles.menuDots}>⋯</Text>
                        </TouchableOpacity>
                        <View style={globalStyles.rowStart}>
                          <Text style={globalStyles.listItemName}>
                            {category ? category.name : 'Unknown Category'}
                            {expense.note && ` - ${expense.note}`}
                          </Text>
                          <Text style={globalStyles.dateDot}> • </Text>
                          <Text style={globalStyles.listItemDate}>
                            {new Date(expense.date).toLocaleDateString()}
                          </Text>
                        </View>
                      </View>
                      <Text style={[globalStyles.expenseAmount, globalStyles.expenseText]}>
                        -${formatCurrency(expense.amount)}
                      </Text>
                    </View>
                  </View>
                );
              })}

              {/* Total Spent Row */}
              <View style={[globalStyles.summaryRow, globalStyles.totalRow]}>
                <Text style={globalStyles.totalLabel}>Total Spent:</Text>
                <Text style={[globalStyles.totalValue, globalStyles.expenseText]}>
                  ${formatCurrency(totalSpent)}
                </Text>
              </View>
            </>
          ) : (
            <View style={globalStyles.emptyStateSmall}>
              <Text style={globalStyles.emptyStateTitle}>No expenses logged yet</Text>
              <Text style={globalStyles.emptyStateText}>
                Tap "Log Expense" to start tracking your spending
              </Text>
            </View>
          )}
        </View>

        {/* Actions */}
        <View style={globalStyles.cardCompact}>
          <Text style={globalStyles.cardTitle}>Add Items</Text>
          <View style={globalStyles.actionsGrid}>
            <ActionButton
              title="Add Income"
              onPress={() => navigation.navigate('Add Income')}
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
          <View style={globalStyles.cardCompact}>
            <Text style={globalStyles.cardTitle}>Budget Categories</Text>
            {categories.slice(0, 3).map((category) => {
              const percentage = category.limit > 0 ? (category.spent / category.limit) * 100 : 0;
              const isOverBudget = percentage > 100;

              return (
                <View key={category.id} style={styles.categoryItem}>
                  <View style={globalStyles.row}>
                    <Text style={globalStyles.categoryName}>{category.name}</Text>
                    <Text style={globalStyles.categoryAmount}>
                      ${formatCurrency(category.spent)} / ${formatCurrency(category.limit)}
                    </Text>
                  </View>
                  <View style={globalStyles.progressBarContainer}>
                    <View
                      style={[
                        globalStyles.progressBar,
                        {
                          width: `${Math.min(percentage, 100)}%`,
                          backgroundColor: isOverBudget ? '#ef4444' : category.color
                        }
                      ]}
                    />
                  </View>
                  <Text style={[globalStyles.percentageText, isOverBudget && globalStyles.overBudgetText]}>
                    {percentage.toFixed(0)}%
                  </Text>
                </View>
              );
            })}

            {categories.length > 3 && (
              <TouchableOpacity
                style={globalStyles.viewMoreButton}
                onPress={() => navigation.navigate('Budgets')}
              >
                <Text style={globalStyles.viewMoreText}>View All Categories</Text>
              </TouchableOpacity>
            )}
          </View>
        )}

        <View style={{ height: 80 }} />
      </ScrollView>

      {/* Custom Menu Modal */}
      <Modal
        visible={showMenu}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowMenu(false)}
      >
        <TouchableOpacity
          style={globalStyles.modalOverlay}
          onPress={() => setShowMenu(false)}
          activeOpacity={1}
        >
          <View style={globalStyles.menuModal}>
            <TouchableOpacity
              style={globalStyles.menuOption}
              onPress={() => {
                setShowMenu(false);
                navigation.navigate('Edit Income', { incomeId: selectedIncomeId });
              }}
            >
              <Text style={globalStyles.menuOptionText}>Edit</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[globalStyles.menuOption, globalStyles.deleteOption]}
              onPress={() => {
                setShowMenu(false);
                deleteIncome(selectedIncomeId);
              }}
            >
              <Text style={[globalStyles.menuOptionText, globalStyles.deleteText]}>Delete</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={globalStyles.menuOption}
              onPress={() => setShowMenu(false)}
            >
              <Text style={globalStyles.menuOptionText}>Cancel</Text>
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
          style={globalStyles.modalOverlay}
          onPress={() => setExpenseMenuVisible(false)}
          activeOpacity={1}
        >
          <View style={globalStyles.menuModal}>
            <TouchableOpacity
              style={globalStyles.menuOption}
              onPress={() => {
                setExpenseMenuVisible(false);
                navigation.navigate('Edit Expense', { expenseId: selectedExpenseId });
              }}
            >
              <Text style={globalStyles.menuOptionText}>Edit</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[globalStyles.menuOption, globalStyles.deleteOption]}
              onPress={() => {
                setExpenseMenuVisible(false);
                deleteExpense(selectedExpenseId);
              }}
            >
              <Text style={[globalStyles.menuOptionText, globalStyles.deleteText]}>Delete</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={globalStyles.menuOption}
              onPress={() => setExpenseMenuVisible(false)}
            >
              <Text style={globalStyles.menuOptionText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}