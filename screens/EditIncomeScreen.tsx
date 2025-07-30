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

type EditIncomeNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Edit Income'>;

interface Props {
    navigation: EditIncomeNavigationProp;
    route: {
        params: {
            incomeId: string;
        };
    };
}

export default function EditIncomeScreen({ navigation, route }: Props) {
    const { incomeId } = route.params;
    
    const [amount, setAmount] = useState('');
    const [label, setLabel] = useState('');
    const [date, setDate] = useState(new Date().toLocaleDateString());
    const [description, setDescription] = useState('');
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

    // Load income data
    useEffect(() => {
        loadIncomeData();
    }, []);

    const loadIncomeData = async () => {
        try {
            const incomes = await storageUtils.getIncome();
            const income = incomes.find(i => i.id === incomeId);
            
            if (income) {
                setAmount(income.amount.toString());
                setLabel(income.label);
                setDate(income.date);
                setDescription(income.description || '');
                setIsRecurring(income.isRecurring || false);
                setFrequency(income.frequency || 'monthly');
            } else {
                Alert.alert('Error', 'Income not found');
                navigation.goBack();
            }
        } catch (error) {
            Alert.alert('Error', 'Failed to load income data');
            console.error(error);
        } finally {
            setLoading(false);
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
        if (!label.trim()) {
            Alert.alert('Error', 'Please enter a label');
            return false;
        }
        return true;
    };

    const handleUpdateIncome = async () => {
        if (!validateForm()) return;

        try {
            const incomes = await storageUtils.getIncome();
            const incomeIndex = incomes.findIndex(i => i.id === incomeId);
            
            if (incomeIndex === -1) {
                Alert.alert('Error', 'Income not found');
                return;
            }

            const updatedIncome: Income = {
                ...incomes[incomeIndex],
                amount: parseFloat(amount),
                label: label.trim(),
                date: date,
                description: description.trim() || undefined,
                isRecurring: isRecurring,
                frequency: isRecurring ? frequency : undefined,
            };

            incomes[incomeIndex] = updatedIncome;
            await storageUtils.saveIncome(incomes);

            Alert.alert('Success', 'Income updated successfully!', [
                { text: 'OK', onPress: () => navigation.goBack() }
            ]);
        } catch (error) {
            Alert.alert('Error', 'Failed to update income');
            console.error('Error updating income:', error);
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
                <Text style={globalStyles.title}>Edit Income</Text>

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

                {/* Label Input */}
                <View style={globalStyles.inputGroup}>
                    <Text style={globalStyles.label}>Label *</Text>
                    <TextInput
                        style={globalStyles.input}
                        value={label}
                        onChangeText={setLabel}
                        placeholder="Enter income label (e.g., Salary, Freelance)"
                        returnKeyType="next"
                    />
                </View>

                {/* Description Input */}
                <View style={globalStyles.inputGroup}>
                    <Text style={globalStyles.label}>Description</Text>
                    <TextInput
                        style={[globalStyles.input, globalStyles.textArea]}
                        value={description}
                        onChangeText={setDescription}
                        placeholder="Add a description (optional)"
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
                    <Text style={globalStyles.switchLabel}>Recurring Income</Text>
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
                    onPress={handleUpdateIncome}
                >
                    <Text style={globalStyles.submitButtonText}>Update Income</Text>
                </TouchableOpacity>
            </View>

            {/* Frequency Modal */}
            <Modal
                visible={showFrequencyModal}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setShowFrequencyModal(false)}
            >
                <View style={globalStyles.modalOverlayBottom}>
                    <View style={globalStyles.modal}>
                        <View style={globalStyles.modalHeader}>
                            <Text style={globalStyles.modalTitle}>Select Frequency</Text>
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