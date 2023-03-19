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
              const extract_info = (track: any) => {
                const info =  {
                  id: track.id,
                  title: track.name,
                  uri: track.uri
                };
                return info;
              }
              return extract_info(tracks[0]);
            })
      })
      return Promise.all(songs.map(async (song: any) => await get(song)));
    });
    return val;
  }

  return SearchSongs(songs)
  .then(async infos => infos.map(info => info.uri))
  .then(async (uris) => {
    const name = `${req.month}月${req.day}日の${req.weather}の日に${req.location}で聴くためのプレイリスト`
    const playlist = await client.playlists.create('ton_q', { name: name });
    await client.playlists.addItems(playlist.id, uris)
    return playlist.uri;
  })
}

export default MakePlaylist;