import { createSlice } from '@reduxjs/toolkit';

export const statSlice = createSlice({
    name: 'stats',
    initialState: {
        questions: [],
        tries: [],
        accuracy: [],
    },
    reducers: {
        newQuestion: (state, action) => {
            state.questions= [...state.questions, action.payload];
            state.tries = [...state.tries, 0];
            state.accuracy = [...state.accuracy, 0];
        },
        incrementTries: (state, action) => {
            const questionIndex = state.questions.indexOf(action.payload);
            state.tries[questionIndex]++;
            state.accuracy[questionIndex] = (1 / state.tries[questionIndex]).toFixed(2);
        },
        resetStats: (state) => {
            state.questions = [];
            state.tries = [];
            state.accuracy = [];
        }
    }
});

export const {
    newQuestion,
    incrementTries,
    resetStats,
} = statSlice.actions;

export const allQuestions = state => state.stats.questions;
export const allTries = state => state.stats.tries;
export const allAccuracy = state => state.stats.accuracy;

export default statSlice.reducer;