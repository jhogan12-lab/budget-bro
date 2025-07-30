import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Alert,
    ScrollView,
    Switch,
    Modal,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList, Income, Expense, BudgetCategory } from '../constants/types';
import { storageUtils } from '../utils/storage';
import { styles } from '../styles/LogExpense.styles'
import { modalStyles } from '../styles/Modal.styles';
import { globalStyles } from '../styles/Global.styles';

type EditExpenseNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Edit Expense'>;

interface Props {
    navigation: EditExpenseNavigationProp;
    route: {
        params: {
            expenseId: string;
        };
    };
}

export default function EditExpenseScreen({ navigation, route }: Props) {
    const { expenseId } = route.params;
    
    const [amount, setAmount] = useState('');
    const [note, setNote] = useState('');
    const [date, setDate] = useState(new Date().toLocaleDateString());
    const [merchant, setMerchant] = useState('');
    const [description, setDescription] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<BudgetCategory | null>(null);
    const [categories, setCategories] = useState<BudgetCategory[]>([]);
    const [showCategoryModal, setShowCategoryModal] = useState(false);
    const [isRecurring, setIsRecurring] = useState(false);
    const [frequency, setFrequency] = useState<'weekly' | 'bi-weekly' | 'monthly' | 'semi-monthly'>('monthly');
    const [showFrequencyModal, setShowFrequencyModal] = useState(false);
    const [loading, setLoading] = useState(true);

    // Format currency input
    const formatCurrency = (value: string) => {
        const numericValue = value.replace(/[^0-9.]/g, '');
        const parts = numericValue.split('.');
        if (parts.length > 2) {
            return parts[0] + '.' + parts.slice(1).join('').substring(0, 2);
        }
        if (parts[1] && parts[1].length > 2) {
            return parts[0] + '.' + parts[1].substring(0, 2);
        }
        return numericValue;
    };

    // Load expense data and categories
    useEffect(() => {
        loadExpenseData();
        loadCategories();
    }, []);

    const loadExpenseData = async () => {
        try {
            const expenses = await storageUtils.getExpenses();
            const expense = expenses.find(e => e.id === expenseId);
            
            if (expense) {
                setAmount(expense.amount.toString());
                setNote(expense.note || '');
                setDate(expense.date);
                setMerchant(expense.merchant || '');
                setDescription(expense.description);
                setIsRecurring(expense.isRecurring || false);
                setFrequency(expense.frequency || 'monthly');
                
                // Load categories to find the selected one
                const budgets = await storageUtils.getBudgets();
                const category = budgets.find(c => c.id === expense.categoryId);
                setSelectedCategory(category || null);
            } else {
                Alert.alert('Error', 'Expense not found');
                navigation.goBack();
            }
        } catch (error) {
            Alert.alert('Error', 'Failed to load expense data');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const loadCategories = async () => {
        try {
            const budgets = await storageUtils.getBudgets();
            setCategories(budgets);
        } catch (error) {
            console.error('Failed to load categories:', error);
        }
    };

    const handleAmountChange = (value: string) => {
        const formatted = formatCurrency(value);
        setAmount(formatted);
    };

    const validateForm = () => {
        if (!amount || parseFloat(amount) <= 0) {
            Alert.alert('Error', 'Please enter a valid amount');
            return false;
        }
        if (!selectedCategory) {
            Alert.alert('Error', 'Please select a category');
            return false;
        }
        if (!description.trim()) {
            Alert.alert('Error', 'Please enter a description');
            return false;
        }
        return true;
    };

    const handleUpdateExpense = async () => {
        if (!validateForm()) return;

        try {
            const expenses = await storageUtils.getExpenses();
            const expenseIndex = expenses.findIndex(e => e.id === expenseId);
            
            if (expenseIndex === -1) {
                Alert.alert('Error', 'Expense not found');
                return;
            }

            const updatedExpense: Expense = {
                ...expenses[expenseIndex],
                categoryId: selectedCategory!.id,
                amount: parseFloat(amount),
                note: note.trim() || undefined,
                date: date,
                merchant: merchant.trim() || undefined,
                description: description.trim(),
                isRecurring: isRecurring,
                frequency: isRecurring ? frequency : undefined,
            };

            expenses[expenseIndex] = updatedExpense;
            await storageUtils.saveExpenses(expenses);

            Alert.alert('Success', 'Expense updated successfully!', [
                { text: 'OK', onPress: () => navigation.goBack() }
            ]);
        } catch (error) {
            Alert.alert('Error', 'Failed to update expense');
            console.error('Error updating expense:', error);
        }
    };

    const frequencyOptions = [
        { value: 'weekly', label: 'Weekly' },
        { value: 'bi-weekly', label: 'Bi-Weekly' },
        { value: 'semi-monthly', label: 'Semi-Monthly' },
        { value: 'monthly', label: 'Monthly' },
    ];

    if (loading) {
        return (
            <View style={globalStyles.container}>
                <Text style={globalStyles.loadingText}>Loading...</Text>
            </View>
        );
    }

    return (
        <ScrollView style={globalStyles.container}>
            <View style={globalStyles.formCard}>
                <Text style={globalStyles.title}>Edit Expense</Text>

                {/* Amount Input */}
                <View style={globalStyles.inputGroup}>
                    <Text style={globalStyles.label}>Amount *</Text>
                    <View style={globalStyles.amountContainer}>
                        <Text style={globalStyles.currencySymbol}>$</Text>
                        <TextInput
                            style={globalStyles.amountInput}
                            value={amount}
                            onChangeText={handleAmountChange}
                            placeholder="0.00"
                            keyboardType="decimal-pad"
                            returnKeyType="next"
                        />
                    </View>
                </View>

                {/* Category Selection */}
                <View style={globalStyles.inputGroup}>
                    <Text style={globalStyles.label}>Category *</Text>
                    <TouchableOpacity
                        style={globalStyles.pickerButton}
                        onPress={() => setShowCategoryModal(true)}
                    >
                        <Text style={selectedCategory ? globalStyles.pickerText : globalStyles.pickerPlaceholder}>
                            {selectedCategory ? selectedCategory.name : 'Select Category'}
                        </Text>
                        <Text style={globalStyles.pickerArrow}>▼</Text>
                    </TouchableOpacity>
                </View>

                {/* Description Input */}
                <View style={globalStyles.inputGroup}>
                    <Text style={globalStyles.label}>Description *</Text>
                    <TextInput
                        style={globalStyles.input}
                        value={description}
                        onChangeText={setDescription}
                        placeholder="Enter description"
                        returnKeyType="next"
                    />
                </View>

                {/* Merchant Input */}
                <View style={globalStyles.inputGroup}>
                    <Text style={globalStyles.label}>Merchant</Text>
                    <TextInput
                        style={globalStyles.input}
                        value={merchant}
                        onChangeText={setMerchant}
                        placeholder="Enter merchant (optional)"
                        returnKeyType="next"
                    />
                </View>

                {/* Note Input */}
                <View style={globalStyles.inputGroup}>
                    <Text style={globalStyles.label}>Note</Text>
                    <TextInput
                        style={[globalStyles.input, globalStyles.textArea]}
                        value={note}
                        onChangeText={setNote}
                        placeholder="Add a note (optional)"
                        multiline
                        numberOfLines={3}
                        textAlignVertical="top"
                    />
                </View>

                {/* Date Input */}
                <View style={globalStyles.inputGroup}>
                    <Text style={globalStyles.label}>Date</Text>
                    <TextInput
                        style={globalStyles.input}
                        value={date}
                        onChangeText={setDate}
                        placeholder="MM/DD/YYYY"
                    />
                </View>

                {/* Recurring Toggle */}
                <View style={globalStyles.switchContainer}>
                    <Text style={globalStyles.switchLabel}>Recurring Expense</Text>
                    <Switch
                        value={isRecurring}
                        onValueChange={setIsRecurring}
                        trackColor={{ false: '#767577', true: '#4f46e5' }}
                        thumbColor={isRecurring ? '#fff' : '#f4f3f4'}
                    />
                </View>

                {/* Frequency Selection */}
                {isRecurring && (
                    <View style={globalStyles.inputGroup}>
                        <Text style={globalStyles.label}>Frequency</Text>
                        <TouchableOpacity
                            style={globalStyles.pickerButton}
                            onPress={() => setShowFrequencyModal(true)}
                        >
                            <Text style={globalStyles.pickerText}>
                                {frequencyOptions.find(f => f.value === frequency)?.label}
                            </Text>
                            <Text style={globalStyles.pickerArrow}>▼</Text>
                        </TouchableOpacity>
                    </View>
                )}

                {/* Update Button */}
                <TouchableOpacity
                    style={globalStyles.submitButton}
                    onPress={handleUpdateExpense}
                >
                    <Text style={globalStyles.submitButtonText}>Update Expense</Text>
                </TouchableOpacity>
            </View>

            {/* Category Modal */}
            <Modal
                visible={showCategoryModal}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setShowCategoryModal(false)}
            >
                <View style={globalStyles.modalOverlayBottom}>
                    <View style={globalStyles.modal}>
                        <View style={globalStyles.modalHeader}>
                            <Text style={globalStyles.title}>Select Category</Text>
                            <TouchableOpacity
                                onPress={() => setShowCategoryModal(false)}
                                style={globalStyles.modalCloseButton}
                            >
                                <Text style={globalStyles.modalCloseButtonText}>×</Text>
                            </TouchableOpacity>
                        </View>
                        <ScrollView style={globalStyles.modalContent}>
                            {categories.map((category) => (
                                <TouchableOpacity
                                    key={category.id}
                                    style={[
                                        globalStyles.option,
                                        selectedCategory?.id === category.id && globalStyles.selectedOption
                                    ]}
                                    onPress={() => {
                                        setSelectedCategory(category);
                                        setShowCategoryModal(false);
                                    }}
                                >
                                    <View style={[globalStyles.categoryDot, { backgroundColor: category.color }]} />
                                    <Text style={[
                                        globalStyles.optionText,
                                        selectedCategory?.id === category.id && globalStyles.selectedOptionText
                                    ]}>
                                        {category.name}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </View>
                </View>
            </Modal>

            {/* Frequency Modal */}
            <Modal
                visible={showFrequencyModal}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setShowFrequencyModal(false)}
            >
                <View style={globalStyles.modalOverlayBottom }>
                    <View style={globalStyles.modal}>
                        <View style={globalStyles.modalHeader}>
                            <Text style={globalStyles.title}>Select Frequency</Text>
                            <TouchableOpacity
                                onPress={() => setShowFrequencyModal(false)}
                                style={globalStyles.modalCloseButton}
                            >
                                <Text style={globalStyles.modalCloseButtonText}>×</Text>
                            </TouchableOpacity>
                        </View>
                        <ScrollView style={globalStyles.modalContent}>
                            {frequencyOptions.map((option) => (
                                <TouchableOpacity
                                    key={option.value}
                                    style={[
                                        globalStyles.option,
                                        frequency === option.value && globalStyles.selectedOption
                                    ]}
                                    onPress={() => {
                                        setFrequency(option.value as 'weekly' | 'bi-weekly' | 'monthly' | 'semi-monthly');
                                        setShowFrequencyModal(false);
                                    }}
                                >
                                    <Text style={[
                                        globalStyles.optionText,
                                        frequency === option.value && globalStyles.selectedOptionText
                                    ]}>
                                        {option.label}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </View>
                </View>
            </Modal>
        </ScrollView>
    );
}