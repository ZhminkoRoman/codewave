import React, {useEffect, useMemo, memo} from 'react';
import {StyleSheet, Text} from 'react-native';
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
    borderWidth: 2,
    borderStyle: 'solid',
    borderColor: '#fff',
  },
  tileText: {
    fontSize: 8,
    fontWeight: 'bold',
    textAlign: 'center',
    overflow: 'hidden',
  },
});

export interface ITileInt {
  color: string;
  id: string;
  x: number;
  y: number;
  position: number;
  neighbors?: NeighborTilesType;
  onSwipe?: (changedTile: ITile, fullChangedTile: ITile) => void;
}

const Tile: React.FC<ITileInt> = ({
  color,
  id,
  x,
  y,
  neighbors,
  position,
  onSwipe,
}) => {
  const offsetX = useSharedValue(x);
  const offsetY = useSharedValue(y);

  // const borderColor = useMemo(() => {
  //   if (color === '#FFAC4D') {
  //     return '#fefd42';
  //   } else if (color === '#395789') {
  //     return '#00F1FF';
  //   } else if (color === '#8c221d') {
  //     return '#FF4365';
  //   } else if (color === '#ccc') {
  //     return '#fff';
  //   }
  // }, [color]);

  const springOptions = useMemo(() => {
    return {
      damping: 15,
      stiffness: 75,
    };
  }, []);

  useEffect(() => {
    const movingTilesSubscription = movingTiles$
      .pipe(
        tap(tile => {
          if (tile && neighbors && neighbors[tile?.position]) {
            if (neighbors[tile.position].direction === tile.direction) {
              offsetX.value = withSpring(x - tile.x, springOptions);
              offsetY.value = withSpring(y - tile.y, springOptions);
            }
          }
        })
      )
      .subscribe();

    return () => {
      movingTilesSubscription.unsubscribe();
    };
  }, [id, neighbors, offsetX, offsetY, springOptions, x, y, position]);

  const subscriber = (xValue: number, yValue: number) => {
    if (!neighbors) {
      return;
    }
    const changedTile = Object.values(neighbors).find(
      tile => tile.x === xValue && tile.y === yValue
    );
    if (changedTile) {
      movingTiles$.next(undefined);
      if (changedTile.position === 15) {
        levelProperties$.next({
          ...levelProperties$.value,
          counter: 1,
        });
      } else if (changedTile) {
        // onSwipe(changedTile, changedTile);
      }
    }
  };

  const handleSwipeEnd = (xValue: number, yValue: number) => {
    'worklet';

    runOnJS(subscriber)(xValue, yValue);
  };

  const subscriberTile = (xValue: number, yValue: number, dir: string) => {
    movingTiles$.next({
      x: xValue,
      y: yValue,
      position,
      id,
      color,
      direction: dir,
    });
  };

  const resetTile = () => {
    movingTiles$.next(undefined);
  };

  const handleSwipeUpdate = (xValue: number, yValue: number, dir: string) => {
    'worklet';

    runOnJS(subscriberTile)(xValue, yValue, dir);
  };

  const handleReset = () => {
    'worklet';

    runOnJS(resetTile)();
  };

  const gestureHandler = Gesture.Pan()
    .onStart(() => {
      handleReset();
    })
    .onUpdate(e => {
      // if (!neighbors) {
      //   return;
      // }
      let direction = '';
      if (Math.abs(e.translationX) > Math.abs(e.translationY)) {
        if (e.translationX + x > x) {
          direction = 'right';
        } else {
          direction = 'left';
        }
      } else if (Math.abs(e.translationX) < Math.abs(e.translationY)) {
        if (e.translationY + y > y) {
          direction = 'top';
        } else {
          direction = 'down';
        }
      }
      if (direction === 'right') {
        if (
          offsetY.value === y &&
          e.translationX <= 40 &&
          e.translationX >= -40
        ) {
          offsetX.value = withSpring(e.translationX + x, springOptions);
          handleSwipeUpdate(e.translationX, 0, direction);
        }
      } else if (direction === 'left') {
        if (
          offsetY.value === y &&
          e.translationX <= 40 &&
          e.translationX >= -40
        ) {
          offsetX.value = withSpring(e.translationX + x, springOptions);
          handleSwipeUpdate(e.translationX, 0, direction);
        }
      } else if (direction === 'top') {
        if (
          offsetX.value === x &&
          e.translationY <= 40 &&
          e.translationY >= -40
        ) {
          offsetY.value = withSpring(e.translationY + y, springOptions);
          handleSwipeUpdate(0, e.translationY, direction);
        }
      } else if (direction === 'down') {
        if (
          offsetX.value === x &&
          e.translationY <= 40 &&
          e.translationY >= -40
        ) {
          offsetY.value = withSpring(e.translationY + y, springOptions);
          handleSwipeUpdate(0, e.translationY, direction);
        }
      }
    })
    .onEnd(e => {
      if (!neighbors) {
        return;
      }
      let xPosition = x;
      let yPosition = y;
      let direction = '';
      if (Math.abs(e.translationX) > Math.abs(e.translationY)) {
        if (e.translationX + x > x) {
          direction = 'right';
        } else {
          direction = 'left';
        }
      } else if (Math.abs(e.translationX) < Math.abs(e.translationY)) {
        if (e.translationY + y > y) {
          direction = 'top';
        } else {
          direction = 'down';
        }
      }
      if (
        direction === 'right' &&
        Object.values(neighbors).find(neighb => neighb.direction === 'left')
      ) {
        if (e.translationX >= 20) {
          xPosition = x + 40;
          offsetX.value = withSpring(xPosition, springOptions);
          handleSwipeUpdate(40, 0, 'right');
        } else if (e.translationX < 20 && e.translationX > 0) {
          xPosition = x;
          offsetX.value = withSpring(xPosition, springOptions);
          handleSwipeUpdate(0, 0, 'right');
        }
      } else if (
        direction === 'left' &&
        Object.values(neighbors).find(neighb => neighb.direction === 'right')
      ) {
        if (e.translationX <= -20) {
          xPosition = x - 40;
          offsetX.value = withSpring(xPosition, springOptions);
          handleSwipeUpdate(-40, 0, 'left');
        } else if (e.translationX > -20 && e.translationX < 0) {
          xPosition = x;
          offsetX.value = withSpring(xPosition, springOptions);
          handleSwipeUpdate(0, 0, 'left');
        }
      } else if (
        direction === 'top' &&
        Object.values(neighbors).find(neighb => neighb.direction === 'down')
      ) {
        if (e.translationY >= 20) {
          yPosition = y + 40;
          offsetY.value = withSpring(yPosition, springOptions);
          handleSwipeUpdate(0, 40, 'top');
        } else if (e.translationY < 20 && e.translationY > 0) {
          yPosition = y;
          offsetY.value = withSpring(yPosition, springOptions);
          handleSwipeUpdate(0, 0, 'top');
        }
      } else if (
        direction === 'down' &&
        Object.values(neighbors).find(neighb => neighb.direction === 'top')
      ) {
        if (e.translationY <= -20) {
          yPosition = y - 40;
          offsetY.value = withSpring(yPosition, springOptions);
          handleSwipeUpdate(0, -40, 'down');
        } else if (e.translationY > -20 && e.translationY < 0) {
          yPosition = y;
          offsetY.value = withSpring(yPosition, springOptions);
          handleSwipeUpdate(0, 0, 'down');
        }
      }
      handleSwipeEnd(xPosition, yPosition);
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
            shadowOpacity: 0.5,
            shadowRadius: 10,
          },
          animatedStyle,
        ]}>
        {/* <Text
          style={[
            styles.tileText,
            {
              color: '#000',
            },
          ]}>
          {id}
        </Text> */}
      </Animated.View>
    </GestureDetector>
  );
};

export default memo(Tile);
