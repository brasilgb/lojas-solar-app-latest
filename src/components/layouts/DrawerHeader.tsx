import { View, Text, Image, Alert } from 'react-native'
import React from 'react'
import { Button } from '@/components/Button'
import { ArrowLeftIcon, LogInIcon, LogOutIcon, MenuIcon, UserMinus2Icon } from 'lucide-react-native'
import { DrawerActions, useNavigation } from '@react-navigation/native'
import { useAuth } from '@/contexts/AuthContext'
import { router } from 'expo-router'

export default function DrawerHeader({ typel, typer }: any) {
  const { signOut, signedIn } = useAuth();

  const navigation = useNavigation();

  return (
    <View className="bg-solar-blue-primary h-24 flex-row items-center justify-between">
      <View className='w-[15%] flex-row items-center justify-start'>
        {typel === 'stack' &&
          <Button
            label={<ArrowLeftIcon color={'white'} />}
            onPress={() => navigation.goBack()}
          />
        }
        {typel === 'drawer' &&
          <Button
            label={<MenuIcon color={'white'} />}
            onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
          />
        }
      </View>
      <View className='w-[70%] flex-row items-center justify-center'>
        <Image
          source={require('@/assets/images/logo_lojas_solar.png')}
          style={{ width: 220, height: 40 }}
        />
      </View>
      <View className='w-[15%] flex-row items-center justify-end'>
        {typer === 'stack' &&
          <Button
            label={<ArrowLeftIcon color={'white'} />}
            onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
          />
        }
        {typer === 'drawer' &&
          (
            signedIn
              ?
              <Button
                label={<LogOutIcon color={'white'} />}
                onPress={() => signOut()}
              />
              :
              <Button
                label={<LogInIcon color={'white'} />}
                onPress={() => router.push('/sign-in')}
              />
          )
        }
        {typer === 'exclude' &&
          <Button
            label={<UserMinus2Icon color={'white'} />}
            onPress={() =>
              Alert.alert('Exclusão de dados', 'Vamos direcioná-lo para o processo de exclusão de dados.', [
                {
                  text: 'Cancelar',
                  style: 'cancel',
                },
                { text: 'Ok', onPress: () => router.push('/data-exclude') },
              ])
            }
          />
        }
      </View>
    </View>
  )
}