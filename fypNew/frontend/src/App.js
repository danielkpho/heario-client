import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import Home from "./features/Home";
import Lobby from "./features/Lobby";
import Register from "./features/Register";
import Profile from "./features/Profile";
import ReactPiano from "./features/Piano/Piano";

import { createTheme, ThemeProvider } from '@mui/material/styles';
import { styled } from '@mui/material/styles';  

import Grid from '@mui/material/Grid';
import { CssBaseline, Typography, Link } from "@mui/material";

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
        secondary : "#00000", // cream
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

// const imageURL = Image;
// const Background = styled("div")({
//   position: "absolute",
//   width: "100%",
//   height: "100%",
//   backgroundImage: `url(${imageURL})`,
//   backgroundPosition: "center",
//   backgroundSize: "cover",
//   backgroundRepeat: "no-repeat",
// });


function App() {
  return (
    <div>
    <div>
      {/* <Background/> */}
    </div>
    <ThemeProvider theme={theme}>
      <CssBaseline>
    <div>
    <Grid
        justifyContent="center"
        alignItems="center"
        marginTop={10}
      >
      <Grid item color='warning.main'>
        <Typography variant="h2" color="green" align="center">
          <Link href="/" underline="none" color="inherit">
            HEAR.IO
          </Link>
        </Typography>
      </Grid>
    </Grid>
      <BrowserRouter>
        <Routes>
        <Route path="/" exact element={<div><Home /></div>} />
          <Route path="/register" exact element= {<Register/>} />
          <Route path ="/profile" exact element= {<Profile/>} />
          <Route path = "/piano" exact element= {<ReactPiano/>} />
        </Routes>
      </BrowserRouter>
    </div>
    </CssBaseline>
    </ThemeProvider>
    </div>
  );
}

export default App;
