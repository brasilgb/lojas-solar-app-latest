import { Platform, type ViewStyle } from 'react-native';

export const softCardShadow: ViewStyle = Platform.select({
  ios: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
  },
  android: {
    elevation: 2,
  },
  default: {},
}) as ViewStyle;

export const softFloatingShadow: ViewStyle = Platform.select({
  ios: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  android: {
    elevation: 8,
  },
  default: {},
}) as ViewStyle;
