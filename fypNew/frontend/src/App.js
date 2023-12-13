import React from "react";
import { io } from "socket.io-client";
import { socket } from "./api/socket";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import Home from "./features/Home";
import Lobby from "./features/Lobby";

import { roomId } from "./features/Home";

import { createTheme, ThemeProvider } from '@mui/material/styles';
import pink from '@mui/material/colors/pink';
import { orange } from '@mui/material/colors';

const theme = createTheme({
    palette: {
      primary: orange,
      secondary: pink,
    },
    typography: {
      useNextVariants: true,
    },
  });

function App() {
  return (
    <ThemeProvider theme={theme}>
    <div>
      <h1> HEAR.IO </h1>
      <BrowserRouter>
        <Routes>
          <Route path="/" exact element={ <Home/>} />
          <Route path="/lobby/:id" exact element={ <Lobby/>} />
        </Routes>
      </BrowserRouter>
    </div>
    </ThemeProvider>
  );
}

export default App;
