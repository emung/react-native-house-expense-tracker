import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

export type BreakdownMode = 'category' | 'recipient';

type BreakdownToggleProps = {
  mode: BreakdownMode;
  onToggle: (mode: BreakdownMode) => void;
};

const OPTIONS: { mode: BreakdownMode; icon: keyof typeof Ionicons.glyphMap; label: string }[] = [
  { mode: 'category', icon: 'pricetags-outline', label: 'Category' },
  { mode: 'recipient', icon: 'person-outline', label: 'Recipient' }
];

export default function BreakdownToggle({ mode, onToggle }: BreakdownToggleProps) {
  return (
    <View style={styles.container}>
      {OPTIONS.map(opt => (
        <Pressable
          key={opt.mode}
          style={[styles.option, mode === opt.mode && styles.selected]}
          onPress={() => onToggle(opt.mode)}
        >
          <Ionicons name={opt.icon} size={16} color={mode === opt.mode ? '#FFFFFF' : '#9E9E9E'} />
          <Text style={[styles.optionText, mode === opt.mode && styles.selectedText]}>{opt.label}</Text>
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
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
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
