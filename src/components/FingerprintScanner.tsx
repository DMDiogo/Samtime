import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, StyleSheet, Alert, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import FingerprintScanner from 'react-native-fingerprint-scanner';
import { useTheme } from '../context/ThemeContext';
import { getTheme } from '../theme/theme';

interface FingerprintProps {
  onScan: () => void;
}

// Interfaces para tipagem correta
interface AndroidAuthConfig {
  title: string;
  subtitle: string;
  description: string;
  cancelButton: string;
}

interface IOSAuthConfig {
  description: string;
  fallbackLabel: string;
  cancelLabel: string;
}

const FingerprintScannerComponent: React.FC<FingerprintProps> = ({ onScan }) => {
  const { theme } = useTheme();
  const currentTheme = getTheme(theme);
  const [biometricType, setBiometricType] = useState<string | null>(null);
  const [isSensorAvailable, setSensorAvailable] = useState<boolean>(false);

  useEffect(() => {
    // Verificar se o sensor biométrico está disponível
    checkBiometricSupport();

    // Limpar os recursos quando o componente for desmontado
    return () => {
      safeRelease();
    };
  }, []);

  // Função segura para liberar recursos
  const safeRelease = () => {
    try {
      if (FingerprintScanner) {
        FingerprintScanner.release();
      }
    } catch (error) {
      console.log('Erro ao liberar scanner:', error);
    }
  };

  const checkBiometricSupport = () => {
    try {
      if (!FingerprintScanner) {
        console.log('FingerprintScanner não está disponível');
        setSensorAvailable(false);
        return;
      }

      FingerprintScanner.isSensorAvailable()
        .then(biometryType => {
          setBiometricType(biometryType);
          setSensorAvailable(true);
        })
        .catch(error => {
          console.log('Sensor biométrico não disponível', error);
          setSensorAvailable(false);
        });
    } catch (error) {
      console.log('Erro ao verificar disponibilidade do sensor:', error);
      setSensorAvailable(false);
    }
  };

  const handleFingerPrintAuth = () => {
    if (!isSensorAvailable || !FingerprintScanner) {
      Alert.alert(
        'Erro',
        'Autenticação biométrica não disponível neste dispositivo',
        [{ text: 'OK' }]
      );
      return;
    }

    // Configurações específicas da plataforma
    if (Platform.OS === 'android') {
      // Configuração para Android
      const androidConfig: AndroidAuthConfig = {
        title: 'Autenticação Biométrica',
        subtitle: 'Use sua impressão digital para confirmar',
        description: 'Toque no sensor de impressão digital',
        cancelButton: 'Cancelar',
      };
      
      try {
        // Inicia a autenticação para Android
        FingerprintScanner.authenticate(androidConfig)
          .then(() => {
            safeRelease();
            onScan(); // Execute a callback após sucesso
          })
          .catch(handleAuthError);
      } catch (error) {
        console.log('Erro ao iniciar autenticação:', error);
        handleAuthError(error);
      }
    } 
    else if (Platform.OS === 'ios') {
      // Configuração para iOS
      const iosConfig: IOSAuthConfig = {
        description: 'Use sua impressão digital para confirmar',
        fallbackLabel: 'Use a senha',
        cancelLabel: 'Cancelar',
      };
      
      try {
        // Inicia a autenticação para iOS
        FingerprintScanner.authenticate(iosConfig)
          .then(() => {
            safeRelease();
            onScan(); // Execute a callback após sucesso
          })
          .catch(handleAuthError);
      } catch (error) {
        console.log('Erro ao iniciar autenticação:', error);
        handleAuthError(error);
      }
    }
    else {
      // Caso seja outra plataforma não suportada
      Alert.alert(
        'Erro',
        'Plataforma não suportada para autenticação biométrica',
        [{ text: 'OK' }]
      );
    }
  };

  // Função para tratar erros de autenticação
  const handleAuthError = (error: any) => {
    safeRelease();
    console.log('Erro na autenticação:', error);
    
    let errorMessage = 'Falha na autenticação biométrica';
    
    // Mensagens de erro específicas por código
    if (error && error.name) {
      if (error.name === 'FingerprintScannerNotEnrolled') {
        errorMessage = 'Nenhuma impressão digital cadastrada neste dispositivo';
      } else if (error.name === 'FingerprintScannerNotAvailable') {
        errorMessage = 'Sensor biométrico não disponível ou desativado';
      } else if (error.name === 'FingerprintScannerAuthenticationFailed') {
        errorMessage = 'Impressão digital não reconhecida';
      } else if (error.name === 'FingerprintScannerUnknownError') {
        errorMessage = 'Ocorreu um erro desconhecido';
      } else if (error.name === 'FingerprintScannerNotSupported') {
        errorMessage = 'Autenticação biométrica não suportada neste dispositivo';
      }
    }

    Alert.alert('Erro de autenticação', errorMessage, [{ text: 'OK' }]);
  };

  return (
    <TouchableOpacity 
      style={styles.fingerprintButton}
      onPress={handleFingerPrintAuth}
      activeOpacity={0.7}
    >
      <View style={[
        styles.iconContainer,
        { 
          backgroundColor: theme === 'dark' ? '#333' : '#f0f0f0',
          shadowColor: currentTheme.colors.shadow
        }
      ]}>
        <Ionicons 
          name="finger-print-outline" 
          size={64} 
          color={currentTheme.colors.primary} 
        />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  fingerprintButton: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
});

export default FingerprintScannerComponent;