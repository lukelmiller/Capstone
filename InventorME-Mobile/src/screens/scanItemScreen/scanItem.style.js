import { faAlignCenter } from '@fortawesome/free-solid-svg-icons';
import {StyleSheet} from 'react-native';
import { colors } from '../../util/colors';

export default StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
    },
    text: {
        fontSize: 20,
        fontWeight: "bold",
        justifyContent: 'center',
        textAlign:"center",
        color:colors.accent,
      }
});