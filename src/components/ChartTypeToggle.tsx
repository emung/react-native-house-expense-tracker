import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

type ChartTypeToggleProps = {
  chartType: 'pie' | 'bar';
  onToggle: (type: 'pie' | 'bar') => void;
};

const OPTIONS: { type: 'pie' | 'bar'; icon: keyof typeof Ionicons.glyphMap; label: string }[] = [
  { type: 'pie', icon: 'pie-chart-outline', label: 'Pie' },
  { type: 'bar', icon: 'bar-chart-outline', label: 'Bar' }
];

export default function ChartTypeToggle({ chartType, onToggle }: ChartTypeToggleProps) {
  return (
    <View style={styles.container}>
      {OPTIONS.map(opt => (
        <Pressable
          key={opt.type}
          style={[styles.option, chartType === opt.type && styles.selected]}
          onPress={() => onToggle(opt.type)}
        >
          <Ionicons name={opt.icon} size={16} color={chartType === opt.type ? '#FFFFFF' : '#9E9E9E'} />
          <Text style={[styles.optionText, chartType === opt.type && styles.selectedText]}>{opt.label}</Text>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 8
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#333',
    backgroundColor: '#2A2A2A'
  },
  selected: {
    backgroundColor: '#BB86FC',
    borderColor: '#BB86FC'
  },
  optionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#9E9E9E'
  },
  selectedText: {
    color: '#FFFFFF'
  }
});
