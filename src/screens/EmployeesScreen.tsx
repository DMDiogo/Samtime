import React from 'react';
import { View, StyleSheet, FlatList, Text, TouchableOpacity } from 'react-native';
import EmployeeCard from '../components/EmployeeCard';
import { mockEmployees } from '../utils/mockData';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { getTheme } from '../theme/theme';

// Update the Employee interface to match what EmployeeCard expects
interface Employee {
  id: string;
  name: string;
  position: string;
  digitalSignature: boolean;
  department: string; // Added this as it's required by EmployeeCard
}

// Assuming you need to update your mock data to include department
const updatedMockEmployees: Employee[] = mockEmployees.map(employee => ({
  ...employee,
  department: employee.position.includes('Developer') ? 'Engineering' : 
              employee.position.includes('Manager') ? 'Management' : 
              employee.position.includes('Designer') ? 'Design' : 'Other'
}));

const EmployeesScreen: React.FC = () => {
  const { theme } = useTheme();
  const currentTheme = getTheme(theme);

  return (
    <View style={[styles.container, { backgroundColor: currentTheme.colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: currentTheme.colors.primary }]}>Funcionários</Text>
        <TouchableOpacity style={[styles.addButton, { backgroundColor: currentTheme.colors.primary }]}>
          <Ionicons name="add" size={20} color="#fff" />
          <Text style={[styles.addButtonText, { color: currentTheme.colors.buttonText }]}>Adicionar Funcionário</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={updatedMockEmployees}
        renderItem={({ item }) => <EmployeeCard employee={item} />}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    paddingTop: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop:20,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 4,
    marginTop:20,
  },
  addButtonText: {
    marginLeft: 4,
    fontWeight: '500',
  },
  listContent: {
    paddingBottom: 20,
  },
});

export default EmployeesScreen;