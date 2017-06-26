import React from 'react';
import * as sc from 'react-native-spatialconnect';
import scformschema from 'spatialconnect-form-schema/native';

class Form extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    title: navigation.state.params.form.form_label,
  });
  constructor(props) {
    super(props);
    this.state = {
      submitting: false,
    };
    this.saveForm = this.saveForm.bind(this);
    this.createFeature = this.createFeature.bind(this);
  }
  saveForm(formData) {
    this.setState({ submitting: true });
    const formInfo = this.props.navigation.state.params.form;
    navigator.geolocation.getCurrentPosition(
      position => {
        const gj = {
          geometry: {
            type: 'Point',
            coordinates: [position.coords.longitude, position.coords.latitude],
          },
          properties: formData,
        };
        const f = sc.geometry('FORM_STORE', formInfo.form_key, gj);
        this.createFeature(f);
      },
      () => {
        const f = sc.spatialFeature('FORM_STORE', formInfo.form_key, { properties: formData });
        this.createFeature(f);
      },
      { enableHighAccuracy: true, timeout: 5000, maximumAge: 1000 }
    );
  }
  createFeature(f) {
    sc.createFeature$(f).first().subscribe(newFeature => {
      this.setState({ submitting: false });
      this.scform.formSubmitted();
    });
  }
  render() {
    const { form } = this.props.navigation.state.params;
    const { SCForm } = scformschema;
    const { submitting } = this.state;
    return (
      <SCForm
        ref={scform => {
          this.scform = scform;
        }}
        form={form}
        submitting={submitting}
        saveForm={this.saveForm}
      />
    );
  }
}

export default Form;
