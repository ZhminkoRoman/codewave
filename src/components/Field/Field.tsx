/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import React, {useEffect, useMemo, useCallback} from 'react';
import {StyleSheet, View} from 'react-native';
import {useObservableState} from 'observable-hooks';
import {
  ITile,
  allTiles$,
  movingTiles$,
  selectedTiles$,
  tiles$,
  tilesWithNeighbors$,
} from '../../utils/utils';
import shortid from 'shortid';

import Tile from '../Tile/Tile';
import {CELL_SIZE} from '../../constants/constants';

type ColorType = {
  [key: string]: string;
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

  const updTiles = useMemo(() => {
    return tilesArr;
  }, [tilesArr]);

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

  const handleTileSwipe = useCallback(
    (changedTile: ITile, fullChangedTile: ITile) => {
      selectedTiles$.next([changedTile, fullChangedTile]);
    },
    []
  );

  const fieldWidth = useMemo(() => {
    return columns * CELL_SIZE + 4;
  }, [columns]);

  const fieldHeight = useMemo(() => {
    return rows * CELL_SIZE + 4;
  }, [rows]);

  return (
    <View style={[styles.field, {width: fieldWidth, height: fieldHeight}]}>
      {updTiles.map(tile => {
        return (
          <Tile
            color={tile.color}
            key={tile.id}
            id={tile.id}
            x={tile.x}
            y={tile.y}
            neighbors={tile.neighbors}
            position={tile.position}
            onSwipe={handleTileSwipe}
          />
        );
      })}
    </View>
  );
};

export default Field;
