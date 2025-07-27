import type { appState } from './types';

export const apiBase = 'https://rickandmortyapi.com/api/character/';
export const appStateInitial: appState = {
  data: [],
  loading: false,
  count: 0,
  previous: null,
  next: null,
  noResults: false,
  itemSelected: null,
};
