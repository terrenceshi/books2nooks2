import { useState } from 'react';

import HandleClick from '../components/HandleClick.js';

import { Typography, Autocomplete, TextField, Button, Box, Skeleton, Fade, styled } from '@mui/material';

const MuiIFrame = styled("iframe")({});

function Home({bookData, loading, setLoading, resultsLoaded, setResultsLoaded, genreLoading, setGenreLoading, playlistData, setPlaylistData, genre, setGenre}) {
    const [disabledBtn, setDisabledBtn] = useState(true);
    const [inputValue, setInputValue] = useState("");
    const [open, setOpen] = useState(false);

    function btnClick(){
        const idx = bookData.indexOf(inputValue);
        HandleClick(idx, setLoading, setResultsLoaded, setPlaylistData);
    }

    function timeout(delay) {
        return new Promise( res => setTimeout(res, delay) );
    }

    return (
        <Fade in = {true} timeout={{ enter: 1500 }}>
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
                        if (value.length > 2) {
                            setOpen(true);
                        } else {
                            setOpen(false);
                        }
                    }}
                    options={bookData}
                    sx={{ width: {md: 700, sm: 500, xs: 300} }}
                    renderInput={(params) => <TextField {...params} label="Enter a book title" variant="outlined" />}
                />

                <Box>
                    <Button variant="contained" disabled = {disabledBtn || inputValue === null} onClick = {btnClick}>
                        Generate Playlist
                    </Button>
                </Box>

                <Fade in = {resultsLoaded} timeout={{ enter: 1500 }}>
                    <Box sx = {{
                        display: resultsLoaded ? "flex" : "none",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: 3
                    }}>
                        <Fade in = {loading || genreLoading} timeout={{ enter: 1500 }}>
                            <Skeleton 
                                variant="rounded" 
                                width={700} 
                                height={400} 
                                sx = {{
                                    display: loading || genreLoading ? "block" : "none",
                                    borderRadius: 4,
                                }}
                            />
                        </Fade>

                        <Fade in = {!loading && !genreLoading} timeout={{ enter: 1500 }}>
                            <MuiIFrame
                                title = "myFrame"
                                id="spotifyPlaylist"
                                src= {playlistData[genre]}
                                frameBorder="0" 
                                allowtransparency="true"
                                sx = {{
                                    width: {md: 700, sm: 500, xs: 300},
                                    height: 400,
                                    display: !loading && !genreLoading ? "block" : "none"
                            }}/>
                        </Fade>

                        <Fade in = {!loading} timeout={{ enter: 1500 }}>
                            <Box sx = {{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                gap: 3
                            }}>
                                <Typography variant = "h6">
                                    Don't like what you see?
                                </Typography>

                                <Autocomplete
                                    disableClearable
                                    options={Object.keys(playlistData).map((entry) => {
                                        return entry.charAt(0).toUpperCase() + entry.slice(1)
                                    })}
                                    onChange={async (event, value) => {
                                        setGenreLoading(true);
                                        setGenre(value.toLowerCase());
                                        await timeout(750);
                                        setGenreLoading(false);
                                    }}
                                    value = {genre.charAt(0).toUpperCase() + genre.slice(1)}
                                    sx={{ width: 300 }}
                                    renderInput={(params) => <TextField {...params} label="Select your favorite genre" />}
                                />
                            </Box>
                        </Fade>
                    </Box>
                </Fade>
            </Box>
        </Fade>
    );
}

export default Home;