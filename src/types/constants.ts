import type { appState } from './types';

export const LSTheme_Key = 'theme';
export const apiBase = 'https://rickandmortyapi.com/api/character/';
export const appStateInitial: appState = {
  data: [],
  count: 0,
  previous: null,
  next: null,
  itemSelected: null,
};
