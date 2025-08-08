import { configureStore } from '@reduxjs/toolkit';
import saveCharacterSlice from './saveCharactersSlice';
import { rimApi } from './rimService';

const rootReducer = {
  favorites: saveCharacterSlice,
  [rimApi.reducerPath]: rimApi.reducer,
};
export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(rimApi.middleware),
});

export default store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export { rootReducer };
