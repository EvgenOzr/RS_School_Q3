import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { AuthUser } from "../types/types";

interface UserState {
  users: AuthUser[];
}

const initialState: UserState = {
  users: [],
};

const formsSlice = createSlice({
  name: "forms",
  initialState,
  reducers: {
    addUser(state, action: PayloadAction<AuthUser>) {
      state.users.push(action.payload);
    },
  },
});

export const { addUser } = formsSlice.actions;
export default formsSlice.reducer;
