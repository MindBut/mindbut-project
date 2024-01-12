import {
  View,
  Text,
  StyleSheet
} from 'react-native'
import { Colors, Fonts } from '../common/styles';

export default PrepareSetup = ({ username }) => {
  return (
    <View style={{ height: '100%', justifyContent: 'center' }}>
      <Text style={styles.header}>
        {username + "님만을 위한 맞춤형 마인드벗을 준비 중이에요."}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    fontSize: 32,
    fontFamily: Fonts.header,
    marginVertical: 20,
    paddingHorizontal: 20,
  },
  body: {
    fontSize: 20,
    fontFamily: Fonts.body,
    color: Colors.grayFont,
    paddingHorizontal: 20,
  },
});
