import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import EmployeesScreen from '../screens/EmployeesScreen';
import AddEmployeeScreen from '../screens/AddEmployeeScreen';

// Define os parâmetros para as rotas de funcionários
export type EmployeesStackParamList = {
  Employees: undefined;
  AddEmployee: {
    empresa_id: number;
  };
};

const Stack = createStackNavigator<EmployeesStackParamList>();

const EmployeesNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Employees" component={EmployeesScreen} />
      <Stack.Screen name="AddEmployee" component={AddEmployeeScreen} />
    </Stack.Navigator>
  );
};

export default EmployeesNavigator; 