// index.js

// 必要なモジュールをインポート
const express = require('express'); // 例としてExpressを使用
const app = express();
const PORT = process.env.PORT || 3000;

// ルートエンドポイントの設定
app.get('/', (req, res) => {
    res.send('Hello, World!'); // 簡単なレスポンス
});

// サーバーの起動
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});