# To do:

- run through yenho code and see if you can output everything as a csv
    - 6 playlists for each book
    - each book should be about 24 kb
    - with 16k books, should be looking at 384 mb
    - not completely fucked...

    - look here if the d3 stuff doesnt print (should print though...): https://stackoverflow.com/questions/50469355/how-to-load-very-large-csv-files-in-nodejs

- once mega csv is created, should create code to just
    - get index of song
    - set playlist info to useState
    - create spotify playlist if not created yet
    - display data

# Set up:

Create an env file in root that looks like this:

```
REACT_APP_SPOTIFY_CLIENT_ID = ""
REACT_APP_SPOTIFY_SECRET = ""
REACT_APP_REDIRECT_URL = ""
REACT_APP_USER_ID = ""
```

Mkdir data under src and add book_data (books_ix).