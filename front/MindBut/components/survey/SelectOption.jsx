import { 
  Text,
  StyleSheet, 
  View,
  FlatList,
} from 'react-native';
import { Colors, Device, Fonts } from '../common/styles';
import Option from '../common/Option';


/**
 * Options for answering the given question.
 * For `question` prop, wrap text with `$` for emphasis and `\n` for line break.
 * 
 * @param {*} props { question, responseId, setResponseId }
 * @returns Display options for the given question
 */
export default SelectOption = ({ questionId, responseId, setResponseId }) => {

  // Responses to be chosen
  const RESPONSES = [{
    key: 'option1',
    text: '거의 매일 방해받았다.',
  }, {
    key: 'option2',
    text: '7일 이상 방해받았다.',
  }, {
    key: 'option3',
    text: '며칠 동안 방해받았다.',
  }, {
    key: 'option4',
    text: '전혀 방해 받지 않았다.',
  }];

  const QUESTIONS = [(
    <>
      <Text style={styles.question}>지난 2주일 동안 <Text style={styles.em}>기분이 가라앉거나</Text></Text>
      <Text style={styles.question}><Text style={styles.em}>우울하거나 희망이 없다고 느껴지는 것</Text>으로 인해</Text>
      <Text style={styles.question}>얼마나 자주 방해를 받았습니까? </Text>
    </>
  ), (
    <>
      <Text style={styles.question}>지난 2주일 동안 <Text style={styles.em}>일 또는 여가 활동을 하는 데</Text></Text>
      <Text style={styles.question}><Text style={styles.em}>흥미나 즐거움을 느끼지 못하는 것</Text>으로 인해</Text>
      <Text style={styles.question}>얼마나 자주 방해를 받았습니까? </Text>
    </>
  ), (
    <>
      <Text style={styles.question}>지난 2주일 동안 <Text style={styles.em}>걱정하는 것을</Text></Text>
      <Text style={styles.question}><Text style={styles.em}>멈추거나 조절할 수가 없는 것</Text>으로 인해</Text>
      <Text style={styles.question}>얼마나 자주 방해를 받았습니까? </Text>
    </>
  ), (
    <>
      <Text style={styles.question}>지난 2주일 동안 <Text style={styles.em}>초조하거나 불안하거나</Text></Text>
      <Text style={styles.question}><Text style={styles.em}>조마조마하게 느껴지는 것</Text>으로 인해</Text>
      <Text style={styles.question}>얼마나 자주 방해를 받았습니까? </Text>
    </>
  )];

  return (
    <>
      <View style={styles.questionArea}>
        {QUESTIONS[questionId]}
      </View>
      <View style={styles.optionArea}>
        <FlatList
          scrollEnabled={false}
          data={RESPONSES}
          renderItem={({item}) => (
            <View style={styles.optionWrap}>
              <Option
                text={item.text}
                selected={responseId === item.text}
                onPress={() => setResponseId(item.text)}
              />
            </View>
          )}
        />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  questionArea: {
    width: Device.fullLayoutWidth,
    alignItems: 'center',
    marginVertical: 60,
  },
  optionArea: {
    width: Device.width,
  },
  optionWrap: {
    marginHorizontal: 20,
  },
  question: {
    fontFamily: Fonts.header,
    fontSize: 18,
    marginVertical: 3
  },
  em: {
    color: Colors.primary,
  }
});
