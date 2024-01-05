import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import Home from "./features/Home";
import Lobby from "./features/Lobby";

import { createTheme, ThemeProvider } from '@mui/material/styles';

import Grid from '@mui/material/Grid';
import { CssBaseline } from "@mui/material";

const theme = createTheme({
    palette: {
        background: {
          // default: "#20212a"
          default: "#17255A"
        },
        primary: {
          // main: '#ff4a3b',
          main: "#D88373",
          dark: "#b23329",
        },
        secondary: {
          // main: "#70a7b6",
          main: "#BD1E1E",
        },
        black: {
          main: "#000000",
        },
        cream: {
          main: "#ede6e2",
        },
        green:{
          main: "#00bf63",
        },
      text: {
        primary: "#00000",
        secondary : "#ede6e2",
      }
    },
    typography: {     
      body1: {
        fontWeight: 500,
      },
    },
    // customBorderRadius: {
    //   borderRadius: "16px",
    // },
  });

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline>
    <div>
    <Grid
        alignItems="left"
        justifyContent="center"
        margin={2}
      >
      <Grid item xs={3} color='primary.main' fontSize={50}>
        Hear.IO
      </Grid>
      </Grid>
      <BrowserRouter>
        <Routes>
          <Route path="/" exact element={ <Home/>} />
          <Route path="/lobby/:id" exact element={ <Lobby/>} />
        </Routes>
      </BrowserRouter>
    </div>
    </CssBaseline>
    </ThemeProvider>
  );
}

export default App;
