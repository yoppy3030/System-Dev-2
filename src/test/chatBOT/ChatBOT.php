<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>マナー学習チャットボット デモ</title>
    
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Noto+Sans+JP:wght@400;500;700&family=Noto+Sans+SC:wght@400;500;700&display=swap" rel="stylesheet">
    
    <style>
        body {
            font-family: 'Inter', 'Noto Sans JP', 'Noto Sans SC', sans-serif;
        }
        #chat-window::-webkit-scrollbar { width: 8px; }
        #chat-window::-webkit-scrollbar-track { background: #f1f5f9; }
        #chat-window::-webkit-scrollbar-thumb { background: #94a3b8; border-radius: 4px; }
        #chat-window::-webkit-scrollbar-thumb:hover { background: #64748b; }
       .bot-response-dos { color: #16a34a; /* Green */ }
       .bot-response-donts { color: #dc2626; /* Red */ }
    </style>
</head>

<body class="bg-gray-100 flex items-center justify-center min-h-screen p-4">

    <div class="w-full max-w-lg mx-auto bg-white rounded-2xl shadow-2xl flex flex-col h-[90vh] max-h-[750px]">
        
        <header class="bg-sky-600 text-white p-4 rounded-t-2xl shadow-md flex justify-between items-center">
            <div>
                <h1 id="header-title" class="text-xl font-bold">AIマナー学習ボット</h1>
                <p id="header-lang-status" class="text-sm opacity-90">言語: 日本語</p>
            </div>
            <div id="language-switcher" class="flex space-x-1 sm:space-x-2">
                <button onclick="switchLanguage('ja')" class="ja-btn bg-white text-sky-600 font-bold py-1 px-3 rounded-full text-sm shadow-sm transition-transform transform scale-110 ring-2 ring-white">日本語</button>
                <button onclick="switchLanguage('en')" class="en-btn bg-sky-500 hover:bg-white hover:text-sky-600 font-bold py-1 px-3 rounded-full text-sm shadow-sm transition-transform transform hover:scale-110">EN</button>
                <button onclick="switchLanguage('zh')" class="zh-btn bg-sky-500 hover:bg-white hover:text-sky-600 font-bold py-1 px-3 rounded-full text-sm shadow-sm transition-transform transform hover:scale-110">中文</button>
            </div>
        </header>

        <main id="chat-window" class="flex-1 p-6 overflow-y-auto space-y-4 bg-gray-50">
            </main>

        <footer class="p-4 bg-white border-t border-gray-200 rounded-b-2xl">
            <div class="flex items-center space-x-3">
                <input type="text" id="user-input" class="flex-1 p-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-sky-500 transition" placeholder="日本のマナーについて質問してください">
                <button id="send-btn" class="bg-sky-600 text-white rounded-full p-3 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 transition-transform transform hover:scale-110">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" /></svg>
                </button>
            </div>
        </footer>
    </div>

    <script src="./js/knowledge.js"></script>
    <script src="./js/main.js"></script>

</body>
</html>
