import { StyleSheet } from 'react-native';

export const modalStyles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
    },
    container: {
        backgroundColor: '#ffffff',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        maxHeight: '70%',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#f3f4f6',
    },
    title: {
        fontSize: 18,
        fontWeight: '600',
        color: '#1f2937',
    },
    closeButton: {
        width: 30,
        height: 30,
        borderRadius: 15,
        backgroundColor: '#f3f4f6',
        justifyContent: 'center',
        alignItems: 'center',
    },
    closeButtonText: {
        fontSize: 16,
        color: '#6b7280',
        fontWeight: '600',
    },
    categoryList: {
        flex: 1,
    },
    categoryItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#f9fafb',
    },
    selectedCategoryItem: {
        backgroundColor: '#f0f9ff',
    },
    categoryInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    categoryDot: {
        width: 12,
        height: 12,
        borderRadius: 6,
        marginRight: 12,
    },
    categoryName: {
        fontSize: 16,
        color: '#1f2937',
    },
    checkmark: {
        fontSize: 18,
        color: '#3b82f6',
        fontWeight: '600',
    },
    categoryTextContainer: {
        flex: 1,
    },
    categoryIcon: {
        fontSize: 16,
        marginRight: 8,
    },
    categoryBudget: {
        fontSize: 12,
        color: '#6b7280',
        marginTop: 2,
    },
})