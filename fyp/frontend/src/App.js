import React from 'react';
import { BrowserRouter as Routes, Route, Router } from 'react-router-dom';
import MyPage from './pages/MyPage';

function App() {
  return (
    <div>
      <h1>HEAR.IO</h1>
      <MyPage />
    </div>
  );
}

export default App;