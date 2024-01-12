import { 
  SafeAreaView, 
  StatusBar, 
  Animated, 
  Text, 
  View, 
  StyleSheet, 
  Image,
  Pressable
} from 'react-native';
import React, { useRef, useEffect } from 'react';
import axios, { AxiosError } from 'axios';
import * as KakaoLogin from '@react-native-seoul/kakao-login';
import { Colors } from '../components/common/styles';
import { useNavigation } from '@react-navigation/native';


const KakaoLoginButton = () => {
  /**
   * Sign in user to Kakao Auth server, and receive bearer access token.
   * 
   * @returns Bearer token for accessing Kakao API server
   */
  const getKakaoAccessToken = async () => {
    KakaoLogin
    .login()
    .then((res) => res.accessToken)
    .then((token) => signInWithAccessToken(token))
    .catch((err) => console.error("[Kakao Auth]", err));
  };

  /**
   * Fetch user ID from Kakao API server using access token, and sign in user to
   * MindBut server. If successful, navigate to survey screen.
   * 
   * @param accessToken Bearer token received from Kakao Auth.
   */
  const navigation = useNavigation();
  const signInWithAccessToken = async (accessToken) => {
    axios.post(
      "http://localhost:8000/signup/",
      // { "access_token": accessToken }
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
    .then(() => navigation.navigate("Survey"))
    .catch((err) => console.error("[Server Login]", err));
  };

  return (
    <Pressable onPress={() => getKakaoAccessToken()}>
      <Image
        source={require("../assets/kakao_login/ko/kakao_login_large_wide.png")}
        style={styles.kakao}
      />
    </Pressable>
  );
};


export default OnBoarding = () => {
  // Refs
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim2 = useRef(new Animated.Value(0)).current;
  const fadeAnim3 = useRef(new Animated.Value(0)).current;
  const fadeAnim4 = useRef(new Animated.Value(0)).current;

  /**
   * Fade animation for contents.
   * 
   */
  const showFeatureAnimation = () => {
    const fadeDuration = 750;
    const bufferDuration = 1000;

    Animated.sequence([
      // DEBUG: RESET FADE VAL
      Animated.timing(fadeAnim4, {
        toValue: 0,
        duration: 0,
        useNativeDriver: true,
      }),
      // Fade in
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: fadeDuration,
        useNativeDriver: true,
      }),
      // Buffer
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: bufferDuration,
        useNativeDriver: true,
      }),
      // Fade out
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: fadeDuration,
        useNativeDriver: true,
      }),
      // Fade in
      Animated.timing(fadeAnim2, {
        toValue: 1,
        duration: fadeDuration,
        useNativeDriver: true,
      }),
      // Buffer
      Animated.timing(fadeAnim2, {
        toValue: 1,
        duration: bufferDuration,
        useNativeDriver: true,
      }),
      // Fade out
      Animated.timing(fadeAnim2, {
        toValue: 0,
        duration: fadeDuration,
        useNativeDriver: true,
      }),
      // Fade in
      Animated.timing(fadeAnim3, {
        toValue: 1,
        duration: fadeDuration,
        useNativeDriver: true,
      }),
      // Buffer
      Animated.timing(fadeAnim3, {
        toValue: 1,
        duration: bufferDuration,
        useNativeDriver: true,
      }),
      // Fade out
      Animated.timing(fadeAnim3, {
        toValue: 0,
        duration: fadeDuration,
        useNativeDriver: true,
      }),
      // Fade in
      Animated.timing(fadeAnim4, {
        toValue: 1,
        duration: fadeDuration,
        useNativeDriver: true,
      }),
    ]).start();
  };

  // Effects
  useEffect(showFeatureAnimation, [fadeAnim, fadeAnim2, fadeAnim3, fadeAnim4]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar />
      <View style={{ height: '100%', justifyContent: 'center' }}>
        <Animated.View
          style={{
            ...styles.animationView,
            opacity: fadeAnim,
          }}>
          <Image
            style={styles.icon}
            source={require("../assets/health-check.png")}
          />
          <Text style={styles.captionBold}>
            맞춤형으로
          </Text>
          <Text style={styles.caption}>
            정신 건강을 진단하고
          </Text>
        </Animated.View>
        <Animated.View
          style={{
            ...styles.animationView,
            opacity: fadeAnim2,
          }}>
          <Image
            style={styles.icon}
            source={require("../assets/heart.png")}
          />
          <Text style={styles.captionBold}>
            챗봇을 통해
          </Text>
          <Text style={styles.caption}>
            즉각적 도움을 제공하는
          </Text>
        </Animated.View>
        <Animated.View
          style={{
            ...styles.animationView,
            opacity: fadeAnim3,
          }}>
          <Image
            style={styles.icon}
            source={require("../assets/growth-mindset.png")}
          />
          <Text style={styles.captionBold}>
            인지행동치료 기반
          </Text>
          <Text style={styles.caption}>
            AI 상담 보조 서비스
          </Text>
        </Animated.View>
        <Animated.View
          style={{
            ...styles.animationView,
            opacity: fadeAnim4,
          }}>
          <Text style={{...styles.title, marginBottom: 150}}>
            마인드벗
          </Text>
          {/* <Image
            style={styles.logo}
            source={require("../assets/wip.png")}
          /> */}
          <KakaoLoginButton />
        </Animated.View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? 20 : 0,
    backgroundColor: Colors.white,
  },
  animationView: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  icon: {
    width: 200,
    height: 200
  },
  logo: {
    marginTop: 50,
    marginBottom: 50,
    width: 200,
    height: 200
  },
  kakao: {
    width: 300,
    resizeMode: 'contain'
  },
  captionBold: {
    textAlign: 'center',
    fontSize: 24,
    marginTop: 80,
    marginBottom: 10,
    color: Colors.primary,
    fontFamily: 'NotoSansKR-Medium',
  },
  caption: {
    textAlign: 'center',
    fontSize: 24,
    marginBottom: 10,
    // color: Colors.white,
    fontFamily: 'NotoSansKR-Light',
  },
  title: {
    textAlign: 'center',
    fontSize: 60,
    fontFamily: 'NotoSansKR-ExtraBold',
    color: Colors.primary,
  }
});
