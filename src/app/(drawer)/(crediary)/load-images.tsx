import React, { useEffect, useState } from 'react';
import {
    View, Text, ScrollView, Pressable,
    Image, Modal, Alert, TouchableOpacity,
    ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import * as SecureStore from 'expo-secure-store';
import appservice from '@/services/appservice';
import { useAuth } from '@/contexts/AuthContext';
import { ScreenLayout } from '@/components/layouts/ScreenLayout';
import { Button } from '@/components/Button';
import { router } from 'expo-router';
import { ImagePlusIcon, User2Icon } from 'lucide-react-native';

// Configuração dos documentos
const UPLOAD_CONFIG = [
    { key: 'selfCliente', label: 'Tire uma selfie', icon: require('@/assets/images/docs/selfie.png') },
    { key: 'imaDocumento', label: 'Tire uma foto do RG ou CNH', icon: require('@/assets/images/docs/document.png') },
    { key: 'imaAssinatura', label: 'Tire uma foto da sua assinatura', icon: require('@/assets/images/docs/signature.png') },
    { key: 'imaEndereco', label: 'Tire uma foto do comprovante de residência', icon: require('@/assets/images/docs/address.png') },
    { key: 'imaRenda', label: 'Tire uma foto do comprovante de renda', icon: require('@/assets/images/docs/voucher.png') },
];

const LoadImages = ({ route }: any) => {
    const navigation = useNavigation<any>();
    const { user } = route?.params || {};
    const { disconnect } = useAuth();

    const [modalVisible, setModalVisible] = useState(false);
    const [selectedType, setSelectedType] = useState<string>('');
    const [images, setImages] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState<boolean>(false)

    useEffect(() => {
        checkPermissions();
        loadStoredImages();
    }, []);

    const checkPermissions = async () => {
        const { granted } = await ImagePicker.requestCameraPermissionsAsync();
        if (!granted) Alert.alert('Permissão necessária', 'Precisamos de acesso à câmera.');
    };

    const loadStoredImages = async () => {
        try {
            const storageData = await SecureStore.getItemAsync('StoreImg');
            if (storageData) {
                const parsed = JSON.parse(storageData);
                const imageMap: Record<string, string> = {};
                parsed.forEach((item: any) => {
                    imageMap[item.key] = item.imageName;
                });
                setImages(imageMap);
            }
        } catch (e) { console.error(e); }
    };

    const handlePickImage = async (source: 'camera' | 'gallery') => {
        setModalVisible(false);

        const options: ImagePicker.ImagePickerOptions = {
            base64: true,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.7, // Reduzido para performance no upload
        };

        const result = source === 'camera'
            ? await ImagePicker.launchCameraAsync(options)
            : await ImagePicker.launchImageLibraryAsync(options);

        if (!result.canceled && result.assets[0]) {
            const asset = result.assets[0];
            updateImageState(selectedType, asset.uri, asset.base64 || '');
        }
    };

    const updateImageState = async (key: string, uri: string, base64?: string) => {
        setImages(prev => ({ ...prev, [key]: uri }));

        // Persistência Local
        const storageData = await SecureStore.getItemAsync('StoreImg');
        let currentList = storageData ? JSON.parse(storageData) : [];
        currentList = currentList.filter((item: any) => item.key !== key);
        currentList.push({ key, imageName: uri });
        await SecureStore.setItemAsync('StoreImg', JSON.stringify(currentList));

        // Upload API
        uploadImage(key, base64);
    };

    const uploadImage = async (key: string, base64?: string) => {
        setLoading(true);
        try {
            const payload = {
                token: user,
                selfCliente: key === 'selfCliente' ? base64 : '',
                Documento: key === 'imaDocumento' ? base64 : '',
                Assinatura: key === 'imaAssinatura' ? base64 : '',
                Endereco: key === 'imaEndereco' ? base64 : '',
                Renda: key === 'imaRenda' ? base64 : '',
            };

            const response = await appservice.post(`(WS_IMAGENS_CLIENTE)`, payload);
            const { success, message, token } = response.data.resposta;

            if (!token) {
                Alert.alert('Atenção', message, [{ text: 'Ok', onPress: () => { disconnect(); navigation.navigate('Home'); } }]);
            } else if (success) {
                Alert.alert('Sucesso', 'Imagem enviada com sucesso');
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const isFormComplete = UPLOAD_CONFIG.every(item => !!images[item.key]);

    return (
        <>
            <Modal animationType="slide" transparent visible={modalVisible} onRequestClose={() => setModalVisible(false)}>
                <View className="flex-1 items-center justify-end bg-[#0000007b]" onTouchEnd={() => setModalVisible(false)}>
                    <View className="bg-white w-full rounded-t-3xl p-6">
                        <Text className="text-xl text-solar-blue-secondary font-bold mb-4">Selecione a fonte</Text>
                        <View className="flex-row justify-around pb-10">
                            <SourceButton icon="camera" label="Câmera" onPress={() => handlePickImage('camera')} />
                            <SourceButton icon="image" label="Galeria" onPress={() => handlePickImage('gallery')} />
                        </View>
                    </View>
                </View>
            </Modal>

            <ScreenLayout backgroundColor='bg-solar-blue-primary'>
                <ScrollView
                    contentContainerStyle={{ flexGrow: 1 }}
                    showsVerticalScrollIndicator={false}
                    bounces={false}
                >
                    <View className='flex-1 flex-col items-center justify-start'>
                        <View className='w-full flex-1 bg-white rounded-t-3xl p-6 flex-col justify-start items-center gap-4'>
                            <View className=''>
                                <ImagePlusIcon size={60} color={'#1a9cd9'} />
                            </View>
                            <View className="bg-white rounded-xl px-6 pb-4 flex-col justify-center items-center">
                                <Text className="text-2xl font-bold text-gray-700">
                                    Documentos
                                </Text>
                                <Text className="text-gray-700">Envie uma selfie e fotos </Text>
                                <Text className="text-gray-700">dos seus documentos</Text>
                            </View>

                            {UPLOAD_CONFIG.map((item) => {
                                const isDone = !!images[item.key];
                                return (
                                    <Pressable
                                        key={item.key}
                                        onPress={() => { setSelectedType(item.key); setModalVisible(true); }}
                                        className={`flex-row items-center justify-between p-4 mb-2 rounded-xl border ${isDone
                                            ? 'border-green-500 bg-green-50'
                                            : 'border-gray-500 bg-white'
                                            }`}
                                    >
                                        <Text className="flex-1 text-base text-solar-blue-dark mr-2">{item.label}</Text>
                                        <Image
                                            source={images[item.key] ? { uri: images[item.key] } : item.icon}
                                            className="w-12 h-12 rounded-md"
                                        />
                                    </Pressable>
                                )
                            })}
                            <View className='w-full py-4'>
                                <Button
                                    disabled={loading || !isFormComplete}
                                    label={loading ? <ActivityIndicator color={'white'} size={'small'} /> : 'Continuar'}
                                    onPress={() => router.replace('/images-sent')}
                                />
                            </View>
                        </View>
                    </View>
                </ScrollView>
            </ScreenLayout>
        </>
    );
};

// Sub-componente para limpar o modal
const SourceButton = ({ icon, label, onPress }: any) => (
    <TouchableOpacity className="items-center p-4 bg-gray-100 rounded-xl border border-gray-500" onPress={onPress}>
        <Ionicons name={icon === 'camera' ? 'camera' : 'image'} size={40} color="#024D9F" />
        <Text className="text-solar-blue-dark mt-1">{label}</Text>
    </TouchableOpacity>
);

export default LoadImages;