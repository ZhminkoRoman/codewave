/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {useObservableState} from 'observable-hooks';
import React, {useEffect, useMemo, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {tilesSubject$, levelProperties$} from '../../utils/utils';
import {map, tap} from 'rxjs/operators';
import shortid from 'shortid';

import Tile from '../Tile/Tile';
import calculateNeighbourTiles from '../../utils/calculateNeighbourTiles';

const CELL_SIZE = 40;

type ColorType = {
  [key: string]: string;
};

type TilesObj = {
  [key: number]: {
    id: string;
    position: number;
    x: number;
    y: number;
    color: string;
    neighbours: {
      [key: number]: {
        id: string;
        x: number;
        y: number;
        color: string;
        direction: string;
        position: number;
      };
    };
  };
};

const colors: ColorType = {
  '1': '#8c221d',
  '2': '#395789',
  '3': '#FFAC4D',
  '4': '#ccc',
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
  const [tilesArr, setTilesArr] = useState<
    {
      id: string;
      x: number;
      y: number;
      color: string;
      position: number;
      neighbours: {
        [key: number]: {
          id: string;
          x: number;
          y: number;
          color: string;
          position: number;
          direction: string;
        };
      };
    }[]
  >([]);

  useEffect(() => {
    const tilesSubscription = tilesSubject$.subscribe(subedTiles => {
      // const updatedTiles = subedTiles.map((til, index) => {
      //   const neighbours = calculateNeighbourTiles(
      //     columns,
      //     rows,
      //     til,
      //     columns * rows,
      //     CELL_SIZE
      //   );
      //   return {
      //     ...til,
      //     neighbours: neighbours,
      //   };
      // });
      setTilesArr(subedTiles);
    });
    const levelSubscription = levelProperties$.subscribe();

    return () => {
      tilesSubscription.unsubscribe();
      levelSubscription.unsubscribe();
    };
  }, [columns, rows]);

  const tiles = useMemo(() => {
    let column = 1;
    const obj: TilesObj = {};
    for (let i = 0; i < tilesCount; i++) {
      if (i >= column * columns) {
        column += 1;
      }
      const color = setRandomColor();
      const lastColumnTileNumber = column * rows - 1;

      let tile = {
        id: shortid.generate(),
        color,
        x: 0,
        y: 0,
        position: i,
        neighbours: {},
      };
      if (i <= lastColumnTileNumber) {
        tile = {
          ...tile,
          x: (column - 1) * CELL_SIZE,
          y: (lastColumnTileNumber - i) * CELL_SIZE,
        };
      }
      obj[i] = tile;
    }
    return obj;
  }, [columns, rows, tilesCount]);

  // console.log(tiles);

  useEffect(() => {
    const updatedTiles = calculateNeighbourTiles(
      columns,
      rows,
      tiles,
      columns * rows,
      CELL_SIZE
    );
    tilesSubject$.next(updatedTiles);
  }, [columns, rows, tiles]);

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
            position={tile.position}
          />
        );
      })}
    </View>
  );
};

export default Field;
