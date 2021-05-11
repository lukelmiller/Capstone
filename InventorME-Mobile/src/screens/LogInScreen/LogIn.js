import React, { Component } from "react";
import {
  Text,
  View,
  Image,
  Alert,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import { TextInput, TouchableOpacity } from "react-native-gesture-handler";
import { Auth } from "aws-amplify";
import styles from "./LogIn.style";

class HomeScreen extends Component {
  constructor(props) {
    super(props);
    this.state = { email: "", password: "" };
    this.validateUser = this.validateUser.bind(this);
    this.submit = this.submit.bind(this);
    this.emailOnChange = this.emailOnChange.bind(this);
    this.passwordOnChange = this.passwordOnChange.bind(this);
  }

  async componentDidMount() {
    try {
      const session = await Auth.currentSession();
      // console.log('user found!');
      this.props.navigation.navigate("MainPage");
    } catch (error) {
      // console.log('could not find user :(', error);
    }
  }

  createAlert = (title, msg) => Alert.alert(title, msg, [{ text: "OK" }]);

  emailOnChange = (event) => {
    this.setState({ email: event });
  };

  passwordOnChange = (event) => {
    this.setState({ password: event });
  };

  validateUser = () => {
    if (this.state.email === "") this.createAlert("Error", "Please Type Email");
    else if (this.state.password === "")
      this.createAlert("Error", "Please Type Password");
    else this.submit();
  };

  submit = async () => {
    try {
      const user = await Auth.signIn(this.state.email, this.state.password);
      // console.log('Logged in!', user);
      this.props.navigation.navigate("MainPage");
    } catch (error) {
      console.log(error);
      this.createAlert(
        "Sign In Error",
        "Please Make Sure Account Is Confirmed. Please Check Email or Password Are Correct"
      );
    }
  };

  render() {
    return (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.mainContainer}>
          <View style={{ flex: 1, alignItems: "flex-end" }}>
            <TouchableOpacity
              style={styles.appButtonContainer}
              onPress={this.validateUser}
            >
              <Text style={styles.appButtonText}>Log In</Text>
            </TouchableOpacity>
            
          </View>
          <View style={styles.container}>
            <Image
              source={require("../../../assets/appImages/InventorMELogo.png")}
            />
            <TextInput
              style={styles.TextInput}
              placeholder="Email"
              autoCapitalize="none"
              onChangeText={this.emailOnChange}
              value={this.email}
            />
            <TextInput
              secureTextEntry
              style={styles.TextInput}
              placeholder="Password"
              autoCapitalize="none"
              onChangeText={this.passwordOnChange}
              value={this.password}
            />
            <TouchableOpacity
              style={styles.signUpButton}
              onPress={() =>
                this.props.navigation.navigate("CreateAccountScreen")
              }
            >
              <Text style={styles.signUpText}>Sign Up</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableWithoutFeedback>
    );
  }
}

export default HomeScreen;
