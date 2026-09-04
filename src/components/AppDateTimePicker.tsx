import DateTimePicker, {
    DateTimePickerEvent,
} from '@react-native-community/datetimepicker';
import { CalendarDaysIcon } from 'lucide-react-native';
import moment from 'moment';
import React, { useState } from 'react';
import { Modal, Platform, Pressable, Text, View } from 'react-native';
import { Button } from './Button';
import { softCardShadow } from '@/styles/shadows';

interface AppDateTimePickerProps {
    value: Date;
    onChange: (date: Date) => void;
}

const AppDateTimePicker = ({
    value,
    onChange: onValueChange,
}: AppDateTimePickerProps) => {
    const [mode, setMode] = useState<'date' | 'time'>('date');
    const [show, setShow] = useState(false);
    const [selectedDate, setSelectedDate] = useState(value);

    const onChange = (event: DateTimePickerEvent, date?: Date) => {
        if (Platform.OS === 'ios') {
            if (date) setSelectedDate(date);
            return;
        }

        setShow(false);
        if (event.type === 'set' && date) {
            onValueChange(date);
        }
    };

    const showMode = (currentMode: 'date' | 'time') => {
        setSelectedDate(value);
        setShow(true);
        setMode(currentMode);
    };

    const showDatepicker = () => {
        showMode('date');
    };

    return (
        <View className="min-w-0 w-full">
            <View
                className="h-14 flex-row items-center justify-between gap-1 px-2 bg-white rounded-lg"
                style={softCardShadow}
            >
                <Text
                    adjustsFontSizeToFit
                    minimumFontScale={0.8}
                    numberOfLines={1}
                    className="min-w-0 flex-1 text-base text-solar-blue-secondary"
                >
                    {moment(value).format('DD/MM/YYYY')}
                </Text>
                <Button
                    variant={'default'}
                    size={'icon'}
                    onPress={showDatepicker}
                    label={<CalendarDaysIcon size={24} color={'white'} />}
                    labelClasses="p-0.5"
                />
            </View>

            {show && Platform.OS === 'android' && (
                <DateTimePicker
                    testID="dateTimePicker"
                    value={value}
                    maximumDate={new Date()}
                    mode={mode}
                    is24Hour={true}
                    onChange={onChange}
                    locale="pt"
                />
            )}

            {Platform.OS === 'ios' && (
                <Modal
                    animationType="fade"
                    transparent
                    visible={show}
                    onRequestClose={() => setShow(false)}
                >
                    <Pressable
                        className="flex-1 items-center justify-center bg-black/40 px-6"
                        onPress={() => setShow(false)}
                    >
                        <Pressable
                            className="w-full max-w-md rounded-2xl bg-white p-4"
                            onPress={event => event.stopPropagation()}
                        >
                            <DateTimePicker
                                testID="dateTimePicker"
                                value={selectedDate}
                                maximumDate={new Date()}
                                mode={mode}
                                display="spinner"
                                is24Hour
                                themeVariant="light"
                                textColor="#374151"
                                onChange={onChange}
                                locale="pt-BR"
                            />

                            <View className="mt-2 flex-row justify-end gap-5 px-2 py-2">
                                <Pressable onPress={() => setShow(false)}>
                                    <Text className="font-medium text-gray-500">Cancelar</Text>
                                </Pressable>
                                <Pressable
                                    onPress={() => {
                                        onValueChange(selectedDate);
                                        setShow(false);
                                    }}
                                >
                                    <Text className="font-bold text-solar-blue-primary">Confirmar</Text>
                                </Pressable>
                            </View>
                        </Pressable>
                    </Pressable>
                </Modal>
            )}
        </View>
    );
};

export default AppDateTimePicker;
