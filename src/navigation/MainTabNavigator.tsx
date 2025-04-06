import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import HomeScreen from '../screens/HomeScreen';
import ReportsScreen from '../screens/ReportsScreen';
import SettingsNavigator from './SettingsNavigator';
import EmployeesNavigator from './EmployeesNavigator';
import { RouteProp } from '@react-navigation/native';
import { Platform, Dimensions, StyleSheet } from 'react-native';

const Tab = createBottomTabNavigator();
const { width, height } = Dimensions.get('window');

// Ajustar tamanhos baseados na largura da tela
const isSmallDevice = width < 375;
const isMediumDevice = width >= 375 && width < 768;
const isLargeDevice = width >= 768;

// Calcular os tamanhos
const getTabIconSize = () => {
  if (isSmallDevice) return 22;
  if (isMediumDevice) return 24;
  return 28; // isLargeDevice
};

const getTabBarHeight = () => {
  if (isSmallDevice) return 55;
  if (isMediumDevice) return 60;
  return 65; // isLargeDevice
};

const getLabelFontSize = () => {
  if (isSmallDevice) return 11;
  if (isMediumDevice) return 12;
  return 14; // isLargeDevice
};

export default function MainTabNavigator() {
  // Calcular as dimensões
  const iconSize = getTabIconSize();
  const tabBarHeight = getTabBarHeight();
  const labelFontSize = getLabelFontSize();

  return (
    <Tab.Navigator
      screenOptions={({ route }: { route: RouteProp<Record<string, object | undefined>, string> }) => ({
        headerShown: false,
        tabBarActiveTintColor: '#3EB489',
        tabBarInactiveTintColor: '#86939e',
        tabBarStyle: {
          height: tabBarHeight,
          paddingTop: Platform.OS === 'android' ? 5 : 0,
          paddingBottom: Platform.OS === 'android' ? 5 : 25,
          ...styles.tabBar
        },
        tabBarLabelStyle: {
          fontSize: labelFontSize,
          paddingBottom: Platform.OS === 'android' ? 3 : 0,
        },
        tabBarIcon: ({ color }: { color: string; size: number }) => {
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

          return <Ionicons name={iconName as any} size={iconSize} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Início" component={HomeScreen} />
      <Tab.Screen name="Funcionários" component={EmployeesNavigator} />
      <Tab.Screen name="Relatórios" component={ReportsScreen} />
      <Tab.Screen name="Configurações" component={SettingsNavigator} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    elevation: 8,
    shadowOpacity: 0.1,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: -3 },
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  }
});