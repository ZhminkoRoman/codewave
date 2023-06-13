import {BehaviorSubject} from 'rxjs';
import {map} from 'rxjs/operators';

export interface Tiles {
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
}
export interface Tile {
  id: string;
  position: number;
  x: number;
  y: number;
  color: string;
  dir: string;
}

export const tilesSubject$ = new BehaviorSubject<Tiles[]>([]);

//!: Making neighbors calculations here, not in the Field component;
export const tilesWithNeighbors$ = tilesSubject$.pipe(
  map(tiles =>
    tiles.map(tile => ({
      ...tile,
      neighbours: {},
    }))
  )
);

export const selectedTilesSubject$ = new BehaviorSubject<
  Tile | Record<string, never>
>({});

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
