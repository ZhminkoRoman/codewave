type TileType = {
  id: string;
  x: number;
  y: number;
  position: number;
  color: string;
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
  tile: TileType,
  totalTiles: number,
  cellSize: number
): NeightbourTilesType => {
  const neighbourTiles: NeightbourTilesType = {};
  for (let column = 1; column <= columns; column++) {
    const lastColumnTileNumber = column * rows - 1;
    if (tile.position <= lastColumnTileNumber) {
      const firstColumnTileNumber = lastColumnTileNumber - rows + 1;
      const leftTileNumber = tile.position - rows;
      const rightTileNumber = tile.position + rows;
      //!: issue with ID calculating :!
      if (tile.position < lastColumnTileNumber) {
        neighbourTiles[tile.position + 1] = {
          id: tile.id,
          position: tile.position + 1,
          x: tile.x,
          y: tile.y - cellSize,
          color: tile.color,
          direction: 'top',
        };
      }
      if (tile.position > firstColumnTileNumber) {
        neighbourTiles[tile.position - 1] = {
          id: tile.id,
          position: tile.position - 1,
          x: tile.x,
          y: tile.y + cellSize,
          color: tile.color,
          direction: 'down',
        };
      }
      if (leftTileNumber > 0) {
        neighbourTiles[leftTileNumber] = {
          id: tile.id,
          position: leftTileNumber,
          x: tile.x - cellSize,
          y: tile.y,
          color: tile.color,
          direction: 'right',
        };
      }
      if (rightTileNumber < totalTiles) {
        neighbourTiles[rightTileNumber] = {
          id: tile.id,
          position: rightTileNumber,
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
