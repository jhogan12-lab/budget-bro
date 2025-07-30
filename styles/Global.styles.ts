import { StyleSheet } from 'react-native';

export const globalStyles = StyleSheet.create({
  // ============ BASE CONTAINERS ============
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  contentContainer: {
    padding: 16,
  },
  scrollContainer: {
    flex: 1,
    backgroundColor: '#f8fafc',
    padding: 12,
  },

  // ============ CARDS ============
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardCompact: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  formCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },

  // ============ TYPOGRAPHY ============
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 24,
    textAlign: 'center',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
  },
  bodyText: {
    fontSize: 16,
    color: '#1f2937',
  },
  captionText: {
    fontSize: 14,
    color: '#6b7280',
  },
  smallText: {
    fontSize: 12,
    color: '#6b7280',
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 12,
  },
  emptyStateText: {
    fontSize: 17,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 26,
  },

  // ============ TEXT COLORS ============
  textPrimary: { color: '#1f2937' },
  textSecondary: { color: '#6b7280' },
  textMuted: { color: '#9ca3af' },
  textSuccess: { color: '#22c55e' },
  textDanger: { color: '#ef4444' },
  textWarning: { color: '#f59e0b' },
  textInfo: { color: '#3b82f6' },

  // Financial specific
  incomeText: { 
    color: '#22c55e',
    fontSize: 15,
  },
  expenseText: { 
    color: '#ef4444',
  },

  // ============ FORMS ============
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
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  helpText: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 4,
  },
  placeholderText: {
    fontSize: 16,
    color: '#9ca3af',
  },

  // Amount input specific
  amountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    backgroundColor: '#ffffff',
  },
  currencySymbol: {
    fontSize: 16,
    color: '#6b7280',
    paddingLeft: 12,
  },
  amountInput: {
    flex: 1,
    paddingHorizontal: 8,
    paddingVertical: 12,
    fontSize: 16,
    color: '#1f2937',
  },

  // ============ BUTTONS ============
  buttonPrimary: {
    backgroundColor: '#4f46e5',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonSuccess: {
    backgroundColor: '#22c55e',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonDanger: {
    backgroundColor: '#ef4444',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonSecondary: {
    backgroundColor: '#f3f4f6',
    borderWidth: 1,
    borderColor: '#d1d5db',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  buttonTextSecondary: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
  },
  
  // Action buttons
  actionButton: {
    backgroundColor: '#4f46e5',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 10,
    alignItems: 'center',
  },
  actionButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },

  // Submit buttons
  submitButton: {
    backgroundColor: '#22c55e',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },

  // Small buttons
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

  // ============ LAYOUT HELPERS ============
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rowStart: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  column: {
    flexDirection: 'column',
  },
  flex1: { flex: 1 },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  spacingBottom: { marginBottom: 8 },
  spacingBottomLarge: { marginBottom: 16 },
  paddingBottom: { paddingBottom: 80 },

  // ============ FINANCIAL UI ELEMENTS ============
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    paddingTop: 8,
    marginTop: 4,
  },
  totalLabel: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  totalValue: {
    fontSize: 15,
    fontWeight: 'bold',
  },
  summaryValue: {
    fontSize: 17,
    fontWeight: '600',
  },

  // Amount displays
  incomeAmount: {
    fontSize: 15,
    fontWeight: '700',
  },
  expenseAmount: {
    fontSize: 15,
    fontWeight: '700',
  },

  // ============ LIST ITEMS ============
  listItem: {
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  listItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  listItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  listItemName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1f2937',
  },
  listItemDate: {
    fontSize: 12,
    color: '#6b7280',
  },
  dateDot: {
    fontSize: 15,
    color: '#9ca3af',
    fontWeight: 'bold',
  },

  // ============ CATEGORIES ============
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  categoryDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 8,
  },
  categoryName: {
    fontSize: 17,
    fontWeight: '600',
    color: '#1f2937',
    flex: 1,
  },
  categoryAmount: {
    fontSize: 15,
    color: '#6b7280',
    textAlign: 'right',
  },

  // Progress bars
  progressBarContainer: {
    height: 10,
    backgroundColor: '#e5e7eb',
    borderRadius: 5,
    marginBottom: 6,
  },
  progressBar: {
    height: '100%',
    borderRadius: 5,
  },
  percentageText: {
    fontSize: 13,
    color: '#6b7280',
    textAlign: 'right',
  },
  overBudgetText: {
    color: '#ef4444',
    fontWeight: '600',
  },

  // ============ BADGES ============
  recurringBadge: {
    backgroundColor: '#dbeafe',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  recurringText: {
    fontSize: 11,
    color: '#1e40af',
    fontWeight: '600',
  },

  // ============ MENU & MODALS ============
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalOverlayBottom: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modal: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '70%',
  },
  menuModal: {
    backgroundColor: 'white',
    borderRadius: 12,
    minWidth: 240,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
  },
  modalCloseButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalCloseButtonText: {
    fontSize: 16,
    color: '#6b7280',
    fontWeight: '600',
  },
  modalContent: {
    flex: 1,
  },

  // ============ MENU OPTIONS ============
  menuOption: {
    paddingVertical: 20,
    paddingHorizontal: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  menuOptionText: {
    fontSize: 17,
    color: '#1f2937',
    textAlign: 'center',
  },
  deleteOption: {
    borderBottomColor: '#fee2e2',
  },
  deleteText: {
    color: '#ef4444',
  },

  // List options for modals
  option: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f9fafb',
  },
  selectedOption: {
    backgroundColor: '#f0f9ff',
  },
  optionText: {
    fontSize: 16,
    color: '#1f2937',
  },
  selectedOptionText: {
    color: '#3b82f6',
    fontWeight: '600',
  },

  // ============ INTERACTIVE ELEMENTS ============
  menuButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 8,
  },
  menuDots: {
    fontSize: 20,
    color: '#6b7280',
    fontWeight: 'bold',
    transform: [{ rotate: '90deg' }],
  },

  // Picker buttons
  pickerButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: '#ffffff',
  },
  pickerText: {
    fontSize: 16,
    color: '#1f2937',
  },
  pickerPlaceholder: {
    fontSize: 16,
    color: '#9ca3af',
  },
  pickerArrow: {
    fontSize: 12,
    color: '#6b7280',
  },

  // ============ SWITCHES & TOGGLES ============
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingVertical: 8,
  },
  switchLabel: {
    fontSize: 16,
    color: '#1f2937',
    fontWeight: '500',
  },

  // ============ EMPTY STATES ============
  emptyState: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 40,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  emptyStateSmall: {
    alignItems: 'center',
    paddingVertical: 40,
  },

  // ============ LOADING STATES ============
  loadingText: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    marginTop: 20,
  },

  // ============ GRIDS & LAYOUTS ============
  actionsGrid: {
    flexDirection: 'column',
    gap: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
  },

  // ============ CARD HEADERS ============
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },

  // ============ VIEW MORE BUTTONS ============
  viewMoreButton: {
    alignItems: 'center',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  viewMoreText: {
    color: '#4f46e5',
    fontSize: 15,
    fontWeight: '600',
  },
});