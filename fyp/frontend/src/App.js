// import React from 'react';
// import { Paths } from './Routes';

// import { createTheme, ThemeProvider } from '@mui/material/styles';
// import pink from '@mui/material/colors/pink';
// import { orange } from '@mui/material/colors';
// import { io } from 'socket.io-client';


// import './App.css';

// let connected = '';

//     const socket = io('http://localhost:8000');

//     socket.on('connect', () => {
//         connected = 'We got a signal!';
//         console.log(connected);
//   });

// const theme = createTheme({
//   palette: {
//     primary: orange,
//     secondary: pink,
//   },
//   typography: {
//     useNextVariants: true,
//   },
// });

// function App() {
//   return (
//     <ThemeProvider theme={theme}>
//     <div>
//       <h1>HEAR.IO</h1>
//       <Paths />
//     </div>
//     </ThemeProvider>
//   );
// }

// export default App;

import React from 'react';  // adjust the path
import { io } from 'socket.io-client';
import CreateGame from './features/game/CreateGame';
import { Route, Routes, BrowserRouter } from 'react-router-dom';
import Question from './features/questions/Question';
import Answers from './features/questions/Answers';
import { socket } from './api/socket';

const App = () => {
  // Assuming you have the socket instance
  
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" exact element={ <CreateGame/> } />  
          <Route path="/game/question/:id" exact element={ <Question/> } />
          <Route path="/game/answers/:id" exact element={ <Answers/> } />
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;