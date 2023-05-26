import {BehaviorSubject} from 'rxjs';

export const tilesSubject$ = new BehaviorSubject<
  {
    id: number;
    x: number;
    y: number;
    color: string;
  }[]
>([]);

export const selectedTilesSubject$ = new BehaviorSubject<{
  id: number;
  x: number;
  y: number;
  color: string;
}>({
  id: 0,
  x: 0,
  y: 0,
  color: '',
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
