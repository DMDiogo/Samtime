import React, { useState } from 'react';
import { View, StyleSheet, FlatList, Text, TouchableOpacity, Dimensions, Platform, SafeAreaView, ActivityIndicator, Alert } from 'react-native';
import EmployeeCard from '../components/EmployeeCard';
import { mockEmployees } from '../utils/mockData';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { getTheme } from '../theme/theme';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { EmployeesStackParamList } from '../navigation/EmployeesNavigator';

// Obter dimensões da tela
const { width, height } = Dimensions.get('window');
const isSmallDevice = width < 375;
const isMediumDevice = width >= 375 && width < 768;
const isLargeDevice = width >= 768;

// Função para calcular tamanhos responsivos
const scaleFontSize = (size: number) => {
  if (isSmallDevice) return size * 0.85;
  if (isMediumDevice) return size;
  return size * 1.15; // para dispositivos grandes
};

// Calcular margens e paddings responsivos
const scaleSize = (size: number) => {
  const scale = width / 375; // 375 é uma largura base para iPhone 8
  const newSize = size * scale;
  return Math.round(newSize);
};

// Update the Employee interface to match what EmployeeCard expects
interface Employee {
  id: string;
  name: string;
  position: string;
  digitalSignature: boolean;
  department: string;
}

type EmployeesScreenNavigationProp = StackNavigationProp<EmployeesStackParamList, 'Employees'>;

const EmployeesScreen: React.FC = () => {
  const { theme } = useTheme();
  const currentTheme = getTheme(theme);
  const navigation = useNavigation<EmployeesScreenNavigationProp>();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEmployees = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('http://192.168.1.57/api_employees.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action: 'getEmployees' }),
      });
      
      // Check if response is OK
      if (!response.ok) {
        console.error('API response error:', response.status, response.statusText);
        throw new Error(`Server responded with ${response.status}: ${response.statusText}`);
      }
      
      // Get response text first to debug
      const responseText = await response.text();
      console.log('API response:', responseText);
      
      // Try to parse the response
      let data;
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        console.error('JSON parse error:', parseError);
        throw new Error('Invalid JSON response from server');
      }
      
      if (data.status === 'success') {
        setEmployees(data.employees || []);
      } else {
        setError('Erro ao carregar funcionários: ' + (data.message || 'Erro desconhecido'));
        // Fallback to mock data if API fails
        setEmployees(mockEmployees.map(employee => ({
          ...employee,
          department: employee.position.includes('Developer') ? 'Engineering' : 
                      employee.position.includes('Manager') ? 'Management' : 
                      employee.position.includes('Designer') ? 'Design' : 'Other'
        })));
      }
    } catch (error) {
      console.error('Error fetching employees:', error);
      setError('Não foi possível conectar ao servidor');
      // Fallback to mock data
      setEmployees(mockEmployees.map(employee => ({
        ...employee,
        department: employee.position.includes('Developer') ? 'Engineering' : 
                    employee.position.includes('Manager') ? 'Management' : 
                    employee.position.includes('Designer') ? 'Design' : 'Other'
      })));
    } finally {
      setIsLoading(false);
    }
  };

  // Refresh employee list when screen is focused
  useFocusEffect(
    React.useCallback(() => {
      fetchEmployees();
    }, [])
  );

  const handleAddEmployee = () => {
    navigation.navigate('AddEmployee');
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: currentTheme.colors.background }]}>
      {/* Cabeçalho */}
      <View style={[styles.header, { borderBottomColor: currentTheme.colors.divider }]}>
        <Text style={[styles.headerTitle, { color: currentTheme.colors.primary }]}>Funcionários</Text>
        <TouchableOpacity 
          style={[styles.addButton, { backgroundColor: currentTheme.colors.primary }]}
          onPress={handleAddEmployee}
        >
          <Ionicons name="add" size={scaleSize(20)} color={currentTheme.colors.buttonText} />
          <Text style={[styles.addButtonText, { color: currentTheme.colors.buttonText }]}>
            {width < 360 ? "Adicionar" : "Adicionar Funcionário"}
          </Text>
        </TouchableOpacity>
      </View>
      
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={currentTheme.colors.primary} />
          <Text style={[styles.loadingText, { color: currentTheme.colors.textSecondary }]}>
            Carregando funcionários...
          </Text>
        </View>
      ) : error ? (
        <View style={styles.errorContainer}>
          <Text style={[styles.errorText, { color: currentTheme.colors.error }]}>{error}</Text>
          <TouchableOpacity 
            style={[styles.retryButton, { borderColor: currentTheme.colors.primary }]}
            onPress={fetchEmployees}
          >
            <Ionicons name="refresh" size={scaleSize(16)} color={currentTheme.colors.primary} />
            <Text style={[styles.retryText, { color: currentTheme.colors.primary }]}>Tentar novamente</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={employees}
          renderItem={({ item }) => <EmployeeCard employee={item} />}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons 
                name="people-outline" 
                size={scaleSize(50)} 
                color={currentTheme.colors.textSecondary} 
              />
              <Text style={[styles.emptyText, { color: currentTheme.colors.textSecondary }]}>
                Nenhum funcionário encontrado
              </Text>
              <Text style={[styles.emptySubText, { color: currentTheme.colors.textSecondary }]}>
                Adicione seu primeiro funcionário clicando no botão acima
              </Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === 'ios' ? scaleSize(40) : scaleSize(20),
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: scaleSize(20),
    paddingVertical: scaleSize(15),
    borderBottomWidth: 1,
    marginBottom: scaleSize(20),
    height: scaleSize(70),
  },
  headerTitle: {
    fontSize: scaleFontSize(24),
    fontWeight: 'bold',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 20,
    paddingVertical: scaleSize(8),
    paddingHorizontal: scaleSize(12),
  },
  addButtonText: {
    marginLeft: 5,
    fontSize: scaleFontSize(14),
    fontWeight: '500',
  },
  listContent: {
    paddingHorizontal: scaleSize(15),
    paddingBottom: scaleSize(20),
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: scaleSize(10),
    fontSize: scaleFontSize(16),
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: scaleSize(20),
  },
  errorText: {
    fontSize: scaleFontSize(16),
    marginBottom: scaleSize(20),
    textAlign: 'center',
  },
  retryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 20,
    paddingVertical: scaleSize(8),
    paddingHorizontal: scaleSize(15),
  },
  retryText: {
    marginLeft: scaleSize(8),
    fontSize: scaleFontSize(14),
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: scaleSize(20),
    marginTop: scaleSize(50),
  },
  emptyText: {
    fontSize: scaleFontSize(18),
    fontWeight: '600',
    marginTop: scaleSize(15),
    marginBottom: scaleSize(8),
  },
  emptySubText: {
    fontSize: scaleFontSize(14),
    textAlign: 'center',
  },
});

export default EmployeesScreen;