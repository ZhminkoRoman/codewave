type TileType = {
  id: number;
  x: number;
  y: number;
  color: string;
};

export type NeightbourTilesType = {
  [key: number]: {
    id: number;
    x: number;
    y: number;
    color: string;
    direction: string;
  };
};

const calculateNeighbourTiles = (
  columns: number,
  rows: number,
  tile: TileType,
  totalTiles: number,
  cellSize: number
): NeightbourTilesType => {
  const neighbourTiles: NeightbourTilesType = {};
  for (let column = 1; column <= columns; column++) {
    const lastColumnTileNumber = column * rows;
    if (tile.id <= lastColumnTileNumber) {
      const firstColumnTileNumber = lastColumnTileNumber - rows + 1;
      const leftTileNumber = tile.id - rows;
      const rightTileNumber = tile.id + rows;
      if (tile.id < lastColumnTileNumber) {
        neighbourTiles[tile.id + 1] = {
          id: tile.id + 1,
          x: tile.x,
          y: tile.y - cellSize,
          color: tile.color,
          direction: 'top',
        };
      }
      if (tile.id > firstColumnTileNumber) {
        neighbourTiles[tile.id - 1] = {
          id: tile.id - 1,
          x: tile.x,
          y: tile.y + cellSize,
          color: tile.color,
          direction: 'down',
        };
      }
      if (leftTileNumber > 0) {
        neighbourTiles[leftTileNumber] = {
          id: leftTileNumber,
          x: tile.x - cellSize,
          y: tile.y,
          color: tile.color,
          direction: 'right',
        };
      }
      if (rightTileNumber <= totalTiles) {
        neighbourTiles[rightTileNumber] = {
          id: rightTileNumber,
          x: tile.x + cellSize,
          y: tile.y,
          color: tile.color,
          direction: 'left',
        };
      }
      return neighbourTiles;
    }
  }
  return neighbourTiles;
};

export default calculateNeighbourTiles;
