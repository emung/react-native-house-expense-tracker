import BreakdownToggle, { BreakdownMode } from '@/src/components/BreakdownToggle';
import CurrencyToggle from '@/src/components/CurrencyToggle';
import ReportTable, { BreakdownRow } from '@/src/components/ReportTable';
import Expense from '@/src/server/expense/Expense';
import ExpenseService from '@/src/server/expense/ExpenseService';
import { useEffect, useMemo, useState } from 'react';
import { Platform, ScrollView, StyleSheet, Text, View } from 'react-native';

const expenseService = new ExpenseService();

type CurrencyGroup = {
  currency: 'EUR' | 'RON';
  rows: BreakdownRow[];
  total: number;
};

export default function Reports() {
  const [allExpenses, setAllExpenses] = useState<Expense[]>([]);
  const [selectedCurrency, setSelectedCurrency] = useState<'All' | 'EUR' | 'RON'>('EUR');
  const [breakdownMode, setBreakdownMode] = useState<BreakdownMode>('category');

  useEffect(() => {
    (async () => {
      const result = await expenseService.getAllExpenses();
      setAllExpenses(result.expenses);
    })();
  }, []);

  const groups = useMemo<CurrencyGroup[]>(() => {
    const currencies: ('EUR' | 'RON')[] = selectedCurrency === 'All' ? ['EUR', 'RON'] : [selectedCurrency];

    return currencies
      .map(currency => {
        const filtered = allExpenses.filter(exp => exp.currency === currency);

        const totals = new Map<string, { total: number; count: number }>();
        for (const exp of filtered) {
          const key = breakdownMode === 'category' ? exp.category : exp.recipient;
          const prev = totals.get(key) || { total: 0, count: 0 };
          if (!exp.isRefund) {
            totals.set(key, { total: prev.total + exp.amount, count: prev.count + 1 });
          }
        }

        const grandTotal = Array.from(totals.values()).reduce((sum, v) => sum + v.total, 0);

        const rows: BreakdownRow[] = Array.from(totals.entries())
          .map(([label, v]) => ({
            label,
            total: v.total,
            count: v.count,
            percent: grandTotal ? (v.total / grandTotal) * 100 : 0
          }))
          .sort((a, b) => b.total - a.total);

        return { currency, rows, total: grandTotal };
      })
      .filter(group => group.rows.length > 0);
  }, [allExpenses, selectedCurrency, breakdownMode]);

  const nameHeader = breakdownMode === 'category' ? 'Category' : 'Recipient';

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Reports</Text>

        <View style={styles.toggles}>
          <CurrencyToggle showAll selected={selectedCurrency} onSelect={setSelectedCurrency} />
          <BreakdownToggle mode={breakdownMode} onToggle={setBreakdownMode} />
        </View>

        {groups.length > 0 ? (
          groups.map(group => (
            <ReportTable
              key={group.currency}
              nameHeader={nameHeader}
              currency={group.currency}
              rows={group.rows}
              sectionLabel={selectedCurrency === 'All' ? group.currency : undefined}
            />
          ))
        ) : (
          <Text style={styles.empty}>No expenses to report</Text>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    paddingTop: Platform.OS === 'ios' ? 40 : 10
  },
  scroll: {
    flex: 1
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 32
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#E0E0E0',
    marginBottom: 16
  },
  toggles: {
    gap: 12,
    marginBottom: 16
  },
  empty: {
    fontSize: 14,
    color: '#9E9E9E',
    textAlign: 'center',
    marginTop: 32
  }
});
