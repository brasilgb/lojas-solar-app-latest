import { useAuth } from '@/contexts/AuthContext';
import { MapPinIcon } from 'lucide-react-native';
import React, { useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withRepeat,
    withSequence,
    withTiming,
    Easing,
} from 'react-native-reanimated';



const BouncingPin = () => {

    const { returnStore } = useAuth();

    const translateY = useSharedValue(0);

    useEffect(() => {
        translateY.value = withRepeat(
            withSequence(
                withTiming(-10, {
                    duration: 500,
                    easing: Easing.out(Easing.quad),
                }),
                withTiming(0, {
                    duration: 500,
                    easing: Easing.in(Easing.quad),
                })
            ),
            -1,
            false
        );
    }, []);

    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [{ translateY: translateY.value }],
        };
    });

    const openMap = () => {
        if (returnStore) {
            const url = `https://www.google.com/maps/dir/?api=1&destination=${returnStore.latitude},${returnStore.longitude}`;
            Linking.openURL(url);
        }
    };

    return (
        <View style={styles.container}>
            <Animated.View style={animatedStyle}>
                <TouchableOpacity
                    onPress={openMap}
                >
                    <MapPinIcon color={'#bccf00'} size={40} />
                </TouchableOpacity>
            </Animated.View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default BouncingPin;