// Definição de temas para a aplicação

// Tema claro
export const lightTheme = {
  colors: {
    primary: '#3EB489',  // Verde principal 
    background: '#FFFFFF',
    card: '#FFFFFF',
    surface: '#F9F9F9',
    text: '#333333',
    textSecondary: '#666666',
    border: '#EEEEEE',
    notification: '#FF6B6B',
    error: '#FF6B6B',
    success: '#3EB489',
    warning: '#FFC107',
    info: '#2196F3',
    divider: '#EEEEEE',
    icon: '#3EB489',
    iconSecondary: '#666666',
    button: '#3EB489',
    buttonText: '#FFFFFF',
    inputBackground: '#FFFFFF',
    inputBorder: '#DDDDDD',
    shadow: 'rgba(0, 0, 0, 0.1)',
    overlay: 'rgba(0, 0, 0, 0.5)',
    tabBar: '#FFFFFF',
    tabBarInactive: '#86939E',
    statusBar: 'dark-content',
    
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 40
  },
  borderRadius: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    round: 999
  },
  typography: {
    fontSizes: {
      xs: 12,
      sm: 14,
      md: 16,
      lg: 18,
      xl: 20,
      xxl: 24,
      xxxl: 32
    },
    fontWeights: {
      regular: '400',
      medium: '500',
      semiBold: '600',
      bold: '700'
    }
  }
};

// Tema escuro
export const darkTheme = {
  colors: {
    primary: '#3EB489',  // Manter a cor principal para identidade visual
    background: '#121212',
    card: '#1E1E1E',
    surface: '#242424',
    text: '#E1E1E1',
    textSecondary: '#A0A0A0',
    border: '#333333',
    notification: '#FF6B6B',
    error: '#FF6B6B',
    success: '#3EB489',
    warning: '#FFC107',
    info: '#2196F3',
    divider: '#333333',
    icon: '#3EB489',
    iconSecondary: '#A0A0A0',
    button: '#3EB489',
    buttonText: '#FFFFFF',
    inputBackground: '#2C2C2C',
    inputBorder: '#444444',
    shadow: 'rgba(0, 0, 0, 0.3)',
    overlay: 'rgba(0, 0, 0, 0.7)',
    tabBar: '#1E1E1E',
    tabBarInactive: '#86939E',
    statusBar: 'light-content'
  },
  // Manter as mesmas dimensões e tipografia do tema claro para consistência
  spacing: lightTheme.spacing,
  borderRadius: lightTheme.borderRadius,
  typography: lightTheme.typography
};

// Função para obter o tema ativo
export const getTheme = (mode: 'light' | 'dark') => {
  return mode === 'dark' ? darkTheme : lightTheme;
};

export type Theme = typeof lightTheme;
export type ThemeColors = typeof lightTheme.colors; 