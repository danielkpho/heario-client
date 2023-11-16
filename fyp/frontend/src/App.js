import React from 'react';
import { Paths } from './Routes';

import { createTheme, ThemeProvider } from '@mui/material/styles';
import pink from '@mui/material/colors/pink';
import blue from '@mui/material/colors/blue';

const theme = createTheme({
  palette: {
    primary: blue,
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
      <h1>HEAR.IO</h1>
      <Paths />
    </div>
    </ThemeProvider>
  );
}

export default App;