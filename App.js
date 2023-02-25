/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import RootNavigator from './navigation/RootNavigator';
import {ContextProvider} from './contexts/AuthenticatedUserContext';

function App() {
  return (
    <ContextProvider>
      <RootNavigator />
    </ContextProvider>
  );
}

export default App;
