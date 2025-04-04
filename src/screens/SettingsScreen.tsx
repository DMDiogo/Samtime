import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const SettingsScreen = () => {
  const [notifications, setNotifications] = React.useState(true);
  const [biometricLogin, setBiometricLogin] = React.useState(true);
  const [darkMode, setDarkMode] = React.useState(false);
  const [autoSync, setAutoSync] = React.useState(true);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Configurações</Text>
      
      <ScrollView style={styles.scrollView}>
        {/* Seção de Conta */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Conta</Text>
          
          <TouchableOpacity style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Ionicons name="person-outline" size={24} color="#3EB489" />
              <Text style={styles.settingLabel}>Perfil</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#666" />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Ionicons name="shield-outline" size={24} color="#3EB489" />
              <Text style={styles.settingLabel}>Segurança</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#666" />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Ionicons name="notifications-outline" size={24} color="#3EB489" />
              <Text style={styles.settingLabel}>Notificações</Text>
            </View>
            <Switch
              trackColor={{ false: "#ddd", true: "#3EB489" }}
              thumbColor="#fff"
              onValueChange={() => setNotifications(!notifications)}
              value={notifications}
            />
          </TouchableOpacity>
        </View>
        
        {/* Seção de Aplicativo */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Aplicativo</Text>
          
          <TouchableOpacity style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Ionicons name="finger-print-outline" size={24} color="#3EB489" />
              <Text style={styles.settingLabel}>Login Biométrico</Text>
            </View>
            <Switch
              trackColor={{ false: "#ddd", true: "#3EB489" }}
              thumbColor="#fff"
              onValueChange={() => setBiometricLogin(!biometricLogin)}
              value={biometricLogin}
            />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Ionicons name="moon-outline" size={24} color="#3EB489" />
              <Text style={styles.settingLabel}>Modo Escuro</Text>
            </View>
            <Switch
              trackColor={{ false: "#ddd", true: "#3EB489" }}
              thumbColor="#fff"
              onValueChange={() => setDarkMode(!darkMode)}
              value={darkMode}
            />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Ionicons name="sync-outline" size={24} color="#3EB489" />
              <Text style={styles.settingLabel}>Sincronização Automática</Text>
            </View>
            <Switch
              trackColor={{ false: "#ddd", true: "#3EB489" }}
              thumbColor="#fff"
              onValueChange={() => setAutoSync(!autoSync)}
              value={autoSync}
            />
          </TouchableOpacity>
        </View>
        
        {/* Seção de Suporte */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Suporte</Text>
          
          <TouchableOpacity style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Ionicons name="help-circle-outline" size={24} color="#3EB489" />
              <Text style={styles.settingLabel}>Ajuda</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#666" />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Ionicons name="information-circle-outline" size={24} color="#3EB489" />
              <Text style={styles.settingLabel}>Sobre</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#666" />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#3EB489',
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
    color: '#333',
    marginBottom: 16,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingLabel: {
    fontSize: 16,
    marginLeft: 12,
    color: '#333',
  },
});

export default SettingsScreen;