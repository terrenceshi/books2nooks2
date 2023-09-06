import { useState, useEffect } from 'react';

import Navbar from "./components/Navbar.js";
import Home from "./pages/Home"
import About from "./pages/About.js";

import { Typography } from '@mui/material';
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

  useEffect(() => {
    csv(url, function(err, data) {
      var mappedData = data.map((entry) => {
          return entry.title;
      });

      mappedData = mappedData.filter(onlyUnique);

      setBookData(mappedData);

      console.log("Book Data loaded")
    })
  }, []);

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
        <Navbar/>

        <Typography variant="h1" align = "center" sx = {{p: 3}}>
          From Books to Nooks
        </Typography>

        <Routes>
          <Route path="/" element={<Home bookData = {bookData} />} />
          <Route path="/About" element={<About />} />
        </Routes>
    </ThemeProvider>
  );
}

export default App;