import React from 'react'
import {
  ActivityIndicator,
  Dimensions,
  Platform,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import { ScreenLayout } from '@/components/layouts/ScreenLayout'
import { PageHeader } from '@/components/PageHeader'
import { Link2Icon, LinkIcon, ShieldUserIcon } from 'lucide-react-native'
import WebView from 'react-native-webview';
import * as WebBrowser from 'expo-web-browser';

export default function PrivacyPolice() {

  const VIEW_WIDTH = Dimensions.get('window').width;

  function LoadingIndicatorView() {
    return (
      <ActivityIndicator
        size="large"
        color={'#0d3b85'}
        animating={true}
      />
    );
  }
  const dataHtml = {
    uri: 'http://services.gruposolar.com.br:8082/midias/img/politica.html',
  };

  let colorBar = Platform.OS === 'ios' ? 'rgba(0, 162, 227, 0)' : '#1a9cd9';
  const handlePressButtonAsync = async (url: any) => {
    let result = await WebBrowser.openBrowserAsync(url, {
      toolbarColor: colorBar,
      controlsColor: '#FFF',
    });
  };

  return (
    <ScreenLayout backgroundColor='bg-solar-blue-primary'>
      <View className='flex-1 flex-col items-center justify-start'>
        <View className='w-full flex-1 bg-white rounded-t-3xl p-6 flex-col justify-start items-center gap-4'>

          <PageHeader
            title="Privacidade"
            subtitle="Politica de privacidade"
            description="Como utilizamos os dados de clientes coletados no App Lojas Solar."
            icon={<ShieldUserIcon size={26} color="#1a9cd9" />}
          />
          <View className='flex-1 bg-gray-50 border border-gray-200 rounded-lg'>
            {dataHtml && (
              <WebView
                originWhitelist={['*']}
                source={dataHtml}
                renderLoading={LoadingIndicatorView}
                startInLoadingState={true}
                style={{
                  flex: 1,
                  width: VIEW_WIDTH - 40,
                  marginTop: 20,
                }}
                javaScriptEnabled={true}
                domStorageEnabled={true}
              />
            )}

          </View>
          <View className="py-4 w-full">
            <Text className="text-xs text-center font-PoppinsRegular">
              Para saber mais sobre nossa política de privacidade acesse
            </Text>
            <TouchableOpacity
              className="flex-row items-center justify-center"
              onPress={() =>
                handlePressButtonAsync(
                  'https://www.lojasolar.com.br/duvidas?page=politica-de-privacidade',
                )
              }
            >
              <LinkIcon size={22} color={'#0d3b85'} />
              <Text className="pl-2 text-xs text-solar-blue-secondary text-center font-PoppinsRegular py-2 underline">
                Política de privacidade Lojas Solar
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScreenLayout>
  )
}