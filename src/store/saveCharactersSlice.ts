import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { character } from '../types/types';

export interface CharactersState {
  characters: character[];
}

const initialState: CharactersState = {
  characters: [],
};

const saveCharacterSlice = createSlice({
  name: 'characters',
  initialState,
  reducers: {
    addCharacter(state, action: PayloadAction<character>) {
      state.characters.push(action.payload);
    },

    deleteCharacter(state, action) {
      const indexDelete = state.characters.findIndex(
        (char) => char.name === action.payload.name
      );
      state.characters = [
        ...state.characters.slice(0, indexDelete),
        ...state.characters.slice(indexDelete + 1),
      ];
    },

    deleteAll(state) {
      state.characters = [];
    },
  },
});

export const { addCharacter, deleteCharacter, deleteAll } =
  saveCharacterSlice.actions;
export default saveCharacterSlice.reducer;
