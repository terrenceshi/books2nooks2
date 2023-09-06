import { useState } from 'react';

import { Typography, Autocomplete, TextField, Button, Box, Skeleton, Fade } from '@mui/material';

function Home({bookData}) {
    const [loading, setLoading] = useState(false);
    const [resultsLoaded, setResultsLoaded] = useState(false);

    const [disabledBtn, setDisabledBtn] = useState(true);
    const [inputValue, setInputValue] = useState("");
    const [open, setOpen] = useState(false);

    const top100Films = [
        { label: 'The Shawshank Redemption', year: 1994 },
        { label: 'The Godfather', year: 1972 },
        { label: 'The Godfather: Part II', year: 1974 },
        { label: 'The Dark Knight', year: 2008 },
        { label: '12 Angry Men', year: 1957 },
        { label: "Schindler's List", year: 1993 },
        { label: 'Pulp Fiction', year: 1994 },
        {
          label: 'The Lord of the Rings: The Return of the King',
          year: 2003,
        }
    ];

    return (
        <Box sx = {{
            display: "flex", 
            flexDirection: "column", 
            alignItems: "center",
            gap: 3,
            pb: 16
        }}>
            <Autocomplete
                disableClearable
                open={open}
                onClose={() => setOpen(false)}
                onChange={(event, value) => {
                    setInputValue(value);
                    setDisabledBtn(false);
                }}
                onInputChange={(event, value) => {
                    setDisabledBtn(true);
                    if (value.length > 2) {
                        setOpen(true);
                    } else {
                        setOpen(false);
                    }
                }}
                options={bookData}
                sx={{ width: 700 }}
                renderInput={(params) => <TextField {...params} label="Enter a book title" variant="outlined" />}
            />

            <Box>
                <Button variant="contained" disabled = {disabledBtn || inputValue === null} onClick = {() => console.log(inputValue)}>
                    Generate Playlist
                </Button>
            </Box>

            <Fade in = {loading} timeout={{ enter: 1500 }}>
                <Box>
                    <Skeleton 
                        variant="rounded" 
                        width={700} 
                        height={400} 
                        sx = {{
                            display: loading ? "block" : "none",
                            borderRadius: 4,
                        }}
                    />
                </Box>
            </Fade>

            <Fade in = {resultsLoaded} timeout={{ enter: 1500 }}>
                <Box sx = {{
                    display: resultsLoaded ? "flex" : "none",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 3
                }}>
                    <Box>
                        <iframe
                            title = "myFrame"
                            src="https://open.spotify.com/embed/user/spotify/playlist/0ZtNpjS6cTeLIa1KpQ4cpp"
                            width = {700} 
                            height="400" 
                            frameBorder="0" 
                            allowtransparency="true"
                        />
                        
                    </Box>

                    <Typography variant = "h6">
                        Don't like what you see?
                    </Typography>

                    <Autocomplete
                        disablePortal
                        options={top100Films}
                        sx={{ width: 300 }}
                        renderInput={(params) => <TextField {...params} label="Enter your favorite genre" />}
                    />

                    <Button
                        variant="contained"
                    >
                        Search Genre
                    </Button>
                </Box>
            </Fade>
        </Box>
    );
}

export default Home;