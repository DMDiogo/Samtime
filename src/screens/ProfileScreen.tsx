import React from 'react';
import { View, StyleSheet, Text } from 'react-native';

const ProfileScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Perfil da Empresa</Text>
      
      <View style={styles.infoCard}>
        <Text style={styles.label}>Nome da Empresa</Text>
        <Text style={styles.value}>Tech Solutions Ltda</Text>
      </View>
      
      <View style={styles.infoCard}>
        <Text style={styles.label}>CNPJ</Text>
        <Text style={styles.value}>12.345.678/0001-99</Text>
      </View>
      
      <View style={styles.infoCard}>
        <Text style={styles.label}>Endereço</Text>
        <Text style={styles.value}>Rua Exemplo, 123 - Centro</Text>
      </View>
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
    marginBottom: 30,
  },
  infoCard: {
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  value: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
});

export default ProfileScreen;