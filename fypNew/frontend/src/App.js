import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import Home from "./features/Home";
import Lobby from "./features/Lobby";
import Register from "./features/Register";

import { createTheme, ThemeProvider } from '@mui/material/styles';

import Grid from '@mui/material/Grid';
import { CssBaseline, Typography, Backdrop } from "@mui/material";

import "./Knewave.css"

import { blue, green, red } from "@mui/material/colors";


const theme = createTheme({
    palette: {
        background: {
          // default: "#20212a"
          default: "white"
        },
        primary: {
          // main: '#ff4a3b',
          main: blue[500],
          dark: blue[700],
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
          main: green[500],
        },
      text: {
        primary: "#00000",
        secondary : "#ede6e2",
      }
    },
    typography: {     
      body1: {
        fontWeight: 200,
      },
      h2:{
        fontFamily: 'Knewave'
      }
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
        justifyContent="center"
        marginTop={10}
      >
      <Grid item xs={3} color='green.main'>
        <Typography variant="h2" color="green" align="center">
          HEAR.IO
        </Typography>
      </Grid>
    </Grid>
      <BrowserRouter>
        <Routes>
          <Route path="/" exact element={ <Home/>} />
          <Route path="/lobby/:id" exact element={ <Lobby/>} />
          <Route path="/register" exact element={ <Register/>} />
        </Routes>
      </BrowserRouter>
    </div>
    </CssBaseline>
    </ThemeProvider>
  );
}

export default App;
