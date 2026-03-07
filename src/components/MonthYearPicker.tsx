import { Ionicons } from '@expo/vector-icons';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';

type MonthYearPickerProps = {
  visible: boolean;
  selectedMonth: number;
  selectedYear: number;
  onSelect: (month: number, year: number) => void;
  onClose: () => void;
};

const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export default function MonthYearPicker({
  visible,
  selectedMonth,
  selectedYear,
  onSelect,
  onClose
}: MonthYearPickerProps) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable style={styles.dialog} onPress={() => {}}>
          {/* Year navigation */}
          <View style={styles.yearRow}>
            <Pressable onPress={() => onSelect(selectedMonth, selectedYear - 1)} style={styles.arrowButton}>
              <Ionicons name="chevron-back" size={22} color="#E0E0E0" />
            </Pressable>
            <Text style={styles.yearText}>{selectedYear}</Text>
            <Pressable onPress={() => onSelect(selectedMonth, selectedYear + 1)} style={styles.arrowButton}>
              <Ionicons name="chevron-forward" size={22} color="#E0E0E0" />
            </Pressable>
          </View>

          {/* Month grid 3x4 */}
          <View style={styles.monthGrid}>
            {MONTH_NAMES.map((name, index) => {
              const isSelected = index === selectedMonth;
              return (
                <Pressable
                  key={name}
                  style={[styles.monthCell, isSelected && styles.monthCellSelected]}
                  onPress={() => {
                    onSelect(index, selectedYear);
                    onClose();
                  }}
                >
                  <Text style={[styles.monthText, isSelected && styles.monthTextSelected]}>{name}</Text>
                </Pressable>
              );
            })}
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  dialog: {
    backgroundColor: '#1E1E1E',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#333',
    padding: 20,
    width: 300
  },
  yearRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16
  },
  arrowButton: {
    padding: 8
  },
  yearText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#E0E0E0'
  },
  monthGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap'
  },
  monthCell: {
    width: '33.33%',
    paddingVertical: 14,
    alignItems: 'center',
    borderRadius: 10
  },
  monthCellSelected: {
    backgroundColor: '#BB86FC'
  },
  monthText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#9E9E9E'
  },
  monthTextSelected: {
    color: '#FFFFFF'
  }
});
