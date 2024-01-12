import { 
  Text,
  StyleSheet, 
  View,
  Image,
  Pressable,
} from 'react-native';
import { Colors, Device, Fonts } from '../common/styles';
import BedIcon from '../../assets/icons/bed.svg';
import BodyIcon from '../../assets/icons/body.svg';
import ChatIcon from '../../assets/icons/chat.svg';
import CleaningIcon from '../../assets/icons/cleaning.svg';
import ExtIcon from '../../assets/icons/external.svg';
import FamilyIcon from '../../assets/icons/family.svg';
import FoodIcon from '../../assets/icons/food.svg';
import FriendIcon from '../../assets/icons/friend.svg';
import HealthIcon from '../../assets/icons/health.svg';
import HomeIcon from '../../assets/icons/home.svg';
import LoveIcon from '../../assets/icons/love.svg';
import MoneyIcon from '../../assets/icons/money.svg';
import MusicIcon from '../../assets/icons/music.svg';
import RunningIcon from '../../assets/icons/running.svg';
import SchoolIcon from '../../assets/icons/school.svg';
import SelfIcon from '../../assets/icons/self.svg';
import WeatherIcon from '../../assets/icons/weather.svg';
import WorkIcon from '../../assets/icons/work.svg'; 
import CloudIcon from '../../assets/icons/moodcloud.svg'; 


export default MoodTrackingElement = ({ category, scale, mood, reason, time}) => {

  const iconPath = "../../assets/wip.png";

  const moodColorSelector = (category) => {
    switch (category) {
      case '기쁨': return '#42def3';
      case '당황': return '#44f964';
      case '분노': return '#7e58f7';
      case '불안': return '#ffdf46';
      case '상처': return '#ffc146';
      case '슬픔': return '#ff5a5a';
      default: return '#ffffff';
    };
  };

  const moodIconSelector = (reason) => {
    const iconSize = 24;

    switch (reason) {
      case '일': return (<WorkIcon color={Colors.grayText} width={iconSize} height={iconSize} />);
      case '학교': return (<SchoolIcon color={Colors.grayText} width={iconSize} height={iconSize} />);
      case '외부활동': return (<ExtIcon color={Colors.grayText} width={iconSize} height={iconSize} />);
      case '집': return (<HomeIcon color={Colors.grayText} width={iconSize} height={iconSize} />);
      case '나': return (<SelfIcon color={Colors.grayText} width={iconSize} height={iconSize} />);
      case '연인': return (<LoveIcon color={Colors.grayText} width={iconSize} height={iconSize} />);
      case '가족': return (<FamilyIcon color={Colors.grayText} width={iconSize} height={iconSize} />);
      case '친구': return (<FriendIcon color={Colors.grayText} width={iconSize} height={iconSize} />);
      case 'SNS': return (<ChatIcon color={Colors.grayText} width={iconSize} height={iconSize} />);
      case '음악': return (<MusicIcon color={Colors.grayText} width={iconSize} height={iconSize} />);
      case '수면': return (<BedIcon color={Colors.grayText} width={iconSize} height={iconSize} />);
      case '운동': return (<RunningIcon color={Colors.grayText} width={iconSize} height={iconSize} />);
      case '몸': return (<BodyIcon color={Colors.grayText} width={iconSize} height={iconSize} />);
      case '건강': return (<HealthIcon color={Colors.grayText} width={iconSize} height={iconSize} />);
      case '음식': return (<FoodIcon color={Colors.grayText} width={iconSize} height={iconSize} />);
      case '돈': return (<MoneyIcon color={Colors.grayText} width={iconSize} height={iconSize} />);
      case '날씨': return (<WeatherIcon color={Colors.grayText} width={iconSize} height={iconSize} />);
      case '청소': return (<CleaningIcon color={Colors.grayText} width={iconSize} height={iconSize} />);
      default: return (<></>);
    }
  };

  const concatScaleAndMood = (scale, mood) => {
    // Clamp value to [0, 1]
    scale = Math.max(Math.min(scale, 1), 0);
    
    if (scale > 0.8) return "아주 많이 " + mood;
    else if (scale > 0.6) return "많이 " + mood;
    else if (scale > 0.4) return mood;
    else if (scale > 0.2) return "조금 " + mood;
    else return "아주 조금 " + mood;
  };
  

  return (
    <View style={styles.wrapper}>
      <View style={styles.header}>
        <CloudIcon color={moodColorSelector(category)} width={24} height={24} />
        <View style={styles.headerContent}>
          <Text style={styles.mood}>{concatScaleAndMood(scale, mood)}</Text>
          <View style={{justifyContent: 'flex-end'}}>
          </View>
        </View>
      </View>
      <View style={styles.body}>
        <View style={{width: 24, alignItems: 'center',}}>
          <View style={{...styles.horizontalBar, backgroundColor: moodColorSelector(category)}}>
            <Text style={styles.mood}>{/* Vertical Bar */} </Text>
          </View>
        </View>
        <Pressable 
          style={{...styles.bodyContent, backgroundColor: moodColorSelector(category)}}
          onPress={() => console.log({mood}, {category})}
        >
          {moodIconSelector(reason)}
          <Text style={styles.reason}>{reason}</Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    // borderWidth: 1,
    width: '100%',
    marginVertical: 10,
  },
  header: {
    flexDirection: 'row',
    marginBottom: 5,
  },
  headerContent: {
    // borderWidth: 1,
    width: Device.fullLayoutWidth - 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 5,
  },
  body: {
    flexDirection: 'row',
    width: '100%',
  },
  bodyContent: {
    width: Device.fullLayoutWidth - 24,
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'red',
    borderRadius: 24,
  },
  horizontalBar: {
    paddingVertical: 18, 
    width: 6, 
    borderRadius: 5
  },
  mood: {
    fontSize: 18,
    fontFamily: Fonts.header,
    color: Colors.grayText,
  },
  reason: {
    fontSize: 18,
    fontFamily: Fonts.body,
    color: Colors.grayText,
    marginHorizontal: 10,
  }
});
