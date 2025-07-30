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
});