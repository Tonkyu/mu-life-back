import express from 'express';

const app = express()

app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept');
  res.header('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Max-Age', '86400');
  next();
});
// jsonデータを扱う
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// テスト用のエンドポイント
app.get('/', (req, res) => {
    res.status(200).send({ message: 'hello, api sever!' })
})

// サーバー接続
const port = process.env.PORT || 3001
app.listen(port, () => {
    console.log('listen on port:', port)
})