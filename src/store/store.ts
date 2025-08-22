import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./formsSlice";
import countryReducer from "./countrySlice";

const rootReducer = {
  userReducer,
  countryReducer,
};

export const store = configureStore({
  reducer: rootReducer,
});

export default store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export { rootReducer };
