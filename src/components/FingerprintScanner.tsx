import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, StyleSheet, Alert, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import FingerprintScanner from 'react-native-fingerprint-scanner';

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
  const [biometricType, setBiometricType] = useState<string | null>(null);
  const [isSensorAvailable, setSensorAvailable] = useState<boolean>(false);

  useEffect(() => {
    // Verificar se o sensor biométrico está disponível
    checkBiometricSupport();

    // Limpar os recursos quando o componente for desmontado
    return () => {
      FingerprintScanner.release();
    };
  }, []);

  const checkBiometricSupport = () => {
    FingerprintScanner.isSensorAvailable()
      .then(biometryType => {
        setBiometricType(biometryType);
        setSensorAvailable(true);
      })
      .catch(error => {
        console.log('Sensor biométrico não disponível', error);
        setSensorAvailable(false);
      });
  };

  const handleFingerPrintAuth = () => {
    if (!isSensorAvailable) {
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
      
      // Inicia a autenticação para Android
      FingerprintScanner.authenticate(androidConfig)
        .then(() => {
          FingerprintScanner.release();
          onScan(); // Execute a callback após sucesso
        })
        .catch(handleAuthError);
    } 
    else if (Platform.OS === 'ios') {
      // Configuração para iOS
      const iosConfig: IOSAuthConfig = {
        description: 'Use sua impressão digital para confirmar',
        fallbackLabel: 'Use a senha',
        cancelLabel: 'Cancelar',
      };
      
      // Inicia a autenticação para iOS
      FingerprintScanner.authenticate(iosConfig)
        .then(() => {
          FingerprintScanner.release();
          onScan(); // Execute a callback após sucesso
        })
        .catch(handleAuthError);
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
    FingerprintScanner.release();
    console.log('Erro na autenticação:', error);
    
    let errorMessage = 'Falha na autenticação biométrica';
    
    // Mensagens de erro específicas por código
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

    Alert.alert('Erro de autenticação', errorMessage, [{ text: 'OK' }]);
  };

  return (
    <TouchableOpacity 
      style={styles.fingerprintButton}
      onPress={handleFingerPrintAuth}
      activeOpacity={0.7}
    >
      <View style={styles.iconContainer}>
        <Ionicons 
          name="finger-print-outline" 
          size={64} 
          color="#3EB489" 
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
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
});

export default FingerprintScannerComponent;