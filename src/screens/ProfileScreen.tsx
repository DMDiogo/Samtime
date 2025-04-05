import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Alert } from 'react-native';
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
  
  // Dados do perfil (normalmente viriam de uma API ou contexto)
  const [profileData, setProfileData] = useState({
    adminName: 'João Silva',
    companyEmail: 'contato@minhaempresa.com.br',
    creationDate: '15/03/2023',
  });

  const [isEditing, setIsEditing] = useState(false);
  const [tempName, setTempName] = useState(profileData.adminName);
  const [tempEmail, setTempEmail] = useState(profileData.companyEmail);

  const handleSave = () => {
    // Validação simples de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(tempEmail)) {
      Alert.alert('Erro', 'Por favor, insira um email válido.');
      return;
    }

    // Aqui você implementaria a chamada para atualizar os dados no backend
    setProfileData({
      ...profileData,
      adminName: tempName,
      companyEmail: tempEmail,
    });
    
    setIsEditing(false);
    Alert.alert('Sucesso', 'Dados do perfil atualizados com sucesso!');
  };

  const handleCancel = () => {
    setTempName(profileData.adminName);
    setTempEmail(profileData.companyEmail);
    setIsEditing(false);
  };

  const handleLogout = async () => {
    try {
      // Remover o token de autenticação
      await AsyncStorage.removeItem('userToken');
      // Navegar para a tela de login, isso será implementado em outro momento
      
      // Mostrar mensagem de sucesso
      Alert.alert('Sucesso', 'Você saiu da sua conta com sucesso!');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
      Alert.alert('Erro', 'Não foi possível encerrar a sessão. Tente novamente.');
    }
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
        <View style={styles.profileImageContainer}>
          <View style={styles.profileImage}>
            <Text style={styles.profileInitials}>
              {profileData.adminName.split(' ').map(name => name[0]).join('').toUpperCase()}
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

        <TouchableOpacity 
          style={styles.dangerButton}
          onPress={handleLogout}
        >
          <Ionicons name="log-out-outline" size={20} color="#fff" />
          <Text style={styles.dangerButtonText}>Sair da Conta</Text>
        </TouchableOpacity>
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
    paddingTop: 60,
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
  dangerButton: {
    backgroundColor: '#FF6B6B',
    padding: 15,
    borderRadius: 5,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dangerButtonText: {
    color: '#fff',
    fontWeight: '600',
    marginLeft: 10,
  },
});

export default ProfileScreen;