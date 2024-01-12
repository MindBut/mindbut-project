import { 
  Text,
  StyleSheet, 
  View,
  Image,
  Pressable,
} from 'react-native';
import { Colors, Device, Fonts } from '../common/styles';
import BubbleIcon from '../../assets/icons/bubble.svg'; 

export default CheckInElement = ({ chat }) => {

  return (
    <View style={styles.wrapper}>
      <View style={{width: '100%', alignItems: 'flex-end'}}>
        <View style={styles.chatBox}>
          <Text style={styles.chatText}>{chat}</Text>
        </View>
      </View>
      <BubbleIcon style={styles.chatIcon} />
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    // borderWidth: 1,
    width: '100%',
    marginVertical: 10,
  },
  chatBox: {
    width: Device.fullLayoutWidth - 12,
    backgroundColor: Colors.secondary,
    paddingVertical: 18,
    paddingHorizontal: 24,
    borderRadius: 18,
  },
  chatText: {
    fontSize: 18,
    fontFamily: Fonts.body,
  },
  chatIcon: {
    width: 24,
    height: 24,
    position: 'absolute',
  }
});
