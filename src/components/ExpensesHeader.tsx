import { CurrencyMetadata } from '@/src/server/expense/ExpensesWithMeta';
import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import ExpenseHeaderCard from './ExpenseHeaderCard';

type ExpensesHeaderProps = {
  expensesMeta: CurrencyMetadata[] | null;
};

export default function ExpensesHeader({ expensesMeta }: ExpensesHeaderProps) {
  const [totalEurCount, setTotalEurCount] = useState(0);
  const [totalEurSum, setTotalEurSum] = useState(0);
  const [totalRonCount, setTotalRonCount] = useState(0);
  const [totalRonSum, setTotalRonSum] = useState(0);
  const [totalEurRefund, setTotalEurRefund] = useState(0);
  const [totalRonRefund, setTotalRonRefund] = useState(0);

  useEffect(() => {
    if (expensesMeta) {
      const eurExpensesMeta = expensesMeta.find(meta => meta.currency === 'EUR');
      const ronExpensesMeta = expensesMeta.find(meta => meta.currency === 'RON');
      setTotalEurCount(eurExpensesMeta?.count || 0);
      setTotalRonCount(ronExpensesMeta?.count || 0);
      setTotalEurSum(eurExpensesMeta?.sum || 0);
      setTotalRonSum(ronExpensesMeta?.sum || 0);
      setTotalEurRefund(eurExpensesMeta?.refundSum || 0);
      setTotalRonRefund(ronExpensesMeta?.refundSum || 0);
    }
  }, [expensesMeta]);

  return (
    <View style={styles.outerContainer}>
      <View style={styles.cardsContainer}>
        <ExpenseHeaderCard text="EUR count" value={totalEurCount} />
        <ExpenseHeaderCard text="EUR sum" value={totalEurSum} suffix="€" refundValue={totalEurRefund} />
        <ExpenseHeaderCard text="RON count" value={totalRonCount} />
        <ExpenseHeaderCard text="RON sum" value={totalRonSum} suffix="RON" refundValue={totalRonRefund} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#121212',
    width: '100%'
  },
  cardsContainer: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between'
  }
});
