import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import FingerprintScanner from '../components/FingerprintScanner';

const HomeScreen = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedAction, setSelectedAction] = useState<string | null>(null);
  
  // Atualizar o tempo a cada segundo
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentDate(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Formatar a data e hora
  const formatTime = () => {
    const hours = currentDate.getHours().toString().padStart(2, '0');
    const minutes = currentDate.getMinutes().toString().padStart(2, '0');
    const seconds = currentDate.getSeconds().toString().padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
  };

  const formatDate = () => {
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    const formattedDate = currentDate.toLocaleDateString('pt-BR', options);
    return formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);
  };

  // Lidar com ações do relógio
  const handleAction = (action: string) => {
    setSelectedAction(action);
  };
  
  // Manipular escaneamento de impressão digital
  const handleFingerprint = () => {
    if (selectedAction) {
      // Esta função será chamada apenas após autenticação biométrica bem-sucedida
      console.log(`Ação de ${selectedAction} registrada com impressão digital`);
      
      // Aqui você pode adicionar a lógica para salvar este registro no seu backend
      // Por exemplo, enviar os dados para uma API
      
      Alert.alert(
        'Sucesso', 
        `${selectedAction} registrada com sucesso às ${formatTime()}!`,
        [{ text: 'OK' }]
      );
      
      // Opcional: limpar a ação selecionada após registro
      setSelectedAction(null);
    } else {
      Alert.alert(
        'Aviso',
        'Selecione uma ação primeiro (Entrada, Pausa ou Saída)',
        [{ text: 'OK' }]
      );
    }
  };

  return (
    <View style={styles.container}>
      {/* Título */}
      <Text style={styles.title}>SamTime</Text>
      
      {/* Exibição da hora atual */}
      <Text style={styles.timeText}>{formatTime()}</Text>
      <Text style={styles.dateText}>{formatDate()}</Text>
      
      {/* Botões de ação */}
      <View style={styles.actionButtons}>
        <TouchableOpacity 
          style={[styles.actionButton, selectedAction === 'Entrada' && styles.selectedButton]}
          onPress={() => handleAction('Entrada')}
        >
          <Ionicons name="log-in-outline" size={24} color={selectedAction === 'Entrada' ? '#fff' : '#3EB489'} />
          <Text style={[styles.actionText, selectedAction === 'Entrada' && styles.selectedText]}>Entrada</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.actionButton, styles.middleButton, selectedAction === 'Pausa' && styles.selectedButton]}
          onPress={() => handleAction('Pausa')}
        >
          <Ionicons name="cafe-outline" size={24} color={selectedAction === 'Pausa' ? '#fff' : '#000'} />
          <Text style={[styles.actionText, selectedAction === 'Pausa' && styles.selectedText]}>Pausa</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.actionButton, selectedAction === 'Saída' && styles.selectedButton]}
          onPress={() => handleAction('Saída')}
        >
          <Ionicons name="log-out-outline" size={24} color={selectedAction === 'Saída' ? '#fff' : '#3EB489'} />
          <Text style={[styles.actionText, selectedAction === 'Saída' && styles.selectedText]}>Saída</Text>
        </TouchableOpacity>
      </View>
      
      {/* Scanner de impressão digital */}
      <View style={styles.fingerprintContainer}>
        <FingerprintScanner onScan={handleFingerprint} />
        <Text style={styles.fingerprintText}>
          {selectedAction 
            ? `Toque para registrar ${selectedAction}` 
            : 'Selecione uma ação e toque para escanear'}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#3EB489',
    marginTop: 40,
    marginBottom: 20,
  },
  timeText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#3EB489',
    marginBottom: 30,
    marginTop: 50,
  },
  dateText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 40,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 50,
  },
  actionButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    width: '30%',
  },
  middleButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  selectedButton: {
    backgroundColor: '#3EB489',
  },
  actionText: {
    marginTop: 5,
    fontSize: 14,
  },
  middleText: {
    color: '#000',
  },
  selectedText: {
    color: '#fff',
  },
  fingerprintContainer: {
    alignItems: 'center',
    marginTop: 30,
  },
  fingerprintText: {
    color: '#666',
    fontSize: 14,
    marginTop: 10,
  },
});

export default HomeScreen;