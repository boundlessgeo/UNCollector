import React from 'react';
import {
  Dimensions,
  FlatList,
  Platform,
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
            {props.form.form_label}
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
  }

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
