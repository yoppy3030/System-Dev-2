// index.js

// 必要なモジュールをインポート
const express = require('express'); // 例としてExpressを使用
const app = express();
const PORT = process.env.PORT || 3000;

// publicフォルダを静的ファイルの提供元として設定
app.use(express.static('public'));

// ルートエンドポイントの設定
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html'); // index.htmlを返す
});

// サーバーの起動
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});