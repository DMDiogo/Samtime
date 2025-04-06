import * as LocalAuthentication from 'expo-local-authentication';

// Check if biometric sensor is available
export const isBiometricAvailable = async (): Promise<boolean> => {
  try {
    const isAvailable = await LocalAuthentication.hasHardwareAsync();
    return isAvailable;
  } catch (error) {
    console.log('Sensor biométrico não disponível', error);
    return false;
  }
};

// Get biometric types available on the device
export const getBiometricTypes = async (): Promise<LocalAuthentication.AuthenticationType[]> => {
  try {
    const types = await LocalAuthentication.supportedAuthenticationTypesAsync();
    return types;
  } catch (error) {
    console.log('Erro ao obter tipos biométricos', error);
    return [];
  }
};

// Authenticate using biometrics
export const authenticateWithBiometrics = async (
  promptMessage: string = 'Autentique para continuar'
): Promise<boolean> => {
  try {
    // First check if hardware is available
    const isAvailable = await isBiometricAvailable();
    if (!isAvailable) {
      console.log('Hardware biométrico não disponível');
      return false;
    }

    // Check if biometrics are enrolled
    const isEnrolled = await LocalAuthentication.isEnrolledAsync();
    if (!isEnrolled) {
      console.log('Nenhuma biometria cadastrada no dispositivo');
      return false;
    }

    // Authenticate
    const result = await LocalAuthentication.authenticateAsync({
      promptMessage,
      fallbackLabel: 'Use sua senha',
      cancelLabel: 'Cancelar',
      disableDeviceFallback: false,
    });

    return result.success;
  } catch (error) {
    console.log('Erro na autenticação biométrica', error);
    return false;
  }
};

// Save a biometric credential (simulated as we can't actually store biometrics)
export const saveBiometricSignature = async (
  userId: string,
  promptMessage: string = 'Registre sua digital'
): Promise<boolean> => {
  try {
    // We can't actually save biometrics, so we simulate by authenticating
    // This just verifies the user has biometrics set up on their device
    return await authenticateWithBiometrics(promptMessage);
  } catch (error) {
    console.log('Erro ao salvar assinatura biométrica', error);
    return false;
  }
}; 