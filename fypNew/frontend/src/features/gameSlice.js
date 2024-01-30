import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    joinedLobby: false,
    hostId: null,
    id: null,
    error: null,
    status: 'idle',
    players: [], // { id: 1, name: 'player1', score: 0 }
    roundSettings: {
        rounds: 3,
        time: 10,
        piano: 0,
        sharps: false,
        notes: true,
        intervals: true,
        scales: true,
        chords: true,
    },
    roundCount: 1,
    questionCount: 1,
    isRoundOver: false,
    isGameOver: false,
    isStarted: false,
    scores: [], // { id: 1, name: 'player1', score: 0 }
}

export const gameSlice = createSlice({
    name: 'game',
    initialState,
    reducers: {
        setJoinedLobby: (state, action) => {
            state.joinedLobby = action.payload;
        },
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
            console.log("resetGame redux store called");
            state.roundCount = 1;
            state.questionCount = 1;
            state.isGameOver = false;
            state.isStarted = false;
            state.isRoundOver = false;
            state.status = 'idle';
        },
        resetState: (state) => {
            state.joinedLobby = false;
            state.hostId = null;
            state.id = null;
            state.error = null;
            state.status = 'idle';
            state.players = [];
            state.roundSettings = {
                rounds: 3,
                time: 10,
                piano: 0,
                sharps: false,
                notes: true,
                intervals: true,
                scales: true,
                chords: true,
            };
            state.roundCount = 1;
            state.questionCount = 1;
            state.isRoundOver = false;
            state.isGameOver = false;
            state.isStarted = false;
            state.scores = [];
        },
    }
});

export const {
    setJoinedLobby,
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
    resetState,
} = gameSlice.actions;

export const roundCount = (state) => state.game.roundCount;
export const questionCount = (state) => state.game.questionCount;
export const scores = (state) => state.game.scores;
export const gameId = (state) => state.game.id;
export const selectTimer = (state) => state.game.roundSettings.time;

export default gameSlice.reducer;