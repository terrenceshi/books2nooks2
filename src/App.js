import { useState, useEffect } from 'react';

import Navbar from "./components/Navbar.js";
import FakeLanding from "./components/FakeLanding.js";
import Home from "./pages/Home"
import About from "./pages/About.js";

import { Typography, Box, Fade } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

import { Route, Routes } from 'react-router-dom';
import { csv } from 'd3-request';
import url from "./data/book_data.csv";

function onlyUnique(value, index, array) {
  return array.indexOf(value) === index;
}

function App() {
  const darkTheme = createTheme({
    palette: {
      mode: 'dark',
    },
  });

  const [bookData, setBookData] = useState([]);
  const [appLoaded, setAppLoaded] = useState(false);

  useEffect(() => {
    csv(url, function(err, data) {
      var mappedData = data.map((entry) => {
          return entry.title;
      });

      mappedData = mappedData.filter(onlyUnique);

      setBookData(mappedData);
      setAppLoaded(true);
    })
  }, []);

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />

      <Box sx = {{display: appLoaded ? "none" : "block"}}>
        <FakeLanding />
      </Box>

      <Fade in = {appLoaded} timeout={{ enter: 1500 }}>
        <Box sx = {{display: appLoaded ? "block" : "none"}}>
          <Navbar/>

          <Typography variant="h1" align = "center" sx = {{p: 3}}>
            From Books to Nooks
          </Typography>

          <Routes>
            <Route path="/" element={<Home bookData = {bookData} />} />
            <Route path="/About" element={<About />} />
          </Routes>
        </Box>
      </Fade>
    </ThemeProvider>
  );
}

export default App;