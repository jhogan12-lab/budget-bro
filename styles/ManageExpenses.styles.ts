import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  addButton: {
    backgroundColor: '#3b82f6',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#3b82f6',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  addButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  expenseItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  expenseHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  expenseMainInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  menuButton: {
    padding: 4,
    marginRight: 8,
    marginTop: 2,
  },
  menuDots: {
    fontSize: 18,
    color: '#6b7280',
    fontWeight: 'bold',
  },
  expenseContent: {
    flex: 1,
  },
  expenseTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  categoryName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1f2937',
    flex: 1,
  },
  expenseDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  merchantText: {
    fontSize: 12,
    color: '#6b7280',
  },
  noteText: {
    fontSize: 12,
    color: '#6b7280',
    fontStyle: 'italic',
    marginTop: 2,
  },
  recurringBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#f3f4f6',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginTop: 4,
  },
  recurringText: {
    fontSize: 10,
    color: '#6b7280',
    fontWeight: '500',
  },
});