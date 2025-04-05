import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from './src/screens/HomeScreen';
import EmployeesScreen from './src/screens/EmployeesScreen';
import ReportsScreen from './src/screens/ReportsScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import { Ionicons } from '@expo/vector-icons';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <View style={styles.container}>
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={({ route }) => ({
            headerShown: false,
            tabBarStyle: styles.tabBar,
            tabBarActiveTintColor: '#3EB489',
            tabBarInactiveTintColor: '#86939e',
            tabBarLabelStyle: styles.tabBarLabel,
            tabBarIcon: ({ color, size }) => {
              let iconName: string = '';

              if (route.name === 'Início') {
                iconName = 'home-outline';
              } else if (route.name === 'Funcionários') {
                iconName = 'people-outline';
              } else if (route.name === 'Relatórios') {
                iconName = 'bar-chart-outline';
              } else if (route.name === 'Configurações') {
                iconName = 'settings-outline';
              }

              return <Ionicons name={iconName as any} size={size} color={color} />;
            },
          })}
        >
          <Tab.Screen name="Início" component={HomeScreen} />
          <Tab.Screen name="Funcionários" component={EmployeesScreen} />
          <Tab.Screen name="Relatórios" component={ReportsScreen} />
          <Tab.Screen name="Configurações" component={SettingsScreen} />
        </Tab.Navigator>
      </NavigationContainer>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  tabBar: {
    height: 60,
    paddingBottom: 5,
    paddingTop: 5,
  },
  tabBarLabel: {
    fontSize: 12,
  },
});