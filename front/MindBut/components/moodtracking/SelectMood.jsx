import { 
  View, 
  StyleSheet, 
  FlatList,
  Text,
  Image
} from 'react-native';
import { Colors, Fonts } from '../common/styles';
import Option from '../common/Option';


export default SelectMood = ({ response, setResponse }) => {
  
  const IMGPATH = "../../assets/moods/"

  const MOODS = [{
    key: 'option1',
    category: '기쁨',
    subcategory: [
      { name: '감사한', img: require(IMGPATH+'happy/thank.jpeg') },
      { name: '신뢰하는', img: require(IMGPATH+'happy/trust.jpeg') },
      { name: '편안한', img: require(IMGPATH+'happy/relaxed.jpeg') },
      { name: '만족한', img: require(IMGPATH+'happy/satisfied.jpeg') },
      { name: '흥분한', img: require(IMGPATH+'happy/excited.jpeg') },
      { name: '느긋한', img: require(IMGPATH+'happy/slow.jpeg') },
      { name: '안도하는', img: require(IMGPATH+'happy/ando.jpeg') },
      { name: '신이 난', img: require(IMGPATH+'happy/sinnan.jpeg') },
      { name: '자신하는', img: require(IMGPATH+'happy/jasin.jpeg') },
    ]
  }, {
    key: 'option2',
    category: '당황',
    subcategory: [
      { name: '고립된', img: require(IMGPATH+'embarrassed/gorip.jpeg') },
      { name: '시선 의식하는', img: require(IMGPATH+'embarrassed/sisun.jpeg') },
      { name: '외로운', img: require(IMGPATH+'embarrassed/lonely.jpeg') },
      { name: '열등한', img: require(IMGPATH+'embarrassed/tenback.jpeg') },
      { name: '죄책감의', img: require(IMGPATH+'embarrassed/joechek.jpeg') },
      { name: '부끄러운', img: require(IMGPATH+'embarrassed/bukku.jpeg') },
      { name: '혐오스러운', img: require(IMGPATH+'embarrassed/hyumoh.jpeg') },
      { name: '한심한', img: require(IMGPATH+'embarrassed/hansim.jpeg') },
      { name: '헷갈리는', img: require(IMGPATH+'embarrassed/hetgal.jpeg') },
    ]
  }, {
    key: 'option3',
    category: '분노',
    subcategory: [
      { name: '툴툴대는', img: require(IMGPATH+'angry/tultul.png') },
      { name: '좌절하는', img: require(IMGPATH+'angry/leftbow.png') },
      { name: '짜증나는', img: require(IMGPATH+'angry/jajung.png') },
      { name: '방어적인', img: require(IMGPATH+'angry/defense.png') },
      { name: '악의적인', img: require(IMGPATH+'angry/agi.png') },
      { name: '안달나는', img: require(IMGPATH+'angry/andal.png') },
      { name: '구역질 나는', img: require(IMGPATH+'angry/guyok.png') },
      { name: '노여워 하는', img: require(IMGPATH+'angry/noyeo.png') },
      { name: '성가신', img: require(IMGPATH+'angry/songa.png') },
    ]
  }, {
    key: 'option4',
    category: '불안',
    subcategory: [
      { name: '두려운', img: require(IMGPATH+'anxious/scared.png') },
      { name: '스트레스 받는', img: require(IMGPATH+'anxious/stressed.png') },
      { name: '취약한', img: require(IMGPATH+'anxious/chiyak.png') },
      { name: '헷갈리는', img: require(IMGPATH+'anxious/hetgal.png') },
      { name: '당혹스러운', img: require(IMGPATH+'anxious/what.png') },
      { name: '회의적인', img: require(IMGPATH+'anxious/meeting.jpg') },
      { name: '걱정스러운', img: require(IMGPATH+'anxious/worry.jpg') },
      { name: '조심스러운', img: require(IMGPATH+'anxious/josim.jpg') },
      { name: '신경쓰이는', img: require(IMGPATH+'anxious/neuron.jpg') },
    ]
  }, {
    key: 'option5',
    category: '상처',
    subcategory: [
      { name: '질투하는', img: require(IMGPATH+'hurt/ziltwo.jpeg') },
      { name: '배신당한', img: require(IMGPATH+'hurt/betray.jpeg') },
      { name: '격리된', img: require(IMGPATH+'hurt/gorip.jpeg') },
      { name: '충격 받은', img: require(IMGPATH+'hurt/shock.jpeg') },
      { name: '궁핍한', img: require(IMGPATH+'hurt/gungpip.jpeg') },
      { name: '희생된', img: require(IMGPATH+'hurt/heesang.jpeg') },
      { name: '억울한', img: require(IMGPATH+'hurt/ogul.jpeg') },
      { name: '괴로워하는', img: require(IMGPATH+'hurt/hurt.jpeg') },
      { name: '버려진', img: require(IMGPATH+'hurt/trash.jpeg') },
    ]
  }, {
    key: 'option6',
    category: '슬픔',
    subcategory: [
      { name: '실망한', img: require(IMGPATH+'sad/silmang.jpeg') },
      { name: '비통한', img: require(IMGPATH+'sad/bitong.jpeg') },
      { name: '후회되는', img: require(IMGPATH+'sad/regret.jpeg') },
      { name: '우울한', img: require(IMGPATH+'sad/sad.jpeg') },
      { name: '마비된', img: require(IMGPATH+'sad/mabi.jpeg') },
      { name: '염세적인', img: require(IMGPATH+'sad/yeom.jpeg') },
      { name: '눈물이 나는', img: require(IMGPATH+'sad/tears.jpeg') },
      { name: '낭패한', img: require(IMGPATH+'sad/nangpe.jpeg') },
      { name: '환멸을 느끼는', img: require(IMGPATH+'sad/hm.jpeg') },
    ]
  }];

  return (
    <>
      <Text style={styles.text}>지금 감정이 어때요?</Text>
      <View style={styles.optionArea}>
        <FlatList 
          style={styles.categoryGrid}
          columnWrapperStyle={{justifyContent: 'space-between'}}
          keyExtractor={item => item.key}
          data={MOODS}
          renderItem={({item}) => (
            <Option 
              text={item.category} 
              selected={response.category === item.category}
              onPress={() => {
                setResponse({ category: item.category, subcategory: ''}); 
              }}
              style={styles.categoryItem}
            />
          )}
          numColumns={3}
        />
        { (response.category) ? (
          <FlatList
            style={styles.subcategoryGrid}
            columnWrapperStyle={{justifyContent: 'space-between'}}
            data={MOODS.find(
              elem => elem.category === response.category).subcategory}
            renderItem={({item}) => (
              <Option 
                text={item.name} 
                element={<Image style={{width: 48, height: 48, marginBottom: 5, borderRadius: 24}} source={item.img} />}
                selected={response.subcategory === item.name}
                onPress={() => {
                  setResponse({ 
                    category: response.category, 
                    subcategory: item.name
                  });
                }}
                style={styles.subcategoryItem}
                fontStyle={styles.subcategoryFont}
              />
            )}
            numColumns={3}
          />
        ) : (
          <></>
        )}
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
  optionArea: {
    width: '100%',
    alignItems: 'center',
    marginTop: 20,
  },
  categoryGrid: {
    width: '75%',
    paddingHorizontal: 10,
  },
  categoryItem: {
    paddingVertical: 7, 
    paddingHorizontal: 0,
    marginVertical: 5, 
    borderRadius: 12,
    width: '30%',
  },
  subcategoryGrid: {
    width: '95%',
    marginTop: 20, 
    paddingHorizontal: 20
  },
  subcategoryFont: {
    fontSize: 14,
  },
  subcategoryItem: {
    height: 100,
    width: 100,
    paddingHorizontal: 0,
    justifyContent: 'center'
  }
});
