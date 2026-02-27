import { View, Text, ScrollView } from 'react-native'
import React from 'react'
import { ScreenLayout } from '@/components/layouts/ScreenLayout'
import { PageHeader } from '@/components/PageHeader'
import { CircleQuestionMarkIcon } from 'lucide-react-native'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/Tabs'
import Comercial from './comercial'
import Crediario from './crediario'

export default function Questions() {
  return (
    <ScreenLayout backgroundColor='bg-solar-blue-primary'>
      <View className='flex-1 bg-white rounded-t-3xl p-6'>

        <PageHeader
          title="Perguntas Frequentes"
          subtitle="Está com dúvidas sobre as Lojas Solar?"
          description="Elaboramos respostas para as dúvidas mais frequentes, selecione o assunto e confira."
          icon={<CircleQuestionMarkIcon size={26} color="#1a9cd9" />}
        />

        <ScrollView className="flex-1">
          <View className="flex-1">
            <Tabs defaultValue="comercial">
              <TabsList>
                <TabsTrigger
                  id="comercial"
                  title="Comercial"
                  value="comercial"
                />
                <TabsTrigger
                  id="crediario"
                  title="Crediário"
                  value="crediario"
                />
              </TabsList>

              <TabsContent value="comercial" className="flex-1">
                <Comercial />
              </TabsContent>

              <TabsContent value="crediario" className="flex-1">
                <Crediario />
              </TabsContent>
            </Tabs>
          </View>
        </ScrollView>

      </View>

    </ScreenLayout>
  )
}