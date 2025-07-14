import { createSlice } from '@reduxjs/toolkit';

const requestsSlice = createSlice({
  name: 'requests',
  initialState: [],
  reducers: {
    addRequest: (state, action) => {
      // Add new request if not already present
      if (!state.includes(action.payload)) {
        state.push(action.payload);
      }
    },
    removeRequest: (state, action) => {
    const index = state.indexOf(action.payload);
    if (index !== -1) {
      state.splice(index, 1); // Removes the item at the specified index
    }
  }
}});

export const { addRequest, removeRequest } = requestsSlice.actions;

export default requestsSlice.reducer;
