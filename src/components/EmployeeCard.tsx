import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { getTheme } from '../theme/theme';

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
          <Ionicons name="finger-print-outline" size={scaleSize(22)} color={currentTheme.colors.primary} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="create-outline" size={scaleSize(22)} color={currentTheme.colors.primary} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="trash-outline" size={scaleSize(22)} color={currentTheme.colors.error} />
        </TouchableOpacity>
      </View>
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
});

export default EmployeeCard;