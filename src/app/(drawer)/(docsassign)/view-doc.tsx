import React from 'react'
import WebView from 'react-native-webview';
import { useLocalSearchParams } from 'expo-router'

export default function ViewDoc() {

  const params = useLocalSearchParams();
  const data = params?.document as string;

  return (
    <WebView source={{ uri: data }} allowFileAccess={true} />
  )
}