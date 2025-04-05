import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { getTheme } from '../theme/theme';

// Define the Employee interface
interface Employee {
  id: string;
  name: string;
  position: string;
  digitalSignature: boolean;
  department?: string;
}

// Define props interface for the component
interface EmployeeCardProps {
  employee: Employee;
}

const EmployeeCard: React.FC<EmployeeCardProps> = ({ employee }) => {
  const { theme } = useTheme();
  const currentTheme = getTheme(theme);

  return (
    <View style={[styles.card, { 
      backgroundColor: currentTheme.colors.card,
      shadowColor: currentTheme.colors.shadow
    }]}>
      <View style={styles.infoContainer}>
        <Text style={[styles.name, { color: currentTheme.colors.text }]}>{employee.name}</Text>
        <Text style={[styles.position, { color: currentTheme.colors.textSecondary }]}>{employee.position}</Text>
        <Text style={[styles.id, { color: currentTheme.colors.textSecondary }]}>ID: {employee.id}</Text>
        <View style={styles.statusContainer}>
          <View style={[styles.statusDot, { backgroundColor: employee.digitalSignature ? currentTheme.colors.success : '#ccc' }]} />
          <Text style={[styles.statusText, { color: currentTheme.colors.textSecondary }]}>
            {employee.digitalSignature ? 'Digital registrada' : 'Sem digital registrada'}
          </Text>
        </View>
      </View>
      <View style={styles.actions}>
        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="finger-print-outline" size={22} color={currentTheme.colors.primary} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="create-outline" size={22} color={currentTheme.colors.primary} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="trash-outline" size={22} color={currentTheme.colors.error} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  infoContainer: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  position: {
    fontSize: 14,
    marginBottom: 4,
  },
  id: {
    fontSize: 14,
    marginBottom: 8,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 6,
  },
  statusText: {
    fontSize: 14,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    marginLeft: 12,
  },
});

export default EmployeeCard;