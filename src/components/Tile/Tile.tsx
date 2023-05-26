import React, {useEffect} from 'react';
import {StyleSheet, Text} from 'react-native';
import {Gesture, GestureDetector} from 'react-native-gesture-handler';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import {tap} from 'rxjs/operators';
import {selectedTilesSubject$, tilesSubject$} from '../../utils/utils';

const styles = StyleSheet.create({
  tile: {
    position: 'absolute',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    top: 4,
    left: 4,
    width: 36,
    height: 36,
  },
});

export interface ITile {
  color: string;
  id: number;
  x: number;
  y: number;
}

const Tile: React.FC<ITile> = ({color, id, x, y}) => {
  const offsetX = useSharedValue(x);
  const offsetY = useSharedValue(y);
  const borderWidth = useSharedValue(0);
  const borderColor = useSharedValue('white');
  const borderStyle = useSharedValue<'solid' | 'dashed' | 'dotted'>('solid');

  /**
   * *: Observer (or Subject) that react on event "Tap", with receiving tapped tile props (like id, x, y, color);
   * *: After that it should wait until second tap and check, if it the same tile or different. If different - than is this different tile is neighbour tile?
   * *: If tile is neighbour, than throw props from second tapped tile (id, x, y, color) and call function to change x and y positions between those two tiles with provided x / y - values;
   * TODO: Could be used (instead of gestureHandler.tap - fromEvent);
   */

  useEffect(() => {
    const subSelectedTile = tilesSubject$.subscribe();

    const subSelectedTiles = selectedTilesSubject$
      .pipe(
        tap(tile => {
          console.log(tile);
        })
      )
      .subscribe();

    return () => {
      subSelectedTile.unsubscribe();
      subSelectedTiles.unsubscribe();
    };
  }, [borderWidth, id, offsetX, offsetY]);

  const subscriber = (xValue: number, yValue: number) => {
    const filtered = tilesSubject$.value.filter(tile => tile.id !== id);
    tilesSubject$.next([
      ...filtered,
      {
        id,
        color,
        x: xValue,
        y: yValue,
      },
    ]);
  };

  const handleId = (xValue: number, yValue: number) => {
    'worklet';

    runOnJS(subscriber)(xValue, yValue);
  };

  const subscriberTile = (xValue: number, yValue: number) => {
    selectedTilesSubject$.next({x: xValue, y: yValue, id, color});
  };

  const handleTile = (xValue: number, yValue: number) => {
    'worklet';

    runOnJS(subscriberTile)(xValue, yValue);
  };

  const gestureHandler = Gesture.Pan()
    .onStart(() => {
      borderWidth.value = withSpring(2);
    })
    .onUpdate(e => {
      offsetX.value = e.translationX + x;
      offsetY.value = e.translationY + y;
      handleTile(e.translationX, e.translationY);
    })
    .onEnd(e => {
      handleId(e.translationX + x, e.translationY + y);
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{translateX: offsetX.value}, {translateY: offsetY.value}],
    borderWidth: borderWidth.value,
    borderStyle: borderStyle.value,
    borderColor: borderColor.value,
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
        <Text>{id}</Text>
      </Animated.View>
    </GestureDetector>
  );
};

export default Tile;
