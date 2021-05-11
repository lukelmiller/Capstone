import {StyleSheet} from 'react-native';
import { colors } from '../../util/colors';

export default StyleSheet.create({
    page:{
        backgroundColor: colors.background
    },
    container:{
        backgroundColor: colors.background,
        flex:1,
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'center'
    },  
    stat:{
        backgroundColor: colors.background,
        color: colors.label,
        justifyContent: 'center',
        width: "45%",
        margin: "2%"
    },
    label:{
        fontSize: 20,
        color: colors.label,
        textAlign: 'center'
    }

});