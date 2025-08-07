import { configureStore } from '@reduxjs/toolkit';
import saveCharacterSlice from './saveCharactersSlice';
import { rimApi } from './rimService';

export const store = configureStore({
  reducer: {
    favorites: saveCharacterSlice,
    [rimApi.reducerPath]: rimApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(rimApi.middleware),
});

export default store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
