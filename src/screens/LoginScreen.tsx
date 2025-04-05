import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, ScrollView, Keyboard } from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import FingerprintScannerComponent from '../components/FingerprintScanner';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '../context/ThemeContext';
import { getTheme } from '../theme/theme';
import { ThemedView, ThemedText } from '../components/ThemedView';

type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  Main: undefined;
};

type LoginScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Login'>;

const LoginSchema = Yup.object().shape({
  email: Yup.string().email('Email inválido').required('Obrigatório'),
  password: Yup.string().min(6, 'Muito curta!').required('Obrigatório'),
});

const LoginScreen = () => {
  const navigation = useNavigation<LoginScreenNavigationProp>();
  const { theme } = useTheme();
  const currentTheme = getTheme(theme);
  const [useBiometric, setUseBiometric] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (values: { email: string; password: string }) => {
    Keyboard.dismiss(); // Fecha o teclado antes da navegação
    setLoading(true);
    try {
      const response = await axios.post('http://192.168.1.57/app_empresas_api/api.php', {
        action: 'login',
        email: values.email,
        password: values.password
      });
  
      if (response.data.status === 'success') {
        await AsyncStorage.setItem('userToken', JSON.stringify(response.data.empresa));
        navigation.navigate('Main');
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      console.error(error);
      alert('Erro ao conectar ao servidor');
    } finally {
      setLoading(false);
    }
  };

  const handleBiometricSuccess = () => {
    console.log('Autenticação biométrica bem-sucedida');
  };

  return (
    <ThemedView style={styles.container}>
      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
        scrollEnabled={false}
      >
        <View style={styles.innerContainer}>
          <Image 
            source={require('../../assets/logo.png')} 
            style={styles.logo} 
            resizeMode="contain"
          />
          
          <ThemedText style={styles.title} type="title">Bem-vindo de volta</ThemedText>
          
          <Formik
            initialValues={{ email: '', password: '' }}
            validationSchema={LoginSchema}
            onSubmit={handleLogin}
          >
            {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
              <View style={styles.formContainer}>
                <TextInput
                  style={[
                    styles.input,
                    {
                      backgroundColor: currentTheme.colors.inputBackground,
                      borderColor: currentTheme.colors.inputBorder,
                      color: currentTheme.colors.text
                    }
                  ]}
                  placeholder="Email"
                  placeholderTextColor={currentTheme.colors.textSecondary}
                  onChangeText={handleChange('email')}
                  onBlur={handleBlur('email')}
                  value={values.email}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  onSubmitEditing={() => Keyboard.dismiss()}
                />
                {touched.email && errors.email && (
                  <Text style={styles.errorText}>{errors.email}</Text>
                )}

                <TextInput
                  style={[
                    styles.input,
                    {
                      backgroundColor: currentTheme.colors.inputBackground,
                      borderColor: currentTheme.colors.inputBorder,
                      color: currentTheme.colors.text
                    }
                  ]}
                  placeholder="Senha"
                  placeholderTextColor={currentTheme.colors.textSecondary}
                  onChangeText={handleChange('password')}
                  onBlur={handleBlur('password')}
                  value={values.password}
                  secureTextEntry
                  onSubmitEditing={() => Keyboard.dismiss()}
                />
                {touched.password && errors.password && (
                  <Text style={styles.errorText}>{errors.password}</Text>
                )}

                <TouchableOpacity 
                  style={[styles.loginButton, loading && styles.disabledButton]} 
                  onPress={() => handleSubmit()}
                  disabled={loading}
                >
                  <Text style={styles.buttonText}>
                    {loading ? 'Carregando...' : 'Entrar'}
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </Formik>

          <TouchableOpacity 
            onPress={() => navigation.navigate('Register')}
            disabled={loading}
          >
            <Text style={[styles.linkText, { color: currentTheme.colors.primary }]}>
              Não tem uma conta? Registre-se
            </Text>
          </TouchableOpacity>

          <ThemedText style={styles.orText} type="secondary">OU</ThemedText>

          <FingerprintScannerComponent onScan={handleBiometricSuccess} />
        </View>
      </ScrollView>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
  },
  innerContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 30,
    paddingBottom: 40, // Adiciona espaço na parte inferior
  },
  logo: {
    width: 150,
    height: 150,
    alignSelf: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
  },
  formContainer: {
    marginBottom: 20,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 10,
    fontSize: 16,
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
    fontSize: 14,
  },
  loginButton: {
    backgroundColor: '#3EB489',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  disabledButton: {
    backgroundColor: '#cccccc',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  linkText: {
    textAlign: 'center',
    marginTop: 20,
  },
  orText: {
    textAlign: 'center',
    marginVertical: 20,
  },
});

export default LoginScreen;