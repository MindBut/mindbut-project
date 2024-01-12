import { 
  SafeAreaView, 
  StatusBar, 
  View, 
  Text,
  StyleSheet,
  ScrollView,
  Pressable, 
} from 'react-native';
import axios from 'axios';
import { Colors, Device, Fonts } from '../components/common/styles';
import { useNavigation } from '@react-navigation/native';
import MoodTrackingElement from '../components/moodrecord/MoodTrackingElement';
import CheckInElement from '../components/moodrecord/CheckInElement';
import ListIcon from '../assets/icons/list.svg'; 
import BubbleIcon from '../assets/icons/bubble.svg';
import { Calendar } from 'react-native-calendars';
import { useEffect, useState } from 'react';


export default MoodRecord = () => {

  // Navigation
  const navigation = useNavigation();

  // States
  const [selectedDate, setSelectedDate] = useState('2023-12-22');
  const [markedDates, setMarkedDates] = useState({});
  const [moodRecords, setMoodRecords] = useState([]);
  const [chatRecords, setChatRecords] = useState([]);
  
  const data = ['2023-12-18', '2023-12-19'];


  const getDataFromDate = async (dateString) => {
    // console.log(dateString);
  }

  // Effects
  useEffect(() => {
    axios.get(
      `http://localhost:8000/moodtracking/record/date?user_kakaotalk=1234567890&moodtracking_date=${selectedDate}`
    )
    .then((res) => res.data)
    .then((data) => setMoodRecords(data))
    .then(
      () => axios.get(
        `http://localhost:8000/chatting/record/date?user_kakaotalk=1234567890&counsel_date=${selectedDate}`
      )
    )
    .then((res) => res.data)
    .then((data) => setChatRecords(data))
    .catch((err) => console.error(err))
    // .then(
    //   () => {
    //     const dates = data.reduce(
    //       (c, v) => 
    //         Object.assign(c, {
    //           [v]: { selected: false, dots: [happy, angry] }
    //         }),
    //       {}
    //     );
    //     setMarkedDates(dates);
    //     console.log(dates);
    //   }
    // )
  }, []);

  
  // Calender
  const happy = {key: 'happy', color: '#42def3'};
  const embarrassed = {key: 'embarrassed', color: '#44f964', selectedDotColor: 'blue'};
  const angry = {key: 'angry', color: '#7e58f7'};
  const anxious = {key: 'anxious', color: '#ffdf46'};
  const hurt = {key: 'hurt', color: '#ffc146'};
  const sad = {key: 'sad', color: '#ff5a5a'};

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar />
      <View style={styles.calendarArea}>
        <Calendar
          theme={{
            selectedDayBackgroundColor: Colors.tertiary,
            selectedDayTextColor: Colors.grayText,
            todayTextColor: Colors.primary,
            textMonthFontFamily: Fonts.header,
            textMonthFontSize: 18,
            textMonthFontWeight: 'bold',
            textDayFontFamily: Fonts.body,
            arrowColor: Colors.lightGrayUI,
          }}
          onDayPress={(day) => {
            setSelectedDate(day.dateString);
            axios.get(
              `http://localhost:8000/moodtracking/record/date?user_kakaotalk=1234567890&moodtracking_date=${day.dateString}`
            )
            .then((res) => res.data)
            .then((data) => setMoodRecords(data))
            .then(
              () => axios.get(
                `http://localhost:8000/chatting/record/date?user_kakaotalk=1234567890&counsel_date==${day.dateString}`
              )
            )
            .then((res) => setChatRecords(res.data))
            .catch((err) => setChatRecords([]))

            console.log(chatRecords);
          }}
          markingType={'multi-dot'}
          markedDates={{
            ...markedDates,
            [selectedDate]: {
              selected: true,
              dots: markedDates[selectedDate]?.dots,
            }
          }}
        />
      </View>
      <ScrollView style={styles.recordsArea}>
        <Text style={{fontSize: 28, fontFamily: Fonts.header}}>무드 트래킹</Text>
        {/* <MoodTrackingElement scale={0.9} category={"기쁨"} mood={"감사한"} reason={"학교"} time={"4:44 PM"} />
        <MoodTrackingElement scale={0.2} category={"슬픔"} mood={"짜증난"} reason={"수면"} time={"4:54 PM"} /> */}
        {moodRecords.map((item) => (
          <MoodTrackingElement 
            scale={item.emotion_intensity} 
            category={item.emotion_one}
            mood={item.emotion_two}
            reason={item.emotion_reason}
            key={moodRecords.indexOf(item)}
          />
        ))}
        <Text style={{fontSize: 28, fontFamily: Fonts.header, marginTop: 30,}}>상담 체크인</Text>
        {chatRecords && chatRecords.map((item) => (
          <Pressable 
            key={chatRecords.indexOf(item)}
            onPress={() => navigation.navigate(
              'DisplayChatRecord', {id: item.counsel_id})}
          >
            <CheckInElement chat={item.chatting_user} />
          </Pressable>
        ))}
      </ScrollView>
      <View style={styles.navigatorArea}>
        <Pressable 
          style={{
            ...styles.navigator, 
            // borderRightWidth: styles.navigator.borderTopWidth
          }}
          onPress={() => navigation.navigate('CheckIn')}
        >
          <BubbleIcon color={Colors.lightGrayUI} height={32} />
          <Text style={styles.navigatorText}>체크인</Text>
        </Pressable>
        <Pressable 
          style={styles.navigator}
          onPress={() => navigation.navigate('MoodTracking')}
        >
          <ListIcon width={18} height={18} />
          <Text style={styles.navigatorText}>무드 트래킹</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? 20 : 0,
    backgroundColor: Colors.trueWhite,
    alignItems: 'center',
  },
  calendarArea: {
    width: Device.fullLayoutWidth,
    height: '47%',
    
    // borderWidth: 3,
    borderColor: 'red'
  },
  recordsArea: {
    // borderWidth: 1,
    borderTopWidth: 1,
    paddingTop: 16,
    borderColor: Colors.lightGray,
    width: Device.fullLayoutWidth,
  },
  navigatorArea: {
    width: Device.width,
    height: Device.tabBarHeight,
    flexDirection: 'row',
    // borderWidth: 3,
    borderColor: 'green',
  },
  navigator: {
    width: '50%',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    borderTopWidth: 1,
    borderColor: Colors.lightGray,
  },
  navigatorText: {
    marginHorizontal: 10,
    fontFamily: Fonts.body,
    fontSize: 18,
    color: Colors.lightGrayUI,
  }
});
