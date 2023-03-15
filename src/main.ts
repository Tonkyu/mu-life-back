import express from 'express';

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

app.post("/api/recommend", function (req, res) {

  const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  });
  const openai = new OpenAIApi(configuration);
  console.log("api");
  const month = 3;
  const day = 3;
  const weather = "晴れ";
  const location = "代々木公園";
  const question_text = month + "月" + day + "日の" + weather + "の日に" + location+ "で聴くのにぴったりな5曲の日本の楽曲をJSON形式で教えてください。それぞれの楽曲に対して、キーはartistとtitleの2つとしなさい。artistには歌手名を、titleには楽曲名を入れなさい。";
  var response = "default";
  const requestFunc = async () => {
    await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [{role: "user", content: question_text}],
    }).then((response: any) => {
      const answer_text = response.data.choices[0].message.content;
      try {
        const answer_json = JSON.parse(answer_text);
        console.log(answer_json);
        res.status(200).send(answer_json);
      } catch (error) {
        console.log("Error: failed to parse the openai response");
      }
    });
  };
  requestFunc();
});


app.post("/api/recommend-dummy", function (req, res) {

  const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  });
  const openai = new OpenAIApi(configuration);
  const requestFunc = async () => {
    const answer_text = "dummy-answer";
    try {
      const answer_json = JSON.parse(answer_text);
      console.log(answer_json);
      res.status(200).send(answer_json);
    } catch (error) {
      console.log("Error: failed to parse the openai response");
    };
  };
  requestFunc();
});

// サーバー接続
const port = process.env.PORT || 3001
app.listen(port, () => {
    console.log('listen on port:', port)
})