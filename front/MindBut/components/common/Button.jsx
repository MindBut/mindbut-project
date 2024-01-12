import { 
  Text,
  StyleSheet, 
  Pressable,
} from 'react-native';
import { Colors, Fonts } from './styles';

/**
 * A button.
 * 
 */
export default Button = ({ text, onPress, disabled, alternativeStyle }) => {
  const selectedStyle = 
    alternativeStyle ? {...styles.button, ...styles.alternative} 
      : styles.button;

  const selectedTextStyle = 
    alternativeStyle ? {...styles.buttonText, ...styles.alternativeText}
      : styles.buttonText

  return (
    <Pressable 
      onPress={onPress} 
      style={{
        ...selectedStyle, 
        backgroundColor: 
          disabled ? Colors.gray : selectedStyle.backgroundColor,
        borderColor: disabled ? Colors.gray : selectedStyle.borderColor,
      }}
      disabled={disabled}>
      <Text
        style={{
          ...selectedTextStyle,
          color: disabled ? Colors.trueWhite : selectedTextStyle.color,
        }}>
        {text}
      </Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: 15,
    marginVertical: 5,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.primary,
    backgroundColor: Colors.primary,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: Colors.trueWhite,
    fontFamily: Fonts.header,
    fontSize: 20,
  },
  alternative: {
    backgroundColor: Colors.trueWhite,
  },
  alternativeText: {
    color: Colors.primary,
  },
});
