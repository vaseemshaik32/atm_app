import { configureStore } from '@reduxjs/toolkit';
import messageReducer from './messageslice';
import userinfoReducer from './userinfoslice';
import requestsReducer from './reqslice';
import chatsReducer from './chatsslice';

// Save the Redux state to sessionStorage
const saveStateToSession = (state) => {
    try {
        const serializedState = JSON.stringify(state);
        sessionStorage.setItem('reduxState', serializedState);
    } catch (error) {
        console.error('Could not save state to sessionStorage:', error);
    }
};

// Load the Redux state from sessionStorage
const loadStateFromSession = () => {
    try {
        const serializedState = sessionStorage.getItem('reduxState');
        if (serializedState === null) return undefined; // No saved state
        return JSON.parse(serializedState);
    } catch (error) {
        console.error('Could not load state from sessionStorage:', error);
        return undefined;
    }
};

// Load the preloaded state
const preloadedState = loadStateFromSession();

// Configure the Redux store
const store = configureStore({
    reducer: {
        messages: messageReducer,
        userinfo: userinfoReducer,
        req: requestsReducer,
        chts: chatsReducer,
    },
    preloadedState,
});

// Save the state to sessionStorage on changes
store.subscribe(() => {
    saveStateToSession(store.getState());
});

export default store;
