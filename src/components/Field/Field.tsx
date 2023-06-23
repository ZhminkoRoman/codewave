/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import React, {useEffect, useMemo, useCallback} from 'react';
import {StyleSheet, View} from 'react-native';
import {useObservableState} from 'observable-hooks';
import {ITile, allTiles$, selectedTiles$, tiles$} from '../../utils/utils';
import shortid from 'shortid';

import Tile from '../Tile/Tile';
import {CELL_SIZE} from '../../constants/constants';
import TestTile from '../TestTile/TestTile';
import {Gesture, GestureDetector} from 'react-native-gesture-handler';

type ColorType = {
  [key: string]: string;
};

const colors: ColorType = {
  '1': '#FF4365',
  '2': '#00F1FF',
  '3': '#fefd42',
  '4': '#fff',
};

// #66dbd9;
// #00F1FF;

const setRandomColor = () => {
  const colorIndex = Math.floor(Math.random() * (4 - 1 + 1) + 1).toString();
  return colors[colorIndex];
};

const styles = StyleSheet.create({
  field: {
    position: 'relative',
    display: 'flex',
  },
});

export interface IFieldProps {
  columns: number;
  rows: number;
  totalTiles: number;
  handleTilesChange: (value: number) => void;
}

const Field: React.FC<IFieldProps> = ({
  columns,
  rows,
  totalTiles,
  handleTilesChange,
}) => {
  const tilesArr = useObservableState(allTiles$, []);

  useEffect(() => {
    let column = 1;
    const tilesArray: ITile[] = [];
    for (let i = 0; i < totalTiles; i++) {
      if (i >= column * columns) {
        column += 1;
      }
      const color = setRandomColor();
      const lastColumnsTileNumber = column * rows - 1;

      const tile = {
        id: shortid.generate(),
        color,
        x: (column - 1) * CELL_SIZE,
        y: (lastColumnsTileNumber - i) * CELL_SIZE,
        position: i,
        neighbors: {},
      };
      tilesArray.push(tile);
    }
    tiles$.next(tilesArray);
  }, [columns, rows, totalTiles]);

  const fieldWidth = useMemo(() => {
    return columns * CELL_SIZE + 4;
  }, [columns]);

  const fieldHeight = useMemo(() => {
    return rows * CELL_SIZE + 4;
  }, [rows]);

  const handleStartMovingTile = useCallback((position: number) => {
    console.log(position);
  }, []);

  return (
    <View style={[styles.field, {width: fieldWidth, height: fieldHeight}]}>
      {tilesArr.map(tile => {
        return (
          <TestTile
            color={tile.color}
            id={tile.id}
            key={tile.id}
            x={tile.x}
            y={tile.y}
            position={tile.position}
            handleStartMovingTile={handleStartMovingTile}
          />
        );
      })}
    </View>
  );
};

export default Field;
