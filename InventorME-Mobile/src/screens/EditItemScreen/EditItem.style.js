import { StyleSheet } from 'react-native';
import { colors } from '../../util/colors';

export default StyleSheet.create({
  page:{
    backgroundColor: colors.background,
  },
  child: {
    width: "80%",
    marginLeft: "10%",
    marginTop: "5%"
  },
  child1: {
    width: "45%",
    marginLeft: "10%",
    marginTop: "5%"
  },
  container: {
    backgroundColor: colors.background,
    color: colors.text
  },
  label:{
    color: colors.label,
    fontWeight: 'bold',
    marginBottom: 5
  },
  image: {
    position: 'absolute',
    alignSelf: "flex-end",
    marginRight: '10%',
    marginTop: "12%"
  },
  textInput: {
    borderWidth: 0.5,
    borderColor: colors.text,
    borderRadius: 8,
    height: 35,
    backgroundColor: colors.background,
    color: colors.text,
    paddingLeft: 8
  },
  notesInput:{
    borderWidth: 0.5,
    borderColor: colors.text,
    borderRadius: 8,
    height: 150,
    backgroundColor: colors.background,
    color: colors.text,
    paddingLeft: 8
  },
  buttonContainer: { 
    justifyContent: 'center', 
    alignItems: 'center', 
    flexDirection: 'row'
  },
  button: {
    backgroundColor: colors.button,
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    margin: 45
  },
  buttonCancel: {
    backgroundColor: colors.button,
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    width: '25%',
    marginTop: "15%",
    marginLeft: "10%"
  },
  uploadContainer:{
    position: 'absolute',
    alignSelf: "flex-end",
    marginRight: '25%',
    marginTop: "12%",
    justifyContent: 'center', 
    alignItems: 'center'
  },
  imageContainer:{
    position: 'absolute',
    alignSelf: "flex-end",
    marginRight: '25%',
    marginTop: "12%",
    justifyContent: 'center', 
    alignItems: 'center'
  },
  uploadButton: {
    borderRadius: 200,
    padding: 18,
    borderWidth: 5,
    borderColor: colors.iconBackless
  },
  buttonText: {
    fontSize: 18,
    color: colors.buttonText,
    fontWeight: "bold",
    alignSelf: "center",
    textTransform: "uppercase"
  }
});