import { createSlice } from '@reduxjs/toolkit';

const messageSlice = createSlice({
    name: 'messages',
    initialState: {}, // Dictionary-like state, e.g., { John: [{...}, {...}], Doe: [{...}] }
    reducers: {
        // Add a message to a specific user
        addMessage: (state, action) => {
            const { key, msg, received } = action.payload;
            
            if (!state[key]) {
                // If the key doesn't exist, initialize it with an empty array
                state[key] = [];
            }
            // Add the new message to the user's message list
            state[key].push({ msg, received });
        }
    }
});

export const { addMessage } = messageSlice.actions;
export default messageSlice.reducer;


