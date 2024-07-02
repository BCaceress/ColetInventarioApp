import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { Radio } from 'react-native-feather';
import api from '../../services/api';

const Configuracao = () => {
    const [connection, setConnection] = useState('');

    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        // Recupera os valores do AsyncStorage
        const fetchData = async () => {
            try {
                const savedConnection = await AsyncStorage.getItem('@MyApp:connection');
                setConnection(savedConnection || '');
            } catch (error) {
                console.error('Erro ao recuperar os dados:', error);
            }
        };

        fetchData();
    }, []);

    const fnSalvar = async () => {
        try {
            // Salva os dados no AsyncStorage
            await AsyncStorage.setItem('@MyApp:connection', connection);
            Alert.alert('Sucesso', 'Configurações salvas com sucesso!', [
                { text: 'OK' },
            ]);
        } catch (error) {
            Alert.alert('Erro', 'Ocorreu um erro ao salvar as configurações.', [
                { text: 'OK' },
            ]);
        }
    };

    const testarConexao = async () => {
        try {
            setIsLoading(true);
            // Salva os valores no AsyncStorage
            await Promise.all([
                AsyncStorage.setItem('@MyApp:connection', connection),
            ]);
            // Faz a chamada à API
            const apiInstance = await api();
            const response = await apiInstance.get('/parametros?chave=EMPRESA');
            if (response.status === 200) {
                if (response.data && response.data.valor) {
                    Alert.alert('Sucesso', 'Conexão com API realizada!', [{ text: 'OK' }]);
                    setIsLoading(false);
                } else {
                    Alert.alert('Erro', 'Dados inválidos na resposta da API.', [{ text: 'OK' }]);
                    setIsLoading(false);
                }
            } else {
                Alert.alert('Erro', 'Favor verificar a conexão API.', [{ text: 'OK' }]);
                setIsLoading(false);
            }
        } catch (error) {
            Alert.alert('Erro', 'Ocorreu um erro na chamada da API.', [{ text: 'OK' }]);
            setIsLoading(false);
        }
    };

    const fnLerTodas = () => {
        setLeitura(previousState => !previousState);
    };

    return (
        <View style={styles.container}>

            <Text style={styles.label}>Conexão API:</Text>
            <TextInput
                style={styles.inputConexao}
                placeholder="Digite a conexão"
                value={connection}
                onChangeText={text => setConnection(text)}
            />

            <View style={styles.viewButton}>
                <TouchableOpacity style={styles.buttonTestar} onPress={testarConexao}>
                    {isLoading ? (
                        <ActivityIndicator size="small" color="white" />
                    ) : (<Radio size={32} color="white" />)}
                </TouchableOpacity>
                <TouchableOpacity style={styles.buttonSalvar} onPress={fnSalvar}>
                    <Text style={styles.textSalvar}>Salvar</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 18,
        backgroundColor: '#fff',
    },
    inputConexao: {
        height: 40,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 4,
        paddingHorizontal: 10,
        marginBottom: 17,
    },
    viewButton: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    buttonTestar: {
        backgroundColor: '#09A08D',
        paddingVertical: 12,
        borderRadius: 4,
        alignItems: 'center',
        marginBottom: 15,
        width: '25%',
    },
    buttonSalvar: {
        backgroundColor: '#09A08D',
        paddingVertical: 12,
        borderRadius: 4,
        alignItems: 'center',
        marginBottom: 15,
        width: '70%',
    },
    textSalvar: {
        color: 'white',
        fontSize: 19,
        alignSelf: 'center',
        fontWeight: 'bold',
    },
});
export default Configuracao;
