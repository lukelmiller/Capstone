import { StyleSheet } from 'react-native';
import { colors } from '../../util/colors';

export default StyleSheet.create({
  page:{
    backgroundColor: colors.background
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
    color: colors.text,
    height: "150%",
    alignItems: 'stretch'
  },
  label:{
    color: colors.label,
    fontWeight: 'bold',
    marginBottom: 5
  },
  uploadContainer:{
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
    height: 100,
    backgroundColor: colors.background,
    color: colors.text,
    paddingLeft: 8
  },
  buttonContainer: { 
    justifyContent: 'center', 
    alignItems: 'center', 
    flexDirection: 'row',
    marginTop: "5%",
    marginBottom: "5%"
  },
  button: {
    backgroundColor: colors.button,
    borderRadius: 10,
    paddingVertical: 8,
    margin:"5%"

  },
  buttonCancel: {
    backgroundColor: colors.button,
    borderRadius: 10,
    paddingVertical: 8,
    width: '25%',
    marginTop: "15%",
    marginLeft: "10%"
  },
  buttonText: {
    fontSize: 18,
    color: colors.buttonText,
    fontWeight: "bold",
    alignSelf: "center",
    textTransform: "uppercase"
  }
});