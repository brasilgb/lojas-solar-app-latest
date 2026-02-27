import { View, Text, Image, Alert, TouchableOpacity } from 'react-native'
import React from 'react'
import { Button } from '@/components/Button'
import { ArrowLeftIcon, LogInIcon, LogOutIcon, MenuIcon, UserMinus2Icon } from 'lucide-react-native'
import { DrawerActions, useNavigation } from '@react-navigation/native'
import { useAuth } from '@/contexts/AuthContext'
import { router } from 'expo-router'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

export default function DrawerHeader({ typel, typer }: any) {
  const { signOut, signedIn } = useAuth();

  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  return (
    <View
      style={{
        paddingTop: insets.top,
        paddingBottom: 12,
        paddingHorizontal: 16,
      }}
      className="bg-solar-blue-primary flex-row items-center justify-between"
    >

      <View className="w-12 items-start">
        {typel === 'stack' && (
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            className="p-2"
          >
            <ArrowLeftIcon color="white" size={24} />
          </TouchableOpacity>
        )}

        {typel === 'drawer' && (
          <TouchableOpacity
            onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
            className="p-2"
          >
            <MenuIcon color="white" size={24} />
          </TouchableOpacity>
        )}
      </View>

      <View className="flex-1 items-center justify-center">
        <Image
          source={require('@/assets/images/logo_lojas_solar.png')}
          resizeMode="contain"
          style={{ width: 160, height: 36 }}
        />
      </View>

      <View className="w-12 items-end">
        {typer === 'drawer' && (
          signedIn ? (
            <TouchableOpacity
              onPress={signOut}
              className="p-2"
            >
              <LogOutIcon color="white" size={22} />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              onPress={() => router.push('/sign-in')}
              className="p-2"
            >
              <LogInIcon color="white" size={22} />
            </TouchableOpacity>
          )
        )}

        {typer === 'exclude' && (
          <TouchableOpacity
            onPress={() =>
              Alert.alert(
                'Exclusão de dados',
                'Vamos direcioná-lo para o processo de exclusão de dados.',
                [
                  { text: 'Cancelar', style: 'cancel' },
                  { text: 'Ok', onPress: () => router.push('/data-exclude') },
                ]
              )
            }
            className="p-2"
          >
            <UserMinus2Icon color="white" size={22} />
          </TouchableOpacity>
        )}
      </View>

    </View>
  )
}