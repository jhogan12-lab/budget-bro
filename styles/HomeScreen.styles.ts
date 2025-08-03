// screens/HomeScreen.styles.ts
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    summaryLabel: {
        fontSize: 17, // Increased from 16
        color: '#6b7280',
    },
    totalIncome: {
        fontSize: 15,
        color: '#1f2937',
    },
    categoryItem: {
        marginBottom: 12, // Reduced
    },
    incomeDetails: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
});