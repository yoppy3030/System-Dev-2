// ページ全体のDOMが読み込まれてからスクリプトを実行
document.addEventListener('DOMContentLoaded', () => {

    // --- グローバル変数 ---
    let currentLanguage = 'ja';
    let inquiryState = { status: 'idle', name: '', email: '', message: '' };
    let currentQuiz = null;
    let askedQuizIndices = new Set();
    let currentDifficulty = null;
    let quizScore = 0;
    let quizLength = 0;
    let isChatInitialized = false;

    // --- DOM要素 ---
    const chatWindow = document.getElementById('chat-window');
    const userInput = document.getElementById('user-input');
    const sendBtn = document.getElementById('send-btn');
    const langSwitcher = document.getElementById('language-switcher');
    const chatModal = document.getElementById('chatbot-modal');
    const openButton = document.getElementById('chat-open-button');

    // --- 関数定義 ---

    /** お問い合わせの状態をリセット */
    function resetInquiryState() {
        inquiryState = { status: 'idle', name: '', email: '', message: '' };
    }

    /** クイズの状態をリセット */
    function resetQuizState() {
        currentQuiz = null;
        askedQuizIndices.clear();
        currentDifficulty = null;
        quizScore = 0;
        quizLength = 0;
    }

    /** ウェルカムメニューを表示 */
    function showWelcomeMenu() {
        resetQuizState();
        const welcome = uiStrings[currentLanguage].welcome;
        displayBotMessage(welcome.message, { quickReplies: welcome.replies });
    }

    /** 言語を切り替える */
    function switchLanguage(lang) {
        if (currentLanguage === lang) return;
        currentLanguage = lang;
        resetInquiryState();
        resetQuizState();
        const strings = uiStrings[lang];
        document.getElementById('header-title').textContent = strings.headerTitle;
        document.getElementById('header-lang-status').textContent = strings.langStatus;
        userInput.placeholder = strings.inputPlaceholder;
        
        const buttons = langSwitcher.querySelectorAll('button.lang-switch-btn');
        buttons.forEach(btn => {
            btn.classList.remove('bg-white', 'text-sky-600', 'scale-110', 'ring-2', 'ring-white');
            btn.classList.add('bg-sky-500', 'text-white', 'hover:bg-white', 'hover:text-sky-600');
            if (btn.dataset.lang === lang) {
                btn.classList.remove('bg-sky-500', 'text-white');
                btn.classList.add('bg-white', 'text-sky-600', 'scale-110', 'ring-2', 'ring-white');
            }
        });

        displayBotMessage(uiStrings[currentLanguage].lang_switched);
        setTimeout(showWelcomeMenu, 1000);
    }

    /** 古いクイック返信ボタンを削除 */
    function removeAllQuickReplies() {
        const existingReplies = document.querySelectorAll('.quick-replies-container');
        existingReplies.forEach(container => container.remove());
    }

    /** チャットウィンドウにユーザーのメッセージを表示 */
    function displayUserMessage(text) {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'flex justify-end';
        const bubble = document.createElement('div');
        bubble.className = 'user-message-bubble max-w-md p-3 rounded-2xl shadow';
        bubble.textContent = text;
        messageDiv.appendChild(bubble);
        chatWindow.appendChild(messageDiv);
        chatWindow.scrollTop = chatWindow.scrollHeight;
    }

    /** ボットの応答を表示（リッチコンテンツ対応）*/
    function displayBotMessage(text, options = {}) {
        removeAllQuickReplies();
        const messageContainer = document.createElement('div');
        messageContainer.className = 'flex flex-col items-start space-y-2';
        const bubble = document.createElement('div');
        bubble.className = 'max-w-md p-4 rounded-2xl shadow bg-white text-gray-800';
        const mainText = document.createElement('p');
        mainText.innerHTML = text.replace(/\n/g, '<br>');
        bubble.appendChild(mainText);
        messageContainer.appendChild(bubble);
        const repliesContainer = document.createElement('div');
        
        repliesContainer.className = 'flex justify-start flex-wrap gap-2 pt-2 quick-replies-container'; 
        
        const replies = options.quickReplies || options.quizOptions;
        if (replies) {
            replies.forEach(replyText => {
                const replyBtn = document.createElement('button');
                replyBtn.textContent = replyText;
                let actionType = 'quick_reply';
                if (options.quizOptions) actionType = 'quiz_option';
                else if (uiStrings[currentLanguage].quiz_difficulty.includes(replyText)) actionType = 'select_difficulty';
                else if (uiStrings[currentLanguage].quiz_question_counts.includes(replyText)) actionType = 'select_question_count';
                
                replyBtn.className = 'quick-reply-btn bg-white border border-sky-500 text-sky-500 text-sm font-semibold py-1 px-4 rounded-full hover:bg-sky-500 hover:text-white transition';
                replyBtn.dataset.action = actionType;
                repliesContainer.appendChild(replyBtn);
            });
        }
        if (options.isAiResponse) {
            const backBtn = document.createElement('button');
            backBtn.textContent = uiStrings[currentLanguage].back_to_menu;
            backBtn.className = 'quick-reply-btn bg-gray-200 border border-gray-400 text-gray-700 text-sm font-semibold py-1 px-4 rounded-full hover:bg-gray-300 transition';
            backBtn.dataset.action = 'back_to_menu';
            repliesContainer.appendChild(backBtn);
        }
        if (options.quizFlow === 'continue') {
            const continueBtn = document.createElement('button');
            continueBtn.textContent = uiStrings[currentLanguage].continue_quiz;
            continueBtn.className = 'quick-reply-btn bg-sky-500 border border-sky-500 text-white text-sm font-semibold py-1 px-4 rounded-full hover:bg-sky-600 transition';
            continueBtn.dataset.action = 'next_quiz';
            repliesContainer.appendChild(continueBtn);
            const backBtn = document.createElement('button');
            backBtn.textContent = uiStrings[currentLanguage].back_to_menu;
            backBtn.className = 'quick-reply-btn bg-gray-200 border border-gray-400 text-gray-700 text-sm font-semibold py-1 px-4 rounded-full hover:bg-gray-300 transition';
            backBtn.dataset.action = 'back_to_menu';
            repliesContainer.appendChild(backBtn);
        } else if (options.quizFlow === 'end') {
            const startOverBtn = document.createElement('button');
            startOverBtn.textContent = uiStrings[currentLanguage].start_over_quiz;
            startOverBtn.className = 'quick-reply-btn bg-sky-500 border border-sky-500 text-white text-sm font-semibold py-1 px-4 rounded-full hover:bg-sky-600 transition';
            startOverBtn.dataset.action = 'start_over_quiz';
            repliesContainer.appendChild(startOverBtn);
            const backBtn = document.createElement('button');
            backBtn.textContent = uiStrings[currentLanguage].back_to_menu;
            backBtn.className = 'quick-reply-btn bg-gray-200 border border-gray-400 text-gray-700 text-sm font-semibold py-1 px-4 rounded-full hover:bg-gray-300 transition';
            backBtn.dataset.action = 'back_to_menu';
            repliesContainer.appendChild(backBtn);
        }
        if (repliesContainer.hasChildNodes()) {
            messageContainer.appendChild(repliesContainer);
        }
        chatWindow.appendChild(messageContainer);
        chatWindow.scrollTop = chatWindow.scrollHeight;
    }

    /** ユーザーの入力を処理するメイン関数 */
    function handleUserInput() {
        const inputText = userInput.value.trim();
        if (!inputText) return;
        displayUserMessage(inputText);
        userInput.value = '';
        setTimeout(() => {
            const inquiryStrings = uiStrings[currentLanguage].inquiry;
            const cancelKeywords = inquiryStrings.cancel_keywords || [];
            if (inquiryState.status !== 'idle' && cancelKeywords.includes(inputText.toLowerCase())) {
                resetInquiryState();
                displayBotMessage(inquiryStrings.cancelled);
                setTimeout(showWelcomeMenu, 2000);
                return;
            }
            if (inquiryState.status !== 'idle') {
                processInquiry(inputText);
            } else {
                getBotResponse(inputText);
            }
        }, 500);
    }

    /** お問い合わせフローを処理 */
    function processInquiry(text) {
        const strings = uiStrings[currentLanguage].inquiry;
        switch (inquiryState.status) {
            case 'awaiting_name':
                inquiryState.name = text;
                inquiryState.status = 'awaiting_email';
                displayBotMessage(strings.prompt_email);
                break;
            case 'awaiting_email':
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (emailRegex.test(text)) {
                    inquiryState.email = text;
                    inquiryState.status = 'awaiting_message';
                    displayBotMessage(strings.prompt_message);
                } else {
                    displayBotMessage(strings.invalid_email);
                }
                break;
            case 'awaiting_message':
                inquiryState.message = text;
                sendInquiryToServer();
                break;
        }
    }

    /** サーバーにお問い合わせ内容を送信 */
    async function sendInquiryToServer() {
        displayBotMessage("...");
        const payload = { ...inquiryState, lang: currentLanguage };
        try {
            const response = await fetch('chatBOT/send_inquiry.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            const result = await response.json();
            if (chatWindow.lastChild && chatWindow.lastChild.textContent === "...") {
                chatWindow.removeChild(chatWindow.lastChild);
            }
            if (result.success) {
                displayBotMessage(uiStrings[currentLanguage].inquiry.complete);
            } else {
                console.error('Inquiry submission error:', result.error);
                displayBotMessage(uiStrings[currentLanguage].inquiry.send_error);
            }
        } catch (error) {
            console.error('Fetch API error during inquiry submission:', error);
            if (chatWindow.lastChild && chatWindow.lastChild.textContent === "...") {
                chatWindow.removeChild(chatWindow.lastChild);
            }
            displayBotMessage(uiStrings[currentLanguage].inquiry.send_error);
        } finally {
            resetInquiryState();
            setTimeout(showWelcomeMenu, 3000);
        }
    }

    /** クイズの次の問題を出題 */
    function askNextQuizQuestion() {
        if (askedQuizIndices.size >= quizLength) {
            const resultMessage = uiStrings[currentLanguage].getQuizResultMessage(quizScore, quizLength);
            displayBotMessage(uiStrings[currentLanguage].quiz_complete + "\n" + resultMessage, { quizFlow: 'end' });
            return;
        }

        const allQuizzesInDifficulty = quizData[currentDifficulty];
        if (!allQuizzesInDifficulty) {
            console.error("Invalid difficulty or quiz data is missing for:", currentDifficulty);
            displayBotMessage(uiStrings[currentLanguage].defaultReply);
            return;
        }
        const availableIndices = allQuizzesInDifficulty
            .map((_, index) => index)
            .filter(index => !askedQuizIndices.has(index));

        if (availableIndices.length === 0) {
            const resultMessage = uiStrings[currentLanguage].getQuizResultMessage(quizScore, askedQuizIndices.size);
            displayBotMessage(uiStrings[currentLanguage].all_quizzes_done + "\n" + resultMessage, { quizFlow: 'end' });
            return;
        }

        const randomIndexInPool = Math.floor(Math.random() * availableIndices.length);
        const originalQuizIndex = availableIndices[randomIndexInPool];
        askedQuizIndices.add(originalQuizIndex);
        currentQuiz = {
            ...allQuizzesInDifficulty[originalQuizIndex],
            originalIndex: originalQuizIndex
        };
        displayBotMessage(currentQuiz.question[currentLanguage], { quizOptions: currentQuiz.options[currentLanguage] });
    }

    /** AIに応答を問い合わせる（安全なサーバー経由） */
    async function getAIResponse(text) {
        displayBotMessage("...");
        const langMap = { ja: '日本語', en: 'English', zh: '中文' };
        const prompt = `あなたは日本の文化とマナーについて教える専門家です。以下の質問に対して、${langMap[currentLanguage]}で、親切かつ簡潔に答えてください。\n\n質問：${text}`;
        const payload = {
            contents: [{
                parts: [{ text: prompt }]
            }]
        };
        try {
            const apiUrl = 'chatBOT/gemini_proxy.php';
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            if (chatWindow.lastChild && chatWindow.lastChild.textContent === "...") {
                chatWindow.removeChild(chatWindow.lastChild);
            }
            if (!response.ok) {
                const errorResult = await response.json();
                console.error('Proxy or API Error:', errorResult.error);
                throw new Error(`Request failed with status ${response.status}`);
            }
            const result = await response.json();
            if (result.candidates && result.candidates.length > 0 && result.candidates[0].content.parts[0].text) {
                const aiText = result.candidates[0].content.parts[0].text;
                displayBotMessage(aiText, { isAiResponse: true });
            } else {
                console.error("Invalid AI response structure:", result);
                displayBotMessage(uiStrings[currentLanguage].defaultReply, { isAiResponse: true });
            }
        } catch (error) {
            console.error('AI response fetch error:', error);
            if (chatWindow.lastChild && chatWindow.lastChild.textContent === "...") {
                chatWindow.removeChild(chatWindow.lastChild);
            }
            displayBotMessage(uiStrings[currentLanguage].defaultReply, { isAiResponse: true });
        }
    }

    /** 通常の応答を検索して表示 */
    function getBotResponse(text) {
        const lowerCaseText = text.toLowerCase();
        const features = specialFeatures[currentLanguage];
        let foundFeature = null;
        for (const keyword in features) {
            if (lowerCaseText.includes(keyword.toLowerCase())) {
                foundFeature = features[keyword];
                break;
            }
        }
        if (foundFeature) {
            if (foundFeature.isInquiry) {
                inquiryState.status = 'awaiting_name';
                displayBotMessage(uiStrings[currentLanguage].inquiry.start);
            } else if (foundFeature.isQuiz) {
                resetQuizState();
                displayBotMessage(uiStrings[currentLanguage].quiz_prompt, { quickReplies: uiStrings[currentLanguage].quiz_difficulty });
            }
        } else {
            getAIResponse(text);
        }
    }

    /** ★★★ START: REVISED FUNCTION ★★★ */
    /** テーマ切り替えドロップダウンを初期化 */
    function initializeThemeSwitcher() {
        const dropdownBtn = document.getElementById('cb-theme-btn');
        const dropdownContent = document.getElementById('cb-theme-content');
        const themeOptions = document.querySelectorAll('.cb-theme-option');
        const chatbotModal = document.getElementById('chatbot-modal');
        
        if (!dropdownBtn || !dropdownContent || !chatbotModal) {
            console.error('Theme switcher elements not found. Check IDs: cb-theme-btn, cb-theme-content');
            return;
        }
        console.log("Theme switcher initialized.");

        const allThemes = ['theme-spring', 'theme-summer', 'theme-autumn', 'theme-winter', 'theme-morning', 'theme-day', 'theme-evening', 'theme-night'];

        const applyTheme = (themeName) => {
            allThemes.forEach(theme => chatbotModal.classList.remove(theme));
            chatbotModal.classList.add(`theme-${themeName}`);
            
            const selectedOption = document.querySelector(`.cb-theme-option[data-theme="${themeName}"]`);
            if (selectedOption) {
                dropdownBtn.innerHTML = selectedOption.querySelector('i').outerHTML;
            }
        };

        applyTheme('spring');

        dropdownBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            dropdownContent.classList.toggle('show');
        });

        themeOptions.forEach(option => {
            option.addEventListener('click', (e) => {
                e.stopPropagation();
                const selectedTheme = option.dataset.theme;
                applyTheme(selectedTheme);
                dropdownContent.classList.remove('show');
            });
        });

        document.addEventListener('click', () => {
            if (dropdownContent.classList.contains('show')) {
                dropdownContent.classList.remove('show');
            }
        });
    }
    /** ★★★ END: REVISED FUNCTION ★★★ */

    /** チャットボットの初期化処理 */
    function initializeChat() {
        initializeThemeSwitcher();

        sendBtn.addEventListener('click', handleUserInput);
        userInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') handleUserInput();
        });

        if (langSwitcher) {
            langSwitcher.addEventListener('click', (e) => {
                const button = e.target.closest('.lang-switch-btn');
                if (button && button.dataset.lang) {
                    switchLanguage(button.dataset.lang);
                }
            });
        }

        chatWindow.addEventListener('click', function (e) {
            const targetButton = e.target.closest('.quick-reply-btn');
            if (!targetButton) return;
            
            e.stopPropagation();

            const replyText = targetButton.textContent;
            const action = targetButton.dataset.action;
            displayUserMessage(replyText);
            removeAllQuickReplies();
            if (action === 'back_to_menu') {
                resetQuizState();
                setTimeout(showWelcomeMenu, 500);
            } else if (action === 'start_over_quiz') {
                resetQuizState();
                const quizKeyword = uiStrings[currentLanguage].welcome.replies.find(r =>
                    specialFeatures[currentLanguage][r.toLowerCase()]?.isQuiz
                );
                if (quizKeyword) {
                    getBotResponse(quizKeyword);
                }
            } else if (action === 'next_quiz') {
                askNextQuizQuestion();
            } else if (action === 'select_difficulty') {
                const difficultyMap = {
                    '簡単': 'easy', 'Easy': 'easy', '简单': 'easy',
                    '普通': 'normal', 'Normal': 'normal',
                    '難しい': 'hard', 'Hard': 'hard', '困难': 'hard'
                };
                currentDifficulty = difficultyMap[replyText];
                displayBotMessage(uiStrings[currentLanguage].quiz_question_count_prompt, { quickReplies: uiStrings[currentLanguage].quiz_question_counts });

            } else if (action === 'select_question_count') {
                quizLength = parseInt(replyText);
                askedQuizIndices.clear();
                quizScore = 0;
                currentQuiz = null;
                askNextQuizQuestion();

            } else if (action === 'quiz_option') {
                const quizData = currentQuiz;
                if (!quizData) return;
                const masterCorrectAnswerIndex = quizData.correct;
                const selectedOptionIndex = quizData.options[currentLanguage].indexOf(replyText);
                let resultMessage;
                const correctMessages = { ja: '正解です！👏 ', en: 'Correct! 👏 ', zh: '回答正确！👏 ' };
                const incorrectMessages = { ja: '残念！正解は「', en: 'Incorrect. The correct answer is "', zh: '很遗憾！正确答案是“' };
                const endMessages = { ja: '」です。', en: '". ', zh: '”。' };
                if (selectedOptionIndex === masterCorrectAnswerIndex) {
                    quizScore++;
                    resultMessage = correctMessages[currentLanguage] + quizData.explanation[currentLanguage];
                } else {
                    resultMessage = incorrectMessages[currentLanguage] + quizData.options[currentLanguage][masterCorrectAnswerIndex] + endMessages[currentLanguage] + quizData.explanation[currentLanguage];
                }
                currentQuiz = null;
                setTimeout(() => displayBotMessage(resultMessage, { quizFlow: 'continue' }), 500);
            } else {
                setTimeout(() => getBotResponse(replyText), 500);
            }
        });
        showWelcomeMenu();
    }

    // --- チャットボットの表示切り替えと初期化 ---
    if (openButton && chatModal) {
        const toggleChat = (show) => {
            if (show) {
                chatModal.style.display = 'flex';
                openButton.innerHTML = '<i class="fas fa-times"></i>';
                if (!isChatInitialized) {
                    initializeChat();
                    isChatInitialized = true;
                }
            } else {
                chatModal.style.display = 'none';
                openButton.innerHTML = '<i class="far fa-comments"></i>';
            }
        };

        openButton.addEventListener('click', (e) => {
            e.stopPropagation();
            const isVisible = chatModal.style.display === 'flex';
            toggleChat(!isVisible);
        });

        document.addEventListener('click', (e) => {
            if (chatModal.style.display === 'flex' && !chatModal.contains(e.target) && !openButton.contains(e.target)) {
                toggleChat(false);
            }
        });
    }
});
