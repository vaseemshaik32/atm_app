import { createSlice } from '@reduxjs/toolkit';

const userinfoSlice = createSlice({
    name: 'userinfo',
    initialState: {
        donors: [], // Array to store donor information
        receivers: [] // Array to store receiver information
    },
    reducers: {
        // Action to set the donors array when "Get Cash" is selected
        setDonors: (state, action) => {
            state.donors = action.payload; // Replace donors array with API response
            state.receivers = []; // Clear receivers since only one is needed
        },
        // Action to set the receivers array when "Get Digital" is selected
        setReceivers: (state, action) => {
            state.receivers = action.payload; // Replace receivers array with API response
            state.donors = []; // Clear donors since only one is needed
        },
        // Optional: Clear both donors and receivers (e.g., on user logout)
        clearUserinfo: (state) => {
            state.donors = [];
            state.receivers = [];
        }
    }
});

export const { setDonors, setReceivers, clearUserinfo } = userinfoSlice.actions;
export default userinfoSlice.reducer;
