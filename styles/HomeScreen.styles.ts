// screens/HomeScreen.styles.ts
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8fafc',
        padding: 12,
    },
    summaryCard: {
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 16, // Reduced for compactness
        marginBottom: 12, // Reduced gap between cards
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    cardTitle: {
        fontSize: 18, // Slightly smaller
        fontWeight: 'bold',
        marginBottom: 12, // Reduced spacing
        color: '#1f2937',
    },
    summaryRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8, // Reduced for tighter spacing
    },
    summaryLabel: {
        fontSize: 17, // Increased from 16
        color: '#6b7280',
    },
    summaryValue: {
        fontSize: 17, // Increased from 16
        fontWeight: '600',
    },
    incomeText: {
        color: '#22c55e',
        fontSize: 15
    },
    expenseText: {
        color: '#ef4444',
    },
    totalRow: {
        borderTopWidth: 1,
        borderTopColor: '#e5e7eb',
        paddingTop: 8, // Reduced
        marginTop: 4, // Reduced
    },
    totalLabel: {
        fontSize: 17,
        fontWeight: 'bold',
        color: '#1f2937',
    },
    totalIncome: {
        fontSize: 15,
        color: '#1f2937',
    },
    totalValue: {
        fontSize: 15,
        fontWeight: 'bold',
    },
    actionsCard: {
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 16, // Reduced
        marginBottom: 12, // Reduced
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    actionsGrid: {
        flexDirection: 'column', // Changed from 'row' to stack vertically
        gap: 10, // Reduced gap
    },
    actionButton: {
        backgroundColor: '#4f46e5',
        paddingVertical: 12, // Reduced
        paddingHorizontal: 24,
        borderRadius: 10,
        alignItems: 'center',
    },
    actionButtonText: {
        color: 'white',
        fontSize: 16, // Increased from 14
        fontWeight: '600',
    },
    categoriesCard: {
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 16, // Reduced
        marginBottom: 12, // Reduced
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    categoryItem: {
        marginBottom: 12, // Reduced
    },
    categoryHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 6, // Reduced
    },
    categoryName: {
        fontSize: 17, // Increased from 16
        fontWeight: '600',
        color: '#1f2937',
        flex: 1, // Allow name to take available space
    },
    categoryAmount: {
        fontSize: 15, // Increased from 14
        color: '#6b7280',
        textAlign: 'right',
    },
    progressBarContainer: {
        height: 10, // Increased from 8
        backgroundColor: '#e5e7eb',
        borderRadius: 5, // Increased from 4
        marginBottom: 6, // Increased from 4
    },
    progressBar: {
        height: '100%',
        borderRadius: 5, // Increased from 4
    },
    percentageText: {
        fontSize: 13, // Increased from 12
        color: '#6b7280',
        textAlign: 'right',
    },
    overBudgetText: {
        color: '#ef4444',
        fontWeight: '600',
    },
    viewMoreButton: {
        alignItems: 'center',
        paddingTop: 16, // Increased from 12
        borderTopWidth: 1,
        borderTopColor: '#e5e7eb',
    },
    viewMoreText: {
        color: '#4f46e5',
        fontSize: 15, // Increased from 14
        fontWeight: '600',
    },
    emptyState: {
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 40, // Increased from 32
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    emptyTitle: {
        fontSize: 22, // Increased from 20
        fontWeight: 'bold',
        color: '#1f2937',
        marginBottom: 12, // Increased from 8
    },
    emptyText: {
        fontSize: 17, // Increased from 16
        color: '#6b7280',
        textAlign: 'center',
        lineHeight: 26, // Increased from 24
    },
    incomeCard: {
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 16, // Reduced
        marginBottom: 12, // Reduced
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    incomeItem: {
        marginBottom: 12, // Reduced
        paddingBottom: 12, // Reduced
        borderBottomWidth: 1,
        borderBottomColor: '#f3f4f6',
    },
    incomeHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 4, // Reduced
    },
    incomeName: {
        fontSize: 15,
        fontWeight: '600',
        color: '#1f2937',
    },
    incomeAmount: {
        fontSize: 15,
        fontWeight: '700',
    },
    incomeDetails: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    incomeDate: {
        fontSize: 12, // Increased from 14
        color: '#6b7280',
    },
    recurringBadge: {
        backgroundColor: '#dbeafe',
        paddingHorizontal: 12, // Increased from 8
        paddingVertical: 4, // Increased from 2
        borderRadius: 12,
    },
    recurringText: {
        fontSize: 11, // Increased from 10
        color: '#1e40af',
        fontWeight: '600',
    },
    incomeMainInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    menuButton: {
        paddingHorizontal: 12, // Increased from 8
        paddingVertical: 8, // Increased from 4
        marginRight: 8,
    },
    menuDots: {
        fontSize: 20, // Increased from 18
        color: '#6b7280',
        fontWeight: 'bold',
        transform: [{ rotate: '90deg' }],
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    menuModal: {
        backgroundColor: 'white',
        borderRadius: 12,
        minWidth: 240, // Increased from 200
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    menuOption: {
        paddingVertical: 20, // Increased from 16
        paddingHorizontal: 24, // Increased from 20
        borderBottomWidth: 1,
        borderBottomColor: '#f3f4f6',
    },
    menuOptionText: {
        fontSize: 17, // Increased from 16
        color: '#1f2937',
        textAlign: 'center',
    },
    deleteOption: {
        borderBottomColor: '#fee2e2',
    },
    deleteText: {
        color: '#ef4444',
    },
    incomeNameAndDate: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    dateDot: {
        fontSize: 15, // Increased from 14
        color: '#9ca3af',
        fontWeight: 'bold',
    },
    expensesCard: {
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 16, // Reduced
        marginBottom: 12, // Reduced
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    expenseItem: {
        marginBottom: 12, // Reduced
        paddingBottom: 12, // Reduced
        borderBottomWidth: 1,
        borderBottomColor: '#f3f4f6',
    },
    expenseHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    expenseMainInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    expenseNameAndDate: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    expenseName: {
        fontSize: 15,
        fontWeight: '600',
        color: '#1f2937',
    },
    expenseAmount: {
        fontSize: 15,
        fontWeight: '700',
    },
    expenseDate: {
        fontSize: 12,
        color: '#6b7280',
    },
    emptyExpensesState: {
        alignItems: 'center',
        paddingVertical: 40,
    },
    emptyExpensesText: {
        fontSize: 17,
        fontWeight: '600',
        color: '#6b7280',
        marginBottom: 12,
    },
    emptyExpensesSubtext: {
        fontSize: 15,
        color: '#9ca3af',
        textAlign: 'center',
    },
    emptyIncomeState: {
        alignItems: 'center',
        paddingVertical: 40,
    },
    emptyIncomeText: {
        fontSize: 17,
        fontWeight: '600',
        color: '#6b7280',
        marginBottom: 12,
    },
    emptyIncomeSubtext: {
        fontSize: 15,
        color: '#9ca3af',
        textAlign: 'center',
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    viewButton: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        backgroundColor: '#f3f4f6',
        borderRadius: 6,
    },
    viewButtonText: {
        fontSize: 14,
        color: '#4f46e5',
        fontWeight: '500',
    },
});