import { StyleSheet, View } from 'react-native';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import MainTabNavigator from './src/navigation/MainTabNavigator';
import { ThemeProvider, useTheme } from './src/context/ThemeContext';
import ThemeWrapper from './src/theme/ThemeWrapper';
import { getTheme } from './src/theme/theme';

const Stack = createStackNavigator();

// Componente interno para acessar o contexto de tema
const AppContent = () => {
  const { theme } = useTheme();
  const currentTheme = getTheme(theme);
  
  // Configurar temas de navegação baseados no tema atual
  const navigationTheme = {
    ...(theme === 'dark' ? DarkTheme : DefaultTheme),
    colors: {
      ...(theme === 'dark' ? DarkTheme.colors : DefaultTheme.colors),
      primary: currentTheme.colors.primary,
      background: currentTheme.colors.background,
      card: currentTheme.colors.card,
      text: currentTheme.colors.text,
      border: currentTheme.colors.border,
      notification: currentTheme.colors.notification,
    },
  };
  
  return (
    <View style={[styles.container, { backgroundColor: currentTheme.colors.background }]}>
      <NavigationContainer theme={navigationTheme}>
        <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
          <Stack.Screen name="Main" component={MainTabNavigator} />
        </Stack.Navigator>
      </NavigationContainer>
    </View>
  );
};

export default function App() {
  return (
    <ThemeProvider>
      <ThemeWrapper>
        <AppContent />
      </ThemeWrapper>
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});