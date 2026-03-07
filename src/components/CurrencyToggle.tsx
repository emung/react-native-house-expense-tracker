import { Pressable, StyleSheet, Text, View } from 'react-native';

const CURRENCIES: ('EUR' | 'RON')[] = ['EUR', 'RON'];

type CurrencyToggleProps = {
  selected: 'EUR' | 'RON';
  onSelect: (currency: 'EUR' | 'RON') => void;
};

export default function CurrencyToggle({ selected, onSelect }: CurrencyToggleProps) {
  return (
    <View style={styles.container}>
      {CURRENCIES.map(cur => (
        <Pressable key={cur} style={[styles.option, selected === cur && styles.selected]} onPress={() => onSelect(cur)}>
          <Text style={[styles.optionText, selected === cur && styles.selectedText]}>{cur}</Text>
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
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#333',
    backgroundColor: '#2A2A2A',
    alignItems: 'center'
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
