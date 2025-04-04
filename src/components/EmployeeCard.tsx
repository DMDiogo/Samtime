import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Define the Employee interface
interface Employee {
  id: string;
  name: string;
  position: string;
  digitalSignature: boolean;
}

// Define props interface for the component
interface EmployeeCardProps {
  employee: Employee;
}

const EmployeeCard: React.FC<EmployeeCardProps> = ({ employee }) => {
  return (
    <View style={styles.card}>
      <View style={styles.infoContainer}>
        <Text style={styles.name}>{employee.name}</Text>
        <Text style={styles.position}>{employee.position}</Text>
        <Text style={styles.id}>ID: {employee.id}</Text>
        <View style={styles.statusContainer}>
          <View style={[styles.statusDot, { backgroundColor: employee.digitalSignature ? '#3EB489' : '#ccc' }]} />
          <Text style={styles.statusText}>
            {employee.digitalSignature ? 'Digital registrada' : 'Sem digital registrada'}
          </Text>
        </View>
      </View>
      <View style={styles.actions}>
        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="finger-print-outline" size={22} color="#3EB489" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="create-outline" size={22} color="#3EB489" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="trash-outline" size={22} color="#f44336" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    shadowColor: '#000',
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
    color: '#333',
    marginBottom: 4,
  },
  position: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  id: {
    fontSize: 14,
    color: '#666',
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
    color: '#666',
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