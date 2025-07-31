import { configureStore } from '@reduxjs/toolkit';
import saveCharacterSlice from './saveCharactersSlice';

export const store = configureStore({
  reducer: {
    favorites: saveCharacterSlice,
  },
});

export default store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
