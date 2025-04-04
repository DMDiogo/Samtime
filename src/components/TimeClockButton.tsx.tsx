import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';

type ButtonType = 'entry' | 'break' | 'exit';

interface TimeClockButtonProps {
  type: ButtonType;
  onPress: () => void;
  active?: boolean;
}

const TimeClockButton: React.FC<TimeClockButtonProps> = ({ type, onPress, active = false }) => {
  const buttonConfig = {
    entry: { text: 'Entrada', icon: 'log-in' },
    break: { text: 'Pausa', icon: 'pause' },
    exit: { text: 'Saída', icon: 'log-out' },
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.button, active && styles.activeButton]}
      activeOpacity={0.7}
    >
      <Text style={[styles.buttonText, active && styles.activeText]}>
        {buttonConfig[type].text}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#f5f5f5',
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeButton: {
    backgroundColor: '#3EB489',
  },
  buttonText: {
    color: '#666',
    fontWeight: 'bold',
  },
  activeText: {
    color: 'white',
  },
});

export default TimeClockButton;