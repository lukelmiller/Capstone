import {StyleSheet} from 'react-native';
import { colors } from '../../util/colors';

export default StyleSheet.create({
    container : {
        flex : 1,
        backgroundColor : colors.background,
        alignItems : 'center',
        alignSelf:'stretch',
        padding: 5,
    },
    boxFolderRow:{
        flex:1,
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'space-around',
        maxHeight:150,
    },
    boxFolderColumn:{
        flexDirection:'column',
        alignItems:'center', 
        justifyContent:'space-between',
    },
});