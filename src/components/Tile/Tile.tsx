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
    width: 34,
    height: 34,
    borderWidth: 2,
    // borderColor: '#ceffff',
    borderStyle: 'solid',
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

  let borderColor;
  if (color === '#fefd42') {
    borderColor = '#FFAC4D';
  } else if (color === '#00F1FF') {
    borderColor = '#beffff';
  } else if (color === '#FF4365') {
    borderColor = '#8c221d';
  } else if (color === '#5af4ac') {
    borderColor = '#0f7d7b';
  }

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
              offsetX.value = withSpring(x - tile.x);
              offsetY.value = withSpring(y - tile.y);
            }
          }
        })
      )
      .subscribe();

    return () => {
      subSelectedTile.unsubscribe();
      subSelectedTiles.unsubscribe();
    };
  }, [id, neighbours, offsetX, offsetY]);

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
    .activeOffsetX([-20, 20])
    .activeOffsetY([-20, 20])
    .onStart(() => {
      handleReset();
      // borderWidth.value = withSpring(2);
    })
    .onUpdate(e => {
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
        Object.values(neighbours).find(neighb => neighb.direction === 'left')
      ) {
        if (
          offsetY.value === y &&
          e.translationX <= 40 &&
          e.translationX >= -40
        ) {
          offsetX.value = withSpring(e.translationX + x);
          handleTile(e.translationX, 0, direction);
        }
      } else if (
        direction === 'left' &&
        Object.values(neighbours).find(neighb => neighb.direction === 'right')
      ) {
        if (
          offsetY.value === y &&
          e.translationX <= 40 &&
          e.translationX >= -40
        ) {
          offsetX.value = withSpring(e.translationX + x);
          handleTile(e.translationX, 0, direction);
        }
      } else if (
        direction === 'top' &&
        Object.values(neighbours).find(neighb => neighb.direction === 'down')
      ) {
        if (
          offsetX.value === x &&
          e.translationY <= 40 &&
          e.translationY >= -40
        ) {
          offsetY.value = withSpring(e.translationY + y);
          handleTile(0, e.translationY, direction);
        }
      } else if (
        direction === 'down' &&
        Object.values(neighbours).find(neighb => neighb.direction === 'top')
      ) {
        if (
          offsetX.value === x &&
          e.translationY <= 40 &&
          e.translationY >= -40
        ) {
          offsetY.value = withSpring(e.translationY + y);
          handleTile(0, e.translationY, direction);
        }
      }
    })
    .onEnd(e => {
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
        Object.values(neighbours).find(neighb => neighb.direction === 'left')
      ) {
        if (e.translationX > 20) {
          xPosition = x + 40;
          offsetX.value = withSpring(xPosition);
          handleTile(40, 0, 'right');
        } else if (e.translationX < 20 && e.translationX > 0) {
          xPosition = x;
          offsetX.value = withSpring(xPosition);
          handleTile(0, 0, 'right');
        }
      } else if (
        direction === 'left' &&
        Object.values(neighbours).find(neighb => neighb.direction === 'right')
      ) {
        if (e.translationX < -20) {
          xPosition = x - 40;
          offsetX.value = withSpring(xPosition);
          handleTile(-40, 0, 'left');
        } else if (e.translationX > -20 && e.translationX < 0) {
          xPosition = x;
          offsetX.value = withSpring(xPosition);
          handleTile(0, 0, 'left');
        }
      } else if (
        direction === 'top' &&
        Object.values(neighbours).find(neighb => neighb.direction === 'down')
      ) {
        console.log(
          Object.values(neighbours).find(neighb => neighb.direction === 'down'),
          neighbours
        );
        if (e.translationY > 20) {
          yPosition = y + 40;
          offsetY.value = withSpring(yPosition);
          handleTile(0, 40, 'top');
        } else if (e.translationY < 20 && e.translationY > 0) {
          yPosition = y;
          offsetY.value = withSpring(yPosition);
          handleTile(0, 0, 'top');
        }
      } else if (
        direction === 'down' &&
        Object.values(neighbours).find(neighb => neighb.direction === 'top')
      ) {
        console.log(
          Object.values(neighbours).find(neighb => neighb.direction === 'top'),
          neighbours
        );
        if (e.translationY < -20) {
          yPosition = y - 40;
          offsetY.value = withSpring(yPosition);
          handleTile(0, -40, 'down');
        } else if (e.translationY > -20 && e.translationY < 0) {
          yPosition = y;
          offsetY.value = withSpring(yPosition);
          handleTile(0, 0, 'down');
        }
      }
      handleId(xPosition, yPosition);
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
            borderColor: borderColor,
            shadowOpacity: 0.5,
            shadowRadius: 10,
          },
          animatedStyle,
        ]}>
        {/* <Text>{id}</Text> */}
      </Animated.View>
    </GestureDetector>
  );
};

export default Tile;
