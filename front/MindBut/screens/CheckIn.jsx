import { 
  SafeAreaView, 
  StatusBar, 
  View, 
  StyleSheet, 
  ScrollView,
  TextInput,
  Pressable,
  Text,
  KeyboardAvoidingView,
  Dimensions,
  Image
} from 'react-native';
import axios from 'axios';
import { Colors, Fonts } from '../components/common/styles';
import { useNavigation } from '@react-navigation/native';
import Button from '../components/common/Button';
import Chat from '../components/common/Chat';
import { useRef, useState, useEffect } from 'react';


export default CheckIn = () => {


  // Refs
  const scrollRef = useRef();
  const navigation = useNavigation();

  // States
  const [isChatting, setIsChatting] = useState(false);
  const [chatText, setChatText] = useState('');
  
  const [chatLists, setChatLists] = useState([{
    fromUser: false, 
    chats: []
  }]);

  useEffect(() => {
    axios.get(
      "http://localhost:8000/login?user_kakaotalk=1234567890"
    )
    .then((res) => res.data)
    .then((data) => setChatLists([{
      fromUser: false, 
      chats: [{
        seq: 1,
        text: '정신건강을 위한 투자가 시간 낭비처럼 느껴질 수도 있어요.',
      }, {
        seq: 2,
        text: '하지만 마음 속에만 언젠가 묵혀둔 감정들이 터져버릴지도...',
      }, {
        seq: 3,
        text: '지금 ' + data.user_name + '님의 감정은 어떠신가요?',
      }, {
        seq: 4,
        text: '오늘 어떻게 도와드릴까요?',
      }] 
    }]))
    // .then(() => console.log(name))
  }, []);

  const sendChatToServer = async () => {
    // TODO: Send to server
    setChatLists((chatLists) => [
      ...chatLists, 
      {
        fromUser: true, 
        chats: [{ seq: 1, text: chatText }]
      }
    ]);

    setChatText('');
    
    await axios.post(
      "http://localhost:8000/counsel/chatting",
      {
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
        "chatting": {
          "chatting_id": 0,
          "counsel_id": 0,
          "chatting_datetime": "2023-12-22T03:15:38.871Z",
          "chatting_user": chatText,
          "chatting_computer": "string"
        }
      }
    ).then(
      () => axios.get(
        "http://localhost:8000/chatting/record/last?user_kakaotalk=1234567890"
      )
    ).then(
      // (res) => console.log(res.data)
      (res) => setChatLists((chatLists) => [
        ...chatLists, 
        {
          fromUser: false, 
          chats: [{ seq: 1, text: res.data.chatting_computer }]
        }
      ])
    );

    // TODO: Receive from server
    // setTimeout(() => {
    //   setChatLists((chatLists) => [
    //     ...chatLists, 
    //     {
    //       fromUser: false, 
    //       chats: [{ seq: 1, text: chatText }]
    //     }
    //   ]);
    // }, 1000);
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar />
      <View style={styles.pageHeader}>
        {isChatting ? (
          <Pressable onPress={() => {
            setIsChatting(false)
            navigation.navigate('MoodRecord')
          }} style={styles.quit}>
            <Text style={styles.quitText}>상담 종료</Text>
          </Pressable>
        ) : (
          <></>
        )}
      </View>
      <ScrollView 
        style={styles.pageBody} 
        ref={scrollRef}
        onContentSizeChange={() => scrollRef.current.scrollToEnd()}>
        {chatLists.map((item) => (
          <Chat texts={item.chats} fromUser={item.fromUser} key={chatLists.indexOf(item)} />
        ))}
      </ScrollView>
      {isChatting ? (
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.input}>
          <TextInput
            style={styles.inputField}
            multiline
            // clearButtonMode='always'
            onChangeText={(text) => setChatText(text)}
            value={chatText}
          />
          <Pressable onPress={() => sendChatToServer()}>
            <Image
              source={require("../assets/subtract.png")}
              style={styles.icon} />
          </Pressable>
        </KeyboardAvoidingView>
      ) : (
        <View style={styles.pageFooter}>
          <Button 
            text={"직접 입력하기"} 
            alternativeStyle={true} 
            onPress={() => {
              setIsChatting(true)
              axios.post(
                "http://localhost:8000/counsel",
                {
                  "user_id": 0,
                  "user_kakaotalk": "1234567890",
                  "user_name": "string",
                  "bot_name": "string",
                  "survey_question_one": "string",
                  "survey_question_two": "string",
                  "survey_question_three": "string",
                  "survey_question_four": "string",
                  "survey_question_five": "string"
                }
              )
            }} />
          <Button 
            text={"무드 트래킹하기"} 
            onPress={() => navigation.navigate('MoodTracking')}/>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? 20 : 0,
    backgroundColor: Colors.trueWhite,
  },
  pageHeader: {
    height: '7%',
    paddingHorizontal: 20,
    alignItems: 'flex-end',
    borderBottomWidth: 2,
    borderColor: Colors.lightGray,
  },
  pageBody: {
    height: '75%',
  },
  pageFooter: {
    height: '25%',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  quit: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.lightGray,
    paddingVertical: 5,
    paddingHorizontal: 20,
    backgroundColor: Colors.white,
  },
  quitText: {
    fontFamily: Fonts.header,
    fontSize: 16,
    color: Colors.darkGray,
  },
  input: {
    flexDirection: 'row',
  },
  inputField: {
    width: Dimensions.get('window').width - 70,
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
})
