import { 
  Text,
  StyleSheet, 
  Pressable,
} from 'react-native';
import { Colors, Fonts } from './styles';

/**
 * Option component for selection.
 * 
 */
export default Option = ({ text, element, onPress, selected, style, fontStyle }) => {
  const selectedBackground = 
    selected ? {...styles.option, ...styles.optionSelected} : styles.option;
  const selectedColor = 
    selected ? {...styles.optionText, ...styles.optionTextSelected} 
      : styles.optionText;
  return (
    <Pressable 
      onPress={onPress} 
      style={StyleSheet.flatten([selectedBackground, style])}>
      { element }
      <Text style={StyleSheet.flatten([selectedColor, fontStyle])}>
        {text}
      </Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  option: {
    paddingVertical: 18,
    paddingHorizontal: 25,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.gray,
    backgroundColor: Colors.trueWhite,
    marginVertical: 10,
    width: '100%',
    alignItems: 'center',
    ...Platform.select({
      ios: { 
        shadowColor: "#7090B0",
        shadowOffset: {
	        width: 0,
	        height: 2,
        },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      },
      android: { 
        elevation: 12,
      },
    })
  },
  optionSelected: {
    borderWidth: 1,
    borderColor: Colors.primary,
    backgroundColor: Colors.tertiary,
  },
  optionText: {
    fontFamily: Fonts.header,
    fontSize: 18,
    color: Colors.grayText,
  },
  optionTextSelected: {
    fontFamily: Fonts.header,
    color: Colors.primary
  },
});
