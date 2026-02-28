import { Ionicons } from '@expo/vector-icons';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';

type ConfirmDeleteDialogProps = {
  visible: boolean;
  expenseDescription: string;
  onConfirm: () => void;
  onCancel: () => void;
};

export default function ConfirmDeleteDialog({
  visible,
  expenseDescription,
  onConfirm,
  onCancel
}: ConfirmDeleteDialogProps) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel}>
      <Pressable style={styles.overlay} onPress={onCancel}>
        <Pressable style={styles.dialog} onPress={() => {}}>
          <Ionicons name="warning-outline" size={40} color="#CF6679" style={styles.icon} />
          <Text style={styles.title}>Delete Expense</Text>
          <Text style={styles.message}>Are you sure you want to delete &quot;{expenseDescription}&quot;?</Text>
          <Text style={styles.subMessage}>This action cannot be undone.</Text>

          <View style={styles.buttonRow}>
            <Pressable style={styles.cancelButton} onPress={onCancel}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </Pressable>
            <Pressable style={styles.deleteButton} onPress={onConfirm}>
              <Ionicons name="trash-outline" size={16} color="#FFFFFF" />
              <Text style={styles.deleteButtonText}>Delete</Text>
            </Pressable>
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
    padding: 24,
    maxWidth: 400,
    width: '85%',
    alignItems: 'center'
  },
  icon: {
    marginBottom: 12
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#E0E0E0',
    marginBottom: 8
  },
  message: {
    fontSize: 15,
    color: '#BDBDBD',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 4
  },
  subMessage: {
    fontSize: 13,
    color: '#707070',
    textAlign: 'center',
    marginBottom: 24
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
    width: '100%'
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#333',
    alignItems: 'center'
  },
  cancelButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#E0E0E0'
  },
  deleteButton: {
    flex: 1,
    flexDirection: 'row',
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: '#CF6679',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6
  },
  deleteButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FFFFFF'
  }
});
