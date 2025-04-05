import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import FingerprintScanner from '../components/FingerprintScanner';
import { useTheme } from '../context/ThemeContext';
import { getTheme } from '../theme/theme';
import { ThemedView, ThemedText } from '../components/ThemedView';

const HomeScreen = () => {
  const { theme } = useTheme();
  const currentTheme = getTheme(theme);
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
    <ThemedView style={styles.container}>
      {/* Título */}
      <Text style={[styles.title, { color: currentTheme.colors.primary }]}>SamTime</Text>
      
      {/* Exibição da hora atual */}
      <Text style={[styles.timeText, { color: currentTheme.colors.primary }]}>{formatTime()}</Text>
      <ThemedText style={styles.dateText} type="secondary">{formatDate()}</ThemedText>
      
      {/* Botões de ação */}
      <View style={styles.actionButtons}>
        <TouchableOpacity 
          style={[
            styles.actionButton, 
            {
              backgroundColor: theme === 'dark' ? '#333' : '#f0f0f0'
            },
            selectedAction === 'Entrada' && styles.selectedButton
          ]}
          onPress={() => handleAction('Entrada')}
        >
          <Ionicons 
            name="log-in-outline" 
            size={24} 
            color={selectedAction === 'Entrada' ? '#fff' : currentTheme.colors.primary} 
          />
          <Text 
            style={[
              styles.actionText, 
              {color: selectedAction === 'Entrada' ? '#fff' : currentTheme.colors.text},
            ]}
          >
            Entrada
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[
            styles.actionButton, 
            styles.middleButton, 
            {
              backgroundColor: theme === 'dark' ? '#333' : '#fff',
              borderColor: currentTheme.colors.border
            },
            selectedAction === 'Pausa' && styles.selectedButton
          ]}
          onPress={() => handleAction('Pausa')}
        >
          <Ionicons 
            name="cafe-outline" 
            size={24} 
            color={selectedAction === 'Pausa' ? '#fff' : currentTheme.colors.text} 
          />
          <Text 
            style={[
              styles.actionText,
              {color: selectedAction === 'Pausa' ? '#fff' : currentTheme.colors.text}
            ]}
          >
            Pausa
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[
            styles.actionButton, 
            {
              backgroundColor: theme === 'dark' ? '#333' : '#f0f0f0'
            },
            selectedAction === 'Saída' && styles.selectedButton
          ]}
          onPress={() => handleAction('Saída')}
        >
          <Ionicons 
            name="log-out-outline" 
            size={24} 
            color={selectedAction === 'Saída' ? '#fff' : currentTheme.colors.primary} 
          />
          <Text 
            style={[
              styles.actionText,
              {color: selectedAction === 'Saída' ? '#fff' : currentTheme.colors.text}
            ]}
          >
            Saída
          </Text>
        </TouchableOpacity>
      </View>
      
      {/* Scanner de impressão digital */}
      <View style={styles.fingerprintContainer}>
        <FingerprintScanner onScan={handleFingerprint} />
        <ThemedText style={styles.fingerprintText} type="secondary">
          {selectedAction 
            ? `Toque para registrar ${selectedAction}` 
            : 'Selecione uma ação e toque para escanear'}
        </ThemedText>
      </View>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 40,
    marginBottom: 20,
  },
  timeText: {
    fontSize: 36,
    fontWeight: 'bold',
    marginBottom: 30,
    marginTop: 50,
  },
  dateText: {
    fontSize: 16,
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
    width: '30%',
  },
  middleButton: {
    borderWidth: 1,
  },
  selectedButton: {
    backgroundColor: '#3EB489',
  },
  actionText: {
    marginTop: 5,
    fontSize: 14,
  },
  fingerprintContainer: {
    alignItems: 'center',
    marginTop: 30,
  },
  fingerprintText: {
    fontSize: 14,
    marginTop: 10,
  },
});

export default HomeScreen;