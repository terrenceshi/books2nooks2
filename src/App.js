import Navbar from "./components/Navbar.js";
import Home from "./pages/Home"
import About from "./pages/About.js";

import { Typography } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

import { Route, Routes } from 'react-router-dom';

function App() {
  const darkTheme = createTheme({
    palette: {
      mode: 'dark',
    },
  });

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
        <Navbar/>

        <Typography variant="h1" align = "center" sx = {{p: 2}}>
          From Books to Nooks
        </Typography>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/About" element={<About />} />
        </Routes>
    </ThemeProvider>
  );
}

export default App;