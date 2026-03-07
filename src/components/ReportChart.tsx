import { StyleSheet, Text, View } from 'react-native';
import { BarChart, PieChart } from 'react-native-gifted-charts';

export type ChartDataItem = {
  value: number;
  label: string;
  color: string;
};

type ReportChartProps = {
  data: ChartDataItem[];
  chartType: 'pie' | 'bar';
  currency: 'EUR' | 'RON';
};

export default function ReportChart({ data, chartType, currency }: ReportChartProps) {
  if (data.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No expenses for this period</Text>
      </View>
    );
  }

  if (chartType === 'pie') {
    const pieData = data.map(item => ({
      value: item.value,
      color: item.color,
      text: item.label
    }));

    return (
      <View style={styles.chartContainer}>
        <PieChart
          data={pieData}
          donut
          radius={110}
          innerRadius={60}
          innerCircleColor="#1E1E1E"
          centerLabelComponent={() => (
            <View style={styles.centerLabel}>
              <Text style={styles.centerLabelAmount}>{data.reduce((sum, d) => sum + d.value, 0).toFixed(0)}</Text>
              <Text style={styles.centerLabelCurrency}>{currency}</Text>
            </View>
          )}
        />
      </View>
    );
  }

  const barData = data.map(item => ({
    value: item.value,
    label: item.label.length > 8 ? item.label.substring(0, 7) + '.' : item.label,
    frontColor: item.color,
    topLabelComponent: () => <Text style={styles.barTopLabel}>{item.value.toFixed(0)}</Text>
  }));

  return (
    <View style={styles.chartContainer}>
      <BarChart
        data={barData}
        barWidth={32}
        spacing={16}
        noOfSections={4}
        yAxisColor="#333"
        xAxisColor="#333"
        yAxisTextStyle={styles.axisText}
        xAxisLabelTextStyle={styles.axisText}
        // hideRules
        barBorderTopLeftRadius={4}
        barBorderTopRightRadius={4}
        height={250}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  chartContainer: {
    alignItems: 'center',
    paddingVertical: 16
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 40
  },
  emptyText: {
    fontSize: 15,
    color: '#707070'
  },
  centerLabel: {
    alignItems: 'center'
  },
  centerLabelAmount: {
    fontSize: 20,
    fontWeight: '700',
    color: '#E0E0E0'
  },
  centerLabelCurrency: {
    fontSize: 12,
    color: '#9E9E9E',
    marginTop: 2
  },
  barTopLabel: {
    fontSize: 10,
    color: '#9E9E9E',
    marginBottom: 4
  },
  axisText: {
    fontSize: 10,
    color: '#9E9E9E'
  }
});
