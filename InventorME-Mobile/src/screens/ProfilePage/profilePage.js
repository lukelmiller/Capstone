import React, { Component } from "react";
import { View, SafeAreaView, AppState, ScrollView, Image } from "react-native";
import { Avatar, Text } from "react-native-paper";
import { TouchableOpacity } from "react-native-gesture-handler";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";
import { Auth } from "aws-amplify";
import styles from "./profilePage.style";
import { colors } from "../../util/colors";
import { Photo } from "../../util/Photos";

class ProfilePageNav extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      phone_number: "",
      name: "",
      family_name: "",
      appState: AppState.currentState,
      profilePic: "",
      photoType: "",
      imageLoaded: false
    };
    this.signOut = this.signOut.bind(this);
  }
  async componentDidMount() {

    try {
      const data = await Auth.currentUserInfo();
      // console.log('userInfo data:', data);
      this.setState({ name: data.attributes.name });
      this.setState({ family_name: data.attributes.family_name });
      this.setState({ email: data.attributes.email });
      this.setState({ phone_number: data.attributes.phone_number });
    } catch (error) {
      // console.log("could not find user :(", error);
      alert("Error: No user found, please sign in again");
      this.props.navigation.navigate("HomeScreen");
    }
    try{
      const photos = new Photo();
      const profilePic = await photos.get(this.state.email + '.jpg');
      this.setState({ profilePic: profilePic });
      this.setState({ photoType: "image/jpg"});
      this.setState({imageLoaded: true});
    } catch(error){
      console.log(error);
    }
  }

  async signOut() {
    try {
      await Auth.signOut();
      // console.log("User Signed Out");
      this.props.navigation.navigate("HomeScreen");
    } catch (error) {
      // console.log("user sign out error");
    }
  }

  render() {
    return (
      <ScrollView style={styles.Pager}>
        <View style={styles.Page}>
          <View style={styles.signOutBtn}>
            <TouchableOpacity
              style={styles.appButtonContainer}
              onPress={this.signOut}
            >
              <Text style={styles.appButtonText}>Sign Out</Text>
            </TouchableOpacity>
          </View>

          <SafeAreaView style={styles.container1}>
            <View>
            {this.state.imageLoaded ? <Avatar.Image style={{ alignSelf: "center" }}
                source={{uri: `data:${this.state.photoType};base64,${this.state.profilePic}`}} size={180}/> : 
                <Avatar.Image style={{ alignSelf: "center" }}
                source={{ uri: "https://api.adorable.io/avatars/285/10@adorable.png", }} size={180}/>}
              <View style={styles.child}>
                <View>
                  <Text
                    style={{
                      fontWeight: "bold",
                      color: colors.text,
                      fontSize: 25,
                      marginTop: hp("2%"),
                      marginLeft: wp("7%"),
                    }}
                  >
                    {this.state.name} {this.state.family_name}
                  </Text>
                </View>
              </View>
            </View>

            <View style={styles.child}>
              <Text
                style={{
                  color: colors.label,
                  fontSize: 15,
                  marginLeft: wp("10%"),
                  marginTop: hp("2%"),
                }}
              >
                Phone Number:
            </Text>
              <View
                style={{
                  flexDirection: "row",
                  marginLeft: wp("10%"),
                  marginTop: hp("2%"),
                }}
              >
                <Icon name="phone" color={colors.iconBackless} size={50} />
                <View style={styles.child}>
                  <Text
                    style={{
                      fontSize: 20,
                      marginHorizontal: wp("5%"),
                      color: colors.text
                    }}
                  >
                    {this.state.phone_number}
                  </Text>
                </View>
              </View>
              <Text
                style={{
                  color: colors.label,
                  fontSize: 15,
                  marginLeft: wp("10%"),
                  marginTop: hp("5%"),
                }}
              >
                Email:
            </Text>
              <View
                style={{
                  flexDirection: "row",
                  marginLeft: wp("10%"),
                  marginTop: hp("2%"),
                  marginBottom: hp("4%"),
                }}
              >
                <Icon name="mail" color={colors.iconBackless} size={50} />
                <View style={styles.child}>
                  <Text
                    style={{
                      fontSize: 20,
                      marginHorizontal: wp("5%"),
                      color: colors.text
                    }}
                  >
                    {this.state.email}
                  </Text>
                </View>
              </View>
            </View>

            <View style={styles.child}>
              <TouchableOpacity
                style={styles.appButtonContainer}
                onPress={() => this.props.navigation.navigate("EditProfilePage")}
              >
                <Text style={styles.appButtonText}>Edit Profile</Text>
              </TouchableOpacity>
            </View>
          </SafeAreaView>
        </View>
      </ScrollView>
    );
  }
}
export default ProfilePageNav;
