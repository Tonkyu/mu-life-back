"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
require('dotenv').config();
const app = (0, express_1.default)();
app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept');
    res.header('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Max-Age', '86400');
    next();
});
// jsonデータを扱う
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// テスト用のエンドポイント
app.get('/', (req, res) => {
    res.status(200).send({ message: 'hello, api sever!' });
});
app.get("/api/recommend-music", function (req, res) {
    const day = req.body.day;
    const month = req.body.month;
    const weather = req.body.weather;
    const location = req.body.location;
    console.log(process.env.OPENAI_API_KEY);
    console.log("aiu");
    res.status(200).send({ message: process.env.OPENAI_API_KEY });
});
// サーバー接続
const port = process.env.PORT || 3001;
app.listen(port, () => {
    console.log('listen on port:', port);
});
//# sourceMappingURL=main.js.map