import { configureStore } from '@reduxjs/toolkit';
import { gameSlice } from '../features/gameSlice'; 
import { questionsSlice } from '../features/questionsSlice';


export const store = configureStore({
  reducer: {
    game: gameSlice.reducer,
    questions: questionsSlice.reducer,
  }
});