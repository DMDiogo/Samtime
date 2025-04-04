// src/pages/employees/AddEmployee.tsx
import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  ScrollView, 
  Alert,
  ActivityIndicator
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../global/colors';
import { Employee } from '../../types';
import { saveEmployee } from '../../utils/storageHelper';
import { enrollEmployeeBiometric } from '../../utils/biometricHelper';
import { useNavigation } from '@react-navigation/native';
import { v4 as uuidv4 } from 'uuid';

const AddEmployeeScreen: React.FC = () => {
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isBiometricEnrolled, setIsBiometricEnrolled] = useState<boolean>(false);
  const [employee, setEmployee] = useState<Partial<Employee>>({
    name: '',
    position: '',
    department: '',
    employeeId: '',
    active: true,
  });

  const handleInputChange = (field: keyof Employee, value: string) => {
    setEmployee({
      ...employee,
      [field]: value,
    });
  };

  const handleEnrollBiometric = async () => {
    if (!employee.name || !employee.employeeId) {
      Alert.alert('Validation Error', 'Please fill in at least the name and employee ID before enrolling biometrics.');
      return;
    }

    try {
      setIsLoading(true);
      
      // Create a temporary ID for this employee
      const tempId = uuidv4();
      
      // Attempt to enroll biometric
      const enrolled = await enrollEmployeeBiometric(tempId);
      
      if (enrolled) {
        setIsBiometricEnrolled(true);
        setEmployee({
          ...employee,
          biometricId: tempId,
        });
        Alert.alert('Success', 'Biometric enrolled successfully.');
      } else {
        Alert.alert('Enrollment Failed', 'Failed to enroll biometric. Please try again.');
      }
    } catch (error) {
      console.error('Error enrolling biometric:', error);
      Alert.alert('Error', 'An error occurred during biometric enrollment.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveEmployee = async () => {
    // Validate required fields
    if (!employee.name || !employee.position || !employee.employeeId) {
      Alert.alert('Validation Error', 'Please fill in all required fields.');
      return;
    }

    try {
      setIsLoading(true);
      
      // Create complete employee object
      const completeEmployee: Employee = {
        id: uuidv4(),
        name: employee.name || '',
        position: employee.position || '',
        department: employee.department || '',
        employeeId: employee.employeeId || '',
        biometricId: employee.biometricId,
        active: true,
        createdAt: new Date().toISOString(),
      };
      
      // Save employee
      await saveEmployee(completeEmployee);
      
      Alert.alert('Success', 'Employee added successfully.', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    } catch (error) {
      console.error('Error saving employee:', error);
      Alert.alert('Error', 'Failed to save employee. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Name *</Text>
            <TextInput
              style={styles.input}
              value={employee.name}
              onChangeText={(value) => handleInputChange('name', value)}
              placeholder="Enter employee name"
              placeholderTextColor={colors.mediumGray}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Position *</Text>
            <TextInput
              style={styles.input}
              value={employee.position}
              onChangeText={(value) => handleInputChange('position', value)}
              placeholder="Enter position"
              placeholderTextColor={colors.mediumGray}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Department</Text>
            <TextInput
              style={styles.input}
              value={employee.department}
              onChangeText={(value) => handleInputChange('department', value)}
              placeholder="Enter department"
              placeholderTextColor={colors.mediumGray}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Employee ID *</Text>
            <TextInput
              style={styles.input}
              value={employee.employeeId}
              onChangeText={(value) => handleInputChange('employeeId', value)}
              placeholder="Enter employee ID"
              placeholderTextColor={colors.mediumGray}
            />
          </View>

          <View style={styles.biometricSection}>
            <Text style={styles.biometricTitle}>Biometric Enrollment</Text>
            <Text style={styles.biometricDescription}>
              Register employee fingerprint for authentication
            </Text>

            <TouchableOpacity
              style={[
                styles.biometricButton,
                isBiometricEnrolled && styles.biometricEnrolledButton
              ]}
              onPress={handleEnrollBiometric}
              disabled={isLoading || isBiometricEnrolled}
            >
              {isLoading ? (
                <ActivityIndicator color={colors.white} />
              ) : (
                <>
                  <Ionicons
                    name={isBiometricEnrolled ? "checkmark-circle" : "finger-print-outline"}
                    size={24}
                    color={colors.white}
                  />
                  <Text style={styles.biometricButtonText}>
                    {isBiometricEnrolled ? 'Biometric Enrolled' : 'Enroll Biometric'}
                  </Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.saveButton}
            onPress={handleSaveEmployee}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color={colors.white} />
            ) : (
              <Text style={styles.saveButtonText}>Save Employee</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  scrollContent: {
    padding: 16,
  },
  form: {
    marginBottom: 24,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.darkGray,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.lightGray,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: colors.text,
  },
  biometricSection: {
    marginTop: 24,
    backgroundColor: colors.background,
    borderRadius: 8,
    padding: 16,
  },
  biometricTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
  },
  biometricDescription: {
    fontSize: 14,
    color: colors.darkGray,
    marginBottom: 16,
  },
  biometricButton: {
    backgroundColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 14,
    borderRadius: 8,
  },
  biometricEnrolledButton: {
    backgroundColor: colors.success,
  },
  biometricButtonText: {
    color: colors.white,
    fontWeight: '600',
    fontSize: 16,
    marginLeft: 8,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: colors.lightGray,
    padding: 14,
    borderRadius: 8,
    marginRight: 8,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: colors.darkGray,
    fontWeight: '600',
    fontSize: 16,
  },
  saveButton: {
    flex: 2,
    backgroundColor: colors.primary,
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveButtonText: {
    color: colors.white,
    fontWeight: '600',
    fontSize: 16,
  },
});

export default AddEmployeeScreen;