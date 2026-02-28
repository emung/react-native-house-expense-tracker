import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View, useWindowDimensions } from 'react-native';

type AddExpenseButtonProps = {
  onPress: () => void;
};

export default function AddExpenseButton({ onPress }: AddExpenseButtonProps) {
  const { width } = useWindowDimensions();
  const isWide = width >= 768;

  if (isWide) {
    return (
      <Pressable style={styles.toolbarButton} onPress={onPress}>
        <Ionicons name="add-circle-outline" size={18} color="#FFFFFF" />
        <Text style={styles.toolbarButtonText}>Add Expense</Text>
      </Pressable>
    );
  }

  return (
    <View style={styles.fabWrapper} pointerEvents="box-none">
      <Pressable style={styles.fab} onPress={onPress}>
        <Ionicons name="add" size={28} color="#FFFFFF" />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  toolbarButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#BB86FC',
    paddingHorizontal: 16,
    height: 44,
    borderRadius: 12,
    gap: 6,
    // Shadow
    shadowColor: '#BB86FC',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4
  },
  toolbarButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF'
  },
  fabWrapper: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    zIndex: 100
  },
  fab: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#BB86FC',
    alignItems: 'center',
    justifyContent: 'center',
    // Shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 8
  }
});
