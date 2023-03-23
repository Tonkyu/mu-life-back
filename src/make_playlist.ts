const { Client } = require("spotify-api.js");

const MakePlaylist = async (req: any, res:any) => {
  const client = await Client.create({token: { clientID: process.env.SPOTIFY_CLIENT_ID, clientSecret: process.env.SPOTIFY_CLIENT_SECRET, refreshToken: process.env.SPOTIFY_REFRESH_TOKEN }, userAuthorizedToken: true});
  const songs = res.songs;
  const SearchSongs = async (songs: any) => {
    const val = await new Promise((resolve) => {
      resolve(songs);
    }).then((songs: any) => {
      const get = (song: any) => new Promise((resolve) => {
        resolve(song)
      }).then(async (song: any) => {
            return await client.search(`${song.title} ${song.artist}`, {types: ['track']})
            .then((val: any) => {
              return val.tracks;
            }).then((tracks: any) => {
              return tracks[0];
            })
      })
      return Promise.all(songs.map(async (song: any) => await get(song)));
    });
    return val;
  }

  return SearchSongs(songs)
  .then(async tracks => {
    const uris = tracks.map(track => track.uri)
    const name = `${req.month}月${req.day}日の${req.weather}の日に${req.location}で聴くためのプレイリスト`
    const spotify_tonq_bot  = "31ein4zwheierebmzdqpw6nhbubi";
    const playlist = await (async () => {
      try{
        return client.playlists.create(spotify_tonq_bot, { name: name });
      }
      catch (e) {
        return {id: "None"};
      }
    })();
    return {playlist, uris, tracks};
  }).then(async ({playlist, uris, tracks}) => {
    await client.playlists.addItems(playlist.id, uris);
    return {playlist, tracks};
  }).then(({playlist, tracks}) => {
    return {
      playlist_id: playlist.id,
      tracks: tracks
    }
  })
}

export default MakePlaylist;