import { 
  View,
  StyleSheet,
  FlatList,
  Text,
} from 'react-native';
import { Device } from '../common/styles';
import Option from '../common/Option';


export default SetGoals = ({ goalResponse, setGoalResponse }) => {
  
  // Goals to select
  const GOALS = [{
    key: 'option1',
    text: '불안 완화',
  }, {
    key: 'option2',
    text: '관계 개선',
  }, {
    key: 'option3',
    text: '생산성 향상',
  }, {
    key: 'option4',
    text: '우울 완화',
  }, {
    key: 'option5',
    text: '자존감 향상',
  }, {
    key: 'option6',
    text: '자신감 향상',
  }, {
    key: 'option7',
    text: '스트레스 완화',
  }, {
    key: 'option8',
    text: '행복 증대',
  }];

  return (
    <>
      <View style={{width: Device.fullLayoutWidth}}>
        <Instruction 
          title={"무엇을 위해 \n가입하셨나요?"}
          description={"당신의 목표에 기반하여 마인드벗이 맞춤형 솔루션을 제공합니다."}
        />
      </View>
      <View style={styles.optionArea}>
        <FlatList 
          keyExtractor={item => item.key}
          data={GOALS}
          style={{width: '100%', paddingHorizontal: 20}}
          columnWrapperStyle={{justifyContent: 'space-between'}}
          renderItem={({item}) => (
            <Option 
              text={item.text} 
              selected={goalResponse === item.text}
              onPress={() => setGoalResponse(item.text)}
              style={{width: '47%'}}
              fontStyle={{fontSize: 16}}
            />
          )}
          numColumns={2}
        />
      </View>
    </>
  )
};

const styles = StyleSheet.create({
  optionArea: {
    width: Device.fullLayoutWidth,
    flex: 1,
    marginTop: 30,
  },
});
