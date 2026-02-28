import ExpensesList from '@/src/components/ExpensesList';
import SearchFilterBar from '@/src/components/SearchFilterBar';
import { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import ExpensesHeader from '../components/ExpensesHeader';
import ExpenseService from '../server/expense/ExpenseService';
import ExpensesWithMeta, { CurrencyMetadata } from '../server/expense/ExpensesWithMeta';

const expenseService = new ExpenseService();

export default function Index() {
  const [allExpensesWithMeta, setAllExpensesWithMeta] = useState<ExpensesWithMeta | null>(null);
  const [expensesMeta, setExpensesMeta] = useState<CurrencyMetadata[] | null>(null);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchText, setSearchText] = useState('');
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

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

  return (
    <View style={styles.container}>
      <Text style={styles.title}>House expenses</Text>
      <ExpensesHeader expensesMeta={expensesMeta} />
      <SearchFilterBar
        categories={categories}
        selectedCategory={selectedCategory}
        searchText={searchText}
        onSearchChange={handleSearchChange}
        onCategorySelect={handleCategorySelect}
      />
      <ExpensesList expenses={allExpensesWithMeta?.expenses || []} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    paddingTop: 10,
    paddingLeft: 20,
    paddingRight: 20,
    backgroundColor: '#121212' // Dark background
  },
  button: {
    padding: 10,
    backgroundColor: '#BB86FC', // Light purple accent for dark mode
    borderRadius: 5,
    borderColor: '#3700B3',
    borderWidth: 1,
    margin: 10
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#E0E0E0', // Light text color
    marginBottom: 2
  }
});
