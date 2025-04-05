import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { SettingsStackParamList } from '../navigation/SettingsNavigator';
import { useTheme } from '../context/ThemeContext';
import { getTheme } from '../theme/theme';

type SettingsScreenNavigationProp = StackNavigationProp<SettingsStackParamList, 'Settings'>;

const SettingsScreen = () => {
  const navigation = useNavigation<SettingsScreenNavigationProp>();
  const { theme, toggleTheme, isDarkMode } = useTheme();
  const currentTheme = getTheme(theme);
  
  const [notifications, setNotifications] = React.useState(true);
  const [biometricLogin, setBiometricLogin] = React.useState(true);
  const [autoSync, setAutoSync] = React.useState(true);

  return (
    <View style={[styles.container, { backgroundColor: currentTheme.colors.background }]}>
      <Text style={[styles.title, { color: currentTheme.colors.primary }]}>Configurações</Text>
      
      <ScrollView style={styles.scrollView}>
        {/* Seção de Conta */}
        <View style={[styles.section, { borderColor: currentTheme.colors.border }]}>
          <Text style={[styles.sectionTitle, { color: currentTheme.colors.text }]}>Conta</Text>
          
          <TouchableOpacity 
            style={[styles.settingRow, { borderBottomColor: currentTheme.colors.divider }]}
            onPress={() => navigation.navigate('Profile')}
          >
            <View style={styles.settingInfo}>
              <Ionicons name="person-outline" size={24} color={currentTheme.colors.icon} />
              <Text style={[styles.settingLabel, { color: currentTheme.colors.text }]}>Perfil</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={currentTheme.colors.iconSecondary} />
          </TouchableOpacity>
          
          <TouchableOpacity style={[styles.settingRow, { borderBottomColor: currentTheme.colors.divider }]}>
            <View style={styles.settingInfo}>
              <Ionicons name="shield-outline" size={24} color={currentTheme.colors.icon} />
              <Text style={[styles.settingLabel, { color: currentTheme.colors.text }]}>Segurança</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={currentTheme.colors.iconSecondary} />
          </TouchableOpacity>
          
          <TouchableOpacity style={[styles.settingRow, { borderBottomColor: currentTheme.colors.divider }]}>
            <View style={styles.settingInfo}>
              <Ionicons name="notifications-outline" size={24} color={currentTheme.colors.icon} />
              <Text style={[styles.settingLabel, { color: currentTheme.colors.text }]}>Notificações</Text>
            </View>
            <Switch
              trackColor={{ false: "#ddd", true: currentTheme.colors.primary }}
              thumbColor="#fff"
              onValueChange={() => setNotifications(!notifications)}
              value={notifications}
            />
          </TouchableOpacity>
        </View>
        
        {/* Seção de Aplicativo */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: currentTheme.colors.text }]}>Aplicativo</Text>
          
          <TouchableOpacity style={[styles.settingRow, { borderBottomColor: currentTheme.colors.divider }]}>
            <View style={styles.settingInfo}>
              <Ionicons name="finger-print-outline" size={24} color={currentTheme.colors.icon} />
              <Text style={[styles.settingLabel, { color: currentTheme.colors.text }]}>Login Biométrico</Text>
            </View>
            <Switch
              trackColor={{ false: "#ddd", true: currentTheme.colors.primary }}
              thumbColor="#fff"
              onValueChange={() => setBiometricLogin(!biometricLogin)}
              value={biometricLogin}
            />
          </TouchableOpacity>
          
          <TouchableOpacity style={[styles.settingRow, { borderBottomColor: currentTheme.colors.divider }]}>
            <View style={styles.settingInfo}>
              <Ionicons name="moon-outline" size={24} color={currentTheme.colors.icon} />
              <Text style={[styles.settingLabel, { color: currentTheme.colors.text }]}>Modo Escuro</Text>
            </View>
            <Switch
              trackColor={{ false: "#ddd", true: currentTheme.colors.primary }}
              thumbColor="#fff"
              onValueChange={toggleTheme}
              value={isDarkMode}
            />
          </TouchableOpacity>
          
          <TouchableOpacity style={[styles.settingRow, { borderBottomColor: currentTheme.colors.divider }]}>
            <View style={styles.settingInfo}>
              <Ionicons name="sync-outline" size={24} color={currentTheme.colors.icon} />
              <Text style={[styles.settingLabel, { color: currentTheme.colors.text }]}>Sincronização Automática</Text>
            </View>
            <Switch
              trackColor={{ false: "#ddd", true: currentTheme.colors.primary }}
              thumbColor="#fff"
              onValueChange={() => setAutoSync(!autoSync)}
              value={autoSync}
            />
          </TouchableOpacity>
        </View>
        
        {/* Seção de Suporte */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: currentTheme.colors.text }]}>Suporte</Text>
          
          <TouchableOpacity style={[styles.settingRow, { borderBottomColor: currentTheme.colors.divider }]}>
            <View style={styles.settingInfo}>
              <Ionicons name="help-circle-outline" size={24} color={currentTheme.colors.icon} />
              <Text style={[styles.settingLabel, { color: currentTheme.colors.text }]}>Ajuda</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={currentTheme.colors.iconSecondary} />
          </TouchableOpacity>
          
          <TouchableOpacity style={[styles.settingRow, { borderBottomColor: currentTheme.colors.divider }]}>
            <View style={styles.settingInfo}>
              <Ionicons name="information-circle-outline" size={24} color={currentTheme.colors.icon} />
              <Text style={[styles.settingLabel, { color: currentTheme.colors.text }]}>Sobre</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={currentTheme.colors.iconSecondary} />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 40,
    marginBottom: 20,
  },
  scrollView: {
    flex: 1,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingLabel: {
    fontSize: 16,
    marginLeft: 12,
  },
});

export default SettingsScreen;