import React, { useEffect, useState } from 'react';
import {
    Alert,
    Modal,
    SafeAreaView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MyModal from '../../components/myModal.js';
import api from '../../services/api.js';

const Coleta = ({ navigation, route }) => {
    const { nomeUsuario, date } = route.params;
    const [modalVisible, setModalVisible] = useState(false);
    const [keyboardModalVisible, setKeyboardModalVisible] = useState(false);
    const [barcode, setBarcode] = useState('');
    const [local, setLocal] = useState('EXP');

    useEffect(() => {
        navigation.setOptions({
            headerTitle: `Coleta Usuário: ${nomeUsuario}`,
        });
    }, [nomeUsuario]);

    const handleTextChange = (newText) => {
        if (newText.length <= 3) {
            setLocal(newText);
        }
    };

    const handleSearch = () => {
        if (validarFormato(barcode)) { // Validate the barcode instead of inputValue
            enviarInventario();
            setKeyboardModalVisible(false);
        } else {
            Alert.alert('Erro', 'Formato de etiqueta inválido.', [{ text: 'OK' }]);
        }
    };

    const enviarInventario = async () => {
        const arrayInventario = {
            data_inventario: date,
            usuario: nomeUsuario,
            estabelecimento: "1",
            volume: barcode,
            local: local,
        };

        try {
            const apiInstance = await api();
            const response = await apiInstance.post(`/expedicao/inventario`, arrayInventario);
            handleApiResponse(response);
        } catch (error) {
            console.error('Erro ao obter dados da API:', error);
        } finally {
            setBarcode(''); // Reset barcode after submission
        }
    };

    const handleApiResponse = (response) => {
        if (response.status === 201) {
            setModalVisible(true);
        } else {
            Alert.alert('Atualização', response.data.mensagem || 'Erro ao obter dados da API.', [{ text: 'OK' }]);
        }
    };

    const validarFormato = (texto) => /^[0-9.]{4,14}$/.test(texto);

    const openKeyboardModal = () => {
        setKeyboardModalVisible(true);
        setBarcode(''); // Reset barcode for new input
    };

    const closeKeyboardModal = () => {
        setKeyboardModalVisible(false);
        setBarcode(''); // Reset barcode on close
    };

    return (
        <SafeAreaView style={styles.container}>
            <MyModal
                visible={modalVisible}
                message="Etiqueta registrada no inventário!"
                onClose={() => setModalVisible(false)}
            />
            <Modal
                transparent={true}
                animationType="slide"
                visible={keyboardModalVisible}
                onRequestClose={closeKeyboardModal}
            >
                <View style={styles.modalBackground}>
                    <View style={styles.modalContainer}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Inserir Etiqueta</Text>
                            <TouchableOpacity onPress={closeKeyboardModal}>
                                <MaterialCommunityIcons name="close" size={24} color="#000" />
                            </TouchableOpacity>
                        </View>
                        <TextInput
                            style={styles.numericInput}
                            placeholder="Digite manualmente a etiqueta"
                            keyboardType="numeric"
                            autoFocus={true}
                            onChangeText={text => {
                                const regex = /^[0-9.]*$/;
                                if (regex.test(text)) {
                                    setBarcode(text);
                                }
                            }}
                            value={barcode}
                        />
                        <TouchableOpacity style={styles.buttonModal} onPress={handleSearch}>
                            <Text style={styles.buttonText}>Pesquisar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
            <View style={styles.containerCentral}>
                <Text style={styles.label}>Data Selecionada: {date}</Text>
                <View>
                    <Text style={styles.label}>Digite o local</Text>
                    <TextInput
                        style={styles.input}
                        value={local}
                        autoCapitalize="characters"
                        maxLength={3}
                        onChangeText={handleTextChange}
                    />
                </View>
                <View style={styles.containerViewInput}>
                    <View>
                        <Text style={styles.label}>Inserir Etiqueta</Text>
                        <View style={styles.viewInput}>
                            <MaterialCommunityIcons name="magnify" size={25} color="#000" />
                            <TextInput
                                style={styles.textInputEtiqueta}
                                placeholderTextColor="#666"
                                showSoftInputOnFocus={false}
                                autoFocus={true}
                                onChangeText={text => setBarcode(text)}
                                placeholder="Leitura do código de barra"
                                returnKeyType="next"
                                onSubmitEditing={enviarInventario}
                                value={barcode}
                                blurOnSubmit={false}
                            />
                        </View>
                    </View>
                    <TouchableOpacity style={styles.buttonTeclado} onPress={openKeyboardModal}>
                        <MaterialCommunityIcons name="keyboard" size={25} color="#000" />
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    containerCentral: {
        flex: 1,
        marginHorizontal: 14,
    },
    label: {
        fontSize: 14,
        fontWeight: "500",
        marginBottom: 3,
        marginTop: 18,
        color: "#11187cc",
    },
    input: {
        borderWidth: 1,
        borderColor: 'gray',
        padding: 10,
        borderRadius: 6,
    },
    viewInput: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        marginBottom: 15,
        borderWidth: 1,
        borderRadius: 6,
    },
    textInputEtiqueta: {
        width: '74%',
        paddingStart: 7,
    },
    containerViewInput: {
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    buttonTeclado: {
        backgroundColor: '#ccc',
        borderRadius: 6,
        paddingHorizontal: 12,
        paddingVertical: 5,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#000',
        elevation: 2,
        height: 50,
        marginTop: 24,
    },
    modalBackground: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContainer: {
        width: '90%',
        padding: 20,
        backgroundColor: 'white',
        borderRadius: 10,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowRadius: 10,
        elevation: 5,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        alignItems: 'center',
        marginBottom: 15,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
    },
    numericInput: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 12,
        borderRadius: 6,
        width: '100%',
        marginBottom: 20,
        fontSize: 16,
    },
    buttonModal: {
        backgroundColor: '#09A08D',
        width: '100%',
        padding: 12,
        borderRadius: 6,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default Coleta;
