import { createSlice } from '@reduxjs/toolkit';

const chatsSlice = createSlice({
  name: 'chats',
  initialState: [],
  reducers: {
    addChat: (state, action) => {
      // Add new chat if not already present
      if (!state.includes(action.payload)) {
        state.push(action.payload);
      }
    },
  },
});

export const { addChat } = chatsSlice.actions;

export default chatsSlice.reducer;
