import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import SettingsScreen from '../screens/SettingsScreen';
import ProfileScreen from '../screens/ProfileScreen';

// Define os parâmetros para as rotas de configurações
export type SettingsStackParamList = {
  Settings: undefined;
  Profile: undefined;
  Security: undefined;
  Notifications: undefined;
  Help: undefined;
  About: undefined;
};

const Stack = createStackNavigator<SettingsStackParamList>();

const SettingsNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Settings" component={SettingsScreen} />
      <Stack.Screen name="Profile" component={ProfileScreen} />
      {/* As telas abaixo seriam implementadas futuramente */}
      {/* <Stack.Screen name="Security" component={SecurityScreen} /> */}
      {/* <Stack.Screen name="Notifications" component={NotificationsScreen} /> */}
      {/* <Stack.Screen name="Help" component={HelpScreen} /> */}
      {/* <Stack.Screen name="About" component={AboutScreen} /> */}
    </Stack.Navigator>
  );
};

export default SettingsNavigator; 