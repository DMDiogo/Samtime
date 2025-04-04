// src/global/colors.ts
// src/global/colors.ts
export const colors = {
    primary: '#3EB489', // A cor predominante solicitada
    white: '#FFFFFF',
    background: '#F5F5F5',
    text: '#333333',
    lightGray: '#E0E0E0',
    mediumGray: '#9E9E9E',
    darkGray: '#616161',
    error: '#D32F2F',
    success: '#388E3C',
    warning: '#FFA000',
    info: '#1976D2'
};
  // src/global/styles.ts
  import { StyleSheet } from 'react-native';
  import { colors } from './colors';
  
  export const globalStyles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.white,
    },
    safeArea: {
      flex: 1,
      backgroundColor: colors.white,
    },
    contentContainer: {
      padding: 16,
    },
    card: {
      backgroundColor: colors.white,
      borderRadius: 8,
      padding: 16,
      marginVertical: 8,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      color: colors.text,
      marginBottom: 16,
    },
    subtitle: {
      fontSize: 18,
      fontWeight: '600',
      color: colors.text,
      marginBottom: 8,
    },
    text: {
      fontSize: 16,
      color: colors.text,
    },
    button: {
      backgroundColor: colors.primary,
      paddingVertical: 12,
      paddingHorizontal: 16,
      borderRadius: 8,
      alignItems: 'center',
      justifyContent: 'center',
    },
    buttonText: {
      color: colors.white,
      fontSize: 16,
      fontWeight: '600',
    },
    input: {
      backgroundColor: colors.white,
      borderWidth: 1,
      borderColor: colors.lightGray,
      borderRadius: 8,
      padding: 12,
      marginBottom: 16,
    },
    shadow: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    }
  });