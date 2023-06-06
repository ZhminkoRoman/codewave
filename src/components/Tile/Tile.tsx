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
    borderStyle: 'solid',
  },
  tileText: {
    fontSize: 8,
    fontWeight: 'bold',
  },
});

export interface ITile {
  color: string;
  id: string;
  x: number;
  y: number;
  position: number;
  neighbours: NeightbourTilesType;
}

const Tile: React.FC<ITile> = ({color, id, x, y, neighbours, position}) => {
  const offsetX = useSharedValue(x);
  const offsetY = useSharedValue(y);

  let borderColor;
  if (color === '#FFAC4D') {
    borderColor = '#fefd42';
  } else if (color === '#395789') {
    borderColor = '#00F1FF';
  } else if (color === '#8c221d') {
    borderColor = '#FF4365';
  } else if (color === '#ccc') {
    borderColor = '#fff';
  }

  useEffect(() => {
    const subSelectedTile = tilesSubject$.subscribe();

    const subSelectedTiles = selectedTilesSubject$
      .pipe(
        tap(tile => {
          if (neighbours[tile.position]) {
            console.log(1, x, tile.x);
            console.log(y, tile.y);
            if (neighbours[tile.position].direction === tile.dir) {
              console.log(2, x, tile.x);
              console.log(y, tile.y);
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

  const subscriber = (xValue: number, yValue: number, tPosition: number) => {
    const changedTile = Object.values(neighbours).find(
      tile => tile.x === xValue && tile.y === yValue
    );
    const fullChangedTile = tilesSubject$.value.find(
      tile => tile.id === changedTile?.id
    );

    if (fullChangedTile && changedTile) {
      const filtered = tilesSubject$.value.filter(
        tile => tile.id !== id && tile.id !== changedTile?.id
      );

      filtered.splice(position, 0, {
        ...fullChangedTile,
        x: x,
        y: y,
        position: position,
      });
      filtered.splice(fullChangedTile?.position, 0, {
        id,
        color,
        position: fullChangedTile?.position,
        x: xValue,
        y: yValue,
        neighbours,
      });

      tilesSubject$.next(filtered);
      selectedTilesSubject$.next({
        id: '',
        x: 0,
        y: 0,
        position: 0,
        color: '',
        dir: '',
      });
    }
  };

  const handleSwipeEnd = (
    xValue: number,
    yValue: number,
    tPosition: number
  ) => {
    'worklet';

    runOnJS(subscriber)(xValue, yValue, tPosition);
  };

  const subscriberTile = (xValue: number, yValue: number, dir: string) => {
    selectedTilesSubject$.next({
      x: xValue,
      y: yValue,
      position,
      id,
      color,
      dir,
    });
  };

  const resetTile = () => {
    selectedTilesSubject$.next({
      id: '',
      x: 0,
      y: 0,
      position: 0,
      color: '',
      dir: '',
    });
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
    .activeOffsetX([-20, 20])
    .activeOffsetY([-20, 20])
    .onStart(() => {
      handleReset();
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
          handleSwipeUpdate(e.translationX, 0, direction);
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
          handleSwipeUpdate(e.translationX, 0, direction);
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
          handleSwipeUpdate(0, e.translationY, direction);
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
          handleSwipeUpdate(0, e.translationY, direction);
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
          handleSwipeUpdate(40, 0, 'right');
        } else if (e.translationX < 20 && e.translationX > 0) {
          xPosition = x;
          offsetX.value = withSpring(xPosition);
          handleSwipeUpdate(0, 0, 'right');
        }
      } else if (
        direction === 'left' &&
        Object.values(neighbours).find(neighb => neighb.direction === 'right')
      ) {
        if (e.translationX < -20) {
          xPosition = x - 40;
          offsetX.value = withSpring(xPosition);
          handleSwipeUpdate(-40, 0, 'left');
        } else if (e.translationX > -20 && e.translationX < 0) {
          xPosition = x;
          offsetX.value = withSpring(xPosition);
          handleSwipeUpdate(0, 0, 'left');
        }
      } else if (
        direction === 'top' &&
        Object.values(neighbours).find(neighb => neighb.direction === 'down')
      ) {
        if (e.translationY > 20) {
          yPosition = y + 40;
          offsetY.value = withSpring(yPosition);
          handleSwipeUpdate(0, 40, 'top');
        } else if (e.translationY < 20 && e.translationY > 0) {
          yPosition = y;
          offsetY.value = withSpring(yPosition);
          handleSwipeUpdate(0, 0, 'top');
        }
      } else if (
        direction === 'down' &&
        Object.values(neighbours).find(neighb => neighb.direction === 'top')
      ) {
        if (e.translationY < -20) {
          yPosition = y - 40;
          offsetY.value = withSpring(yPosition);
          handleSwipeUpdate(0, -40, 'down');
        } else if (e.translationY > -20 && e.translationY < 0) {
          yPosition = y;
          offsetY.value = withSpring(yPosition);
          handleSwipeUpdate(0, 0, 'down');
        }
      }
      handleSwipeEnd(xPosition, yPosition, position);
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
        <Text
          style={[
            styles.tileText,
            {
              color: borderColor,
            },
          ]}>
          {id}
        </Text>
      </Animated.View>
    </GestureDetector>
  );
};

export default Tile;
