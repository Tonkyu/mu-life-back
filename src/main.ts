import express from 'express';

const app = express()
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