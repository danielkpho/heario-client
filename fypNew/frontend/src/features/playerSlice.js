import { createSlice } from '@reduxjs/toolkit';

export const playerSlice = createSlice({
    name: 'player',
    initialState: {
        username: '',
        password: '',
        gamesPlayed: 0,
        loginStatus: '',
    },
    reducers: {
        setUsername: (state, action) => {
            state.username = action.payload;
        },
        setPassword: (state, action) => {
            state.password = action.payload;
        },
        setGamesPlayed: (state, action) => {
            state.gamesPlayed = action.payload;
        },
        setLoginStatus: (state, action) => {
            state.loginStatus = action.payload;
        },
    }
});

export const {
    setUsername,
    setPassword,
    setGamesPlayed,
    setLoginStatus,
} = playerSlice.actions;

export const currentUsername = state => state.player.username;
export const currentPassword = state => state.player.password;
export const currentGamesPlayed = state => state.player.gamesPlayed;
export const currentLoginStatus = state => state.player.loginStatus;

export default playerSlice.reducer;