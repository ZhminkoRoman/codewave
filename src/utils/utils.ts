import {BehaviorSubject} from 'rxjs';

export const tilesSubject$ = new BehaviorSubject<
  {
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
  }[]
>([]);

export const selectedTilesSubject$ = new BehaviorSubject<{
  id: string;
  position: number;
  x: number;
  y: number;
  color: string;
  dir: string;
}>({
  id: '',
  position: 0,
  x: 0,
  y: 0,
  color: '',
  dir: '',
});

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
