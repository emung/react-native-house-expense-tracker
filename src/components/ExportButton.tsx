import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, useWindowDimensions } from 'react-native';

type ExportButtonProps = {
  onPress: () => void;
};

export default function ExportButton({ onPress }: ExportButtonProps) {
  const { width } = useWindowDimensions();
  const isWide = width >= 768;

  if (isWide) {
    return (
      <Pressable style={styles.toolbarButton} onPress={onPress}>
        <Ionicons name="download-outline" size={18} color="#BB86FC" />
        <Text style={styles.toolbarButtonText}>Export CSV</Text>
      </Pressable>
    );
  }

  // Mobile: small icon-only button positioned above the FAB area
  return (
    <Pressable style={styles.fabCompact} onPress={onPress}>
      <Ionicons name="download-outline" size={22} color="#BB86FC" />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  toolbarButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E1E1E',
    borderWidth: 1,
    borderColor: '#BB86FC',
    paddingHorizontal: 14,
    height: 44,
    borderRadius: 12,
    gap: 6,
  },
  toolbarButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#BB86FC',
  },
  fabCompact: {
    position: 'absolute',
    bottom: 92, // sits above the AddExpenseButton FAB (56px + 24px bottom + 12px gap)
    right: 28,
    zIndex: 100,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#1E1E1E',
    borderWidth: 1,
    borderColor: '#BB86FC',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
});
