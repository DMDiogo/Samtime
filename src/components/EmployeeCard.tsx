import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Platform, Alert, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { getTheme } from '../theme/theme';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

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
  onUpdateSuccess?: () => void; // Callback opcional para atualizar a lista após uma operação
}

const EmployeeCard: React.FC<EmployeeCardProps> = ({ employee, onUpdateSuccess }) => {
  const { theme } = useTheme();
  const navigation = useNavigation();
  const currentTheme = getTheme(theme);
  const [isLoading, setIsLoading] = useState(false);
  
  // Extrair o número de ID amigável para exibição
  const getFriendlyId = (fullId: string) => {
    // Se está no formato EMP-{empresa_id}-{sequência}
    if (fullId.includes('-')) {
      const parts = fullId.split('-');
      if (parts.length >= 3) {
        return parts[2]; // Retorna apenas a sequência
      }
    }
    // Caso contrário, retorna o ID completo
    return fullId;
  };

  // Extrair o ID da empresa a partir do ID do funcionário
  const getEmpresaId = (fullId: string) => {
    if (fullId.includes('-')) {
      const parts = fullId.split('-');
      if (parts.length >= 3) {
        return parts[1]; // Retorna o ID da empresa
      }
    }
    return null; // Não foi possível extrair o ID da empresa
  };

  // Obter ID da empresa do armazenamento
  const getEmpresaIdFromStorage = async () => {
    try {
      const userTokenString = await AsyncStorage.getItem('userToken');
      if (!userTokenString) {
        throw new Error('Usuário não autenticado');
      }
      
      const userData = JSON.parse(userTokenString);
      return userData.id;
    } catch (error) {
      console.error('Erro ao obter ID da empresa:', error);
      return null;
    }
  };

  // Atualizar status da assinatura digital
  const toggleDigitalSignature = async () => {
    setIsLoading(true);
    
    try {
      // Preferir obter o ID da empresa do token de usuário
      let empresaId = await getEmpresaIdFromStorage();
      
      // Se não encontrado, tentar extrair do ID do funcionário
      if (!empresaId) {
        empresaId = getEmpresaId(employee.id);
        
        if (!empresaId) {
          throw new Error('ID da empresa não encontrado');
        }
      }
      
      const response = await fetch('http://192.168.1.57/interface/api.biometrico/api_employees.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'updateDigitalSignature',
          id: employee.id,
          digitalSignature: !employee.digitalSignature,
          empresa_id: empresaId
        }),
      });
      
      if (!response.ok) {
        throw new Error(`Erro na resposta do servidor: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.status === 'success') {
        Alert.alert('Sucesso', 'Status da assinatura digital atualizado');
        // Chamar callback para atualizar a lista
        if (onUpdateSuccess) {
          onUpdateSuccess();
        }
      } else {
        Alert.alert('Erro', data.message || 'Erro ao atualizar assinatura digital');
      }
    } catch (error) {
      console.error('Erro ao atualizar assinatura digital:', error);
      Alert.alert('Erro', 'Não foi possível atualizar a assinatura digital');
    } finally {
      setIsLoading(false);
    }
  };

  // Editar funcionário
  const handleEdit = () => {
    // A implementação da edição seria feita em uma tela separada
    Alert.alert('Função em desenvolvimento', 'A edição de funcionários será implementada em breve.');
  };

  // Excluir funcionário
  const handleDelete = async () => {
    Alert.alert(
      'Confirmação',
      `Tem certeza que deseja excluir o funcionário ${employee.name}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Excluir', 
          style: 'destructive',
          onPress: async () => {
            setIsLoading(true);
            
            try {
              // Preferir obter o ID da empresa do token de usuário
              let empresaId = await getEmpresaIdFromStorage();
              
              // Se não encontrado, tentar extrair do ID do funcionário
              if (!empresaId) {
                empresaId = getEmpresaId(employee.id);
                
                if (!empresaId) {
                  throw new Error('ID da empresa não encontrado');
                }
              }
              
              const response = await fetch('http://192.168.1.57/interface/api.biometrico/api_employees.php', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  action: 'deleteEmployee',
                  id: employee.id,
                  empresa_id: empresaId
                }),
              });
              
              if (!response.ok) {
                throw new Error(`Erro na resposta do servidor: ${response.status}`);
              }
              
              const data = await response.json();
              
              if (data.status === 'success') {
                Alert.alert('Sucesso', 'Funcionário excluído com sucesso');
                // Chamar callback para atualizar a lista
                if (onUpdateSuccess) {
                  onUpdateSuccess();
                }
              } else {
                Alert.alert('Erro', data.message || 'Erro ao excluir funcionário');
              }
            } catch (error) {
              console.error('Erro ao excluir funcionário:', error);
              Alert.alert('Erro', 'Não foi possível excluir o funcionário');
            } finally {
              setIsLoading(false);
            }
          }
        }
      ]
    );
  };

  return (
    <View style={[styles.card, { 
      backgroundColor: currentTheme.colors.card,
      shadowColor: currentTheme.colors.shadow
    }]}>
      <View style={styles.infoContainer}>
        <Text style={[styles.name, { color: currentTheme.colors.text }]}>{employee.name}</Text>
        <Text style={[styles.position, { color: currentTheme.colors.textSecondary }]}>{employee.position}</Text>
        <Text style={[styles.id, { color: currentTheme.colors.textSecondary }]}>
          ID: {getFriendlyId(employee.id)}
        </Text>
        <View style={styles.statusContainer}>
          <View style={[styles.statusDot, { backgroundColor: employee.digitalSignature ? currentTheme.colors.success : '#ccc' }]} />
          <Text style={[styles.statusText, { color: currentTheme.colors.textSecondary }]}>
            {employee.digitalSignature ? 'Digital registrada' : 'Sem digital registrada'}
          </Text>
        </View>
      </View>
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color={currentTheme.colors.primary} />
        </View>
      ) : (
        <View style={styles.actions}>
          <TouchableOpacity style={styles.actionButton} onPress={toggleDigitalSignature}>
            <Ionicons name="finger-print-outline" size={scaleSize(22)} color={currentTheme.colors.primary} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} onPress={handleEdit}>
            <Ionicons name="create-outline" size={scaleSize(22)} color={currentTheme.colors.primary} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} onPress={handleDelete}>
            <Ionicons name="trash-outline" size={scaleSize(22)} color={currentTheme.colors.error} />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 8,
    padding: scaleSize(16),
    marginBottom: scaleSize(16),
    flexDirection: 'row',
    justifyContent: 'space-between',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  infoContainer: {
    flex: 1,
    paddingRight: scaleSize(8),
  },
  name: {
    fontSize: scaleFontSize(18),
    fontWeight: 'bold',
    marginBottom: 4,
  },
  position: {
    fontSize: scaleFontSize(14),
    marginBottom: 4,
  },
  id: {
    fontSize: scaleFontSize(14),
    marginBottom: 8,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  statusDot: {
    width: scaleSize(10),
    height: scaleSize(10),
    borderRadius: 5,
    marginRight: 6,
  },
  statusText: {
    fontSize: scaleFontSize(14),
  },
  actions: {
    flexDirection: isSmallDevice ? 'column' : 'row',
    alignItems: 'center',
  },
  actionButton: {
    marginLeft: isSmallDevice ? 0 : scaleSize(12),
    marginBottom: isSmallDevice ? scaleSize(8) : 0,
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: scaleSize(50),
  },
});

export default EmployeeCard;