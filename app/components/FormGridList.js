import React from 'react';
import { Dimensions, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import * as sc from 'react-native-spatialconnect';
import { blue, orange, gray } from '../styles';

class FormGridList extends React.Component {
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

  render() {
    const { navigate } = this.props.navigation;
    return (
      <ScrollView style={styles.container}>
        <View style={styles.list}>
          {this.state.forms.map((form, idx) => (
            <TouchableOpacity
              onPress={() => navigate('Form', { form })}
              style={styles.listItem}
              key={`${form.layer_key}.${idx}`}
            >
              <View>
                <Text style={styles.listItemText}>{form.layer_label}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: gray,
    padding: 20,
  },
  textHeader: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  list: {
    flex: 1,
    marginRight: -20,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  listItem: {
    height: 100,
    width: (Dimensions.get('window').width - 81) / 3,
    backgroundColor: 'white',
    borderRadius: 2,
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
    padding: 10,
    marginRight: 20,
    marginBottom: 20,
  },
  listItemText: {
    color: orange,
    fontSize: 16,
  },
});

export default FormGridList;
