import { View, Text } from 'react-native'
import React, { useEffect, useState } from 'react'
import { ScreenLayout } from '@/components/layouts/ScreenLayout'
import { FilePenLineIcon } from 'lucide-react-native'
import { useAuth } from '@/contexts/AuthContext'
import appservice from '@/services/appservice'
import docscanner from '@/services/docscanner'
import { AssignDocsProps } from '@/types/app-types'
import { Button } from '@/components/Button'
import { router } from 'expo-router'
import { PageHeader } from '@/components/PageHeader'

export default function DocsAssign() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [assignDocs, setAssignDocs] = useState<AssignDocsProps[]>([]);

  useEffect(() => {

    const getAssignDocs = async () => {
      try {
        const response = await docscanner.post('(WS_SIGNATURES_BY_CUSTOMER)', {
          code: user?.codigoCliente
        });
        const { signatures } = response.data.response;
        
        if (signatures === undefined) {
          setAssignDocs([]);
          return;
        }

        setAssignDocs(signatures);

      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    getAssignDocs();
  }, [user]);

  return (
    <ScreenLayout backgroundColor='bg-solar-blue-primary'>

      <View className='flex-1 flex-col items-center justify-start'>
        <View className='w-full flex-1 bg-white rounded-t-3xl p-6 flex-col justify-start items-center gap-4'>

          <PageHeader
            title="Assinar documentos"
            subtitle="Revise e assine com rapidez"
            description="Confira abaixo os documentos disponíveis para assinatura."
            icon={<FilePenLineIcon size={26} color="#1a9cd9" />}
          />

          {assignDocs?.length < 1 && (
            <View className='flex-1'>
              <Text className='text-gray-800 font-semibold'>
                Nenhum documento disponível
              </Text>
              <Text className='text-gray-500 text-sm'>
                Não há documentos para assinatura no momento.
              </Text>
            </View>
          )}

          {assignDocs?.map((doc: AssignDocsProps, idx: number) => (
            <View
              key={idx}
              className="w-full bg-white rounded-xl border border-gray-200 p-3 mb-3"
            >

              <View className="flex-row flex-wrap justify-between gap-y-1 mb-2">
                <Text className="text-xs text-gray-500">
                  Data
                  <Text className="text-sm text-gray-900 font-semibold"> {doc.date}</Text>
                </Text>

                <Text className="text-xs text-gray-500">
                  NF
                  <Text className="text-sm text-gray-900 font-semibold"> {doc.number}</Text>
                </Text>

                <Text className="text-xs text-gray-500">
                  Série
                  <Text className="text-sm text-gray-900 font-semibold"> {doc.serie}</Text>
                </Text>

                <Text className="text-xs text-gray-500">
                  Filial
                  <Text className="text-sm text-gray-900 font-semibold"> {doc.origin}</Text>
                </Text>
              </View>

              <View className="h-px bg-gray-200 my-2" />

              <View className="mb-3">
                <Text className="text-xs text-gray-500 mb-1">
                  Documento
                </Text>
                <Text
                  className="text-sm text-blue-600 font-medium"
                  numberOfLines={1}
                >
                  {doc.link}
                </Text>
              </View>

              <View className="flex-row justify-end">
                <Button
                  label="Assinar"
                  onPress={() =>
                    router.navigate({
                      pathname: "/view-doc",
                      params: { document: doc.link },
                    })
                  }
                  className="px-4 py-2 rounded-lg"
                  labelClasses="text-white text-sm font-semibold"
                />
              </View>
            </View>
          ))}

        </View>
      </View>
    </ScreenLayout>
  )
}