import { useState } from 'react';

import HandleClick from '../components/HandleClick.js';

import { Typography, Autocomplete, TextField, Button, Box, Skeleton, Fade, styled } from '@mui/material';

const MuiIFrame = styled("iframe")({});

function Home({bookData}) {
    const [loading, setLoading] = useState(false);
    const [resultsLoaded, setResultsLoaded] = useState(false);
    const [genreLoading, setGenreLoading] = useState(false);

    const [disabledBtn, setDisabledBtn] = useState(true);
    const [inputValue, setInputValue] = useState("");
    const [open, setOpen] = useState(false);

    const [playlistData, setPlaylistData] = useState({"default":"https://open.spotify.com/embed/user/spotify/playlist/0ZtNpjS6cTeLIa1KpQ4cpp"})
    const [genre, setGenre] = useState("default")
    const [disabledBtn2, setDisabledBtn2] = useState(true);

    function btnClick(){
        const idx = bookData.indexOf(inputValue);
        HandleClick(idx, setLoading, setResultsLoaded, setPlaylistData);
    }

    function timeout(delay: number) {
        return new Promise( res => setTimeout(res, delay) );
    }

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
                                width: 700,
                                height: 400,
                                display: !loading && !genreLoading ? "block" : "none"
                        }}/>
                    </Fade>

                    <Box sx = {{
                        display: !loading ? "flex" : "none",
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
                            sx={{ width: 300 }}
                            renderInput={(params) => <TextField {...params} label="Select your favorite genre" />}
                        />
                    </Box>
                </Box>
            </Fade>
        </Box>
    );
}

export default Home;