import React from 'react';
import { StackNavigator } from 'react-navigation';
import { blue } from '../styles';
import FormList from './FormList';
import Form from './Form';

const App = StackNavigator(
  {
    Home: { screen: FormList },
    Form: { screen: Form },
  },
  {
    navigationOptions: {
      headerStyle: {
        backgroundColor: blue,
        shadowColor: 'black',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
      },
      headerTitleStyle: {
        color: 'white',
      },
      headerTintColor: 'white',
    },
  }
);

export default App;
