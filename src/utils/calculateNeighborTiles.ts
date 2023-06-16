import {ITile} from './utils';

type TilesObj = {
  [key: number]: ITile;
};

export type NeighborTilesType = {
  [key: number]: ITile;
};

const calculateNeighborTiles = (
  columns: number,
  rows: number,
  tiles: TilesObj,
  totalTiles: number,
  cellSize: number
) => {
  let column = 1;
  return Object.values(tiles).map(tile => {
    const neighborTiles: NeighborTilesType = {};
    if (tile.position > column * columns - 1) {
      column = column + 1;
    }
    const lastColumnTileNumber = column * rows - 1;
    if (tile.position <= lastColumnTileNumber) {
      const firstColumnTileNumber = lastColumnTileNumber - rows + 1;
      const leftTileNumber = tile.position - rows;
      const rightTileNumber = tile.position + rows;
      if (tile.position < lastColumnTileNumber) {
        neighborTiles[tile.position + 1] = {
          id: tiles[tile.position + 1].id,
          position: tile.position + 1,
          x: tile.x,
          y: tile.y - cellSize,
          color: tiles[tile.position + 1].color,
          direction: 'top',
        };
      }
      if (tile.position > firstColumnTileNumber) {
        neighborTiles[tile.position - 1] = {
          id: tiles[tile.position - 1].id,
          position: tile.position - 1,
          x: tile.x,
          y: tile.y + cellSize,
          color: tiles[tile.position - 1].color,
          direction: 'down',
        };
      }
      if (leftTileNumber >= 0) {
        neighborTiles[leftTileNumber] = {
          id: tiles[leftTileNumber].id,
          position: leftTileNumber,
          x: tile.x - cellSize,
          y: tile.y,
          color: tiles[leftTileNumber].color,
          direction: 'right',
        };
      }
      if (rightTileNumber < totalTiles) {
        neighborTiles[rightTileNumber] = {
          id: tiles[rightTileNumber].id,
          position: rightTileNumber,
          x: tile.x + cellSize,
          y: tile.y,
          color: tiles[rightTileNumber].color,
          direction: 'left',
        };
      }
    }
    return {
      ...tile,
      neighbors: neighborTiles,
    };
  });
};

export default calculateNeighborTiles;
