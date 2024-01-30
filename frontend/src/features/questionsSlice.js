import { createSlice } from "@reduxjs/toolkit";

export const questionsSlice = createSlice({
    name: "questions",
    initialState: {
        note: [],
        tone: [],
        answers: [],
        correctAnswer: [],
        questionType: [],
    },
    reducers: {
        setNote: (state, action) => {
            state.note = action.payload;
        },
        setTone: (state, action) => {
            state.tone = action.payload;
        },
        setAnswers: (state, action) => {
            state.answers = action.payload;
        },
        setCorrectAnswer: (state, action) => {
            state.correctAnswer = action.payload; 
        },
        setQuestionType: (state, action) => {
            state.questionType = action.payload;
        },
    }
});

export const {
    setNote,
    setTone,
    setAnswers,
    setCorrectAnswer,
    setQuestionType,
} = questionsSlice.actions;

export const currentNote = state => state.questions.note;
export const currentTone = state => state.questions.tone;
export const allAnswers = state => state.questions.answers;
export const correctAns = state => state.questions.correctAnswer;

export default questionsSlice.reducer;