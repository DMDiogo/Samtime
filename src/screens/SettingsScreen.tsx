import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch, ScrollView, Dimensions, Platform, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { SettingsStackParamList } from '../navigation/SettingsNavigator';
import { useTheme } from '../context/ThemeContext';
import { getTheme } from '../theme/theme';
import { scaleFontSize, scaleSize } from '../utils/responsive';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CommonActions } from '@react-navigation/native';

type SettingsScreenNavigationProp = StackNavigationProp<SettingsStackParamList, 'Settings'>;

const SettingsScreen = () => {
  const navigation = useNavigation<SettingsScreenNavigationProp>();
  const { theme, toggleTheme, isDarkMode } = useTheme();
  const currentTheme = getTheme(theme);
  
  const [notifications, setNotifications] = React.useState(true);
  const [autoSync, setAutoSync] = React.useState(true);

  // Funções para lidar com as opções de configuração
  const handleNotificationsToggle = () => {
    setNotifications(!notifications);
    // Aqui seria implementada a lógica para salvar a preferência de notificações
    Alert.alert('Notificações', notifications ? 'Notificações desativadas' : 'Notificações ativadas');
  };

  const handleAutoSyncToggle = () => {
    setAutoSync(!autoSync);
    // Aqui seria implementada a lógica para salvar a preferência de sincronização
    Alert.alert('Sincronização', autoSync ? 'Sincronização automática desativada' : 'Sincronização automática ativada');
  };

  const handleSecurityPress = () => {
    // Quando a tela de segurança for implementada, descomentar a linha abaixo
    // navigation.navigate('Security');
    Alert.alert('Segurança', 'Configurações de segurança da conta');
  };

  const handleHelpPress = () => {
    // Quando a tela de ajuda for implementada, descomentar a linha abaixo
    // navigation.navigate('Help');
    Alert.alert('Ajuda', 'Central de ajuda e suporte');
  };

  const handleAboutPress = () => {
    // Quando a tela sobre for implementada, descomentar a linha abaixo
    // navigation.navigate('About');
    Alert.alert('Sobre', 'Informações sobre o aplicativo Samtime');
  };

  const handleLogout = async () => {
    try {
      // Confirmação antes de sair
      Alert.alert(
        'Sair da Conta',
        'Tem certeza que deseja sair?',
        [
          {
            text: 'Cancelar',
            style: 'cancel',
          },
          {
            text: 'Sim, sair',
            onPress: async () => {
              // Remover o token de autenticação
              await AsyncStorage.removeItem('userToken');
              
              // Redefinir a navegação para a tela de login, removendo todas as telas da pilha
              navigation.dispatch(
                CommonActions.reset({
                  index: 0,
                  routes: [{ name: 'Login' }],
                })
              );
            },
          },
        ],
        { cancelable: true },
      );
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
      Alert.alert('Erro', 'Não foi possível encerrar a sessão. Tente novamente.');
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: currentTheme.colors.background }]}>
      <Text style={[styles.title, { color: currentTheme.colors.primary }]}>Configurações</Text>
      
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Seção de Conta */}
        <View style={[styles.section, { borderColor: currentTheme.colors.border }]}>
          <Text style={[styles.sectionTitle, { color: currentTheme.colors.text }]}>Conta</Text>
          
          <TouchableOpacity 
            style={[styles.settingRow, { borderBottomColor: currentTheme.colors.divider }]}
            onPress={() => navigation.navigate('Profile')}
          >
            <View style={styles.settingInfo}>
              <Ionicons name="person-outline" size={scaleSize(24)} color={currentTheme.colors.icon} />
              <Text style={[styles.settingLabel, { color: currentTheme.colors.text }]}>Perfil</Text>
            </View>
            <Ionicons name="chevron-forward" size={scaleSize(20)} color={currentTheme.colors.iconSecondary} />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.settingRow, { borderBottomColor: currentTheme.colors.divider }]}
            onPress={handleSecurityPress}
          >
            <View style={styles.settingInfo}>
              <Ionicons name="shield-outline" size={scaleSize(24)} color={currentTheme.colors.icon} />
              <Text style={[styles.settingLabel, { color: currentTheme.colors.text }]}>Segurança</Text>
            </View>
            <Ionicons name="chevron-forward" size={scaleSize(20)} color={currentTheme.colors.iconSecondary} />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.settingRow, { borderBottomColor: currentTheme.colors.divider }]}
            onPress={handleNotificationsToggle}
          >
            <View style={styles.settingInfo}>
              <Ionicons name="notifications-outline" size={scaleSize(24)} color={currentTheme.colors.icon} />
              <Text style={[styles.settingLabel, { color: currentTheme.colors.text }]}>Notificações</Text>
            </View>
            <Switch
              trackColor={{ false: "#ddd", true: currentTheme.colors.primary }}
              thumbColor="#fff"
              onValueChange={handleNotificationsToggle}
              value={notifications}
            />
          </TouchableOpacity>
        </View>
        
        {/* Seção de Aplicativo */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: currentTheme.colors.text }]}>Aplicativo</Text>
          
          <TouchableOpacity 
            style={[styles.settingRow, { borderBottomColor: currentTheme.colors.divider }]}
            onPress={toggleTheme}
          >
            <View style={styles.settingInfo}>
              <Ionicons name="moon-outline" size={scaleSize(24)} color={currentTheme.colors.icon} />
              <Text style={[styles.settingLabel, { color: currentTheme.colors.text }]}>Modo Escuro</Text>
            </View>
            <Switch
              trackColor={{ false: "#ddd", true: currentTheme.colors.primary }}
              thumbColor="#fff"
              onValueChange={toggleTheme}
              value={isDarkMode}
            />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.settingRow, { borderBottomColor: currentTheme.colors.divider }]}
            onPress={handleAutoSyncToggle}
          >
            <View style={styles.settingInfo}>
              <Ionicons name="sync-outline" size={scaleSize(24)} color={currentTheme.colors.icon} />
              <Text style={[styles.settingLabel, { color: currentTheme.colors.text }]}>Sincronização Automática</Text>
            </View>
            <Switch
              trackColor={{ false: "#ddd", true: currentTheme.colors.primary }}
              thumbColor="#fff"
              onValueChange={handleAutoSyncToggle}
              value={autoSync}
            />
          </TouchableOpacity>
        </View>
        
        {/* Seção de Suporte */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: currentTheme.colors.text }]}>Suporte</Text>
          
          <TouchableOpacity 
            style={[styles.settingRow, { borderBottomColor: currentTheme.colors.divider }]}
            onPress={handleHelpPress}
          >
            <View style={styles.settingInfo}>
              <Ionicons name="help-circle-outline" size={scaleSize(24)} color={currentTheme.colors.icon} />
              <Text style={[styles.settingLabel, { color: currentTheme.colors.text }]}>Ajuda</Text>
            </View>
            <Ionicons name="chevron-forward" size={scaleSize(20)} color={currentTheme.colors.iconSecondary} />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.settingRow, { borderBottomColor: currentTheme.colors.divider }]}
            onPress={handleAboutPress}
          >
            <View style={styles.settingInfo}>
              <Ionicons name="information-circle-outline" size={scaleSize(24)} color={currentTheme.colors.icon} />
              <Text style={[styles.settingLabel, { color: currentTheme.colors.text }]}>Sobre</Text>
            </View>
            <Ionicons name="chevron-forward" size={scaleSize(20)} color={currentTheme.colors.iconSecondary} />
          </TouchableOpacity>
        </View>

        {/* Botão de Logout */}
        <TouchableOpacity 
          style={[styles.logoutButton, { backgroundColor: currentTheme.colors.error }]}
          onPress={handleLogout}
        >
          <Ionicons name="log-out-outline" size={scaleSize(20)} color="#fff" />
          <Text style={styles.logoutButtonText}>Sair da Conta</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: scaleSize(20),
  },
  title: {
    fontSize: scaleFontSize(24),
    fontWeight: 'bold',
    marginTop: Platform.OS === 'ios' ? scaleSize(40) : scaleSize(20),
    marginBottom: scaleSize(20),
  },
  scrollView: {
    flex: 1,
  },
  section: {
    marginBottom: scaleSize(24),
  },
  sectionTitle: {
    fontSize: scaleFontSize(18),
    fontWeight: '600',
    marginBottom: scaleSize(16),
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: scaleSize(12),
    borderBottomWidth: 1,
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingLabel: {
    fontSize: scaleFontSize(16),
    marginLeft: scaleSize(12),
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: scaleSize(15),
    borderRadius: scaleSize(8),
    marginBottom: scaleSize(40),
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: scaleFontSize(16),
    fontWeight: '600',
    marginLeft: scaleSize(8),
  },
});

export default SettingsScreen;