import React from 'react';
import { View, Text, ViewProps, TextProps, StyleSheet } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { getTheme } from '../theme/theme';

// Componente ThemedView que aplica os estilos do tema atual
export const ThemedView: React.FC<ViewProps> = ({ style, children, ...props }) => {
  const { theme } = useTheme();
  const currentTheme = getTheme(theme);
  
  return (
    <View 
      style={[{ backgroundColor: currentTheme.colors.background }, style]} 
      {...props}
    >
      {children}
    </View>
  );
};

// Componente ThemedText que aplica os estilos do tema atual
export const ThemedText: React.FC<TextProps & { type?: 'primary' | 'secondary' | 'title' | 'subtitle' }> = 
  ({ style, children, type = 'primary', ...props }) => {
  const { theme } = useTheme();
  const currentTheme = getTheme(theme);
  
  let textStyle = {};
  switch (type) {
    case 'primary':
      textStyle = { color: currentTheme.colors.text };
      break;
    case 'secondary':
      textStyle = { color: currentTheme.colors.textSecondary };
      break;
    case 'title':
      textStyle = { 
        color: currentTheme.colors.text, 
        fontSize: currentTheme.typography.fontSizes.xl,
        fontWeight: currentTheme.typography.fontWeights.bold
      };
      break;
    case 'subtitle':
      textStyle = { 
        color: currentTheme.colors.text, 
        fontSize: currentTheme.typography.fontSizes.lg,
        fontWeight: currentTheme.typography.fontWeights.semiBold
      };
      break;
  }
  
  return (
    <Text style={[textStyle, style]} {...props}>
      {children}
    </Text>
  );
};

// Componente ThemedCard que cria um cartão com estilo do tema atual
export const ThemedCard: React.FC<ViewProps> = ({ style, children, ...props }) => {
  const { theme } = useTheme();
  const currentTheme = getTheme(theme);
  
  return (
    <View 
      style={[
        styles.card, 
        { 
          backgroundColor: currentTheme.colors.card,
          borderColor: currentTheme.colors.border,
          shadowColor: currentTheme.colors.shadow
        }, 
        style
      ]} 
      {...props}
    >
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 8,
    padding: 16,
    marginVertical: 8,
    borderWidth: 1,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  }
});

export default {
  ThemedView,
  ThemedText,
  ThemedCard
}; 