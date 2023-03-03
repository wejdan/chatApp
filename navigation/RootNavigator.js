import {StyleSheet, View, ActivityIndicator} from 'react-native';
import React, {useContext, useState, useEffect, useCallback} from 'react';
import {NavigationContainer} from '@react-navigation/native';

import {onAuthStateChanged} from 'firebase/auth';
import {AuthenticatedUserContext} from '../contexts/AuthenticatedUserContext';
import {auth, database} from '../firebase';

import ChatStack from './ChatStack';
import AuthStack from './AuthStack';
import {doc, updateDoc} from 'firebase/firestore';

export default function RootNavigator() {
  const {user, setUser} = useContext(AuthenticatedUserContext);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    // onAuthStateChanged returns an unsubscriber
    const unsubscribe = auth.onAuthStateChanged(authenticatedUser => {
      if (authenticatedUser) {
        setUser(authenticatedUser);
        //   updateUser();
      } else {
        setUser(null);
      }
      setIsLoading(false);
    });

    return unsubscribe;
    // unsubscribe auth listener on unmount
  }, [user]);
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
