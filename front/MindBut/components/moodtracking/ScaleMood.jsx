import { 
  View, 
  StyleSheet,
  Text,
} from 'react-native';
import { Colors, Fonts } from '../common/styles';
import Slider from '@react-native-community/slider';


export default ScaleMood = ({ current, response, setResponse }) => {

  return (
    <>
      <Text style={styles.text}>얼마나 <Text style={styles.em}>{current}</Text>가요?</Text>
      <View style={styles.content}>
      <View style={styles.indicatorArea}>
          <View></View>
          <View style={styles.indicatorBox}>
            <Text style={styles.indicator}>아주 많이</Text>
            <Text style={styles.indicator}>많이</Text>
            <Text style={styles.indicator}>보통</Text>
            <Text style={styles.indicator}>조금</Text>
            <Text style={styles.indicator}>아주 조금</Text>
          </View>
        </View>
        <View style={styles.sliderBox}>
          <Slider 
            value={response} 
            onValueChange={(value) => setResponse(value)} 
            style={styles.slider}
            step={0.01}
            thumbTintColor={Colors.primary}
            // thumbImage={require("../../../assets/slider-thumb.png")}
            // minimumTrackImage={require("../../../assets/slider-thumb.png")}
          />
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  text: {
    fontFamily: Fonts.header,
    fontSize: 24,
    marginVertical: 3
  },
  em: {
    color: Colors.primary,
  },
  content: {
    marginTop: 40,
    height: '80%', 
    width: '100%', 
    alignItems: 'center', 
    justifyContent: 'center',
  },
  indicatorArea: {
    position: 'absolute',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: '100%',
    width: '100%',
    paddingHorizontal: 40,
    flexDirection: 'row',
  },
  indicatorBox: {
    height: 450,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  indicator: {
    fontFamily: Fonts.header,
    fontSize: 18,
  },
  sliderBox: {
    position: 'absolute',
    transform: [{ rotate: '-90deg' }],
    justifyContent: 'center',
  },
  slider: {
    width: 450,
  },
});
