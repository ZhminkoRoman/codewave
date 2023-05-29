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
import {NeightbourTilesType} from '../../utils/calculateNeighbourTiles';

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
  neighbours: NeightbourTilesType;
}

const Tile: React.FC<ITile> = ({color, id, x, y, neighbours}) => {
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
          if (neighbours[tile.id]) {
            if (neighbours[tile.id].direction === tile.dir) {
              offsetX.value = x - tile.x;
              offsetY.value = y - tile.y;
            }
          }
        })
      )
      .subscribe();

    return () => {
      subSelectedTile.unsubscribe();
      subSelectedTiles.unsubscribe();
    };
  }, [borderWidth, id, neighbours, offsetX, offsetY]);

  const subscriber = (xValue: number, yValue: number) => {
    const filtered = tilesSubject$.value.filter(tile => tile.id !== id);
    tilesSubject$.next([
      ...filtered,
      {
        id,
        color,
        x: xValue,
        y: yValue,
        neighbours,
      },
    ]);
  };

  const handleId = (xValue: number, yValue: number) => {
    'worklet';

    runOnJS(subscriber)(xValue, yValue);
  };

  const subscriberTile = (xValue: number, yValue: number, dir: string) => {
    selectedTilesSubject$.next({x: xValue, y: yValue, id, color, dir});
  };

  const resetTile = () => {
    selectedTilesSubject$.next({id: 0, x: 0, y: 0, color: '', dir: ''});
  };

  const handleTile = (xValue: number, yValue: number, dir: string) => {
    'worklet';

    runOnJS(subscriberTile)(xValue, yValue, dir);
  };

  const handleReset = () => {
    'worklet';

    runOnJS(resetTile)();
  };

  const gestureHandler = Gesture.Pan()
    .activeOffsetX([-15, 15])
    .activeOffsetY([-15, 15])
    .onStart(() => {
      handleReset();
      borderWidth.value = withSpring(2);
    })
    .onUpdate(e => {
      let direction = '';
      if (Math.abs(e.translationX) > Math.abs(e.translationY)) {
        offsetX.value = e.translationX + x;
        if (e.translationX + x > x) {
          direction = 'right';
        } else {
          direction = 'left';
        }
        handleTile(e.translationX, 0, direction);
      } else {
        offsetY.value = e.translationY + y;
        if (e.translationY + y > y) {
          direction = 'top';
        } else {
          direction = 'down';
        }
        handleTile(0, e.translationY, direction);
      }
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
