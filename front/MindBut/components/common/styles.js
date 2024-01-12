import { Dimensions, StyleSheet } from "react-native"

export const Colors = {
  primary: '#5687f6',
  secondary: '#f7f6fa',
  tertiary: '#eef3fe',

  trueWhite: '#ffffff',
  grayText: '#656565',
  lightGrayUI: '#aaaaaa',
  lightGray: '#f3f3f3',
  gray: '#e9e9eb'
}

export const Fonts = {
  header: 'NotoSansKR-Bold',
  body: 'NotoSansKR-Regular',
}

export const Device = {
  width: Dimensions.get("screen").width,
  height: Dimensions.get("screen").height,
  fullLayoutWidth: Dimensions.get("screen").width - 32,
  navigationHeight: 97,
  tabBarHeight: 50,
}

export const defaultStyle = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? 20 : 0,
    backgroundColor: Colors.white,
  },
})