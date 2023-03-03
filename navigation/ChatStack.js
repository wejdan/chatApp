import React, {useState, useEffect, useContext} from 'react';

import {SafeAreaProvider} from 'react-native-safe-area-context';

import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Home from '../screens/Home';
import Chat from '../screens/ChatScreen';
import SetupScreen from '../screens/SetupScreen';
import {auth} from '../firebase';
import {AuthenticatedUserContext} from '../contexts/AuthenticatedUserContext';
import ProfileScreen from '../screens/ProfileScreen';
const Stack = createNativeStackNavigator();

export default function ChatStack() {
  const {user} = useContext(AuthenticatedUserContext);
  //user && !user.displayName
  return (
    <Stack.Navigator>
      {user && !user.displayName && (
        <Stack.Screen
          name="SetupScreen"
          options={{headerShown: false}}
          component={SetupScreen}
        />
      )}
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="Chat" component={Chat} />
      <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
    </Stack.Navigator>
  );
}
