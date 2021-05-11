import { StyleSheet } from "react-native";
import { colors } from "../../util/colors";

export default StyleSheet.create({
  Page: {
    flex: 1,
    alignItems: "stretch",
  },
  child: {
    alignItems: "flex-start",
    justifyContent: "center",
  },
  arrow: {
    alignItems: "flex-start",
    justifyContent: "flex-end",
    paddingTop: 50,
    paddingStart: 30,
    backgroundColor: colors.background,
  },
  container: {
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
    borderColor: colors.text,
    borderRadius: 6,
    paddingHorizontal: 16,
    color: colors.text,
    padding: 8,
    margin: 10,
    width: 200,
    backgroundColor: colors.background,
  },

  appButtonContainer: {
    elevation: 8,
    backgroundColor: colors.button,
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  arrowButtonContainer: {
    elevation: 8,
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
});
