import React, { useEffect, useState } from 'react';
import {
    FlatList,
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import api from '../../services/api';
const ListaUsuarios = ({ navigation }) => {
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [users, setUsers] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const apiInstance = await api();

            try {
                const usersResponse = await apiInstance.get('/expedicao/usuarios');
                setUsers(usersResponse.data);
            } catch (error) {
                console.error('Erro ao obter dados da API:', error);
            }
        };
        fetchData();
    }, []);

    const showDatePicker = () => {
        setDatePickerVisibility(true);
    };

    const hideDatePicker = () => {
        setDatePickerVisibility(false);
    };

    const handleConfirm = (date) => {
        // console.warn("A date has been picked: ", date);
        setSelectedDate(date); // Atualize o estado com a data selecionada
        hideDatePicker();
    };
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.containerCentral}>
                <View>
                    <Text style={styles.label}>
                        Selecione a data
                    </Text>

                    <TouchableOpacity style={styles.button}
                        onPress={showDatePicker}
                    >
                        <Text style={styles.buttonText}>Data Selecionada: {selectedDate.toLocaleDateString()}</Text>
                    </TouchableOpacity>
                    <DateTimePickerModal
                        isVisible={isDatePickerVisible}
                        mode="date"
                        locale="pt_BR"
                        onConfirm={handleConfirm}
                        onCancel={hideDatePicker}
                    />
                </View>
                <View>
                    <Text style={styles.label}>
                        Selecione o usuário
                    </Text>
                    <FlatList
                        data={users}
                        keyExtractor={item => item.USRID}
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                style={styles.cartao}
                                onPress={() => {
                                    navigation.navigate('Coleta', { nomeUsuario: item.USRID, date: selectedDate.toLocaleDateString() });
                                }}>
                                <View style={styles.informacoes}>
                                    <Text style={styles.distancia}>{item.NOME}</Text>
                                </View>
                            </TouchableOpacity>
                        )}
                    />
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
    button: {
        backgroundColor: '#09A08D',
        borderRadius: 5,
        margin: 8,
        padding: 10
    },
    buttonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    cartao: {
        backgroundColor: '#F6F6F6',
        margin: 8,
        borderRadius: 6,
        flexDirection: 'row',
        elevation: 4,
        shadowOpacity: 0.23,
        shadowRadius: 2.62,
    },
    informacoes: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginLeft: 8,
        marginVertical: 16,
        marginRight: 16,
    },

});
export default ListaUsuarios;
