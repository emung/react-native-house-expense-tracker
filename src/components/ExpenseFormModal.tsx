import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  useWindowDimensions
} from 'react-native';
import { DatePickerModal } from 'react-native-paper-dates';
import CreateExpenseReqBody from '../server/expense/CreateExpenseReqBody';
import Expense from '../server/expense/Expense';
import UpdateExpenseReqBody from '../server/expense/UpdateExpenseReqBody';

type ExpenseFormModalProps = {
  visible: boolean;
  expense: Expense | null;
  categories: string[];
  onSave: (data: CreateExpenseReqBody) => Promise<void>;
  onUpdate: (id: number, data: UpdateExpenseReqBody) => Promise<void>;
  onClose: () => void;
};

const CURRENCIES: ('EUR' | 'RON')[] = ['EUR', 'RON'];
const DEFAULT_USER_ID = 1;

export default function ExpenseFormModal({
  visible,
  expense,
  categories,
  onSave,
  onUpdate,
  onClose
}: ExpenseFormModalProps) {
  const { width } = useWindowDimensions();
  const isWide = width >= 768;

  const [isRefund, setIsRefund] = useState(false);
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [recipient, setRecipient] = useState('');
  const [currency, setCurrency] = useState<'EUR' | 'RON'>('EUR');
  const [date, setDate] = useState<Date>(new Date());
  const [datePickerOpen, setDatePickerOpen] = useState(false);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');
  const [categoryDropdownVisible, setCategoryDropdownVisible] = useState(false);

  const dateToIsoString = (d: Date): string => {
    const now = new Date();
    const isToday =
      d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth() && d.getDate() === now.getDate();
    if (isToday) return now.toISOString();
    const noon = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 12, 0, 0);
    return noon.toISOString();
  };

  const isEditMode = expense !== null;

  // Reset form when modal opens or expense changes
  useEffect(() => {
    if (visible) {
      if (expense) {
        setDescription(expense.description);
        setAmount(expense.amount.toString());
        setCategory(expense.category);
        setRecipient(expense.recipient);
        setCurrency(expense.currency);
        setDate(new Date(expense.date));
        setIsRefund(expense.isRefund || false);
      } else {
        setDescription('');
        setAmount('');
        setCategory('');
        setRecipient('');
        setCurrency('EUR');
        setDate(new Date());
        setIsRefund(false);
      }
      setErrors({});
      setApiError('');
      setLoading(false);
    }
  }, [visible, expense]);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!description.trim()) newErrors.description = 'Description is required';
    if (!amount.trim()) {
      newErrors.amount = 'Amount is required';
    } else if (isNaN(Number(amount)) || Number(amount) <= 0) {
      newErrors.amount = 'Must be a positive number';
    }
    if (!category.trim()) newErrors.category = 'Category is required';
    if (!recipient.trim()) newErrors.recipient = 'Recipient is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    setLoading(true);
    setApiError('');
    try {
      if (isEditMode && expense) {
        await onUpdate(expense.id, {
          amount: Number(amount),
          description: description.trim(),
          category: category.trim(),
          recipient: recipient.trim(),
          currency,
          userId: DEFAULT_USER_ID,
          date: dateToIsoString(date),
          isRefund: isRefund
        });
      } else {
        await onSave({
          amount: Number(amount),
          description: description.trim(),
          category: category.trim(),
          recipient: recipient.trim(),
          currency,
          userId: DEFAULT_USER_ID,
          date: dateToIsoString(date),
          isRefund: isRefund
        });
      }
    } catch {
      setApiError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderField = (
    label: string,
    value: string,
    onChangeText: (text: string) => void,
    fieldKey: string,
    options?: { keyboardType?: 'default' | 'decimal-pad'; placeholder?: string }
  ) => (
    <View style={styles.fieldContainer}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={[styles.input, errors[fieldKey] && styles.inputError]}
        value={value}
        onChangeText={text => {
          onChangeText(text);
          if (errors[fieldKey]) {
            setErrors(prev => {
              const next = { ...prev };
              delete next[fieldKey];
              return next;
            });
          }
        }}
        placeholderTextColor="#707070"
        placeholder={options?.placeholder}
        keyboardType={options?.keyboardType || 'default'}
        autoCorrect={false}
      />
      {errors[fieldKey] && <Text style={styles.errorText}>{errors[fieldKey]}</Text>}
    </View>
  );

  const getExpenseTypeLabel = () => {
    return `${isRefund ? 'Refund' : 'Expense'}`;
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable style={[styles.dialog, isWide ? styles.dialogWide : styles.dialogNarrow]} onPress={() => {}}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>
              {isEditMode ? `Edit ${getExpenseTypeLabel()}` : `Add ${getExpenseTypeLabel()}`}
            </Text>
            <Pressable onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={22} color="#9E9E9E" />
            </Pressable>
          </View>

          {/* Form */}
          <View style={styles.form}>
            <View style={styles.fieldContainer}>
              <View style={styles.typeToggle}>
                <Pressable
                  style={[styles.typeOption, !isRefund && styles.typeSelectedExpense]}
                  onPress={() => setIsRefund(false)}
                >
                  <Text style={[styles.typeOptionText, !isRefund && styles.typeSelectedText]}>Expense</Text>
                </Pressable>
                <Pressable
                  style={[styles.typeOption, isRefund && styles.typeSelectedRefund]}
                  onPress={() => setIsRefund(true)}
                >
                  <Text style={[styles.typeOptionText, isRefund && styles.typeSelectedText]}>Refund</Text>
                </Pressable>
              </View>
            </View>

            {renderField('Description', description, setDescription, 'description', {
              placeholder: 'e.g. Schrauben, Werkzeug, etc...'
            })}
            {renderField('Amount', amount, setAmount, 'amount', {
              keyboardType: 'decimal-pad',
              placeholder: 'e.g. 25.50'
            })}

            {/* Category with dropdown */}
            <View style={styles.fieldContainer}>
              <Text style={styles.label}>Category</Text>
              <Pressable
                style={[styles.input, styles.categoryPicker, errors.category && styles.inputError]}
                onPress={() => setCategoryDropdownVisible(true)}
              >
                <Text style={[styles.categoryText, !category && styles.placeholderText]}>
                  {category || 'Select a category'}
                </Text>
                <Ionicons name="chevron-down" size={16} color="#9E9E9E" />
              </Pressable>
              {errors.category && <Text style={styles.errorText}>{errors.category}</Text>}
            </View>

            {renderField('Recipient', recipient, setRecipient, 'recipient', {
              placeholder: 'e.g. Hornbach, Obi, etc..'
            })}

            {/* Date picker */}
            <View style={styles.fieldContainer}>
              <Text style={styles.label}>Date</Text>
              <Pressable style={[styles.input, styles.categoryPicker]} onPress={() => setDatePickerOpen(true)}>
                <Text style={styles.categoryText}>
                  {date.toLocaleDateString('de-DE', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric'
                  })}
                </Text>
                <Ionicons name="calendar-outline" size={16} color="#9E9E9E" />
              </Pressable>
            </View>

            {/* Currency toggle */}
            <View style={styles.fieldContainer}>
              <Text style={styles.label}>Currency</Text>
              <View style={styles.currencyToggle}>
                {CURRENCIES.map(cur => (
                  <Pressable
                    key={cur}
                    style={[styles.currencyOption, currency === cur && styles.currencySelected]}
                    onPress={() => setCurrency(cur)}
                  >
                    <Text style={[styles.currencyOptionText, currency === cur && styles.currencySelectedText]}>
                      {cur}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>

            {/* API error */}
            {apiError ? <Text style={styles.apiError}>{apiError}</Text> : null}

            {/* Submit button */}
            <Pressable
              style={[
                styles.submitButton,
                loading && styles.submitButtonDisabled,
                isRefund ? styles.typeSelectedRefund : styles.typeSelectedExpense
              ]}
              onPress={handleSubmit}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <>
                  <Ionicons
                    name={`${isRefund ? 'add-circle-outline' : 'remove-circle-outline'}`}
                    size={18}
                    color="#FFFFFF"
                  />
                  <Text style={styles.submitButtonText}>
                    {isEditMode ? `Update ${getExpenseTypeLabel()}` : `Add ${getExpenseTypeLabel()}`}
                  </Text>
                </>
              )}
            </Pressable>
          </View>
        </Pressable>
      </Pressable>

      {/* Category dropdown modal */}
      <Modal
        visible={categoryDropdownVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setCategoryDropdownVisible(false)}
      >
        <Pressable style={styles.overlay} onPress={() => setCategoryDropdownVisible(false)}>
          <Pressable style={styles.categoryModal} onPress={() => {}}>
            <Text style={styles.categoryModalTitle}>Select Category</Text>

            {/* Free text input for new category */}
            <View style={styles.categoryInputContainer}>
              <TextInput
                style={styles.categoryInput}
                value={category}
                onChangeText={text => {
                  setCategory(text);
                  if (errors.category) {
                    setErrors(prev => {
                      const next = { ...prev };
                      delete next.category;
                      return next;
                    });
                  }
                }}
                placeholder="Type a new category..."
                placeholderTextColor="#707070"
                autoCorrect={false}
              />
            </View>

            <FlatList
              data={categories}
              keyExtractor={item => item}
              renderItem={({ item }) => (
                <Pressable
                  style={[styles.categoryItem, item === category && styles.categoryItemSelected]}
                  onPress={() => {
                    setCategory(item);
                    setCategoryDropdownVisible(false);
                    if (errors.category) {
                      setErrors(prev => {
                        const next = { ...prev };
                        delete next.category;
                        return next;
                      });
                    }
                  }}
                >
                  <Text style={[styles.categoryItemText, item === category && styles.categoryItemTextSelected]}>
                    {item}
                  </Text>
                  {item === category && <Ionicons name="checkmark" size={18} color="#BB86FC" />}
                </Pressable>
              )}
            />
          </Pressable>
        </Pressable>
      </Modal>

      {/* Date picker modal */}
      <DatePickerModal
        locale="de"
        mode="single"
        visible={datePickerOpen}
        onDismiss={() => setDatePickerOpen(false)}
        date={date}
        onConfirm={() => {}}
        onChange={({ date: pickedDate }) => {
          setDatePickerOpen(false);
          if (pickedDate) setDate(pickedDate);
        }}
        startWeekOnMonday={true}
        saveLabel=" "
        label="Select expense date"
        endYear={2030}
        startYear={2020}
      />
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  dialog: {
    backgroundColor: '#1E1E1E',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#333',
    maxHeight: '100%'
  },
  dialogWide: {
    width: 500
  },
  dialogNarrow: {
    width: '90%'
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#2A2A2A'
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#E0E0E0'
  },
  closeButton: {
    padding: 4
  },
  form: {
    padding: 20,
    gap: 16
  },
  fieldContainer: {
    gap: 4
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#9E9E9E',
    marginBottom: 2
  },
  input: {
    backgroundColor: '#1E1E1E',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#333',
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: '#E0E0E0',
    height: 44
  },
  inputError: {
    borderColor: '#CF6679'
  },
  errorText: {
    fontSize: 12,
    color: '#CF6679',
    marginTop: 2
  },
  categoryPicker: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  categoryText: {
    fontSize: 14,
    color: '#E0E0E0',
    flex: 1
  },
  placeholderText: {
    color: '#707070'
  },
  typeToggle: {
    flexDirection: 'row',
    gap: 8
  },
  typeOption: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#333',
    backgroundColor: '#2A2A2A',
    alignItems: 'center'
  },
  typeSelectedExpense: {
    backgroundColor: '#E57373',
    borderColor: '#E57373'
  },
  typeSelectedRefund: {
    backgroundColor: '#66BB6A',
    borderColor: '#66BB6A'
  },
  typeOptionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#9E9E9E'
  },
  typeSelectedText: {
    color: '#FFFFFF'
  },
  currencyToggle: {
    flexDirection: 'row',
    gap: 8
  },
  currencyOption: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#333',
    backgroundColor: '#2A2A2A',
    alignItems: 'center'
  },
  currencySelected: {
    backgroundColor: '#BB86FC',
    borderColor: '#BB86FC'
  },
  currencyOptionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#9E9E9E'
  },
  currencySelectedText: {
    color: '#FFFFFF'
  },
  apiError: {
    fontSize: 13,
    color: '#CF6679',
    textAlign: 'center',
    padding: 8,
    backgroundColor: 'rgba(207,102,121,0.1)',
    borderRadius: 8
  },
  submitButton: {
    flexDirection: 'row',
    backgroundColor: '#BB86FC',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 4
  },
  submitButtonDisabled: {
    opacity: 0.6
  },
  submitButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF'
  },
  categoryModal: {
    backgroundColor: '#1E1E1E',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#333',
    width: '80%',
    maxHeight: '60%',
    paddingVertical: 16
  },
  categoryModalTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#E0E0E0',
    paddingHorizontal: 20,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#2A2A2A'
  },
  categoryInputContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#2A2A2A'
  },
  categoryInput: {
    backgroundColor: '#2A2A2A',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#333',
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
    color: '#E0E0E0'
  },
  categoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#2A2A2A'
  },
  categoryItemSelected: {
    backgroundColor: '#2A2A2A'
  },
  categoryItemText: {
    fontSize: 15,
    color: '#E0E0E0'
  },
  categoryItemTextSelected: {
    color: '#BB86FC',
    fontWeight: '600'
  }
});
