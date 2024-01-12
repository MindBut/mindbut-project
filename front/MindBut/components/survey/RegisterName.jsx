import { 
  StyleSheet, 
  View,
  TextInput,
  Pressable,
  Image,
  Dimensions,
} from 'react-native';
import { Colors, Fonts } from '../common/styles';
import Option from '../common/Option';
import Instruction from './Instruction';


export default RegisterName = ({ username, setUsername }) => {


  return (
    <>
      <View style={styles.instruction}>
        <Instruction title={"반갑습니다!"} description={"당신의 이름은 무엇인가요?"} />
      </View>
      <View style={styles.inputArea}>
        <TextInput
          style={styles.inputField}
          clearButtonMode='always'
          onChangeText={(text) => setUsername(text)}
          value={username}
          textAlign='center'
        />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  instruction: {
    width: '100%',
  },
  inputArea: {
    width: '100%',
    height: '60%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputField: {
    width: '100%',
    borderWidth: 1,
    borderColor: Colors.primary,
    backgroundColor: Colors.trueWhite,
    borderRadius: 16,
    padding: 15,
    paddingTop: 15,
    margin: 10,
    fontSize: 16,
  },
  icon: {
    width: 40,
    height: 40,
    marginVertical: 10,
  },
});
