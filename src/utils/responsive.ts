import { Dimensions, Platform, PixelRatio } from 'react-native';

// Obter dimensões da tela
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Pontos de quebra para diferentes tamanhos de dispositivo
const isSmallDevice = SCREEN_WIDTH < 375;
const isMediumDevice = SCREEN_WIDTH >= 375 && SCREEN_WIDTH < 768;
const isLargeDevice = SCREEN_WIDTH >= 768;

// Tamanho base para escala (iPhone 8/SE/X como referência)
const baseWidth = 375;

// Função para calcular tamanhos de fonte responsivos
export const scaleFontSize = (size: number): number => {
  if (isSmallDevice) return Math.round(size * 0.85);
  if (isMediumDevice) return size;
  return Math.round(size * 1.15); // para dispositivos grandes
};

// Função para calcular dimensões responsivas (margens, padding, etc)
export const scaleSize = (size: number): number => {
  const scale = SCREEN_WIDTH / baseWidth;
  const newSize = size * scale;
  return Math.round(newSize);
};

// Função para calcular altura responsiva
export const scaleHeight = (size: number): number => {
  const scale = SCREEN_HEIGHT / 812; // 812 é a altura do iPhone X
  const newSize = size * scale;
  return Math.round(newSize);
};

// Função auxiliar para ajustar tamanhos de botões/ícones
export const scaleIconSize = (size: number): number => {
  if (isSmallDevice) return Math.round(size * 0.9);
  if (isMediumDevice) return size;
  return Math.round(size * 1.1);
};

// Dimensões padrão para componentes de interface comuns
export const standardSizes = {
  tabBarHeight: isSmallDevice ? 55 : isMediumDevice ? 60 : 65,
  headerHeight: Platform.OS === 'ios' ? 44 : 56,
  statusBarHeight: Platform.OS === 'ios' ? 20 : 0,
  inputHeight: scaleSize(46),
  buttonHeight: scaleSize(50),
  borderRadius: 8,
  iconSize: {
    small: scaleIconSize(16),
    medium: scaleIconSize(24),
    large: scaleIconSize(32),
  },
  padding: {
    small: scaleSize(8),
    medium: scaleSize(16),
    large: scaleSize(24),
  },
  margin: {
    small: scaleSize(8),
    medium: scaleSize(16),
    large: scaleSize(24),
  },
  fontSize: {
    small: scaleFontSize(12),
    regular: scaleFontSize(14),
    medium: scaleFontSize(16),
    large: scaleFontSize(18),
    xlarge: scaleFontSize(20),
    xxlarge: scaleFontSize(24),
    xxxlarge: scaleFontSize(32),
  }
};

// Informações sobre o dispositivo
export const deviceInfo = {
  isSmallDevice,
  isMediumDevice,
  isLargeDevice,
  isIOS: Platform.OS === 'ios',
  isAndroid: Platform.OS === 'android',
  width: SCREEN_WIDTH,
  height: SCREEN_HEIGHT,
  pixelDensity: PixelRatio.get(),
  fontScale: PixelRatio.getFontScale(),
};

export default {
  scaleFontSize,
  scaleSize,
  scaleHeight,
  scaleIconSize,
  standardSizes,
  deviceInfo,
}; 