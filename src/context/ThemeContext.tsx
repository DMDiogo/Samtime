import React, { createContext, useState, useContext, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

type ThemeType = 'light' | 'dark';

interface ThemeContextProps {
  theme: ThemeType;
  isDarkMode: boolean;
  toggleTheme: () => void;
  setTheme: (theme: ThemeType) => void;
}

const ThemeContext = createContext<ThemeContextProps>({
  theme: 'light',
  isDarkMode: false,
  toggleTheme: () => {},
  setTheme: () => {},
});

export const ThemeProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const deviceTheme = useColorScheme();
  const [theme, setTheme] = useState<ThemeType>('light');
  
  // Buscar tema salvo nas preferências do usuário
  useEffect(() => {
    const loadTheme = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem('@theme');
        if (savedTheme) {
          setTheme(savedTheme as ThemeType);
        } else {
          // Usar o tema do dispositivo como padrão, se disponível
          setTheme(deviceTheme === 'dark' ? 'dark' : 'light');
        }
      } catch (error) {
        console.log('Erro ao carregar tema:', error);
      }
    };
    
    loadTheme();
  }, [deviceTheme]);
  
  // Função para alternar entre temas
  const toggleTheme = async () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    
    try {
      await AsyncStorage.setItem('@theme', newTheme);
    } catch (error) {
      console.log('Erro ao salvar tema:', error);
    }
  };
  
  // Função para definir um tema específico
  const changeTheme = async (newTheme: ThemeType) => {
    setTheme(newTheme);
    
    try {
      await AsyncStorage.setItem('@theme', newTheme);
    } catch (error) {
      console.log('Erro ao salvar tema:', error);
    }
  };
  
  return (
    <ThemeContext.Provider 
      value={{ 
        theme, 
        isDarkMode: theme === 'dark',
        toggleTheme,
        setTheme: changeTheme
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);

export default ThemeContext; 