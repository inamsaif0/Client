// Root.js

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import App from './App';

const Root = () => {
  return (
    <NavigationContainer>
      <App />
      <Toast ref={(ref) => Toast.setRef(ref)} />
    </NavigationContainer>
  );
};

export default Root;
