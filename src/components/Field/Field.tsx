/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {useObservableState} from 'observable-hooks';
import React, {useEffect, useMemo} from 'react';
import {StyleSheet, View} from 'react-native';
import {tilesSubject$} from '../../utils/utils';

import Tile from '../Tile/Tile';

const CELL_SIZE = 40;

type ColorType = {
  [key: string]: string;
};

export type SquareType = {
  row: number;
  column: number;
  x: number;
  y: number;
  id: string;
};

const colors: ColorType = {
  '1': '#FF4365',
  '2': '#00F1FF',
  '3': '#ffff92',
  '4': '#0161E8',
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
    backgroundColor: '#fff',
    // shadowColor: '#fff',
    // shadowOffset: {
    //   width: 0,
    //   height: 0,
    // },
    // shadowOpacity: 1,
    // shadowRadius: 5,
  },
});

export interface IFieldProps {
  columns: number;
  rows: number;
  tilesCount: number;
}

const Field: React.FC<IFieldProps> = ({columns, rows, tilesCount}) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
  const tilesArr = useObservableState(tilesSubject$, []);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const tiles = useMemo(() => {
    let column = 1;
    return Array.from({length: tilesCount}, (_, index) => {
      if (index >= column * columns) {
        column += 1;
      }
      const color = setRandomColor();
      const lastColumnTileNumber = column * rows;

      let tile = {
        id: index,
        color,
        x: 0,
        y: 0,
      };
      if (index < lastColumnTileNumber) {
        tile = {
          ...tile,
          x: (column - 1) * CELL_SIZE,
          y: (lastColumnTileNumber - index - 1) * CELL_SIZE,
        };
      }
      return tile;
    });
  }, [columns, rows, tilesCount]);

  useEffect(() => {
    tilesSubject$.next(tiles);
  }, [tiles]);

  return (
    <View
      style={[
        styles.field,
        {width: columns * CELL_SIZE + 4, height: rows * CELL_SIZE + 4},
      ]}>
      {tilesArr.map(tile => {
        return (
          <Tile
            color={tile.color}
            key={tile.id}
            id={tile.id}
            x={tile.x}
            y={tile.y}
          />
        );
      })}
    </View>
  );
};

export default Field;
