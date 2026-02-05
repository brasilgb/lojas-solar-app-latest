import React, { useEffect } from 'react';
import { Platform, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import * as NavigationBar from 'expo-navigation-bar';

interface ScreenLayoutProps {
  children: React.ReactNode;
  lightMode?: boolean;
  backgroundColor?: string;
}

export function ScreenLayout({
  children,
  lightMode = true,
  backgroundColor = '#FFFFFF',
}: ScreenLayoutProps) {

  useEffect(() => {
    if (Platform.OS === 'android') {
      NavigationBar.setButtonStyleAsync(lightMode ? 'light' : 'dark');
    }
  }, [lightMode]);

  return (
    <View className={`flex-1 ${backgroundColor}`}>
      <StatusBar style={lightMode ? 'light' : 'dark'} />
      <View style={{ flex: 1 }}>
        {children}
      </View>
    </View>
  );
}