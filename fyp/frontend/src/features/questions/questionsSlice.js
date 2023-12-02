import { createSlice } from "@reduxjs/toolkit";

export const questionsSlice = createSlice({
    name: "questions",
    initialState: {
        question: [],
        answers: [],
        correctAnswer: null
    },
    reducers: {
        setQuestion: (state, action) => {
            state.question.push(action.payload);
        },
        setAnswers: (state, action) => {
            state.answers.push(action.payload);
        },
        setCorrectAnswer: (state, action) => {
            state.correctAnswer = action.payload;
        },
    }
});

export const {
    setQuestion,
    setAnswers,
    setCorrectAnswer,
} = questionsSlice.actions;

export const currentQuestion = state => state.questions.question;
export const allAnswers = state => state.questions.answers;
export const correctAns = state => state.questions.correctAnswer;

export default questionsSlice.reducer;