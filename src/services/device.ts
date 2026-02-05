import * as SecureStore from 'expo-secure-store';
import DeviceInfo from 'react-native-device-info';

const DEVICE_KEY = 'device_id';

export async function getDeviceId(): Promise<string> {
  const storedDeviceId = await SecureStore.getItemAsync(DEVICE_KEY);

  if (storedDeviceId) {
    return storedDeviceId;
  }

  const newDeviceId = await DeviceInfo.getUniqueId();
  await SecureStore.setItemAsync(DEVICE_KEY, newDeviceId);

  return newDeviceId;
}