import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { getTheme } from '../theme/theme';

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
          <Ionicons name="download-outline" size={20} color={currentTheme.colors.primary} />
          <Text style={[styles.exportButtonText, { color: currentTheme.colors.primary }]}>Exportar CSV</Text>
        </TouchableOpacity>
      </View>
      
      {/* Seletor de Data */}
      <View style={styles.dateSelector}>
        <TouchableOpacity onPress={goToPreviousDay} style={styles.dateNavButton}>
          <Ionicons name="chevron-back" size={24} color={currentTheme.colors.textSecondary} />
        </TouchableOpacity>
        
        <TouchableOpacity style={[styles.dateDisplay, { borderColor: currentTheme.colors.inputBorder }]}>
          <Ionicons name="calendar-outline" size={18} color={currentTheme.colors.text} style={styles.calendarIcon} />
          <Text style={[styles.dateText, { color: currentTheme.colors.text }]}>{selectedDate}</Text>
        </TouchableOpacity>
        
        <TouchableOpacity onPress={goToNextDay} style={styles.dateNavButton}>
          <Ionicons name="chevron-forward" size={24} color={currentTheme.colors.textSecondary} />
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
    paddingTop: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 0,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#fff',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#3EB489',
    marginTop: 20,
  },
  exportButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    marginTop:20,
    borderColor: '#3EB489',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  exportButtonText: {
    color: '#3EB489',
    marginLeft: 5,
    fontSize: 14,
  },
  dateSelector: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 15,
  },
  dateNavButton: {
    padding: 5,
  },
  dateDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    paddingVertical: 8,
    paddingHorizontal: 15,
    marginHorizontal: 10,
  },
  calendarIcon: {
    marginRight: 5,
  },
  dateText: {
    fontSize: 16,
    color: '#333',
  },
  scrollView: {
    flex: 1,
    padding: 15,
  },
  employeeCard: {
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    backgroundColor: '#fff',
  },
  employeeName: { 
    fontSize: 18,
    fontWeight: '500',
    color: '#3EB489',
    marginBottom: 15,
  },
  recordItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
  },
  recordInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 10,
  },
  warningDot: {
    backgroundColor: 'orange',
  },
  errorDot: {
    backgroundColor: 'red',
  },
  recordType: {
    fontSize: 16,
    color: '#333',
  },
  recordTime: {
    fontSize: 14,
    color: '#666',
  }
});

export default ReportsScreen;