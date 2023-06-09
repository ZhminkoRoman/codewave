import {BehaviorSubject} from 'rxjs';
import {map, combineLatestWith} from 'rxjs/operators';
import {CELL_SIZE} from '../constants/constants';
import calculateNeighborTiles from './calculateNeighborTiles';

export interface ITile {
  id: string;
  position: number;
  x: number;
  y: number;
  color: string;
  direction?: string;
  neighbors?: {
    [key: number]: ITile;
  };
  selected?: ITile[];
}

export const tiles$ = new BehaviorSubject<ITile[]>([]);

export const levelProperties$ = new BehaviorSubject<{
  level: number;
  counter: number;
  columns: number;
  rows: number;
  totalTiles: number;
}>({
  level: 1,
  counter: 0,
  columns: 0,
  rows: 0,
  totalTiles: 0,
});

export const selectedTiles$ = new BehaviorSubject<ITile[]>([]);
export const movingTiles$ = new BehaviorSubject<ITile | undefined>(undefined);

export const tilesWithNeighbors$ = tiles$.pipe(
  combineLatestWith(levelProperties$),
  map(([tiles, level]) => {
    const tilesObject = Object.values(tiles);
    return calculateNeighborTiles(
      level.columns,
      level.rows,
      tilesObject,
      level.totalTiles,
      CELL_SIZE
    );
  })
);

export const allTiles$ = tilesWithNeighbors$.pipe(
  combineLatestWith(selectedTiles$),
  map(([tiles, selected]) => {
    // console.log(selected);
    return tiles.map(tile => {
      const selectedTile = selected.find(s => s.id === tile.id);
      return {
        ...tile,
        position: selectedTile?.position || tile.position,
        x: selectedTile?.x || tile.x,
        y: selectedTile?.y || tile.y,
      };
    });
  })
);
