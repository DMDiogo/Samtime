import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, Image, Keyboard } from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import axios from 'axios';
import { useTheme } from '../context/ThemeContext';
import { getTheme } from '../theme/theme';
import { ThemedView, ThemedText } from '../components/ThemedView';
import { LinearGradient } from 'expo-linear-gradient';

// Definindo os tipos para as rotas de navegação
type RootStackParamList = {
  Login: undefined;
  Register: undefined;
};

type RegisterScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Register'>;

const RegisterSchema = Yup.object().shape({
  name: Yup.string().required('Obrigatório'),
  email: Yup.string().email('Email inválido').required('Obrigatório'),
  password: Yup.string().min(6, 'Muito curta!').required('Obrigatório'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Senhas não coincidem')
    .required('Obrigatório'),
});

const RegisterScreen = () => {
  const navigation = useNavigation<RegisterScreenNavigationProp>();
  const { theme } = useTheme();
  const currentTheme = getTheme(theme);
  const [loading, setLoading] = React.useState(false);

  const handleRegister = async (values: { name: string; email: string; password: string }) => {
    Keyboard.dismiss();
    setLoading(true);
    try {
      const response = await axios.post('http://192.168.1.57/app_empresas_api/api.php', {
        action: 'register',
        name: values.name,
        email: values.email,
        password: values.password
      });
  
      if (response.data.status === 'success') {
        alert('Cadastro realizado com sucesso!');
        navigation.navigate('Login');
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

  return (
    <ThemedView style={styles.container}>
      <LinearGradient
        colors={[theme === 'dark' ? '#1e1e1e' : '#f7f7f7', theme === 'dark' ? '#121212' : '#e9e9e9']}
        style={styles.gradientBackground}
      />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidContainer}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.innerContainer}>
            <View style={styles.logoContainer}>
              <Image 
                source={require('../../assets/logo.png')} 
                style={styles.logo} 
                resizeMode="contain"
              />
            </View>
            
            <ThemedText style={styles.title} type="title">Criar nova conta</ThemedText>
            <ThemedText style={styles.subtitle} type="secondary">Preencha os dados abaixo para se registrar</ThemedText>
            
            <Formik
              initialValues={{ name: '', email: '', password: '', confirmPassword: '' }}
              validationSchema={RegisterSchema}
              onSubmit={handleRegister}
            >
              {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
                <View style={styles.formContainer}>
                  <View style={styles.inputContainer}>
                    <ThemedText style={styles.inputLabel} type="secondary">Nome completo</ThemedText>
                    <TextInput
                      style={[
                        styles.input,
                        {
                          backgroundColor: currentTheme.colors.inputBackground,
                          borderColor: touched.name && errors.name ? '#f44336' : currentTheme.colors.inputBorder,
                          color: currentTheme.colors.text
                        }
                      ]}
                      placeholder="Seu nome completo"
                      placeholderTextColor={currentTheme.colors.textSecondary}
                      onChangeText={handleChange('name')}
                      onBlur={handleBlur('name')}
                      value={values.name}
                    />
                    {touched.name && errors.name && (
                      <Text style={styles.errorText}>{errors.name}</Text>
                    )}
                  </View>

                  <View style={styles.inputContainer}>
                    <ThemedText style={styles.inputLabel} type="secondary">Email</ThemedText>
                    <TextInput
                      style={[
                        styles.input,
                        {
                          backgroundColor: currentTheme.colors.inputBackground,
                          borderColor: touched.email && errors.email ? '#f44336' : currentTheme.colors.inputBorder,
                          color: currentTheme.colors.text
                        }
                      ]}
                      placeholder="Seu email"
                      placeholderTextColor={currentTheme.colors.textSecondary}
                      onChangeText={handleChange('email')}
                      onBlur={handleBlur('email')}
                      value={values.email}
                      keyboardType="email-address"
                      autoCapitalize="none"
                    />
                    {touched.email && errors.email && (
                      <Text style={styles.errorText}>{errors.email}</Text>
                    )}
                  </View>

                  <View style={styles.inputContainer}>
                    <ThemedText style={styles.inputLabel} type="secondary">Senha</ThemedText>
                    <TextInput
                      style={[
                        styles.input,
                        {
                          backgroundColor: currentTheme.colors.inputBackground,
                          borderColor: touched.password && errors.password ? '#f44336' : currentTheme.colors.inputBorder,
                          color: currentTheme.colors.text
                        }
                      ]}
                      placeholder="Crie uma senha segura"
                      placeholderTextColor={currentTheme.colors.textSecondary}
                      onChangeText={handleChange('password')}
                      onBlur={handleBlur('password')}
                      value={values.password}
                      secureTextEntry
                    />
                    {touched.password && errors.password && (
                      <Text style={styles.errorText}>{errors.password}</Text>
                    )}
                  </View>

                  <View style={styles.inputContainer}>
                    <ThemedText style={styles.inputLabel} type="secondary">Confirmar senha</ThemedText>
                    <TextInput
                      style={[
                        styles.input,
                        {
                          backgroundColor: currentTheme.colors.inputBackground,
                          borderColor: touched.confirmPassword && errors.confirmPassword ? '#f44336' : currentTheme.colors.inputBorder,
                          color: currentTheme.colors.text
                        }
                      ]}
                      placeholder="Repita sua senha"
                      placeholderTextColor={currentTheme.colors.textSecondary}
                      onChangeText={handleChange('confirmPassword')}
                      onBlur={handleBlur('confirmPassword')}
                      value={values.confirmPassword}
                      secureTextEntry
                    />
                    {touched.confirmPassword && errors.confirmPassword && (
                      <Text style={styles.errorText}>{errors.confirmPassword}</Text>
                    )}
                  </View>

                  <TouchableOpacity 
                    style={[styles.registerButton, loading && styles.disabledButton]} 
                    onPress={() => handleSubmit()}
                    disabled={loading}
                  >
                    <Text style={styles.buttonText}>
                      {loading ? 'Processando...' : 'Registrar conta'}
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            </Formik>

            <TouchableOpacity 
              style={styles.loginContainer}
              onPress={() => navigation.navigate('Login')}
            >
              <Text style={[styles.loginText, { color: currentTheme.colors.textSecondary }]}>
                Já tem uma conta? <Text style={{ color: currentTheme.colors.primary, fontWeight: 'bold' }}>Faça login</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradientBackground: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  keyboardAvoidContainer: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
  },
  innerContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingBottom: 40,
    paddingTop: 10,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 7,
  },
  logo: {
    width: 100,
    height: 100,
    alignSelf: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 32,
    opacity: 0.7,
  },
  formContainer: {
    marginBottom: 20,
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    marginBottom: 6,
    fontWeight: '500',
  },
  input: {
    height: 56,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
  },
  errorText: {
    color: '#f44336',
    marginTop: 4,
    fontSize: 12,
  },
  registerButton: {
    backgroundColor: '#3EB489',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
    elevation: 2,
    shadowColor: '#3EB489',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  disabledButton: {
    backgroundColor: '#cccccc',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loginContainer: {
    alignItems: 'center',
    marginTop: 24,
  },
  loginText: {
    fontSize: 14,
  },
});

export default RegisterScreen;