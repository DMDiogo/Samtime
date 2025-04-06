import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Dimensions, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import FingerprintScanner from '../components/FingerprintScanner';
import { useTheme } from '../context/ThemeContext';
import { getTheme } from '../theme/theme';
import { ThemedView, ThemedText } from '../components/ThemedView';

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
            size={scaleSize(24)} 
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
            size={scaleSize(24)} 
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
            size={scaleSize(24)} 
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
    padding: scaleSize(20),
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: scaleFontSize(24),
    fontWeight: 'bold',
    marginTop: Platform.OS === 'ios' ? scaleSize(40) : scaleSize(20),
    marginBottom: scaleSize(20),
  },
  timeText: {
    fontSize: scaleFontSize(36),
    fontWeight: 'bold',
    marginBottom: scaleSize(20),
    marginTop: scaleSize(40),
  },
  dateText: {
    fontSize: scaleFontSize(16),
    marginBottom: scaleSize(30),
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: scaleSize(40),
    paddingHorizontal: scaleSize(5),
  },
  actionButton: {
    paddingVertical: scaleSize(12),
    paddingHorizontal: scaleSize(8),
    borderRadius: 8,
    alignItems: 'center',
    width: width / 3.5,
  },
  middleButton: {
    borderWidth: 1,
  },
  selectedButton: {
    backgroundColor: '#3EB489',
  },
  actionText: {
    marginTop: 5,
    fontSize: scaleFontSize(13),
    textAlign: 'center',
  },
  fingerprintContainer: {
    alignItems: 'center',
    marginTop: scaleSize(20),
  },
  fingerprintText: {
    fontSize: scaleFontSize(14),
    marginTop: scaleSize(10),
    textAlign: 'center',
    paddingHorizontal: scaleSize(20),
  },
});

export default HomeScreen;