import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    hostId: null,
    id: null,
    error: null,
    status: 'idle',
    players: [], // { id: 1, name: 'player1', score: 0 }
    roundSettings: {
        rounds: 3,
        time: 10,
        sharps: false,
        notes: true,
        intervals: false,
        scales: false,
        chords: false,
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
        setPlayerScore: (state, action) => {
            state.players[action.payload.id].score = action.payload.score;
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
        setStatus: (state, action) => {
            state.status = action.payload;
        },
        addPlayer: (state, action) => {
            state.players[action.payload.id] = action.payload;
        },
        updateRoundSettings: (state, action) => {
            state.roundSettings = action.payload;
        },
        allPlayers: (state, action) => {
            state.players = action.payload;
            console.log(state.players);
        },
        resetGame: (state) => {
            state.roundCount = 1;
            state.questionCount = 1;
            setIsRoundOver(false);
            setIsGameOver(false);
            setIsStarted(false);
            setStatus('idle');
        },   
    }
});

export const {
    setHostId,
    setId,
    incrementRound,
    incrementQuestion,
    setScores,
    setPlayerScore,
    setIsRoundOver,
    setIsGameOver,
    setIsStarted,
    setStatus,
    addPlayer,
    updateRoundSettings,
    allPlayers,
    resetGame,
} = gameSlice.actions;

export const roundCount = (state) => state.game.roundCount;
export const questionCount = (state) => state.game.questionCount;
export const scores = (state) => state.game.scores;
export const gameId = (state) => state.game.id;
export const selectTimer = (state) => state.game.roundSettings.time;

export default gameSlice.reducer;