import axios from 'axios';
import { useEffect, useState } from 'react';
import { 
  Pressable,
  SafeAreaView,
  ScrollView, 
  StatusBar, 
  StyleSheet,
  Text,
} from 'react-native';

export default DisplayChatRecord = ({navigation: {navigate}, route}) => {

  // States
  const [data, setData] = useState([]);

  useEffect(() => {
    axios.get(
      `http://localhost:8000/chatting/record/${route.params.id}`
    )
    .then(res => setData(res.data))
  }, [])

  return (
    <SafeAreaView>
      <StatusBar />
      {data.map((item) => (
        <Text key={data.indexOf(item)}>{item.chatting_user}</Text>
      ))}
    </SafeAreaView>
  );
};