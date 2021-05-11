import {StyleSheet} from 'react-native';
import { colors } from '../../util/colors';

export default StyleSheet.create({
      mainContainer: {
        flex:2,
        backgroundColor:colors.background,
        justifyContent:'center',
      },
      container:{
        flex:3,
        backgroundColor: colors.background,
        justifyContent:'center',
        alignItems:'center',
        bottom:'10%',
      },
      Image:{
        height:70,
        width: 50,
      },
      TextInput:{
        borderWidth:1,
        borderColor: colors.text,
        color: colors.text,
        borderRadius: 8,
        padding: 8,
        margin: 10,
        width: 200,
      },
      appButtonContainer: {
        elevation: 8,
        backgroundColor: colors.button,
        borderRadius: 10,
        paddingVertical: 10,
        paddingHorizontal: 12,
        marginTop:'15%',
        marginRight:'4%',
        margin : 5
      },
      signUpButton:{
        elevation: 8,
        backgroundColor: colors.button,
        borderRadius: 10,
        paddingVertical: 10,
        paddingHorizontal: 12,
        marginTop:'25%',
        margin : 5
      },
      appButtonText: {
        fontSize: 18,
        color: colors.background,
        fontWeight: "bold",
        alignSelf: "center",
        textTransform: "uppercase"
      },
      signUpText: {
        fontSize: 20,
        color: colors.background,
        fontWeight: "bold",
        alignSelf: "center",
        textTransform: "uppercase",
      }
});