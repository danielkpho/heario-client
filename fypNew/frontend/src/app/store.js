import { configureStore } from '@reduxjs/toolkit';
import { gameSlice } from '../features/gameSlice'; 
import { questionsSlice } from '../features/questionsSlice';
import { statSlice } from '../features/statSlice';
import { playerSlice } from '../features/playerSlice';

export const store = configureStore({
  reducer: {
    game: gameSlice.reducer,
    questions: questionsSlice.reducer,
    stats: statSlice.reducer,
    player: playerSlice.reducer,
  }
});