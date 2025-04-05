import React from 'react';
import { StatusBar, ViewStyle, StyleSheet } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { getTheme } from './theme';

interface ThemeWrapperProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

const ThemeWrapper: React.FC<ThemeWrapperProps> = ({ children, style }) => {
  const { theme } = useTheme();
  const currentTheme = getTheme(theme);
  
  // Aplicar o tema ao StatusBar
  return (
    <>
      <StatusBar 
        barStyle={currentTheme.colors.statusBar as any} 
        backgroundColor={currentTheme.colors.background}
      />
      {children}
    </>
  );
};

export default ThemeWrapper; 