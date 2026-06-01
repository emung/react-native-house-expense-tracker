import { StyleSheet, Text, View } from 'react-native';

export type BreakdownRow = {
  label: string;
  total: number;
  count: number;
  percent: number;
};

type ReportTableProps = {
  nameHeader: string;
  currency: 'EUR' | 'RON';
  rows: BreakdownRow[];
  sectionLabel?: string;
};

export default function ReportTable({ nameHeader, currency, rows, sectionLabel }: ReportTableProps) {
  return (
    <View style={styles.container}>
      {sectionLabel && <Text style={styles.sectionLabel}>{sectionLabel}</Text>}

      <View style={styles.card}>
        {/* Header row */}
        <View style={[styles.row, styles.headerRow]}>
          <Text style={[styles.headerCell, styles.nameCell]} numberOfLines={1}>
            {nameHeader}
          </Text>
          <Text style={[styles.headerCell, styles.totalCell]}>Total</Text>
          <Text style={[styles.headerCell, styles.countCell]}>Count</Text>
          <Text style={[styles.headerCell, styles.percentCell]}>%</Text>
        </View>

        {/* Data rows */}
        {rows.map((row, index) => (
          <View key={row.label} style={[styles.row, index === rows.length - 1 && styles.lastRow]}>
            <Text style={[styles.cell, styles.nameCell]} numberOfLines={1}>
              {row.label}
            </Text>
            <Text style={[styles.cell, styles.totalCell, styles.amount]}>
              {row.total.toFixed(2)} {currency}
            </Text>
            <Text style={[styles.cell, styles.countCell]}>{row.count}</Text>
            <Text style={[styles.cell, styles.percentCell, styles.percent]}>{row.percent.toFixed(0)}%</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16
  },
  sectionLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: '#BB86FC',
    marginBottom: 8
  },
  card: {
    backgroundColor: '#1E1E1E',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#333',
    overflow: 'hidden'
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#2A2A2A'
  },
  headerRow: {
    backgroundColor: '#2A2A2A'
  },
  lastRow: {
    borderBottomWidth: 0
  },
  headerCell: {
    fontSize: 12,
    fontWeight: '700',
    color: '#9E9E9E',
    textTransform: 'uppercase'
  },
  cell: {
    fontSize: 14,
    color: '#E0E0E0'
  },
  nameCell: {
    flex: 1,
    paddingRight: 8
  },
  totalCell: {
    width: 110,
    textAlign: 'right'
  },
  countCell: {
    width: 48,
    textAlign: 'right'
  },
  percentCell: {
    width: 44,
    textAlign: 'right'
  },
  amount: {
    fontWeight: '600'
  },
  percent: {
    color: '#9E9E9E'
  }
});
