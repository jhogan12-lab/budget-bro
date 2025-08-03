import { StyleSheet } from 'react-native';


export const styles = StyleSheet.create({
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
    button: {
        flex: 1,
        paddingVertical: 14,
        borderRadius: 8,
        alignItems: 'center',
    },
    categorySelector: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
    },
    selectedCategoryContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    selectedCategoryText: {
        fontSize: 16,
        color: '#1f2937',
    },
    dropdownArrow: {
        fontSize: 12,
        color: '#6b7280',
    },
    categoryIcon: {
        fontSize: 14,
        marginRight: 6,
    },
});