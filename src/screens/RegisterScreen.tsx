import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import axios from 'axios';
import { useTheme } from '../context/ThemeContext';
import { getTheme } from '../theme/theme';

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
    .oneOf([Yup.ref('password')], 'Senhas não coincidem') // Removido o null
    .required('Obrigatório'),
});

const RegisterScreen = () => {
  const navigation = useNavigation<RegisterScreenNavigationProp>();
  const { theme } = useTheme();
  const currentTheme = getTheme(theme);

  const handleRegister = async (values: { name: string; email: string; password: string }) => {
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
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={[styles.container, { backgroundColor: currentTheme.colors.background }]}
    >
      <View style={styles.innerContainer}>
        <Text style={[styles.title, { color: currentTheme.colors.primary }]}>Criar nova conta</Text>
        
        <Formik
          initialValues={{ name: '', email: '', password: '', confirmPassword: '' }}
          validationSchema={RegisterSchema}
          onSubmit={handleRegister}
        >
          {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
            <View style={styles.formContainer}>
              <TextInput
                style={[styles.input, { 
                  borderColor: currentTheme.colors.inputBorder,
                  backgroundColor: currentTheme.colors.inputBackground,
                  color: currentTheme.colors.text
                }]}
                placeholder="Nome completo"
                placeholderTextColor={currentTheme.colors.textSecondary}
                onChangeText={handleChange('name')}
                onBlur={handleBlur('name')}
                value={values.name}
              />
              {touched.name && errors.name && (
                <Text style={[styles.errorText, { color: currentTheme.colors.error }]}>{errors.name}</Text>
              )}

              <TextInput
                style={[styles.input, { 
                  borderColor: currentTheme.colors.inputBorder,
                  backgroundColor: currentTheme.colors.inputBackground,
                  color: currentTheme.colors.text
                }]}
                placeholder="Email"
                placeholderTextColor={currentTheme.colors.textSecondary}
                onChangeText={handleChange('email')}
                onBlur={handleBlur('email')}
                value={values.email}
                keyboardType="email-address"
                autoCapitalize="none"
              />
              {touched.email && errors.email && (
                <Text style={[styles.errorText, { color: currentTheme.colors.error }]}>{errors.email}</Text>
              )}

              <TextInput
                style={[styles.input, { 
                  borderColor: currentTheme.colors.inputBorder,
                  backgroundColor: currentTheme.colors.inputBackground,
                  color: currentTheme.colors.text
                }]}
                placeholder="Senha"
                placeholderTextColor={currentTheme.colors.textSecondary}
                onChangeText={handleChange('password')}
                onBlur={handleBlur('password')}
                value={values.password}
                secureTextEntry
              />
              {touched.password && errors.password && (
                <Text style={[styles.errorText, { color: currentTheme.colors.error }]}>{errors.password}</Text>
              )}

              <TextInput
                style={[styles.input, { 
                  borderColor: currentTheme.colors.inputBorder,
                  backgroundColor: currentTheme.colors.inputBackground,
                  color: currentTheme.colors.text
                }]}
                placeholder="Confirmar senha"
                placeholderTextColor={currentTheme.colors.textSecondary}
                onChangeText={handleChange('confirmPassword')}
                onBlur={handleBlur('confirmPassword')}
                value={values.confirmPassword}
                secureTextEntry
              />
              {touched.confirmPassword && errors.confirmPassword && (
                <Text style={[styles.errorText, { color: currentTheme.colors.error }]}>{errors.confirmPassword}</Text>
              )}

              <TouchableOpacity 
                style={[styles.registerButton, { backgroundColor: currentTheme.colors.primary }]} 
                onPress={() => handleSubmit()}
              >
                <Text style={styles.buttonText}>Registrar</Text>
              </TouchableOpacity>
            </View>
          )}
        </Formik>

        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={[styles.linkText, { color: currentTheme.colors.primary }]}>Já tem uma conta? Faça login</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

// Os estilos permanecem os mesmos
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  innerContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
    color: '#333',
  },
  formContainer: {
    marginBottom: 20,
  },
  input: {
    height: 50,
    borderColor: '#ddd',
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
  registerButton: {
    backgroundColor: '#3EB489',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  linkText: {
    color: '#3EB489',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default RegisterScreen;