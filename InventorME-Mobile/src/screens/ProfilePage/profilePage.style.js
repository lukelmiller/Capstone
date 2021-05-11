import { StyleSheet } from "react-native";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";
import { colors } from "../../util/colors";

export default StyleSheet.create({
  Pager:{
    backgroundColor: colors.background
  },
  Page: {
    flex: 1,
    alignItems: "stretch",
    backgroundColor: colors.background,

  },
  child: {
    alignItems: "flex-start",
    justifyContent: "center",
    marginTop: hp("2%"),
    color: colors.text
  },
  arrow: {
    alignItems: "flex-start",
    justifyContent: "flex-end",
    paddingTop: hp("2%"),
    paddingStart: wp("5%"),
    backgroundColor: colors.background,
  },
  signOutBtn: {
    alignItems: "flex-end",
    justifyContent: "flex-start",
    paddingTop: hp("1.5%"),
    paddingEnd: wp("5%"),
    paddingLeft: wp("60%"),
    backgroundColor: colors.background,
  },
  container1: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.background,
  },
  logo: {},

  Image: {
    height: 70,
    width: 50,
  },
  TextInput: {
    borderWidth: 1,
    borderColor: colors.label,
    borderRadius: 1,
    paddingHorizontal: wp("2.5%"),
    padding: 8,
    margin: wp("5%"),
    width: wp("50%"),
    backgroundColor: colors.background,
  },

  appButtonContainer: {
    elevation: 8,
    backgroundColor: colors.button,
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginTop: 10,
  },
  arrowButtonContainer: {
    elevation: 8,
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  signOutButtonContainer: {
    elevation: 8,
    backgroundColor: colors.button,
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  appButtonText: {
    fontSize: 18,
    color: colors.buttonText,
    fontWeight: "bold",
    alignSelf: "center",
    textTransform: "uppercase",
  },
  container2: {
    flex: 2,
    marginTop: hp("10%"),
    color: colors.text,
    backgroundColor: colors.background,
  },
});
