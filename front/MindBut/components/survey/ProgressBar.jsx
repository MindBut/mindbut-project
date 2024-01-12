import { 
  View, 
  StyleSheet, 
  Animated,
} from 'react-native';
import React, { useEffect, useRef } from 'react';
import { Colors } from '../common/styles';


export default ProgressBar = ({ currentPage, totalPage }) => {
  const progressRef = useRef(new Animated.Value(0)).current;

  /**
   * Progress bar animation
   * 
   */
  const showProgressAnimation = () => {
    Animated.timing(progressRef, {
      toValue: (currentPage / totalPage) * 100,
      duration: 500,
      useNativeDriver: false,
    }).start();
  };
  
  // Effects
  useEffect(() => { showProgressAnimation(currentPage) }, [currentPage]);

  // Progress bar width to percentage
  const width = progressRef.interpolate({
    inputRange: [0, 100],
    outputRange: ['0%', '100%'],
    extrapolate: 'clamp',
  });

  return (
    <View style={styles.fullBar}>
      <Animated.View
        style={{...styles.progress, width}} />
    </View>
  )
}

const styles = StyleSheet.create({
  fullBar: {
    width: '100%',
    height: 7,
    backgroundColor: Colors.lightGray,
  },
  progress: {
    backgroundColor: Colors.primary,
    height: 7,
    borderRadius: 5,
  }
})