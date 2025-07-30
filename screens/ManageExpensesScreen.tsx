import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
  RefreshControl,
  Modal
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useFocusEffect } from '@react-navigation/native';
import { RootStackParamList, BudgetCategory, Expense } from '../constants/types';
import { storageUtils } from '../utils/storage';
import { styles } from '../styles/ManageExpenses.styles'
import { globalStyles } from '../styles/Global.styles';

type ManageExpensesNavigationProp = NativeStackNavigationProp<RootStackParamList, 'ManageExpenses'>;

interface Props {
  navigation: ManageExpensesNavigationProp;
}

export default function ManageExpenses({ navigation }: Props) {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [categories, setCategories] = useState<BudgetCategory[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [selectedExpenseId, setSelectedExpenseId] = useState<string>('');

  const loadExpenses = async () => {
    try {
      const [expenseData, budgetData] = await Promise.all([
        storageUtils.getExpenses(),
        storageUtils.getBudgets()
      ]);
      
      // Sort expenses by date (most recent first)
      const sortedExpenses = expenseData.sort((a, b) => 
        new Date(b.date).getTime() - new Date(a.date).getTime()
      );
      
      setExpenses(sortedExpenses);
      setCategories(budgetData);
    } catch (error) {
      Alert.alert('Error', 'Failed to load expenses');
      console.error(error);
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadExpenses();
    setRefreshing(false);
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadExpenses();
    }, [])
  );

  const getCategoryName = (categoryId: string) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category ? category.name : 'Unknown Category';
  };

  const getCategoryColor = (categoryId: string) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category ? category.color : '#6b7280';
  };

  const formatFrequency = (frequency: string) => {
    return frequency.replace('-', ' ').split(' ').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  const showExpenseMenu = (expenseId: string) => {
    setSelectedExpenseId(expenseId);
    setShowMenu(true);
  };

  const viewExpenseDetails = (expenseId: string) => {
    const expense = expenses.find(e => e.id === expenseId);
    const categoryName = getCategoryName(expense?.categoryId || '');
    
    if (expense) {
      Alert.alert(
        'Expense Details',
        `Category: ${categoryName}\n` +
        `Amount: $${expense.amount.toFixed(2)}\n` +
        `Date: ${new Date(expense.date).toLocaleDateString()}\n` +
        `${expense.merchant ? `Merchant: ${expense.merchant}\n` : ''}` +
        `${expense.note ? `Note: ${expense.note}\n` : ''}` +
        `${expense.isRecurring ? `Recurring: ${formatFrequency(expense.frequency || '')}\n` : ''}`
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
              await loadExpenses();
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

  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);

  return (
    <ScrollView
      style={globalStyles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {/* Header Summary */}
      <View style={globalStyles.card}>
        <Text style={globalStyles.cardTitle}>Expense Summary</Text>
        <View style={globalStyles.summaryRow}>
          <Text style={globalStyles.totalLabel}>Total Expenses:</Text>
          <Text style={[globalStyles.totalValue, globalStyles.expenseText]}>
            ${totalExpenses.toFixed(2)}
          </Text>
        </View>
        <View style={globalStyles.summaryRow}>
          <Text style={globalStyles.totalLabel}>Number of Expenses:</Text>
          <Text style={globalStyles.totalValue}>{expenses.length}</Text>
        </View>
      </View>

      {/* Add New Expense Button */}
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate('Log Expense')}
      >
        <Text style={styles.addButtonText}>+ Add New Expense</Text>
      </TouchableOpacity>

      {/* Expenses List */}
      <View style={globalStyles.card}>
        <Text style={globalStyles.cardTitle}>All Expenses</Text>

        {expenses.length > 0 ? (
          expenses.map((expense) => {
            const categoryName = getCategoryName(expense.categoryId);
            const categoryColor = getCategoryColor(expense.categoryId);
            
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
                    
                    <View style={styles.expenseContent}>
                      <View style={styles.expenseTopRow}>
                        <Text style={styles.categoryName}>
                          {expense.description || 'Invalid'}
                        </Text>
                        <Text style={[globalStyles.expenseAmount, globalStyles.expenseText]}>
                          -${expense.amount.toFixed(2)}
                        </Text>
                      </View>
                      
                      <View style={styles.expenseDetails}>
                        <View style={styles.categoryBadge}>
                          <View 
                            style={[globalStyles.categoryDot, { backgroundColor: categoryColor }]} 
                          />
                          <Text style={styles.categoryName}>{categoryName}</Text>
                        </View>
                        <Text style={globalStyles.listItemDate}>
                          {new Date(expense.date).toLocaleDateString()}
                        </Text>
                        <Text style={globalStyles.dateDot}> | </Text>
                        {expense.merchant && (
                          <>
                            <Text style={globalStyles.dateDot}> • </Text>
                            <Text style={styles.merchantText}>{expense.merchant}</Text>
                          </>
                        )}
                      </View>
                      
                      {expense.isRecurring && (
                        <View style={styles.recurringBadge}>
                          <Text style={styles.recurringText}>
                            {formatFrequency(expense.frequency || '')}
                          </Text>
                        </View>
                      )}
                    </View>
                  </View>
                </View>
              </View>
            );
          })
        ) : (
          <View style={globalStyles.emptyState}>
            <Text style={globalStyles.emptyStateTitle}>No Expenses Yet</Text>
            <Text style={globalStyles.emptyStateText}>
              Start tracking your spending by adding your first expense.
            </Text>
          </View>
        )}
      </View>

      {/* Menu Modal */}
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
                viewExpenseDetails(selectedExpenseId);
              }}
            >
              <Text style={globalStyles.menuOptionText}>View Details</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[globalStyles.menuOption, globalStyles.deleteOption]}
              onPress={() => {
                setShowMenu(false);
                deleteExpense(selectedExpenseId);
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
    </ScrollView>
  );
}