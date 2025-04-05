import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import HomeScreen from '../screens/HomeScreen';
import EmployeesScreen from '../screens/EmployeesScreen';
import ReportsScreen from '../screens/ReportsScreen';
import SettingsNavigator from './SettingsNavigator';
import { RouteProp } from '@react-navigation/native';

const Tab = createBottomTabNavigator();

export default function MainTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }: { route: RouteProp<Record<string, object | undefined>, string> }) => ({
        headerShown: false,
        tabBarActiveTintColor: '#3EB489',
        tabBarInactiveTintColor: '#86939e',
        tabBarIcon: ({ color, size }: { color: string; size: number }) => {
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
      <Tab.Screen name="Configurações" component={SettingsNavigator} />
    </Tab.Navigator>
  );
}