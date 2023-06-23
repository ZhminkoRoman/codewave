import React, {useEffect, useMemo, memo} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {Gesture, GestureDetector} from 'react-native-gesture-handler';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import {tap} from 'rxjs/operators';
import {ITile, levelProperties$, movingTiles$} from '../../utils/utils';
import {NeighborTilesType} from '../../utils/calculateNeighborTiles';

const styles = StyleSheet.create({
  tile: {
    position: 'absolute',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    top: 4,
    left: 4,
    width: 34,
    height: 34,
    // borderWidth: 2,
    // borderColor: '#fff',
    // borderStyle: 'solid',
  },
  tileText: {
    fontSize: 8,
    fontWeight: 'bold',
    textAlign: 'center',
    overflow: 'hidden',
    color: '#fff',
  },
});

export interface ITileInt {
  color: string;
  id: string;
  x: number;
  y: number;
  position: number;
  handleStartMovingTile: (position: number) => void;
}

const TestTile: React.FC<ITileInt> = ({
  id,
  position,
  x,
  y,
  color,
  handleStartMovingTile,
}) => {
  const offsetX = useSharedValue(x);
  const offsetY = useSharedValue(y);

  const handleMove = (xValue: number, yValue: number) => {
    'worklet';
    console.log(xValue, yValue, position);
    runOnJS(handleStartMovingTile)(position);
  };

  const springOptions = useMemo(() => {
    return {
      damping: 15,
      stiffness: 75,
    };
  }, []);

  const gestureHandler = Gesture.Pan()
    .onStart(() => {
      // console.log(position);
      // handleReset();
    })
    .onUpdate(e => {
      handleMove(e.translationX, e.translationY);
      offsetX.value = withSpring(e.translationX + x, springOptions);
      offsetY.value = withSpring(e.translationY + y, springOptions);
      // if (!neighbors) {
      //   return;
      // }
      // let direction = '';
      // if (Math.abs(e.translationX) > Math.abs(e.translationY)) {
      //   if (e.translationX + x > x) {
      //     direction = 'right';
      //   } else {
      //     direction = 'left';
      //   }
      // } else if (Math.abs(e.translationX) < Math.abs(e.translationY)) {
      //   if (e.translationY + y > y) {
      //     direction = 'top';
      //   } else {
      //     direction = 'down';
      //   }
      // }
      // if (
      //   direction === 'right' &&
      //   Object.values(neighbors).find(neighb => neighb.direction === 'left')
      // ) {
      //   if (
      //     offsetY.value === y &&
      //     e.translationX <= 40 &&
      //     e.translationX >= -40
      //   ) {
      //     offsetX.value = withSpring(e.translationX + x, springOptions);
      //     handleSwipeUpdate(e.translationX, 0, direction);
      //   }
      // } else if (
      //   direction === 'left' &&
      //   Object.values(neighbors).find(neighb => neighb.direction === 'right')
      // ) {
      //   if (
      //     offsetY.value === y &&
      //     e.translationX <= 40 &&
      //     e.translationX >= -40
      //   ) {
      //     offsetX.value = withSpring(e.translationX + x, springOptions);
      //     handleSwipeUpdate(e.translationX, 0, direction);
      //   }
      // } else if (
      //   direction === 'top' &&
      //   Object.values(neighbors).find(neighb => neighb.direction === 'down')
      // ) {
      //   if (
      //     offsetX.value === x &&
      //     e.translationY <= 40 &&
      //     e.translationY >= -40
      //   ) {
      //     offsetY.value = withSpring(e.translationY + y, springOptions);
      //     handleSwipeUpdate(0, e.translationY, direction);
      //   }
      // } else if (
      //   direction === 'down' &&
      //   Object.values(neighbors).find(neighb => neighb.direction === 'top')
      // ) {
      //   if (
      //     offsetX.value === x &&
      //     e.translationY <= 40 &&
      //     e.translationY >= -40
      //   ) {
      //     offsetY.value = withSpring(e.translationY + y, springOptions);
      //     handleSwipeUpdate(0, e.translationY, direction);
      //   }
      // }
    })
    .onEnd(e => {
      // if (!neighbors) {
      //   return;
      // }
      // let xPosition = x;
      // let yPosition = y;
      // let direction = '';
      // if (Math.abs(e.translationX) > Math.abs(e.translationY)) {
      //   if (e.translationX + x > x) {
      //     direction = 'right';
      //   } else {
      //     direction = 'left';
      //   }
      // } else if (Math.abs(e.translationX) < Math.abs(e.translationY)) {
      //   if (e.translationY + y > y) {
      //     direction = 'top';
      //   } else {
      //     direction = 'down';
      //   }
      // }
      // if (
      //   direction === 'right' &&
      //   Object.values(neighbors).find(neighb => neighb.direction === 'left')
      // ) {
      //   if (e.translationX >= 20) {
      //     xPosition = x + 40;
      //     offsetX.value = withSpring(xPosition, springOptions);
      //     handleSwipeUpdate(40, 0, 'right');
      //   } else if (e.translationX < 20 && e.translationX > 0) {
      //     xPosition = x;
      //     offsetX.value = withSpring(xPosition, springOptions);
      //     handleSwipeUpdate(0, 0, 'right');
      //   }
      // } else if (
      //   direction === 'left' &&
      //   Object.values(neighbors).find(neighb => neighb.direction === 'right')
      // ) {
      //   if (e.translationX <= -20) {
      //     xPosition = x - 40;
      //     offsetX.value = withSpring(xPosition, springOptions);
      //     handleSwipeUpdate(-40, 0, 'left');
      //   } else if (e.translationX > -20 && e.translationX < 0) {
      //     xPosition = x;
      //     offsetX.value = withSpring(xPosition, springOptions);
      //     handleSwipeUpdate(0, 0, 'left');
      //   }
      // } else if (
      //   direction === 'top' &&
      //   Object.values(neighbors).find(neighb => neighb.direction === 'down')
      // ) {
      //   if (e.translationY >= 20) {
      //     yPosition = y + 40;
      //     offsetY.value = withSpring(yPosition, springOptions);
      //     handleSwipeUpdate(0, 40, 'top');
      //   } else if (e.translationY < 20 && e.translationY > 0) {
      //     yPosition = y;
      //     offsetY.value = withSpring(yPosition, springOptions);
      //     handleSwipeUpdate(0, 0, 'top');
      //   }
      // } else if (
      //   direction === 'down' &&
      //   Object.values(neighbors).find(neighb => neighb.direction === 'top')
      // ) {
      //   if (e.translationY <= -20) {
      //     yPosition = y - 40;
      //     offsetY.value = withSpring(yPosition, springOptions);
      //     handleSwipeUpdate(0, -40, 'down');
      //   } else if (e.translationY > -20 && e.translationY < 0) {
      //     yPosition = y;
      //     offsetY.value = withSpring(yPosition, springOptions);
      //     handleSwipeUpdate(0, 0, 'down');
      //   }
      // }
      // handleSwipeEnd(xPosition, yPosition);
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{translateX: offsetX.value}, {translateY: offsetY.value}],
  }));
  return (
    <GestureDetector gesture={gestureHandler}>
      <Animated.View
        style={[
          styles.tile,
          {
            backgroundColor: color,
            shadowColor: color,
            shadowOffset: {
              width: 0,
              height: 0,
            },
            // borderColor: borderColor,
            shadowOpacity: 0.5,
            shadowRadius: 10,
          },
          animatedStyle,
        ]}>
        {/* <Text style={[styles.tileText]}>{id}</Text> */}
      </Animated.View>
    </GestureDetector>
  );
};

export default memo(TestTile);
