import express from 'express';
import MakePlaylist from './make_playlist'

require('dotenv').config();
const app = express();

const { Configuration, OpenAIApi } = require("openai");

app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept');
  res.header('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Max-Age', '86400');
  next();
});

// jsonデータを扱う
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// テスト用のエンドポイント
app.get('/', (req, res) => {
  res.status(200).send({ message: 'hello, api sever!' });
})

app.get('/api/recommend', (req, res) => {
  res.status(200).send({ message: 'hello, api sever! this is api/recommend'});
})


app.post("/api/recommend", async function (req, res) {
  const configuration = new Configuration({
    apiKey: process.env.OPEN_API_KEY,
  });
  const openai = new OpenAIApi(configuration);
  console.log("api");
  const month = req.body.month;
  const day = req.body.day;
  const weather = req.body.weather;
  const location = req.body.location;
  const question_text = `${month}月${day}日の${weather}の日に${location}で聴くのにぴったりな5曲の日本の楽曲をJSON形式で答えなさい。\n\
                      それぞれの楽曲に対して、キーはartistとtitleの2つとしなさい。artistには歌手名を、titleには楽曲名を入れなさい。\n\
                      例えば、以下の形式に沿って回答しなさい。:\n\
                      [{"artist":"山下達郎","title":"クリスマス・イブ"},{"artist":"松任谷由実","title":"春よ、来い"},{"artist":"サザンオールスターズ","title":"TSUNAMI"},{"artist":"Mr.Children","title":"Tomorrow never knows"},{"artist":"桑田佳祐","title":"白い恋人達"}]`;

    const requestFunc = async () => {
      return await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [{role: "user", content: question_text}],
      }).then((response: any) => {
        const answer_text = response.data.choices[0].message.content;
        function formatToSongs(_songs_json: string) {
          function defaultJudge(json: any) {
              if (json.hasOwnProperty("songs")) {
                  json = json.songs;
              }
              return JSON.parse(json);
          };

          function songNumJudge(json: any) {
              const array = [1, 2, 3, 4, 5];
              return array.map(val => json["song" + val.toString()]);
          };

          function NumJudge(json: any) {
              const array = [1, 2, 3, 4, 5];
              return array.map(val => json[val.toString()]);
          };

          const func_list = [songNumJudge, NumJudge, defaultJudge];

          try {
              return func_list.map(f => f(_songs_json)).filter(val => {return typeof val[0] == "object" && val[0].hasOwnProperty("artist")  && val[0].hasOwnProperty("title")})[0]
          } catch (e){
              console.log(e);
          }
        }
        const res = formatToSongs(answer_text);
        return res;
      }).then((val: any) => {
        return val
      });
    };
  const return_obj = await (async () => {
                        try {
                          return {
                            success: true,
                            songs: await requestFunc()
                          }
                        } catch {
                          return {
                            success: false,
                            songs: []
                          }
                        }})();
  console.log(return_obj);
  res.status(200).send(return_obj);
});


app.get('/api/recommend-dummy', (req, res) => {
  res.status(200).send({ message: 'hello, api sever! this is api/recommend-dummy'});
})


app.post("/api/recommend-dummy", function (req, res) { 
  const requestFunc = async () => {
    const answer_text = '[{"artist":"山下達郎","title":"クリスマス・イブ"},{"artist":"松任谷由実","title":"春よ、来い"},{"artist":"サザンオールスターズ","title":"TSUNAMI"},{"artist":"Mr.Children","title":"Tomorrow never knows"},{"artist":"桑田佳祐","title":"白い恋人達"}]';
    console.log(answer_text);
    res.status(200).send(answer_text);
  };
  requestFunc();
});


app.get("/api/spotify", function(req, res) {
  const ans = MakePlaylist();
  res.status(200).send(ans);
});

// サーバー接続
const port = process.env.PORT || 3001
app.listen(port, () => {
    console.log('listen on port:', port)
})