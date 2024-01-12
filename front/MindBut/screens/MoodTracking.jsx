import { 
  SafeAreaView, 
  StatusBar, 
  View, 
  StyleSheet, 
  FlatList,
  Pressable,
  Text,
  Dimensions,
  Image
} from 'react-native';
import axios from 'axios';
import { Colors, Device } from '../components/common/styles';
import { useNavigation } from '@react-navigation/native';
import { useRef, useState } from 'react';
import Button from '../components/common/Button';
import SelectMood from '../components/moodtracking/SelectMood';
import ScaleMood from '../components/moodtracking/ScaleMood';
import SelectReason from '../components/moodtracking/SelectReason';
import EasyChat from '../components/moodtracking/EasyChat';


export default MoodTracking = () => {
  // Refs
  const flatListRef = useRef();
  const navigation = useNavigation();

  // States
  const [currentPage, setCurrentPage] = useState(0);
  // Select Mood
  const [response1, setResponse1] = useState({ category: '', subcategory: '' });
  // Scale Mood
  const [response2, setResponse2] = useState();
  // Select Reason
  const [response3, setResponse3] = useState();

  // Send & Reply
  // const [message, setMessage] = useState();
  // const [reply, setReply] = useState();
  // const [choices, setChoices] = useState();
  const [messages, setMessages] = useState({choices: [], choiceRes: []});

  // Sub-pages within Mood Tracking
  const PAGES = [{
    key: '1',
    component: (
      <SelectMood response={response1} setResponse={setResponse1}/>
    )
  }, {
    key: '2',
    component: (
      <ScaleMood 
        current={response1.subcategory} 
        response={response2} 
        setResponse={setResponse2} 
      />
    )
  }, {
    key: '3',
    component: (
      <SelectReason 
        current={response1.subcategory} 
        response={response3} 
        setResponse={setResponse3} 
      />
    )
  }, {
    key: '4',
    component: (
      <EasyChat messages={messages} setResponse1={setResponse1} setResponse2={setResponse2} setResponse3={setResponse3} setCurrentPage={setCurrentPage} setMessages={setMessages} />
    )
  }];

  // Send to server
  const sendChatToServer = async () => {
    const requestBody = {
      "user": {
        "user_id": 0,
        "user_kakaotalk": "1234567890",
        "user_name": "string",
        "bot_name": "string",
        "survey_question_one": "string",
        "survey_question_two": "string",
        "survey_question_three": "string",
        "survey_question_four": "string",
        "survey_question_five": "string"
      },
      "moodtracking": {
        "moodtracking_id": 0,
        "user_id": 0,
        "moodtracking_date": "2023-12-21",
        "message_prompt": "string",
        "message_first": "string",
        "message_second": "string",
        "message_first_answer": "string",
        "message_second_answer": "string",
        "message_model": "string",
        "emotion_reason": response3,
        "emotion_one": response1.category,
        "emotion_two": response1.subcategory,
        "emotion_intensity": response2
      }
    };

    await axios.post(
      "http://localhost:8000/moodtracking",
      requestBody
    ).then(
      () => axios.get(
        "http://localhost:8000/moodtracking/record/last?user_kakaotalk=1234567890"
      )
    ).then(
      // TODO: Replace message
      // (res) => { setMessage(res.data.message_prompt); setReply(res.data.message_model); }
      (res) => setMessages({
        userMessage: res.data.message_prompt,
        response: res.data.message_model,
        choices: [res.data.message_first, res.data.message_second],
        choiceRes: [res.data.message_first_answer, res.data.message_second_answer]
        // choices: ["Hello", "World"],
        // choiceRes: ["olleH", "dlroW"],
      })
    ).catch(
      (err) => console.error(err)
    );
  };

  /**
   * Show next page elements. If end of page, do nothing
   */
  const showNextPage = async () => {
    try {
      if (currentPage === 2) {
        await sendChatToServer();
      }
      flatListRef.current.scrollToIndex({
        animated: true, 
        index: currentPage + 1
      });
      setCurrentPage((currentPage) => ++currentPage);
    } catch (err) {
      // End of page
    }
  }

  /**
   * Show previous page elements. If start of page, do nothing
   */
  const showPrevPage = () => {
    try {
      flatListRef.current.scrollToIndex({
        animated: true, 
        index: currentPage - 1
      });
      setCurrentPage((currentPage) => --currentPage);
    } catch(err) {
      navigation.navigate('CheckIn');
    }
  }
  
  /**
   * Different disabled conditions for each pages
   * 
   * @param {*} page Current page
   * @returns Button component with corresponding props.
   */
  const disabledFor = (page) => {
    switch (page) {
      case 0: return !(response1.category && response1.subcategory);
      case 1: return !response2;
      case 2: return !response3;
      default: break;
    };
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar />
      <View style={styles.pageHeader}>
        {(currentPage < 4) ? (
          <Pressable onPress={showPrevPage}>
            <Image 
              style={{width: 28, height: 28, marginBottom: 20}} 
              source={require("../assets/left-arrow.png")}
            />
          </Pressable>
        ) : (
          <></>
        )}
      </View>
      <FlatList
        ref={flatListRef}
        scrollEnabled={false}
        data={PAGES}
        horizontal={true}
        renderItem={({item}) => (
          <View style={styles.pageBody}>
            {item.component}
          </View>
        )}
        keyExtractor={item => item.key}
      />
      {(currentPage < 3) ? (
        <View style={styles.pageFooter}>
          <Button 
            text={"다음"} 
            onPress={showNextPage} 
            disabled={disabledFor(currentPage)}
          />
        </View>
      ) : (
        <></>
      )}
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
  pageHeader: {
    // borderWidth: 3,
    height: Device.tabBarHeight,
    flexDirection: 'column',
    justifyContent: 'space-between',
    width: Device.fullLayoutWidth,
    height: Device.tabBarHeight,
  },
  pageBody: {
    height: '100%',
    width: Dimensions.get("screen").width,
    alignItems: 'center',
  },
  pageFooter: {
    // borderWidth: 2,
    borderColor: 'green',
    justifyContent: 'center',
    width: Device.fullLayoutWidth,
    height: Device.navigationHeight,
  },
});
