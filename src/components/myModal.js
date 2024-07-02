import React, { useEffect } from 'react';
import { Animated, Modal, StyleSheet, Text, View } from 'react-native';
import { Check } from 'react-native-feather';

const MyModal = ({ visible, message, onClose }) => {
    const slideInAnimation = new Animated.Value(0);

    useEffect(() => {
        if (visible) {
            Animated.timing(slideInAnimation, {
                toValue: 1,
                duration: 230,
                useNativeDriver: true,
            }).start(() => {
                setTimeout(() => {
                    onClose();
                }, 850);
            });
        }
    }, [visible]);

    return (
        <Modal visible={visible} animationType="slide" transparent>
            <View style={styles.modalContainer}>
                <Animated.View
                    style={[
                        styles.modalContent,
                        {
                            transform: [
                                {
                                    translateY: slideInAnimation.interpolate({
                                        inputRange: [0, 1],
                                        outputRange: [0, -300],
                                    }),
                                },
                            ],
                        },
                    ]}
                >
                    <View style={styles.iconContainer}>
                        <Check size={10} color="white" />
                    </View>
                    <Text style={styles.modalText}>{message}</Text>
                </Animated.View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        //backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        position: 'absolute',
        bottom: '8%',
        width: '90%',
        backgroundColor: 'white',
        padding: 18,
        borderRadius: 6,
        alignItems: 'center',
        flexDirection: 'row',
        borderLeftWidth: 5,
        borderColor: '#000000',
        backgroundColor: '#45BF92'
    },
    iconContainer: {
        marginRight: 10,
    },
    modalText: {
        fontSize: 16,
        textAlign: 'center',
        color: 'white'
    },
});

export default MyModal;
