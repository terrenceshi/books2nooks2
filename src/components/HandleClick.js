import data0 from '../data/data_0.json';
import data3300 from '../data/data_3300.json';
import data6600 from '../data/data_6600.json';
import data9900 from '../data/data_9900.json';
import data13200 from '../data/data_13200.json';

import {Buffer} from 'buffer';
import axios from 'axios';

async function getRefreshToken(){
    // Returns access token and refresh token if successfull
    // Returns -1 if issues connecting to Spotify API

    var authentication = Buffer.from(process.env.REACT_APP_SPOTIFY_CLIENT_ID + ":" + process.env.REACT_APP_SPOTIFY_SECRET).toString("base64");

    const tokenUrl = 'https://accounts.spotify.com/api/token';
    const authCode = ""

    try {
        var response = await axios.post(tokenUrl, {
            'grant_type': 'authorization_code',
            'scope': 'playlist-modify-public',
            'code': authCode,
            'redirect_uri': process.env.REACT_APP_REDIRECT_URL
        }, {
            headers: { 
                Authorization: "Basic " + authentication,
                'Content-Type': 'application/x-www-form-urlencoded' 
            }
        })

        console.log(response)

        return [response.data.access_token, response.data.refresh_token];
    } catch (error) {
        console.log(error);
        return -1
    }
}

async function lookForPlaylist(token, bookName){
    // Returns output dictionary if successful (dict of links. Key = genre. Val = link to playlist.)
    // Returns -1 if issues connecting to Spotify API

    var output = {};

    const getUrl = "https://api.spotify.com/v1/users/"+process.env.REACT_APP_USER_ID+"/playlists";
    var os = 0;
    var iterating = true;

    while(iterating){
        try {
            var response = await axios.get(getUrl, {
                headers: {
                    Authorization: `Bearer ${token}`
                },
                params: {
                    limit: 50,
                    offset: os
                }
            })

            var items = response.data.items;

            for(let i = 0; i < items.length; i++){
                var name = items[i].name.toLowerCase();

                if(name.includes(bookName.toLowerCase())){
                    var hyphenIdx = name.lastIndexOf("-");
                    var genre = name.substring(hyphenIdx + 2, name.length);
                    output[genre] = items[i].external_urls.spotify
                }
            }

            if(items.length < 50 || Object.keys(output).length >= 6){
                iterating = false;
            }
            os += 50
        } catch (error) {
            console.log(error);
            iterating = false;
            return -1;
        }
    }
    return output;
}

async function addSongsToPlaylist(token, playlistId, uriLst){
    // Returns 1 if success
    // Returns -1 if errors connecting to spotify API

    var addUrl = "https://api.spotify.com/v1/playlists/"+playlistId+"/tracks"

    var responseData = -1;

    await axios.post(
        addUrl,
        {
            'uris': uriLst
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
    ).then(function(response){
        responseData = response.data;
    }).catch(function(error){
        console.log(error);
    });

    if(responseData === -1){
        return -1;
    }

    return 1;
}

async function createPlaylist(token, data, genre, bookName){
    // Returns link to playlist if success
    // Returns -1 if issues connecting to Spotify API

    const createUrl = "https://api.spotify.com/v1/users/"+process.env.REACT_APP_USER_ID+"/playlists";

    var responseData = -1;

    var playlistName = bookName + ' playlist - ' + genre;
    var description = "Generated playlist for " + bookName;

    await axios.post(
        createUrl,
        {
          'name': playlistName,
          'description': description
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
    ).then(function(response){
        responseData = response.data;
    }).catch(function(error){
        console.log(error);
    });

    if(responseData === -1){
        return -1;
    }

    var playlistId = responseData.id;
    var playlistLink = responseData.external_urls.spotify;

    if ( typeof playlistId === 'string' ) {
        var uriLst = data[genre];
        var add = await addSongsToPlaylist(token, playlistId, uriLst);

        if(add === -1){
            return -1;
        }
    }

    return playlistLink;
}

async function refreshToken(){
    // Returns token if successfull
    // Returns -1 if issues connecting to Spotify API

    var authentication = Buffer.from(process.env.REACT_APP_SPOTIFY_CLIENT_ID + ":" + process.env.REACT_APP_SPOTIFY_SECRET).toString("base64");

    const tokenUrl = 'https://accounts.spotify.com/api/token'

    try {
        var response = await axios.post(tokenUrl, {
            'grant_type': 'refresh_token',
            refresh_token: process.env.REACT_APP_REFRESH_TOKEN
        }, {
            headers: { 
                Authorization: "Basic " + authentication,
                'Content-Type': 'application/x-www-form-urlencoded' 
            }
        })

        return response.data.access_token;
    } catch (error) {
        console.log(error);
        return -1
    }
}

function timeout(delay: number) {
    return new Promise( res => setTimeout(res, delay) );
}

const HandleClick = async function(idx, setLoading, setResultsLoaded, setPlaylistData) {
    // Returns dict where key = genre and val = link
    // Returns -1 errors connecting to Spotify API

    // UNCOMMENT THIS IF YOUR REFRESH TOKEN NEEDS REPLACING
    // var tokens = await getRefreshToken()
    // console.log("regular token: " + tokens[0])
    // console.log("refresh token: " + tokens[1])

    setLoading(true);
    setResultsLoaded(true);

    let data;

    if(idx < 3300){
        data = data0[idx];
    } else if(idx < 6600){
        data = data3300[idx - 3300];
    } else if(idx < 9900){
        data = data6600[idx - 6600];
    } else if(idx < 13200){
        data = data9900[idx - 9900];
    } else{
        data = data13200[idx - 13200];
    }

    var bookName = data.name;

    var token = await refreshToken();

    if(token === -1){
        return -1;
    }

    var output = await lookForPlaylist(token, bookName)

    if(Object.keys(output).length === 0){
        // No playlist yet, need to make them

        // Iterate through genres and make playlists
        for(let i = 0; i < Object.keys(data).length; i++){
            var genre = Object.keys(data)[i];

            if(genre === 'name'){
                continue;
            }

            var playlistLink = await createPlaylist(token, data, genre, bookName);

            if(playlistLink === -1){
                return -1;
            }

            output[genre] = playlistLink;
        }
    }

    Object.keys(output).forEach(function(key, index) {
        var lastIdx = output[key].lastIndexOf("/");
        output[key] = "https://open.spotify.com/embed/user/spotify/playlist" + output[key].slice(lastIdx);
    });

    output = Object.keys(output).sort().reduce(
        (obj, key) => { 
            obj[key] = output[key]; 
            return obj;
        }, 
        {}
    );

    setPlaylistData(output);

    await timeout(500);

    setLoading(false);
    setResultsLoaded(true);

    return output;
}

export default HandleClick;