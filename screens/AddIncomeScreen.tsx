// screens/AddPaycheckScreen.tsx
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
import { RootStackParamList, Income } from '../constants/types';
import { storageUtils } from '../utils/storage';
import { styles } from '../styles/AddIncome.styles'
import { globalStyles } from '../styles/Global.styles';

type AddIncomeNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Add Income'>;

interface Props {
    navigation: AddIncomeNavigationProp;
}

export default function AddincomeScreen({ navigation }: Props) {
    const [label, setLabel] = useState('');
    const [amount, setAmount] = useState('');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [isRecurring, setIsRecurring] = useState(false);
    const [frequency, setFrequency] = useState<'weekly' | 'bi-weekly' | 'monthly' | 'semi-monthly'>('bi-weekly');
    const [loading, setLoading] = useState(false);

    const handleSave = async () => {
        // Validation
        if (!label.trim()) {
            Alert.alert('Error', 'Please enter an income label');
            return;
        }

        const parsedAmount = parseFloat(amount);
        if (isNaN(parsedAmount) || parsedAmount <= 0) {
            Alert.alert('Error', 'Please enter a valid amount');
            return;
        }

        setLoading(true);

        try {
            // Load existing income
            const existingIncome = await storageUtils.getIncome();

            // Create new income
            const newIncome: Income = {
                id: Date.now().toString(),
                label: label.trim(),
                amount: parsedAmount,
                date,
                isRecurring,
                frequency: isRecurring ? frequency : undefined,
            };

            // Save updated income
            await storageUtils.saveIncome([...existingIncome, newIncome]);

            Alert.alert('Success', 'Income added successfully!');
            navigation.goBack();
        } catch (error) {
            Alert.alert('Error', 'Failed to save income. Please try again.');
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
                <Text style={globalStyles.title}>Add New Income</Text>

                {/* Income Label */}
                <View style={globalStyles.inputGroup}>
                    <Text style={globalStyles.label}>Income Label *</Text>
                    <TextInput
                        style={globalStyles.input}
                        value={label}
                        onChangeText={setLabel}
                        placeholder="e.g., Main Job, Side Hustle"
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
                        <Text style={globalStyles.label}>Recurring Income</Text>
                        <Text style={globalStyles.helpText}>
                            Enable if this income repeats regularly
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
                            {loading ? 'Saving...' : 'Save Income'}
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ScrollView>
    );
}