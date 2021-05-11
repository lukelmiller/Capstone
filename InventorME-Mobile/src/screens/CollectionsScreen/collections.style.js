import {StyleSheet} from 'react-native';
import { colors } from '../../util/colors';

export default StyleSheet.create({
    container : {
        flex : 1,
        backgroundColor : colors.background,
        alignItems : 'flex-start',
        justifyContent : 'flex-start',
    },

    boxFolder:{
        flex: .25,
        backgroundColor : colors.background,
        flexDirection:'row',
        flexWrap : "wrap",
    }
});