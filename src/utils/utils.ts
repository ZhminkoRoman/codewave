import {BehaviorSubject} from 'rxjs';

export const tilesSubject$ = new BehaviorSubject<
  {
    id: number;
    x: number;
    y: number;
    color: string;
    neighbours: {
      [key: number]: {
        id: number;
        x: number;
        y: number;
        color: string;
        direction: string;
      };
    };
  }[]
>([]);

export const selectedTilesSubject$ = new BehaviorSubject<{
  id: number;
  x: number;
  y: number;
  color: string;
  dir: string;
}>({
  id: 0,
  x: 0,
  y: 0,
  color: '',
  dir: '',
});

export const levelProperties$ = new BehaviorSubject<{
  level: number;
  counter: number;
  tiles: {
    id: number;
    x: number;
    y: number;
    color: string;
    active: boolean;
  }[];
}>({
  level: 1,
  counter: 0,
  tiles: [],
});
