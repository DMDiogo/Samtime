import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  ScrollView, 
  Platform, 
  Alert, 
  ActivityIndicator,
  SafeAreaView,
  Dimensions
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { EmployeesStackParamList } from '../navigation/EmployeesNavigator';
import { useTheme } from '../context/ThemeContext';
import { getTheme } from '../theme/theme';
import { isBiometricAvailable, saveBiometricSignature } from '../utils/biometrics';

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

type AddEmployeeScreenNavigationProp = StackNavigationProp<EmployeesStackParamList, 'AddEmployee'>;

const AddEmployeeScreen: React.FC = () => {
  const navigation = useNavigation<AddEmployeeScreenNavigationProp>();
  const { theme } = useTheme();
  const currentTheme = getTheme(theme);
  
  const [name, setName] = useState('');
  const [position, setPosition] = useState('');
  const [department, setDepartment] = useState('');
  const [hasDigitalSignature, setHasDigitalSignature] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isBiometricSensorAvailable, setIsBiometricSensorAvailable] = useState<boolean | null>(null);

  // Check biometric availability on component mount
  useEffect(() => {
    const checkBiometricAvailability = async () => {
      try {
        const isAvailable = await isBiometricAvailable();
        setIsBiometricSensorAvailable(isAvailable);
      } catch (error) {
        console.log('Erro ao verificar disponibilidade biométrica', error);
        setIsBiometricSensorAvailable(false);
      }
    };

    checkBiometricAvailability();
  }, []);

  const generateEmployeeId = async () => {
    try {
      // Fetch the next employee ID from the server
      const response = await fetch('http://192.168.1.57/api_employees.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action: 'getNextId' }),
      });

      // Check if response is OK
      if (!response.ok) {
        console.error('API response error:', response.status, response.statusText);
        throw new Error(`Server responded with ${response.status}`);
      }
      
      // Get text response for debugging
      const responseText = await response.text();
      console.log('API getNextId response:', responseText);
      
      // Parse response
      let data;
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        console.error('JSON parse error:', parseError);
        throw new Error('Invalid JSON response from server');
      }

      if (data.status === 'success') {
        return data.nextId;
      } else {
        throw new Error('Failed to generate employee ID: ' + (data.message || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error generating employee ID:', error);
      // Fallback: generate a random ID if server request fails
      const randomId = Math.floor(1000 + Math.random() * 9000);
      return `EMP${randomId}`;
    }
  };

  const handleRegister = async () => {
    if (!name || !position || !department) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos obrigatórios');
      return;
    }

    setIsLoading(true);

    try {
      const employeeId = await generateEmployeeId();
      
      const response = await fetch('http://192.168.1.57/api_employees.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'registerEmployee',
          id: employeeId,
          name,
          position,
          department,
          digitalSignature: hasDigitalSignature
        }),
      });

      // Check if response is OK
      if (!response.ok) {
        console.error('API response error:', response.status, response.statusText);
        throw new Error(`Server responded with ${response.status}`);
      }
      
      // Get text response for debugging
      const responseText = await response.text();
      console.log('API registerEmployee response:', responseText);
      
      // Parse response
      let data;
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        console.error('JSON parse error:', parseError);
        throw new Error('Invalid JSON response from server');
      }
      
      if (data.status === 'success') {
        Alert.alert('Sucesso', 'Funcionário cadastrado com sucesso', [
          { text: 'OK', onPress: () => navigation.navigate('Employees') }
        ]);
      } else {
        Alert.alert('Erro', data.message || 'Erro ao cadastrar funcionário');
      }
    } catch (error) {
      console.error('Error registering employee:', error);
      Alert.alert('Erro', 'Não foi possível conectar ao servidor: ' + (error instanceof Error ? error.message : 'Erro desconhecido'));
    } finally {
      setIsLoading(false);
    }
  };

  const toggleDigitalSignature = async () => {
    // If already registered, just toggle off
    if (hasDigitalSignature) {
      setHasDigitalSignature(false);
      return;
    }

    // Check if biometric hardware is available
    if (!isBiometricSensorAvailable) {
      Alert.alert(
        'Sensor Biométrico Indisponível',
        'O seu dispositivo não suporta autenticação biométrica ou o sensor não está disponível.',
        [{ text: 'OK' }]
      );
      return;
    }

    try {
      // Prompt user to authenticate with biometrics
      const success = await saveBiometricSignature('temp-user-id', 'Registre sua impressão digital');
      
      if (success) {
        setHasDigitalSignature(true);
        Alert.alert('Sucesso', 'Digital registrada com sucesso!');
      } else {
        Alert.alert('Falha', 'Não foi possível registrar a digital. Tente novamente.');
      }
    } catch (error) {
      console.error('Erro ao registrar digital:', error);
      Alert.alert('Erro', 'Ocorreu um erro ao registrar a digital.');
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: currentTheme.colors.background }]}>
      <View style={[styles.header, { borderBottomColor: currentTheme.colors.divider }]}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => navigation.goBack()}
        >
          <Ionicons 
            name="arrow-back" 
            size={scaleSize(24)} 
            color={currentTheme.colors.primary} 
          />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: currentTheme.colors.primary }]}>
          Adicionar Funcionário
        </Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView 
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
      >
        <View style={styles.formGroup}>
          <Text style={[styles.label, { color: currentTheme.colors.text }]}>Nome do Funcionário *</Text>
          <TextInput
            style={[
              styles.input, 
              { 
                backgroundColor: currentTheme.colors.card,
                color: currentTheme.colors.text,
                borderColor: currentTheme.colors.border,
              }
            ]}
            placeholder="Digite o nome completo"
            placeholderTextColor={currentTheme.colors.textSecondary}
            value={name}
            onChangeText={setName}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={[styles.label, { color: currentTheme.colors.text }]}>Cargo *</Text>
          <TextInput
            style={[
              styles.input, 
              { 
                backgroundColor: currentTheme.colors.card,
                color: currentTheme.colors.text,
                borderColor: currentTheme.colors.border,
              }
            ]}
            placeholder="Ex: Project Manager, UI/UX Designer"
            placeholderTextColor={currentTheme.colors.textSecondary}
            value={position}
            onChangeText={setPosition}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={[styles.label, { color: currentTheme.colors.text }]}>Departamento *</Text>
          <TextInput
            style={[
              styles.input, 
              { 
                backgroundColor: currentTheme.colors.card,
                color: currentTheme.colors.text,
                borderColor: currentTheme.colors.border,
              }
            ]}
            placeholder="Ex: Design, Engenharia, Gestão"
            placeholderTextColor={currentTheme.colors.textSecondary}
            value={department}
            onChangeText={setDepartment}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={[styles.label, { color: currentTheme.colors.text }]}>Assinatura Digital</Text>
          <TouchableOpacity 
            style={[
              styles.toggleButton, 
              { 
                backgroundColor: hasDigitalSignature 
                  ? currentTheme.colors.success 
                  : currentTheme.colors.card,
                borderColor: currentTheme.colors.border,
              }
            ]}
            onPress={toggleDigitalSignature}
          >
            <Ionicons 
              name={hasDigitalSignature ? "finger-print" : "finger-print-outline"} 
              size={scaleSize(24)} 
              color={hasDigitalSignature ? currentTheme.colors.buttonText : currentTheme.colors.textSecondary} 
            />
            <Text 
              style={[
                styles.toggleText, 
                { 
                  color: hasDigitalSignature 
                    ? currentTheme.colors.buttonText 
                    : currentTheme.colors.textSecondary 
                }
              ]}
            >
              {hasDigitalSignature ? "Digital Registrada" : "Registrar Digital"}
            </Text>
          </TouchableOpacity>
          <Text style={[styles.helperText, { color: currentTheme.colors.textSecondary }]}>
            A assinatura digital não é obrigatória e pode ser adicionada posteriormente
          </Text>
        </View>

        <TouchableOpacity 
          style={[
            styles.registerButton, 
            { backgroundColor: currentTheme.colors.primary }
          ]}
          onPress={handleRegister}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color={currentTheme.colors.buttonText} />
          ) : (
            <>
              <Ionicons 
                name="save-outline" 
                size={scaleSize(20)} 
                color={currentTheme.colors.buttonText} 
              />
              <Text style={[styles.registerButtonText, { color: currentTheme.colors.buttonText }]}>
                Cadastrar Funcionário
              </Text>
            </>
          )}
        </TouchableOpacity>
      </ScrollView>
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
    height: scaleSize(70),
  },
  backButton: {
    padding: scaleSize(5),
  },
  headerTitle: {
    fontSize: scaleFontSize(20),
    fontWeight: 'bold',
  },
  placeholder: {
    width: scaleSize(24),
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: scaleSize(20),
  },
  formGroup: {
    marginBottom: scaleSize(24),
  },
  label: {
    fontSize: scaleFontSize(16),
    fontWeight: '500',
    marginBottom: scaleSize(8),
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: scaleSize(12),
    paddingVertical: scaleSize(10),
    fontSize: scaleFontSize(16),
  },
  toggleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: scaleSize(12),
    paddingVertical: scaleSize(10),
  },
  toggleText: {
    fontSize: scaleFontSize(16),
    marginLeft: scaleSize(10),
  },
  helperText: {
    fontSize: scaleFontSize(12),
    marginTop: scaleSize(6),
  },
  registerButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    paddingVertical: scaleSize(14),
    marginTop: scaleSize(10),
  },
  registerButtonText: {
    fontSize: scaleFontSize(16),
    fontWeight: '600',
    marginLeft: scaleSize(8),
  },
});

export default AddEmployeeScreen; 