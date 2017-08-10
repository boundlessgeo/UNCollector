import React from 'react';
import { AppState, Platform, PermissionsAndroid, StatusBar, View } from 'react-native';
import { StackNavigator } from 'react-navigation';
import * as sc from 'react-native-spatialconnect';
import { blue, darkBlue } from '../styles';
import FormList from './FormList';
import Form from './Form';

const AppStack = StackNavigator(
  {
    Home: { screen: FormList },
    Form: { screen: Form },
  },
  {
    navigationOptions: {
      headerStyle: {
        elevation: 6,
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

class App extends React.Component {
  componentDidMount() {
    sc.addConfigFilepath('layers.scfg');
    sc.startAllServices();
    AppState.addEventListener('change', this._handleAppStateChange);
  }

  componentWillUnmount() {
    AppState.removeEventListener('change', this._handleAppStateChange);
  }

  _handleAppStateChange = nextAppState => {
    if (nextAppState === 'active') {
      if (Platform.OS === 'android' && Platform.Version >= 23) {
        try {
          const granted = PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            {
              title: 'GPS permission',
              message: 'UNCollector needs access to your GPS',
            }
          );
          if (granted) {
            sc.enableGPS();
          }
        } catch (err) {
          console.warn(err);
        }
      } else {
        sc.enableGPS();
      }
    } else {
      sc.disableGPS();
    }
  };

  render() {
    return (
      <View style={{ flex: 1 }}>
        <StatusBar backgroundColor={darkBlue} barStyle="light-content" />
        <AppStack />
      </View>
    );
  }
}

export default App;
