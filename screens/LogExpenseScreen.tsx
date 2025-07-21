import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Alert,
    ScrollView,
    Switch,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList, Paycheck, Expense } from '../constants/types';
import { storageUtils } from '../utils/storage';
import { styles } from '../styles/LogExpense.styles'

type LogExpenseNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Log Expense'>;

interface Props {
    navigation: LogExpenseNavigationProp;
}

export default function LogExpenseScreen({ navigation }: Props) {
    const [label, setLabel] = useState('');
    const [amount, setAmount] = useState('');
    const [merchant, setMerchant] = useState('')
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [isRecurring, setIsRecurring] = useState(false);
    const [frequency, setFrequency] = useState<'weekly' | 'bi-weekly' | 'monthly' | 'semi-monthly'>('bi-weekly');
    const [loading, setLoading] = useState(false);

    const handleSave = async () => {
        // Validation
        if (!label.trim()) {
            Alert.alert('Error', 'Please enter a paycheck label');
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
                categoryId: label.trim(),
                amount: parsedAmount,
                merchant,
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
        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
            <View style={styles.form}>
                <Text style={styles.title}>Add New Expense</Text>

                {/* Expense Label */}
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Expense Label *</Text>
                    <TextInput
                        style={styles.input}
                        value={label}
                        onChangeText={setLabel}
                        placeholder="e.g., Car Payment, Mortgage"
                        placeholderTextColor="#9ca3af"
                        autoCapitalize="words"
                    />
                </View>

                {/* Amount */}
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Amount *</Text>
                    <TextInput
                        style={styles.input}
                        value={amount}
                        onChangeText={setAmount}
                        placeholder="0.00"
                        placeholderTextColor="#9ca3af"
                        keyboardType="decimal-pad"
                        autoCapitalize="none"
                    />
                </View>

                {/* Merhcant */}
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Merchant</Text>
                    <TextInput
                        style={styles.input}
                        value={merchant}
                        onChangeText={setMerchant}
                        placeholder="e.g., VISA, McDonalds, AEP"
                        placeholderTextColor="#9ca3af"
                        autoCapitalize="words"
                    />
                </View>

                {/* Date */}
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Date</Text>
                    <TextInput
                        style={styles.input}
                        value={date}
                        onChangeText={setDate}
                        placeholder="YYYY-MM-DD"
                        placeholderTextColor="#9ca3af"
                        autoCapitalize="none"
                    />
                    <Text style={styles.helpText}>Format: YYYY-MM-DD (e.g., 2024-01-15)</Text>
                </View>

                {/* Recurring Toggle */}
                <View style={styles.switchGroup}>
                    <View style={styles.switchLabelContainer}>
                        <Text style={styles.label}>Recurring Expense?</Text>
                        <Text style={styles.helpText}>
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
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Frequency</Text>
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
                <View style={styles.buttonContainer}>
                    <TouchableOpacity
                        style={[styles.button, styles.cancelButton]}
                        onPress={() => navigation.goBack()}
                        disabled={loading}
                    >
                        <Text style={styles.cancelButtonText}>Cancel</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.button, styles.saveButton]}
                        onPress={handleSave}
                        disabled={loading}
                    >
                        <Text style={styles.saveButtonText}>
                            {loading ? 'Saving...' : 'Save Expense'}
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ScrollView>
    );
}