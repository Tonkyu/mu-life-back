"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const { Client } = require("spotify-api.js");
var dayjs = require('dayjs');
const MakePlaylist = async (req, res, clientPG) => {
    const client = await Client.create({ token: { clientID: process.env.SPOTIFY_CLIENT_ID, clientSecret: process.env.SPOTIFY_CLIENT_SECRET, refreshToken: process.env.SPOTIFY_REFRESH_TOKEN }, userAuthorizedToken: true });
    const songs = res.songs;
    const SearchSongs = async (songs) => {
        const val = await new Promise((resolve) => {
            resolve(songs);
        }).then((songs) => {
            const get = (song) => new Promise((resolve) => {
                resolve(song);
            }).then(async (song) => {
                return await client.search(`${song.title} ${song.artist}`, { types: ['track'] })
                    .then((val) => {
                    return val.tracks;
                }).then((tracks) => {
                    return tracks[0];
                });
            });
            return Promise.all(songs.map(async (song) => await get(song)));
        });
        return val;
    };
    const AlreadyExist = (name) => {
        const query = {
            text: 'SELECT id FROM playlists WHERE name=$1 LIMIT 1',
            values: [name]
        };
        return clientPG.query(query);
    };
    return SearchSongs(songs)
        .then(async (tracks) => {
        const uris = tracks.map(track => track.uri);
        const name = `${req.month}月${req.day}日の${req.weather}の日に${req.location}で聴くためのプレイリスト`;
        var playlist_id;
        const alreadyExist = (await AlreadyExist(name)).rows;
        console.log(alreadyExist);
        if (alreadyExist.length) {
            console.log("exist");
            playlist_id = alreadyExist[0].id;
        }
        else {
            console.log("not exist");
            const spotify_tonq_bot = "31ein4zwheierebmzdqpw6nhbubi";
            const playlist = await (() => {
                try {
                    return client.playlists.create(spotify_tonq_bot, { name: name });
                }
                catch (e) {
                    return { id: "None" };
                }
            })();
            await client.playlists.addItems(playlist.id, uris);
            var createdAt = dayjs().format('YYYY-MM-DD HH:mm:ss');
            const insert_query = {
                text: 'INSERT INTO playlists(id, name, song_id_1, song_id_2, song_id_3, song_id_4, song_id_5, created_at, deleted) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9)',
                values: [playlist.id, playlist.name, tracks[0].id, tracks[1].id, tracks[2].id, tracks[3].id, tracks[4].id, createdAt, false]
            };
            await clientPG.query(insert_query, (err, res) => {
                if (err) {
                    console.log(err.stack);
                }
                else {
                    console.log("-----------");
                    console.log("add playlist to DB");
                    console.log("-----------");
                }
            });
            playlist_id = playlist.id;
        }
        return {
            playlist_id: playlist_id,
            name: name,
            tracks: tracks
        };
    });
};
exports.default = MakePlaylist;
//# sourceMappingURL=make_playlist.js.map