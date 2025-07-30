import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ScrollView, Switch, Modal, } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList, Expense, BudgetCategory } from '../constants/types';
import { storageUtils } from '../utils/storage';
import { styles } from '../styles/LogExpense.styles'
import { modalStyles } from '../styles/Modal.styles';
import { globalStyles } from '../styles/Global.styles';

type LogExpenseNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Log Expense'>;

interface Props {
    navigation: LogExpenseNavigationProp;
}

// Hardcoded categories with colors
const DEFAULT_CATEGORIES: BudgetCategory[] = [
    { id: 'food', name: 'Food & Dining', color: '#ef4444', limit: 500, spent: 0, icon: '🍽️' },
    { id: 'transportation', name: 'Transportation', color: '#3b82f6', limit: 300, spent: 0, icon: '🚗' },
    { id: 'shopping', name: 'Shopping', color: '#f59e0b', limit: 200, spent: 0, icon: '🛍️' },
    { id: 'entertainment', name: 'Entertainment', color: '#8b5cf6', limit: 150, spent: 0, icon: '🎬' },
    { id: 'bills', name: 'Bills & Utilities', color: '#10b981', limit: 400, spent: 0, icon: '💡' },
    { id: 'healthcare', name: 'Healthcare', color: '#06b6d4', limit: 200, spent: 0, icon: '🏥' },
    { id: 'education', name: 'Education', color: '#f97316', limit: 100, spent: 0, icon: '📚' },
    { id: 'travel', name: 'Travel', color: '#84cc16', limit: 300, spent: 0, icon: '✈️' },
    { id: 'personal', name: 'Personal Care', color: '#ec4899', limit: 100, spent: 0, icon: '💄' },
    { id: 'other', name: 'Other', color: '#6b7280', limit: 100, spent: 0, icon: '📦' },
];

export default function LogExpenseScreen({ navigation }: Props) {
    const [label, setLabel] = useState('');
    const [amount, setAmount] = useState('');
    const [merchant, setMerchant] = useState('');
    const [note, setNote] = useState('');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [isRecurring, setIsRecurring] = useState(false);
    const [frequency, setFrequency] = useState<'weekly' | 'bi-weekly' | 'monthly' | 'semi-monthly'>('bi-weekly');
    const [loading, setLoading] = useState(false);
    
    // Category selection state
    const [categories, setCategories] = useState<BudgetCategory[]>(DEFAULT_CATEGORIES);
    const [selectedCategory, setSelectedCategory] = useState<BudgetCategory | null>(null);
    const [showCategoryModal, setShowCategoryModal] = useState(false);

    useEffect(() => {
        loadCategories();
    }, []);

    const loadCategories = async () => {
        try {
            const existingCategories = await storageUtils.getBudgets();
            if (existingCategories.length > 0) {
                setCategories(existingCategories);
            } else {
                // Save default categories if none exist
                await storageUtils.saveBudgets(DEFAULT_CATEGORIES);
                setCategories(DEFAULT_CATEGORIES);
            }
        } catch (error) {
            console.error('Error loading categories:', error);
            // Fallback to default categories
            setCategories(DEFAULT_CATEGORIES);
        }
    };

    const handleSave = async () => {
        // Validation
        if (!selectedCategory) {
            Alert.alert('Error', 'Please select a category');
            return;
        }

        if (!label.trim()) {
            Alert.alert('Error', 'Please enter an expense description');
            return;
        }

        const parsedAmount = parseFloat(amount);
        if (isNaN(parsedAmount) || parsedAmount <= 0) {
            Alert.alert('Error', 'Please enter a valid amount');
            return;
        }

        setLoading(true);

        try {
            const existingExpenses = await storageUtils.getExpenses();

            const newExpense: Expense = {
                id: Date.now().toString(),
                categoryId: selectedCategory.id,
                amount: parsedAmount,
                merchant: merchant.trim(),
                description: label,
                note: note.trim(),
                date,
                isRecurring,
                frequency: isRecurring ? frequency : undefined,
            };

            // Save updated expenses
            await storageUtils.saveExpenses([...existingExpenses, newExpense]);

            Alert.alert('Success', 'Expense added successfully!');
            navigation.goBack();
        } catch (error) {
            Alert.alert('Error', 'Failed to save expense. Please try again.');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const FrequencyButton = ({
        freq,
        currentFreq,
        onPress,
        title
    }: {
        freq: string;
        currentFreq: string;
        onPress: () => void;
        title: string;
    }) => (
        <TouchableOpacity
            style={[
                styles.frequencyButton,
                freq === currentFreq && styles.frequencyButtonActive
            ]}
            onPress={onPress}
        >
            <Text style={[
                styles.frequencyButtonText,
                freq === currentFreq && styles.frequencyButtonTextActive
            ]}>
                {title}
            </Text>
        </TouchableOpacity>
    );

    return (
        <ScrollView style={globalStyles.container} contentContainerStyle={globalStyles.contentContainer}>
            <View style={globalStyles.formCard}>
                <Text style={globalStyles.title}>Add New Expense</Text>

                {/* Category Selection */}
                <View style={globalStyles.inputGroup}>
                    <Text style={globalStyles.label}>Category *</Text>
                    <TouchableOpacity
                        style={[globalStyles.input, styles.categorySelector]}
                        onPress={() => setShowCategoryModal(true)}
                    >
                        {selectedCategory ? (
                            <View style={styles.selectedCategoryContainer}>
                                {selectedCategory.icon && (
                                    <Text style={styles.categoryIcon}>{selectedCategory.icon}</Text>
                                )}
                                <View 
                                    style={[globalStyles.categoryDot, { backgroundColor: selectedCategory.color }]} 
                                />
                                <Text style={styles.selectedCategoryText}>{selectedCategory.name}</Text>
                            </View>
                        ) : (
                            <Text style={globalStyles.placeholderText}>Select a category</Text>
                        )}
                        <Text style={styles.dropdownArrow}>▼</Text>
                    </TouchableOpacity>
                </View>

                {/* Expense Description */}
                <View style={globalStyles.inputGroup}>
                    <Text style={globalStyles.label}>Description *</Text>
                    <TextInput
                        style={globalStyles.input}
                        value={label}
                        onChangeText={setLabel}
                        placeholder="e.g., Lunch at McDonald's, Gas station"
                        placeholderTextColor="#9ca3af"
                        autoCapitalize="words"
                    />
                </View>

                {/* Amount */}
                <View style={globalStyles.inputGroup}>
                    <Text style={globalStyles.label}>Amount *</Text>
                    <TextInput
                        style={globalStyles.input}
                        value={amount}
                        onChangeText={setAmount}
                        placeholder="0.00"
                        placeholderTextColor="#9ca3af"
                        keyboardType="decimal-pad"
                        autoCapitalize="none"
                    />
                </View>

                {/* Merchant */}
                <View style={globalStyles.inputGroup}>
                    <Text style={globalStyles.label}>Merchant</Text>
                    <TextInput
                        style={globalStyles.input}
                        value={merchant}
                        onChangeText={setMerchant}
                        placeholder="e.g., McDonald's, Shell, Amazon"
                        placeholderTextColor="#9ca3af"
                        autoCapitalize="words"
                    />
                </View>

                {/* Note */}
                <View style={globalStyles.inputGroup}>
                    <Text style={globalStyles.label}>Note</Text>
                    <TextInput
                        style={[globalStyles.input, globalStyles.textArea]}
                        value={note}
                        onChangeText={setNote}
                        placeholder="Optional note about this expense"
                        placeholderTextColor="#9ca3af"
                        multiline
                        numberOfLines={3}
                        autoCapitalize="sentences"
                    />
                </View>

                {/* Date */}
                <View style={globalStyles.inputGroup}>
                    <Text style={globalStyles.label}>Date</Text>
                    <TextInput
                        style={globalStyles.input}
                        value={date}
                        onChangeText={setDate}
                        placeholder="YYYY-MM-DD"
                        placeholderTextColor="#9ca3af"
                        autoCapitalize="none"
                    />
                    <Text style={globalStyles.helpText}>Format: YYYY-MM-DD (e.g., 2024-01-15)</Text>
                </View>

                {/* Recurring Toggle */}
                <View style={styles.switchGroup}>
                    <View style={styles.switchLabelContainer}>
                        <Text style={globalStyles.label}>Recurring Expense?</Text>
                        <Text style={globalStyles.helpText}>
                            Enable if this expense repeats regularly
                        </Text>
                    </View>
                    <Switch
                        value={isRecurring}
                        onValueChange={setIsRecurring}
                        trackColor={{ false: '#d1d5db', true: '#4f46e5' }}
                        thumbColor={isRecurring ? '#ffffff' : '#f3f4f6'}
                    />
                </View>

                {/* Frequency Selection (only if recurring) */}
                {isRecurring && (
                    <View style={globalStyles.inputGroup}>
                        <Text style={globalStyles.label}>Frequency</Text>
                        <View style={styles.frequencyContainer}>
                            <FrequencyButton
                                freq="weekly"
                                currentFreq={frequency}
                                onPress={() => setFrequency('weekly')}
                                title="Weekly"
                            />
                            <FrequencyButton
                                freq="bi-weekly"
                                currentFreq={frequency}
                                onPress={() => setFrequency('bi-weekly')}
                                title="Bi-weekly"
                            />
                            <FrequencyButton
                                freq="semi-monthly"
                                currentFreq={frequency}
                                onPress={() => setFrequency('semi-monthly')}
                                title="Semi-monthly"
                            />
                            <FrequencyButton
                                freq="monthly"
                                currentFreq={frequency}
                                onPress={() => setFrequency('monthly')}
                                title="Monthly"
                            />
                        </View>
                    </View>
                )}

                {/* Action Buttons */}
                <View style={globalStyles.buttonContainer}>
                    <TouchableOpacity
                        style={[styles.button, globalStyles.buttonSecondary]}
                        onPress={() => navigation.goBack()}
                        disabled={loading}
                    >
                        <Text style={globalStyles.buttonTextSecondary}>Cancel</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.button, globalStyles.buttonSuccess]}
                        onPress={handleSave}
                        disabled={loading}
                    >
                        <Text style={globalStyles.buttonText}>
                            {loading ? 'Saving...' : 'Save Expense'}
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>

            {/* Category Selection Modal */}
            <Modal
                visible={showCategoryModal}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setShowCategoryModal(false)}
            >
                <View style={modalStyles.overlay}>
                    <View style={modalStyles.container}>
                        <View style={modalStyles.header}>
                            <Text style={modalStyles.title}>Select Category</Text>
                            <TouchableOpacity
                                onPress={() => setShowCategoryModal(false)}
                                style={modalStyles.closeButton}
                            >
                                <Text style={modalStyles.closeButtonText}>✕</Text>
                            </TouchableOpacity>
                        </View>
                        
                        <ScrollView style={modalStyles.categoryList}>
                            {categories.map((category) => (
                                <TouchableOpacity
                                    key={category.id}
                                    style={[
                                        modalStyles.categoryItem,
                                        selectedCategory?.id === category.id && modalStyles.selectedCategoryItem
                                    ]}
                                    onPress={() => {
                                        setSelectedCategory(category);
                                        setShowCategoryModal(false);
                                    }}
                                >
                                    <View style={modalStyles.categoryInfo}>
                                        {category.icon && (
                                            <Text style={modalStyles.categoryIcon}>{category.icon}</Text>
                                        )}
                                        <View 
                                            style={[modalStyles.categoryDot, { backgroundColor: category.color }]} 
                                        />
                                        <View style={modalStyles.categoryTextContainer}>
                                            <Text style={modalStyles.categoryName}>{category.name}</Text>
                                            <Text style={modalStyles.categoryBudget}>
                                                ${category.spent.toFixed(0)} / ${category.limit.toFixed(0)}
                                            </Text>
                                        </View>
                                    </View>
                                    {selectedCategory?.id === category.id && (
                                        <Text style={modalStyles.checkmark}>✓</Text>
                                    )}
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </View>
                </View>
            </Modal>
        </ScrollView>
    );
}
