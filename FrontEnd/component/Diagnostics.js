import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import ModalDropdown from 'react-native-modal-dropdown';

const Diagnostics = () => {
  const [selectedValue, setSelectedValue] = useState('');

  const dropdownOptions = ['Option 1', 'Option 2', 'Option 3'];

  const handleSelect = (index, value) => {
    setSelectedValue(value);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Select an option:</Text>
      <ModalDropdown
        options={dropdownOptions}
        onSelect={handleSelect}
        dropdownTextStyle={styles.dropdownText}
        dropdownStyle={styles.dropdown}
        initialScrollIndex = {0}
      />
      <Text style={styles.selectedValue}>Selected value: {selectedValue}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  label: {
    fontSize: 18,
    marginBottom: 10,
  },
  dropdown: {
    width: 200,
    borderWidth: 1,
    borderColor: '#888',
    borderRadius: 8,
  },
  dropdownText: {
    fontSize: 16,
    padding: 8,
  },
  selectedValue: {
    marginTop: 20,
    fontSize: 16,
  },
});

export default Diagnostics;
