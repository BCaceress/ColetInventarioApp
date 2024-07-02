import React, { useState } from 'react';
import {
    Alert,
    SafeAreaView,
    StyleSheet,
    Text,
    TextInput,
    View
} from 'react-native';
import {
    Search,
} from 'react-native-feather';
import MyModal from '../../components/myModal.js';
import api from '../../services/api.js';

const Coleta = ({ navigation, route }) => {
    const { nomeUsuario } = route.params;
    const { date } = route.params;

    React.useEffect(() => {
        navigation.setOptions({
            headerTitle: `Coleta Usuário: ${nomeUsuario}`,
        });
    }, [nomeUsuario]);
    const [barcode, setBarcode] = useState('');
    const [local, setLocal] = useState('EXP');
    const handleTextChange = (newText) => {
        if (newText.length <= 3) {
            setLocal(newText);
        }
    };

    const enviarInventario = async () => {
        if (validarFormato(barcode)) {
            const arrayInventario = {
                data_inventario: date,
                usuario: nomeUsuario,
                estabelecimento: "1",
                volume: barcode,
                local: local
            };
            try {
                const apiInstance = await api();
                const response = await apiInstance.post(`/expedicao/inventario`, arrayInventario);
                if (response.status === 201) {
                    // Sucesso (status 201): exibe mensagem e faz outras ações necessárias
                    showMessage();
                    console.log(arrayInventario);
                    setBarcode('');
                } else if (response.status === 202) {
                    Alert.alert('Atualização', response.data.mensagem, [{ text: 'OK' }]);
                    setBarcode('');
                } else if (response.status === 299) {
                    Alert.alert('Erro', response.data.mensagem, [{ text: 'OK' }]);
                    setBarcode('');
                } else {
                    Alert.alert('Erro', 'Erro ao obter dados da API.', [{ text: 'OK' }]);
                    setBarcode('');
                }
            } catch (error) {
                console.error('Erro ao obter dados da API:', error);
                setBarcode('');
            }
        } else {
            Alert.alert('Erro', 'Formato de etiqueta inválido.', [{ text: 'OK' }]);
            setBarcode('');
        }
    };

    function validarFormato(texto) {
        const regex = /^[0-9.]{4,14}$/;
        return regex.test(texto);
    }
    const [modalVisible, setModalVisible] = useState(false);

    const showMessage = () => {
        setModalVisible(true);
    };

    return (
        <SafeAreaView style={styles.container}>
            <MyModal
                visible={modalVisible}
                message="Etiqueta registrada no inventário! "
                onClose={() => setModalVisible(false)}
            />
            <View style={styles.containerCentral}>
                <Text style={styles.label}>
                    Data Selecionada: {date}
                </Text>
                <View>
                    <Text style={styles.label}>
                        Digite o local
                    </Text>
                    <TextInput style={styles.input}
                        value={local}
                        autoCapitalize="characters"
                        maxLength={3}
                        onChangeText={handleTextChange} />
                </View>
                <View>
                    <Text style={styles.label}>
                        Inserir Etiqueta
                    </Text>
                    <View style={styles.viewInput}>
                        <Search size={10} stroke="black" />
                        <TextInput
                            style={styles.textInput}
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
        marginStart: 14,
        marginEnd: 14,
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
    //TextInput
    viewInput: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        marginBottom: 15,
        borderWidth: 1,
        borderRadius: 6,
    },
    textInput: {
        paddingStart: 7,
    },

});
export default Coleta;
