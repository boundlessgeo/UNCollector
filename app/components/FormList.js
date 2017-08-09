import React from 'react';
import {
  AppState,
  Dimensions,
  FlatList,
  Platform,
  PermissionsAndroid,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableNativeFeedback,
  View,
} from 'react-native';
import * as sc from 'react-native-spatialconnect';
import Icon from 'react-native-vector-icons/Ionicons';
import { blue, orange, gray, darkGray } from '../styles';

const FormCell = props => {
  return (
    <View>
      <TouchableOpacity onPress={props.onSelect}>
        <View style={styles.cellRow}>
          <Text style={styles.cellName} numberOfLines={2}>
            {props.form.layer_label}
          </Text>
          <Icon
            name={Platform.OS === 'ios' ? 'ios-arrow-forward' : 'md-arrow-forward'}
            size={20}
            color={'#BDBDBD'}
            style={styles.iconStyle}
          />
        </View>
      </TouchableOpacity>
    </View>
  );
};

class FormList extends React.Component {
  static navigationOptions = {
    title: 'UN Collector',
    headerBackTitle: null,
  };

  constructor(props) {
    super(props);
    this.state = {
      appState: AppState.currentState,
      forms: [],
    };
  }

  componentDidMount() {
    sc.addConfigFilepath('layers.scfg');
    sc.startAllServices();
    sc.forms$().subscribe(action => {
      this.setState({
        forms: action.payload.forms,
      });
    });

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

    this.setState({ appState: nextAppState });
  };

  keyExtractor = item => item.id;

  render() {
    const { navigate } = this.props.navigation;
    return (
      <FlatList
        data={this.state.forms}
        renderItem={({ item }) => (
          <FormCell form={item} onSelect={() => navigate('Form', { form: item })} />
        )}
        keyExtractor={this.keyExtractor}
        style={styles.list}
      />
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
    padding: 20,
  },
  textHeader: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  list: {
    flex: 1,
    paddingTop: 8,
    paddingBottom: 8,
    backgroundColor: '#FAFAFA',
  },
  cellName: {
    fontSize: 16,
    marginBottom: 2,
    color: 'black',
  },
  cellRow: {
    height: 48,
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    marginLeft: 16,
    borderBottomColor: darkGray,
    borderBottomWidth: 1,
  },
  iconStyle: {
    paddingRight: 16,
  },
});

export default FormList;
