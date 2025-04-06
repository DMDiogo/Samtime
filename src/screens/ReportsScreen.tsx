import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, Dimensions, Platform } from 'react-native';
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

const ReportsScreen = () => {
  const [selectedDate, setSelectedDate] = useState("April 3, 2025");
  const { theme } = useTheme();
  const currentTheme = getTheme(theme);
  
  // Dados dos funcionários e registros
  const employeeData = [
    {
      name: "Unknown Employee",
      records: [
        { type: "Started Break", time: "09:11 AM", status: "warning" },
        { type: "Started Break", time: "09:12 AM", status: "warning" },
        { type: "Clocked Out", time: "09:12 AM", status: "error" }
      ]
    },
    {
      name: "Jane Smith",
      records: [
        { type: "Started Break", time: "09:12 AM", status: "warning" }
      ]
    }
  ];

  // Funções para navegação de datas
  const goToPreviousDay = () => {
    // Lógica para ir para o dia anterior
  };

  const goToNextDay = () => {
    // Lógica para ir para o próximo dia
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: currentTheme.colors.background }]}>
      {/* Cabeçalho */}
      <View style={[styles.header, { borderBottomColor: currentTheme.colors.divider }]}>
        <Text style={[styles.headerTitle, { color: currentTheme.colors.primary }]}>Relatórios</Text>
        <TouchableOpacity style={[styles.exportButton, { borderColor: currentTheme.colors.primary }]}>
          <Ionicons name="download-outline" size={scaleSize(20)} color={currentTheme.colors.primary} />
          <Text style={[styles.exportButtonText, { color: currentTheme.colors.primary }]}>
            {width < 360 ? "Exportar" : "Exportar CSV"}
          </Text>
        </TouchableOpacity>
      </View>
      
      {/* Seletor de Data */}
      <View style={styles.dateSelector}>
        <TouchableOpacity onPress={goToPreviousDay} style={styles.dateNavButton}>
          <Ionicons name="chevron-back" size={scaleSize(24)} color={currentTheme.colors.textSecondary} />
        </TouchableOpacity>
        
        <TouchableOpacity style={[styles.dateDisplay, { borderColor: currentTheme.colors.inputBorder }]}>
          <Ionicons name="calendar-outline" size={scaleSize(18)} color={currentTheme.colors.text} style={styles.calendarIcon} />
          <Text style={[styles.dateText, { color: currentTheme.colors.text }]}>{selectedDate}</Text>
        </TouchableOpacity>
        
        <TouchableOpacity onPress={goToNextDay} style={styles.dateNavButton}>
          <Ionicons name="chevron-forward" size={scaleSize(24)} color={currentTheme.colors.textSecondary} />
        </TouchableOpacity>
      </View>
      
      {/* Lista de Funcionários e Registros */}
      <ScrollView style={styles.scrollView}>
        {employeeData.map((employee, index) => (
          <View key={index} style={[styles.employeeCard, { 
            borderColor: currentTheme.colors.border,
            backgroundColor: currentTheme.colors.card 
          }]}>
            <Text style={[styles.employeeName, { color: currentTheme.colors.primary }]}>{employee.name}</Text>
            
            {employee.records.map((record, recordIndex) => (
              <View key={recordIndex} style={styles.recordItem}>
                <View style={styles.recordInfo}>
                  <View style={[
                    styles.statusDot, 
                    record.status === "warning" ? styles.warningDot : styles.errorDot
                  ]} />
                  <Text style={[styles.recordType, { color: currentTheme.colors.text }]}>{record.type}</Text>
                </View>
                <Text style={[styles.recordTime, { color: currentTheme.colors.textSecondary }]}>{record.time}</Text>
              </View>
            ))}
          </View>
        ))}
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
    paddingTop: 0,
    paddingBottom: scaleSize(10),
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: scaleFontSize(24),
    fontWeight: 'bold',
    marginTop: scaleSize(20),
  },
  exportButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    marginTop: scaleSize(20),
    borderRadius: 20,
    paddingVertical: scaleSize(8),
    paddingHorizontal: scaleSize(12),
  },
  exportButtonText: {
    marginLeft: 5,
    fontSize: scaleFontSize(14),
  },
  dateSelector: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: scaleSize(15),
  },
  dateNavButton: {
    padding: scaleSize(5),
  },
  dateDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 5,
    paddingVertical: scaleSize(8),
    paddingHorizontal: scaleSize(15),
    marginHorizontal: scaleSize(10),
  },
  calendarIcon: {
    marginRight: 5,
  },
  dateText: {
    fontSize: scaleFontSize(16),
  },
  scrollView: {
    flex: 1,
    padding: scaleSize(15),
  },
  employeeCard: {
    borderWidth: 1,
    borderRadius: 10,
    padding: scaleSize(15),
    marginBottom: scaleSize(15),
  },
  employeeName: { 
    fontSize: scaleFontSize(18),
    fontWeight: '500',
    marginBottom: scaleSize(15),
  },
  recordItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: scaleSize(10),
    flexWrap: 'wrap',
  },
  recordInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  statusDot: {
    width: scaleSize(10),
    height: scaleSize(10),
    borderRadius: 5,
    marginRight: scaleSize(10),
  },
  warningDot: {
    backgroundColor: 'orange',
  },
  errorDot: {
    backgroundColor: 'red',
  },
  recordType: {
    fontSize: scaleFontSize(16),
    flex: 1,
    flexWrap: 'wrap',
  },
  recordTime: {
    fontSize: scaleFontSize(14),
    minWidth: scaleSize(80),
    textAlign: 'right',
  }
});

export default ReportsScreen;