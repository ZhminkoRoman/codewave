/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {useObservableState} from 'observable-hooks';
import React, {useEffect, useMemo} from 'react';
import {StyleSheet, View} from 'react-native';
import {tilesSubject$, levelProperties$} from '../../utils/utils';
import {map, tap} from 'rxjs/operators';

import Tile from '../Tile/Tile';
import calculateNeighbourTiles from '../../utils/calculateNeighbourTiles';

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
    // backgroundColor: '#fff',
    // backgroundColor: '#221a22',
    // backgroundColor: '#035b6d',
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

  useEffect(() => {
    const tilesSubscription = tilesSubject$
      .pipe(
        map(subedTiles => {
          return subedTiles.forEach((til, index) => {
            const updTile = {
              ...til,
              id: index,
            };
            const neighbours = calculateNeighbourTiles(
              columns,
              rows,
              updTile,
              columns * rows,
              CELL_SIZE
            );
            return {
              ...til,
              neighbours: neighbours,
            };
          });
        })
      )
      .subscribe();
    const levelSubscription = levelProperties$.subscribe();

    return () => {
      tilesSubscription.unsubscribe();
      levelSubscription.unsubscribe();
    };
  }, [columns, rows]);

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
      const neighbours = calculateNeighbourTiles(
        columns,
        rows,
        tile,
        columns * rows,
        CELL_SIZE
      );
      return {
        ...tile,
        neighbours: neighbours,
      };
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
            neighbours={tile.neighbours}
          />
        );
      })}
    </View>
  );
};

export default Field;
