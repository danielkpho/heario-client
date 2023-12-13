import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    hostId: null,
    id: null,
    error: null,
    status: 'idle',
    players: {},
    roundSettings: {
        rounds: 3,
        time: 10,
    },
    roundCount: 1,
    questionCount: 1,
    isRoundOver: false,
    isGameOver: false,
    isStarted: false,
    scores: [],
}

export const gameSlice = createSlice({
    name: 'game',
    initialState,
    reducers: {
        setHostId: (state, action) => {
            state.hostId = action.payload;
        },
        setId: (state, action) => {
            state.id = action.payload;
        },
        incrementRound: (state) => {
            state.roundCount++;
        },
        incrementQuestion: (state) => {
            state.questionCount++;
        },
        setScores: (state, action) => {
            state.scores = [...action.payload];
        },
        setIsRoundOver: (state, action) => {  
            state.isRoundOver = action.payload;
        },
        setIsGameOver: (state, action) => {
            state.isGameOver = action.payload;
        },
        setIsStarted: (state, action) => {
            state.isStarted = action.payload;
        },
        addPlayer: (state, action) => {
            state.players[action.payload.id] = action.payload;
            console.log(JSON.parse(JSON.stringify(state.players)));
        },
        updateRoundSettings: (state, action) => {
            state.roundSettings = action.payload;
        },
        allPlayers: (state, action) => {
            state.players = action.payload;
            console.log(state.players);
        },
    }
});

export const {
    setHostId,
    setId,
    incrementRound,
    incrementQuestion,
    setScores,
    setIsRoundOver,
    setIsGameOver,
    setIsStarted,
    addPlayer,
    updateRoundSettings,
    allPlayers,
} = gameSlice.actions;

export const roundCount = (state) => state.game.roundCount;
export const questionCount = (state) => state.game.questionCount;
export const scores = (state) => state.game.scores;
export const gameId = (state) => state.game.id;

export default gameSlice.reducer;