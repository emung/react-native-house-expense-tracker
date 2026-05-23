import { Pressable, StyleSheet, Text, View } from 'react-native';

const CURRENCIES: ('EUR' | 'RON')[] = ['EUR', 'RON'];

// When showAll is false (default), only EUR/RON values are valid.
// When showAll is true, 'All' is also a valid selection.
type CurrencyToggleProps =
  | { showAll?: false; selected: 'EUR' | 'RON'; onSelect: (currency: 'EUR' | 'RON') => void }
  | { showAll: true; selected: 'All' | 'EUR' | 'RON'; onSelect: (currency: 'All' | 'EUR' | 'RON') => void };

export default function CurrencyToggle({ showAll = false, selected, onSelect }: CurrencyToggleProps) {
  const options: ('All' | 'EUR' | 'RON')[] = showAll ? ['All', ...CURRENCIES] : CURRENCIES;

  return (
    <View style={styles.container}>
      {options.map(cur => (
        <Pressable
          key={cur}
          style={[styles.option, selected === cur && styles.selected]}
          onPress={() => (onSelect as (currency: 'All' | 'EUR' | 'RON') => void)(cur)}
        >
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
