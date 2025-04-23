import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Alert, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { useTheme } from '../context/ThemeContext';
import { getTheme } from '../theme/theme';
import { ThemedView, ThemedText, ThemedCard } from '../components/ThemedView';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Definição dos tipos para as rotas
type RootStackParamList = {
  Settings: undefined;
  Profile: undefined;
  Login: undefined;
  Main: undefined;
};

type ProfileScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Profile'>;
type ProfileScreenRouteProp = RouteProp<RootStackParamList, 'Profile'>;

type ProfileScreenProps = {
  navigation: ProfileScreenNavigationProp;
  route: ProfileScreenRouteProp;
};

const ProfileScreen: React.FC<ProfileScreenProps> = ({ navigation }) => {
  const { theme } = useTheme();
  const currentTheme = getTheme(theme);
  
  // Dados do perfil que serão carregados do AsyncStorage
  const [profileData, setProfileData] = useState({
    adminName: '',
    companyEmail: '',
    creationDate: '',
  });
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [tempName, setTempName] = useState('');
  const [tempEmail, setTempEmail] = useState('');

  // Carregar os dados do usuário ao montar o componente
  useEffect(() => {
    loadUserData();
  }, []);

  // Função para carregar os dados do usuário do AsyncStorage
  const loadUserData = async () => {
    try {
      setLoading(true);
      const userDataString = await AsyncStorage.getItem('userToken');
      
      if (userDataString) {
        const userData = JSON.parse(userDataString);
        
        setProfileData({
          adminName: userData.nome || '',
          companyEmail: userData.email || '',
          // Usando o campo data_cadastro do banco de dados
          creationDate: userData.data_cadastro || formatDate(new Date()),
        });
        
        setTempName(userData.nome || '');
        setTempEmail(userData.email || '');
      }
    } catch (error) {
      console.error('Erro ao carregar dados do usuário:', error);
      Alert.alert('Erro', 'Não foi possível carregar seus dados. Por favor, tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  // Formatar data para o padrão brasileiro
  const formatDate = (date: Date): string => {
    return `${date.getDate().toString().padStart(2, '0')}/${
      (date.getMonth() + 1).toString().padStart(2, '0')
    }/${date.getFullYear()}`;
  };

  const handleSave = async () => {
    // Validação simples de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(tempEmail)) {
      Alert.alert('Erro', 'Por favor, insira um email válido.');
      return;
    }

    try {
      // Obter os dados atuais
      const userDataString = await AsyncStorage.getItem('userToken');
      
      if (userDataString) {
        const userData = JSON.parse(userDataString);
        
        // Atualizar os dados
        const updatedUserData = {
          ...userData,
          nome: tempName,
          email: tempEmail
        };
        
        // Salvar de volta no AsyncStorage
        await AsyncStorage.setItem('userToken', JSON.stringify(updatedUserData));
        
        // Atualizar o estado
        setProfileData({
          ...profileData,
          adminName: tempName,
          companyEmail: tempEmail,
        });
        
        setIsEditing(false);
        Alert.alert('Sucesso', 'Dados do perfil atualizados com sucesso!');
      }
    } catch (error) {
      console.error('Erro ao salvar dados do usuário:', error);
      Alert.alert('Erro', 'Não foi possível salvar seus dados. Por favor, tente novamente.');
    }
  };

  const handleCancel = () => {
    setTempName(profileData.adminName);
    setTempEmail(profileData.companyEmail);
    setIsEditing(false);
  };

  return (
    <ThemedView style={styles.container}>
      <View style={[styles.header, { backgroundColor: currentTheme.colors.background, borderBottomColor: currentTheme.colors.divider }]}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={currentTheme.colors.primary} />
        </TouchableOpacity>
        <ThemedText style={styles.title} type="title">Perfil</ThemedText>
        <TouchableOpacity 
          style={styles.editButton} 
          onPress={() => isEditing ? handleSave() : setIsEditing(true)}>
          <Text style={[styles.editButtonText, { color: currentTheme.colors.primary }]}>
            {isEditing ? 'Salvar' : 'Editar'}
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={currentTheme.colors.primary} />
            <ThemedText style={styles.loadingText}>Carregando dados do perfil...</ThemedText>
          </View>
        ) : (
          <>
            <View style={styles.profileImageContainer}>
              <View style={styles.profileImage}>
                <Text style={styles.profileInitials}>
                  {profileData.adminName ? profileData.adminName.split(' ').map(name => name[0]).join('').toUpperCase() : ''}
                </Text>
              </View>
            </View>

            <View style={[styles.infoSection, { 
              backgroundColor: currentTheme.colors.surface,
              borderColor: currentTheme.colors.border,
             }]}>
              <ThemedText style={styles.sectionTitle} type="subtitle">Informações da Conta</ThemedText>
              
              <View style={styles.infoRow}>
                <ThemedText style={styles.infoLabel} type="secondary">Nome do Administrador</ThemedText>
                {isEditing ? (
                  <TextInput
                    style={[styles.input, { 
                      backgroundColor: currentTheme.colors.inputBackground,
                      borderColor: currentTheme.colors.inputBorder,
                      color: currentTheme.colors.text
                    }]}
                    value={tempName}
                    onChangeText={setTempName}
                    placeholder="Nome do Administrador"
                    placeholderTextColor={currentTheme.colors.textSecondary}
                  />
                ) : (
                  <ThemedText style={styles.infoValue}>{profileData.adminName}</ThemedText>
                )}
              </View>
              
              <View style={styles.infoRow}>
                <ThemedText style={styles.infoLabel} type="secondary">E-mail da Empresa</ThemedText>
                {isEditing ? (
                  <TextInput
                    style={[styles.input, { 
                      backgroundColor: currentTheme.colors.inputBackground,
                      borderColor: currentTheme.colors.inputBorder,
                      color: currentTheme.colors.text
                    }]}
                    value={tempEmail}
                    onChangeText={setTempEmail}
                    placeholder="E-mail da Empresa"
                    keyboardType="email-address"
                    placeholderTextColor={currentTheme.colors.textSecondary}
                  />
                ) : (
                  <ThemedText style={styles.infoValue}>{profileData.companyEmail}</ThemedText>
                )}
              </View>
              
              <View style={styles.infoRow}>
                <ThemedText style={styles.infoLabel} type="secondary">Data de Criação</ThemedText>
                <ThemedText style={styles.infoValue}>{profileData.creationDate}</ThemedText>
              </View>
            </View>

            {isEditing && (
              <TouchableOpacity 
                style={[styles.cancelButton, { 
                  backgroundColor: theme === 'dark' ? '#333' : '#f8f8f8',
                }]} 
                onPress={handleCancel}>
                <ThemedText style={styles.cancelButtonText} type="secondary">Cancelar</ThemedText>
              </TouchableOpacity>
            )}
          </>
        )}
      </ScrollView>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
  },
  backButton: {
    padding: 5,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  editButton: {
    padding: 5,
  },
  editButtonText: {
    fontWeight: '600',
    fontSize: 16,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  profileImageContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#3EB489',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileInitials: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#fff',
  },
  infoSection: {
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 15,
  },
  infoRow: {
    marginBottom: 15,
  },
  infoLabel: {
    fontSize: 14,
    marginBottom: 5,
  },
  infoValue: {
    fontSize: 16,
  },
  input: {
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
  },
  cancelButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 20,
  },
  cancelButtonText: {
    fontWeight: '600',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 50,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
  },
});

export default ProfileScreen;