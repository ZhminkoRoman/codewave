import {BehaviorSubject} from 'rxjs';
import {map, combineLatestWith} from 'rxjs/operators';

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

export const tilesWithNeighbors$ = tiles$.pipe(
  map(tiles =>
    tiles.map(tile => ({
      ...tile,
      neighbors: {},
    }))
  )
);

export const selectedTiles$ = new BehaviorSubject<ITile[]>([]);

export const allTiles$ = tiles$.pipe(
  combineLatestWith(selectedTiles$),
  map(([tiles, selected]) =>
    tiles.map(tile => ({
      ...tile,
      selected: selected.includes(tile),
    }))
  )
);

export const levelProperties$ = new BehaviorSubject<{
  level: number;
  counter: number;
  tiles: {
    id: string;
    x: number;
    y: number;
    position: number;
    color: string;
    active: boolean;
  }[];
}>({
  level: 1,
  counter: 0,
  tiles: [],
});
