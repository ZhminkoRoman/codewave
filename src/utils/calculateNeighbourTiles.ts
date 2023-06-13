type TileType = {
  id: string;
  x: number;
  y: number;
  position: number;
  color: string;
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

export type NeightbourTilesType = {
  [key: number]: {
    id: string;
    x: number;
    y: number;
    color: string;
    position: number;
    direction: string;
  };
};

const calculateNeighbourTiles = (
  columns: number,
  rows: number,
  tiles: TilesObj,
  totalTiles: number,
  cellSize: number
) => {
  let column = 1;
  return Object.values(tiles).map(tile => {
    const neighbourTiles: NeightbourTilesType = {};
    if (tile.position > column * columns - 1) {
      column = column + 1;
    }
    const lastColumnTileNumber = column * rows - 1;
    if (tile.position <= lastColumnTileNumber) {
      const firstColumnTileNumber = lastColumnTileNumber - rows + 1;
      const leftTileNumber = tile.position - rows;
      const rightTileNumber = tile.position + rows;
      if (tile.position < lastColumnTileNumber) {
        neighbourTiles[tile.position + 1] = {
          id: tiles[tile.position + 1].id,
          position: tile.position + 1,
          x: tile.x,
          y: tile.y - cellSize,
          color: tiles[tile.position + 1].color,
          direction: 'top',
        };
      }
      if (tile.position > firstColumnTileNumber) {
        neighbourTiles[tile.position - 1] = {
          id: tiles[tile.position - 1].id,
          position: tile.position - 1,
          x: tile.x,
          y: tile.y + cellSize,
          color: tiles[tile.position - 1].color,
          direction: 'down',
        };
      }
      if (leftTileNumber >= 0) {
        neighbourTiles[leftTileNumber] = {
          id: tiles[leftTileNumber].id,
          position: leftTileNumber,
          x: tile.x - cellSize,
          y: tile.y,
          color: tiles[leftTileNumber].color,
          direction: 'right',
        };
      }
      if (rightTileNumber < totalTiles) {
        neighbourTiles[rightTileNumber] = {
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
      neighbours: neighbourTiles,
    };
  });
};

export default calculateNeighbourTiles;
