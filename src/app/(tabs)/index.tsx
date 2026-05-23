import AddExpenseButton from '@/src/components/AddExpenseButton';
import ConfirmDeleteDialog from '@/src/components/ConfirmDeleteDialog';
import ExportButton from '@/src/components/ExportButton';
import ExpenseFormModal from '@/src/components/ExpenseFormModal';
import ExpensesList from '@/src/components/ExpensesList';
import SearchFilterBar from '@/src/components/SearchFilterBar';
import ExpensesHeader from '@/src/components/ExpensesHeader';
import CreateExpenseReqBody from '@/src/server/expense/CreateExpenseReqBody';
import Expense from '@/src/server/expense/Expense';
import ExpenseService from '@/src/server/expense/ExpenseService';
import ExpensesWithMeta, { CurrencyMetadata } from '@/src/server/expense/ExpensesWithMeta';
import UpdateExpenseReqBody from '@/src/server/expense/UpdateExpenseReqBody';
import { expensesToCsv } from '@/src/utils/csvExport';
import { shareCsv } from '@/src/utils/fileShare';
import { useEffect, useRef, useState } from 'react';
import { Alert, Platform, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { de, registerTranslation } from 'react-native-paper-dates';

const expenseService = new ExpenseService();
registerTranslation('de', de);

export default function Index() {
  const { width } = useWindowDimensions();
  const isWide = width >= 768;

  const [allExpensesWithMeta, setAllExpensesWithMeta] = useState<ExpensesWithMeta | null>(null);
  const [expensesMeta, setExpensesMeta] = useState<CurrencyMetadata[] | null>(null);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchText, setSearchText] = useState('');
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // CRUD modal state
  const [formModalVisible, setFormModalVisible] = useState(false);
  const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null);

  // Fetch all expenses + categories on mount
  useEffect(() => {
    (async () => {
      const allExpensesResponse = await expenseService.getAllExpenses();
      setAllExpensesWithMeta(allExpensesResponse);
      setExpensesMeta(allExpensesResponse.sums);

      const distinctCategories = await expenseService.getAllDistinctExpenseCategories();
      setCategories(distinctCategories);
    })();
  }, []);

  // Debounced search
  useEffect(() => {
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    if (searchText === '') {
      return;
    }

    debounceTimer.current = setTimeout(async () => {
      const result = await expenseService.getAllExpensesByDescription(searchText);
      setAllExpensesWithMeta(result);
      setExpensesMeta(result.sums);
    }, 300);

    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, [searchText]);

  // --- Refresh helper (respects current search/filter) ---
  const refreshExpenses = async () => {
    if (searchText) {
      const result = await expenseService.getAllExpensesByDescription(searchText);
      setAllExpensesWithMeta(result);
      setExpensesMeta(result.sums);
    } else if (selectedCategory !== 'All') {
      const result = await expenseService.getAllExpensesByCategory(selectedCategory);
      setAllExpensesWithMeta(result);
      setExpensesMeta(result.sums);
    } else {
      const result = await expenseService.getAllExpenses();
      setAllExpensesWithMeta(result);
      setExpensesMeta(result.sums);
    }
    const distinctCategories = await expenseService.getAllDistinctExpenseCategories();
    setCategories(distinctCategories);
  };

  // --- Search / Filter handlers ---
  const handleSearchChange = (text: string) => {
    setSearchText(text);
    setSelectedCategory('All');

    if (text === '') {
      (async () => {
        const result = await expenseService.getAllExpenses();
        setAllExpensesWithMeta(result);
        setExpensesMeta(result.sums);
      })();
    }
  };

  const handleCategorySelect = async (category: string) => {
    setSelectedCategory(category);
    setSearchText('');

    if (category === 'All') {
      const result = await expenseService.getAllExpenses();
      setAllExpensesWithMeta(result);
      setExpensesMeta(result.sums);
    } else {
      const result = await expenseService.getAllExpensesByCategory(category);
      setAllExpensesWithMeta(result);
      setExpensesMeta(result.sums);
    }
  };

  // --- CRUD handlers ---
  const handleAddPress = () => {
    setSelectedExpense(null);
    setFormModalVisible(true);
  };

  const handleEditPress = (expense: Expense) => {
    setSelectedExpense(expense);
    setFormModalVisible(true);
  };

  const handleDeletePress = (expense: Expense) => {
    setSelectedExpense(expense);
    setDeleteDialogVisible(true);
  };

  const handleSave = async (data: CreateExpenseReqBody) => {
    await expenseService.createExpense(data);
    setFormModalVisible(false);
    await refreshExpenses();
  };

  const handleUpdate = async (id: number, data: UpdateExpenseReqBody) => {
    await expenseService.updateExpense(id, data);
    setFormModalVisible(false);
    setSelectedExpense(null);
    await refreshExpenses();
  };

  const handleDeleteConfirm = async () => {
    if (selectedExpense) {
      await expenseService.deleteExpense(selectedExpense.id);
      setDeleteDialogVisible(false);
      setSelectedExpense(null);
      await refreshExpenses();
    }
  };

  const handleExport = async () => {
    const expenses = allExpensesWithMeta?.expenses ?? [];
    if (expenses.length === 0) {
      Alert.alert('Nothing to export', 'There are no expenses to export.');
      return;
    }

    try {
      const now = new Date();
      const pad = (n: number) => String(n).padStart(2, '0');
      const filename = `expenses-${pad(now.getDate())}-${pad(now.getMonth() + 1)}-${now.getFullYear()}-${pad(now.getHours())}-${pad(now.getMinutes())}.csv`;

      const csv = expensesToCsv(expenses);
      await shareCsv(csv, filename);
    } catch (error) {
      Alert.alert('Export failed', error instanceof Error ? error.message : 'An unexpected error occurred.');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.titleRow}>
        <Text style={styles.title}>House expenses</Text>
        {isWide && (
          <View style={styles.titleRowActions}>
            <ExportButton onPress={handleExport} />
            <AddExpenseButton onPress={handleAddPress} />
          </View>
        )}
      </View>
      <ExpensesHeader expensesMeta={expensesMeta} />
      <SearchFilterBar
        categories={categories}
        selectedCategory={selectedCategory}
        searchText={searchText}
        onSearchChange={handleSearchChange}
        onCategorySelect={handleCategorySelect}
      />
      <ExpensesList
        expenses={allExpensesWithMeta?.expenses || []}
        onEdit={handleEditPress}
        onDelete={handleDeletePress}
      />

      {/* FABs for mobile */}
      {!isWide && <ExportButton onPress={handleExport} />}
      {!isWide && <AddExpenseButton onPress={handleAddPress} />}

      {/* Modals */}
      <ExpenseFormModal
        visible={formModalVisible}
        expense={selectedExpense}
        categories={categories}
        onSave={handleSave}
        onUpdate={handleUpdate}
        onClose={() => {
          setFormModalVisible(false);
          setSelectedExpense(null);
        }}
      />

      <ConfirmDeleteDialog
        visible={deleteDialogVisible}
        expenseDescription={selectedExpense?.description || ''}
        onConfirm={handleDeleteConfirm}
        onCancel={() => {
          setDeleteDialogVisible(false);
          setSelectedExpense(null);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    paddingTop: Platform.OS === 'ios' ? 40 : 10,
    paddingLeft: 10,
    paddingRight: 10,
    backgroundColor: '#121212' // Dark background
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 2
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#E0E0E0' // Light text color
  },
  titleRowActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  }
});
