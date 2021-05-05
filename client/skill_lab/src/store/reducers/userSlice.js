import { createSlice } from "@reduxjs/toolkit";

export const userSlice = createSlice({
  name: "user",
  initialState: {
    user: null,
    groups: [],
    subspaceMentors: [],
  },
  reducers: {
    login: (state, action) => {
      state.user = action.payload;
    },
    logout: (state) => {
      state.user = null;
      state.groups = [];
    },
    storeGroups: (state, action) => {
      state.groups = action.payload;
    },
    addGroup: (state, action) => {
      state.groups.groups = [...state.groups.groups, action.payload];
    },
    leaveGroup: (state, action) => {
      state.groups.groups = state.groups.groups.filter(
        (group) => group.id !== action.payload
      );
    },
    storeSubspaceMentors: (state, action) => {
      state.subspaceMentors = action.payload;
    },
    addSubspaceMentor: (state, action) => {
      state.subspaceMentors = [...state.subspaceMentors, action.payload];
    },
    removeSubspaceMentor: (state, action) => {
      state.subspaceMentors = state.subspaceMentors.filter(
        (mentor) => mentor.id !== action.payload.id
      );
    },
  },
});

export const {
  login,
  logout,
  storeGroups,
  addGroup,
  leaveGroup,
  storeSubspaceMentors,
  addSubspaceMentor,
  removeSubspaceMentor,
} = userSlice.actions;

//Selectors
export const selectUser = (state) => state.user.user;
export const selectGroups = (state) => state.user.groups.groups;
export const selectSubspaceMentors = (state) => state.user.subspaceMentors;

export default userSlice.reducer;
