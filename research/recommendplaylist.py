import argparse
parser = argparse.ArgumentParser(
                prog = 'RecommendPlaylist',
                description = 'This Script takes in an book name that has an exact match and outputs several playlists based on genres')



parser.add_argument('-b', '--book', action='store') 
parser.add_argument('-g', '--genre', default=None, action='store')  
parser.add_argument('-t', '--topn', default=1000, action='store')  
parser.add_argument('-W', '--wfile', default="model/W_rank100.pt", action='store')  
parser.add_argument('-H', '--hfile', default="model/H_rank100.pt", action='store')  
parser.add_argument('-s', '--playlistsize', default=15, action='store')  




args = parser.parse_args()

query = args.book
req_genre = args.genre # this doesnt do anything yet
top_n = args.topn
wfile = args.wfile
hfile = args.hfile
playlist_size = args.playlistsize

music_ix_fname = "data/music_ix.csv"
books_ix_fname = "data/books_ix.csv"
musicfname = "data/combinedMusicData_small.csv"



import numpy as np
import pandas as pd
import torch

# load model
H = torch.load(hfile,map_location=torch.device('cpu'))
W = torch.load(wfile,map_location=torch.device('cpu'))


# load book/music indices
music_ix = pd.read_csv(music_ix_fname, header=None)
books_ix = pd.read_csv(books_ix_fname, header=None)

# compute all music scores for a given book
try:
    query_ix = books_ix.index[books_ix[0] == query].values[0]
    song_scores = (W[query_ix] @ H.T)
    top_song_ix = np.argsort(song_scores.detach().numpy())[::-1][:top_n]

    music_df = pd.read_csv(musicfname, skiprows = lambda x: x not in np.sort(top_song_ix)+1, header=None)
    # music_df.columns = ['title','tag','artist','year','views','features','lyrics','id','lang','uri']
    music_df.columns = ["title", 'tag', 'artist', 'year', 'views', 'uri']
    music_df['score'] = song_scores.detach().numpy()[np.sort(top_song_ix)]

    print("found genres")
    print(music_df['tag'].value_counts().index.values)


    for genre in music_df['tag'].value_counts().index.values:
        if genre != 'misc': # avoid misc category, they are not songs.
            print(genre)
            playlist_df = music_df[music_df['tag'] == genre].sort_values('score',ascending=False)[:playlist_size]
            print(playlist_df)
            print()
            if len(playlist_df) >= playlist_size and genre:
                playlist_df.to_csv(f'saved_playlists/{query_ix}_{genre}_playlist_{playlist_size}.csv')


except:
    print(f"Book query '{query}' did not match to existing book")
    
