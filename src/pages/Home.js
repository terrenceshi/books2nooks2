import { Typography, Autocomplete, TextField, Button, Box } from '@mui/material';

function Home() {
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
            gap: 2
        }}>
            <Box>
                <Autocomplete
                    disablePortal
                    options={top100Films}
                    sx={{ width: 300 }}
                    renderInput={(params) => <TextField {...params} label="Movie" />}
                />

                <Button
                    variant="contained"
                    sx = {{ }}
                >
                    Generate Playlist
                </Button>
            </Box>

            <Box>
                <iframe
                    title = "myFrame"
                    src="https://open.spotify.com/embed/user/spotify/playlist/0ZtNpjS6cTeLIa1KpQ4cpp"
                    width = {700} 
                    height="380" 
                    frameBorder="0" 
                    allowtransparency="true"
                />

                <Typography variant = "h5">
                    Don't like what you see?
                </Typography>

                <Autocomplete
                    disablePortal
                    options={top100Films}
                    sx={{ width: 300 }}
                    renderInput={(params) => <TextField {...params} label="Movie" />}
                />

                <Button
                    variant="contained"
                >
                    Search Genre
                </Button>
            </Box>

        </Box>
    );
}

export default Home;