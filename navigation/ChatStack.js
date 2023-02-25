import React from 'react';

import {SafeAreaProvider} from 'react-native-safe-area-context';

import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Home from '../screens/Home';
import Chat from '../screens/Chat';

const Stack = createNativeStackNavigator();

export default function ChatStack() {
  return (
    <Stack.Navigator defaultScreenOptions={Home}>
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="Chat" component={Chat} />
    </Stack.Navigator>
  );
}
