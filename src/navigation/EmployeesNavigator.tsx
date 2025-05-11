import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import EmployeesScreen from '../screens/EmployeesScreen';
// Removendo o import da tela de adicionar funcionários
// import AddEmployeeScreen from '../screens/AddEmployeeScreen';

// Define os parâmetros para as rotas de funcionários
export type EmployeesStackParamList = {
  Employees: undefined;
  // Removendo a rota de adicionar funcionários
  // AddEmployee: {
  //   empresa_id: number;
  // };
};

const Stack = createStackNavigator<EmployeesStackParamList>();

const EmployeesNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Employees" component={EmployeesScreen} />
      {/* Removendo a tela de adicionar funcionários */}
      {/* <Stack.Screen name="AddEmployee" component={AddEmployeeScreen} /> */}
    </Stack.Navigator>
  );
};

export default EmployeesNavigator; 