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
import { RootStackParamList, Paycheck } from '../constants/types';
import { storageUtils } from '../utils/storage';

type AddPaycheckNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Add Paycheck'>;

interface Props {
    navigation: AddPaycheckNavigationProp;
}

export default function AddPaycheckScreen({ navigation }: Props) {
    const [label, setLabel] = useState('');
    const [amount, setAmount] = useState('');
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
            // Load existing paychecks
            const existingPaychecks = await storageUtils.getPaychecks();

            // Create new paycheck
            const newPaycheck: Paycheck = {
                id: Date.now().toString(),
                label: label.trim(),
                amount: parsedAmount,
                date,
                isRecurring,
                frequency: isRecurring ? frequency : undefined,
            };

            // Save updated paychecks
            await storageUtils.savePaychecks([...existingPaychecks, newPaycheck]);

            Alert.alert('Success', 'Paycheck added successfully!');
            navigation.goBack();
        } catch (error) {
            Alert.alert('Error', 'Failed to save paycheck. Please try again.');
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
                <Text style={styles.title}>Add New Paycheck</Text>

                {/* Paycheck Label */}
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Paycheck Label *</Text>
                    <TextInput
                        style={styles.input}
                        value={label}
                        onChangeText={setLabel}
                        placeholder="e.g., Main Job, Side Hustle"
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
                        <Text style={styles.label}>Recurring Paycheck</Text>
                        <Text style={styles.helpText}>
                            Enable if this paycheck repeats regularly
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
                            {loading ? 'Saving...' : 'Save Paycheck'}
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8fafc',
    },
    contentContainer: {
        padding: 16,
    },
    form: {
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 24,
        color: '#1f2937',
        textAlign: 'center',
    },
    inputGroup: {
        marginBottom: 20,
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        color: '#374151',
        marginBottom: 8,
    },
    input: {
        borderWidth: 1,
        borderColor: '#d1d5db',
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 12,
        fontSize: 16,
        color: '#1f2937',
        backgroundColor: '#ffffff',
    },
    helpText: {
        fontSize: 12,
        color: '#6b7280',
        marginTop: 4,
    },
    switchGroup: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 20,
        paddingVertical: 8,
    },
    switchLabelContainer: {
        flex: 1,
        marginRight: 12,
    },
    frequencyContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    frequencyButton: {
        backgroundColor: '#f3f4f6',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#d1d5db',
    },
    frequencyButtonActive: {
        backgroundColor: '#4f46e5',
        borderColor: '#4f46e5',
    },
    frequencyButtonText: {
        fontSize: 14,
        color: '#374151',
    },
    frequencyButtonTextActive: {
        color: 'white',
        fontWeight: '600',
    },
    buttonContainer: {
        flexDirection: 'row',
        gap: 12,
        marginTop: 20,
    },
    button: {
        flex: 1,
        paddingVertical: 14,
        borderRadius: 8,
        alignItems: 'center',
    },
    cancelButton: {
        backgroundColor: '#f3f4f6',
        borderWidth: 1,
        borderColor: '#d1d5db',
    },
    saveButton: {
        backgroundColor: '#22c55e',
    },
    cancelButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#374151',
    },
    saveButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: 'white',
    },
});