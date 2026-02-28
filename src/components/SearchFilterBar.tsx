import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { FlatList, Modal, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

type SearchFilterBarProps = {
  categories: string[];
  selectedCategory: string;
  searchText: string;
  onSearchChange: (text: string) => void;
  onCategorySelect: (category: string) => void;
};

const ALL_CATEGORIES = 'All';

export default function SearchFilterBar({
  categories,
  selectedCategory,
  searchText,
  onSearchChange,
  onCategorySelect
}: SearchFilterBarProps) {
  const [dropdownVisible, setDropdownVisible] = useState(false);

  const allCategories = [ALL_CATEGORIES, ...categories];

  return (
    <View style={styles.container}>
      {/* Search Input */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={18} color="#9E9E9E" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search by description…"
          placeholderTextColor="#707070"
          value={searchText}
          onChangeText={onSearchChange}
          autoCorrect={false}
        />
        {searchText.length > 0 && (
          <Pressable onPress={() => onSearchChange('')}>
            <Ionicons name="close-circle" size={18} color="#9E9E9E" />
          </Pressable>
        )}
      </View>

      {/* Category Dropdown */}
      <Pressable style={styles.dropdownButton} onPress={() => setDropdownVisible(true)}>
        <Text style={styles.dropdownText} numberOfLines={1}>
          {selectedCategory}
        </Text>
        <Ionicons name="chevron-down" size={16} color="#9E9E9E" />
      </Pressable>

      {/* Dropdown Modal */}
      <Modal
        visible={dropdownVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setDropdownVisible(false)}
      >
        <Pressable style={styles.modalOverlay} onPress={() => setDropdownVisible(false)}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Category</Text>
            <FlatList
              data={allCategories}
              keyExtractor={item => item}
              renderItem={({ item }) => (
                <Pressable
                  style={[styles.modalItem, item === selectedCategory && styles.modalItemSelected]}
                  onPress={() => {
                    onCategorySelect(item);
                    setDropdownVisible(false);
                  }}
                >
                  <Text style={[styles.modalItemText, item === selectedCategory && styles.modalItemTextSelected]}>
                    {item}
                  </Text>
                  {item === selectedCategory && <Ionicons name="checkmark" size={18} color="#BB86FC" />}
                </Pressable>
              )}
            />
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginVertical: 12,
    gap: 8
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E1E1E',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#333',
    paddingHorizontal: 12,
    height: 44
  },
  searchIcon: {
    marginRight: 8
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#E0E0E0',
    height: '100%'
  },
  dropdownButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E1E1E',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#333',
    paddingHorizontal: 12,
    height: 44,
    minWidth: 120,
    justifyContent: 'space-between',
    gap: 6
  },
  dropdownText: {
    fontSize: 14,
    color: '#E0E0E0',
    flex: 1
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  modalContent: {
    backgroundColor: '#1E1E1E',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#333',
    width: '80%',
    maxHeight: '60%',
    paddingVertical: 16
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#E0E0E0',
    paddingHorizontal: 20,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#2A2A2A'
  },
  modalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#2A2A2A'
  },
  modalItemSelected: {
    backgroundColor: '#2A2A2A'
  },
  modalItemText: {
    fontSize: 15,
    color: '#E0E0E0'
  },
  modalItemTextSelected: {
    color: '#BB86FC',
    fontWeight: '600'
  }
});
