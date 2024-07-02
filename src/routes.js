import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';

import Coleta from './pages/Coleta';
import Configuracao from './pages/Configuracao';
import ListaUsuarios from './pages/ListaUsuarios';
import Login from './pages/Login';

const Stack = createStackNavigator();

export default function Routes() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{
          headerTitleAlign: 'center',
          headerStyle: {
            backgroundColor: '#09A08D',
          },
          headerTintColor: '#fff',
        }}>
        <Stack.Screen
          name="Login"
          component={Login}
          options={{
            headerTitle: '',
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="Configuracao"
          component={Configuracao}
          options={{
            headerTitle: 'Configurações',
          }}
        />
        <Stack.Screen
          name="ListaUsuarios"
          component={ListaUsuarios}
          options={{
            headerTitle: 'Lista de Usuários',
          }}
        />
        <Stack.Screen
          name="Coleta"
          component={Coleta}

        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
