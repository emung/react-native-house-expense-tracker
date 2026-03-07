import ChartTypeToggle from '@/src/components/ChartTypeToggle';
import CurrencyToggle from '@/src/components/CurrencyToggle';
import MonthYearPicker from '@/src/components/MonthYearPicker';
import ReportChart, { ChartDataItem } from '@/src/components/ReportChart';
import Expense from '@/src/server/expense/Expense';
import ExpenseService from '@/src/server/expense/ExpenseService';
import { Ionicons } from '@expo/vector-icons';
import { useEffect, useMemo, useState } from 'react';
import { Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

const expenseService = new ExpenseService();

const COLOR_PALETTE = [
  '#BB86FC',
  '#03DAC6',
  '#CF6679',
  '#FFAB40',
  '#69F0AE',
  '#448AFF',
  '#FF6E40',
  '#B388FF',
  '#84FFFF',
  '#FFD740'
];

const MONTH_NAMES_FULL = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December'
];

export default function Reports() {
  const now = new Date();
  const [allExpenses, setAllExpenses] = useState<Expense[]>([]);
  const [selectedMonth, setSelectedMonth] = useState(now.getMonth());
  const [selectedYear, setSelectedYear] = useState(now.getFullYear());
  const [selectedCurrency, setSelectedCurrency] = useState<'EUR' | 'RON'>('EUR');
  const [chartType, setChartType] = useState<'pie' | 'bar'>('pie');
  const [pickerVisible, setPickerVisible] = useState(false);

  useEffect(() => {
    (async () => {
      const result = await expenseService.getAllExpenses();
      setAllExpenses(result.expenses);
    })();
  }, []);

  const chartData: ChartDataItem[] = useMemo(() => {
    const filtered = allExpenses.filter(exp => {
      const d = new Date(exp.date);
      return d.getMonth() === selectedMonth && d.getFullYear() === selectedYear && exp.currency === selectedCurrency;
    });

    const categoryTotals = new Map<string, number>();
    for (const exp of filtered) {
      categoryTotals.set(exp.category, (categoryTotals.get(exp.category) || 0) + exp.amount);
    }

    return Array.from(categoryTotals.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([category, total], index) => ({
        value: total,
        label: category,
        color: COLOR_PALETTE[index % COLOR_PALETTE.length]
      }));
  }, [allExpenses, selectedMonth, selectedYear, selectedCurrency]);

  const totalAmount = chartData.reduce((sum, d) => sum + d.value, 0);

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Reports</Text>

        {/* Month/Year picker button */}
        <Pressable style={styles.monthButton} onPress={() => setPickerVisible(true)}>
          <Ionicons name="calendar-outline" size={18} color="#BB86FC" />
          <Text style={styles.monthButtonText}>
            {MONTH_NAMES_FULL[selectedMonth]} {selectedYear}
          </Text>
          <Ionicons name="chevron-down" size={16} color="#9E9E9E" />
        </Pressable>

        {/* Toggles row */}
        <View style={styles.togglesRow}>
          <CurrencyToggle selected={selectedCurrency} onSelect={setSelectedCurrency} />
          <ChartTypeToggle chartType={chartType} onToggle={setChartType} />
        </View>

        {/* Chart */}
        <ReportChart data={chartData} chartType={chartType} currency={selectedCurrency} />

        {/* Category legend */}
        {chartData.length > 0 && (
          <View style={styles.legend}>
            {chartData.map(item => (
              <View key={item.label} style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: item.color }]} />
                <Text style={styles.legendLabel} numberOfLines={1}>
                  {item.label}
                </Text>
                <Text style={styles.legendAmount}>
                  {item.value.toFixed(2)} {selectedCurrency}
                </Text>
                <Text style={styles.legendPercent}>{((item.value / totalAmount) * 100).toFixed(0)}%</Text>
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      <MonthYearPicker
        visible={pickerVisible}
        selectedMonth={selectedMonth}
        selectedYear={selectedYear}
        onSelect={(month, year) => {
          setSelectedMonth(month);
          setSelectedYear(year);
        }}
        onClose={() => setPickerVisible(false)}
      />
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
  monthButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    alignSelf: 'flex-start',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#333',
    backgroundColor: '#1E1E1E',
    marginBottom: 16
  },
  monthButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#E0E0E0'
  },
  togglesRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8
  },
  legend: {
    gap: 8
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#1E1E1E',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#333'
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6
  },
  legendLabel: {
    flex: 1,
    fontSize: 14,
    color: '#E0E0E0'
  },
  legendAmount: {
    fontSize: 14,
    fontWeight: '600',
    color: '#E0E0E0'
  },
  legendPercent: {
    fontSize: 13,
    color: '#9E9E9E',
    width: 36,
    textAlign: 'right'
  }
});
