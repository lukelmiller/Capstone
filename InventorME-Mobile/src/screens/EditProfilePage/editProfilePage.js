/* eslint-disable react/sort-comp */
import React, { Component } from "react";
import { TextInput, TouchableOpacity } from "react-native-gesture-handler";
import {
  Text,
  View,
  Image,
  ScrollView,
  Alert,
  TouchableWithoutFeedback,
  Keyboard,
  AppState,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { FontAwesome, MaterialCommunityIcons } from "@expo/vector-icons";
import { Auth } from "aws-amplify";
import * as Permissions from 'expo-permissions';
import * as ImagePicker from 'expo-image-picker';
import styles from "./editProfilePage.style";
import { colors } from "../../util/colors";
import { Photo } from "../../util/Photos";




class EditProfilePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      family_name: "",
      email: "",
      phone_number: "",
      phoneFormat: "",
      photo: "",
      photoType: "image/jpg",
      imageLoaded: false,
      photoName: "",
      newPhoto: false
    };
    this.validateUser = this.validateUser.bind(this);
    this.saveChanges = this.saveChanges.bind(this);
    this.nameOnChange = this.nameOnChange.bind(this);
    this.phoneOnChange = this.phoneOnChange.bind(this);
  }

  async componentDidMount() {
    try {
      const data = await Auth.currentUserInfo();
      // console.log('userInfo data:', data);
      this.setState({ name: data.attributes.name });
      this.setState({ family_name: data.attributes.family_name });
      this.setState({ email: data.attributes.email });
      this.setState({ phone_number: data.attributes.phone_number });
      this.phoneOnChange(this.state.phone_number);
    } catch (error) {
      // console.log("could not find user :(", error);
      alert("Error: No user found, please sign in again");
      this.props.navigation.navigate("HomeScreen");
    }
  }

  createAlert(title, msg) {
    Alert.alert(title, msg, [{ text: "OK" }], { cancelable: false });
  }

  phoneCheck(num) {
    const regex = /^(\+1\d{3}\d{3}\d{4}$)/g;
    return regex.test(num);
  }

  nameOnChange = (event) => {
    this.setState({ name: event });
  };

  lastNameOnChange = (event) => {
    this.setState({ family_name: event });
  };

  phoneOnChange = (event) => {
    let cleaned = (`${  event}`).replace(/\D/g, "");
    cleaned = `+${  cleaned}`;
    cleaned = cleaned.substring(0, 12);
    this.setState({ phone_number: cleaned });
    let format = "";
    if (cleaned.length < 6) format = `+1 (${  cleaned.substring(2, 5)}`;
    else if (cleaned.length < 9)
      format =
        `+1 (${  cleaned.substring(2, 5)  }) ${  cleaned.substring(5, 8)}`;
    else
      format =
        `+1 (${ 
        cleaned.substring(2, 5) 
        }) ${ 
        cleaned.substring(5, 8) 
        }-${ 
        cleaned.substring(8, 12)}`;
    this.setState({ phoneFormat: format });
  };

  pickImage = async () => {
    const {
      status: cameraRollPerm
    } = await Permissions.askAsync(Permissions.MEDIA_LIBRARY);

    // only if user allows permission to camera roll
    if (cameraRollPerm === 'granted') {
      const pickerResult = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        base64: true,
        aspect: [4, 3],
        quality: 0.2,
        mediaTypes: ImagePicker.MediaTypeOptions.Images

      });
      if (!pickerResult.cancelled) {
        this.setState({ newPhoto: true });
        this.setState({ photo: pickerResult.base64 });
        // this.setState({ photoType: pickerResult.type });
        // console.log(this.state.photo);
      }
      // this.uploadImageAsync(pickerResult.uri);
    } else {
      this.createAlert("No Photo Access", "Please Go Into Phone Settings & Grant App Access To Photos");
    }
  };

  async uploadImage() {
    try {
      const photos = new Photo();
      const pName = await photos.generateProfilePicName("jpg");
      await photos.uploadFile(this.state.photo, pName, this.state.photoType)
    } catch (error) {
      console.log("upload error", error);
    }
  }

  async saveChanges() {
    const attributes = {
      name: this.state.name,
      phone_number: this.state.phone_number,
      family_name: this.state.family_name
    };
    try {
      if (this.state.newPhoto) {
        this.uploadImage();
      }
      const user = await Auth.currentAuthenticatedUser();
      await Auth.updateUserAttributes(user, attributes);
      this.props.navigation.goBack();
    } catch (error) {
      this.createAlert("Saving Error", "Please Try Again Later");
    }
  }

  validateUser() {
    if (this.state.name === "") {
      this.createAlert("Saving Error", "Please Type First Name");
    } else if (this.state.family_name === "") {
      this.createAlert("Saving Error", "Please Type Last Name");
    } else if (!this.phoneCheck(this.state.phone_number)) {
      this.createAlert(
        "Saving Error",
        "Phone Number Must Be At Least 9 Numbers Long"
      );
    } else {
      this.saveChanges();
    }
  }

  render() {
    return (
      <KeyboardAwareScrollView
        resetScrollToCoords={{ x: 0, y: 0 }}
        contentContainerStyle={styles.Page}
        scrollEnabled={false}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView contentContainerStyle={styles.Page}>
            <View style={{ flexDirection: "row" }}>
              <View style={styles.arrow}>
                <TouchableOpacity
                  style={styles.arrowButtonContainer}
                  onPress={() => this.props.navigation.goBack()}>
                  <FontAwesome
                    name="arrow-left"
                    color={colors.iconBackless}
                    size={45}/>
                </TouchableOpacity>
              </View>
              <View style={styles.deleteBtn}>
                <TouchableOpacity
                  style={styles.deleteButtonContainer}>
                  <Text style={styles.deleteButtonText}>Delete Account</Text>
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.container}>

              <TouchableOpacity
                style={styles.uploadButton}
                onPress={this.pickImage}>
                <MaterialCommunityIcons name="cloud-upload-outline" size={100} color={colors.iconBackless} />
              </TouchableOpacity>

              <View style={styles.child}>
                <Text style={{ color: colors.label }}>First Name:</Text>
                <TextInput
                  style={styles.TextInput}
                  placeholder="First Name"
                  onChangeText={this.nameOnChange}
                  value={this.state.name}/>
              </View>

              <View style={styles.child}>
                <Text style={{ color: colors.label }}>Last Name:</Text>
                <TextInput
                  style={styles.TextInput}
                  placeholder="Last Name"
                  onChangeText={this.lastNameOnChange}
                  value={this.state.family_name}/>
              </View>

              <View style={styles.child}>
                <Text style={{ color: colors.label }}>Phone Number:</Text>
                <TextInput
                  type="number"
                  style={styles.TextInput}
                  placeholder="Phone Number"
                  onChangeText={this.phoneOnChange}
                  value={this.state.phoneFormat}/>
              </View>

              <View style={styles.logo}>
                <TouchableOpacity
                  style={styles.appButtonContainer}
                  onPress={this.validateUser}>
                  <Text style={styles.appButtonText}>Save</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAwareScrollView>
    );
  }
}

export default EditProfilePage;
