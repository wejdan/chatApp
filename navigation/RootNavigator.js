import {StyleSheet, View, ActivityIndicator} from 'react-native';
import React, {useContext, useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';

import {SafeAreaProvider} from 'react-native-safe-area-context';

import {AuthenticatedUserContext} from '../contexts/AuthenticatedUserContext';
import ChatStack from './ChatStack';
import AuthStack from './AuthStack';

export default function RootNavigator() {
  const {user} = useContext(AuthenticatedUserContext);
  const [isLoading, setIsLoading] = useState(false);
  if (isLoading) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator size="large" />
      </View>
    );
  }
  return (
    <NavigationContainer>
      {user ? <ChatStack /> : <AuthStack />}
    </NavigationContainer>
  );
}
