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
    let pinnedMessages = JSON.parse(localStorage.getItem('chatbot_pinned_messages')) || [];

    // --- DOM要素 ---
    const chatWindow = document.getElementById('chat-window');
    const userInput = document.getElementById('user-input');
    const sendBtn = document.getElementById('send-btn');
    const chatModal = document.getElementById('chatbot-modal');
    const openButton = document.getElementById('chat-open-button');
    const settingsBtn = document.getElementById('settings-btn');
    const settingsContent = document.getElementById('settings-content');
    const themeOptions = document.querySelectorAll('.cb-theme-option');
    const clearHistoryBtn = document.getElementById('clear-history-btn');
    const langSwitcher = document.getElementById('language-switcher');
    const pinnedMenuBtn = document.getElementById('pinned-menu-btn');
    const pinnedModal = document.getElementById('pinned-modal');
    const pinnedModalCloseBtn = document.getElementById('pinned-modal-close-btn');
    const pinnedWindow = document.getElementById('pinned-window');

    // --- 関数定義 ---

    /**
     * 設定メニュー内のテキストを現在の言語に翻訳する
     */
    function translateSettingsMenu() {
        const elementsToTranslate = document.querySelectorAll('#settings-content [data-translate], #chatbot-modal [data-translate], #pinned-modal [data-translate]');
        elementsToTranslate.forEach(element => {
            const key = element.dataset.translate;
            if (uiStrings[currentLanguage][key]) {
                element.textContent = uiStrings[currentLanguage][key];
            }
        });
    }

    /**
     * Markdown形式のテキストをHTMLに変換する
     * @param {string} text - 変換するテキスト
     * @returns {string} HTML文字列
     */
    function markdownToHtml(text) {
        let html = text;
        const markdownImageRegex = /!\[(.*?)\]\((.*?)\)/g;
        html = html.replace(markdownImageRegex, (match, alt, src) => {
            return `<img src="${src}" alt="${alt || '関連画像'}" class="bot-response-image">`;
        });
        const urlRegex = /(?<!src=")(https?:\/\/[^\s]+\.(?:png|jpg|jpeg|gif|webp|svg))/g;
        html = html.replace(urlRegex, (url) => {
             return `<img src="${url}" alt="関連画像" class="bot-response-image">`;
        });
        html = html.replace(/\n/g, '<br>');
        return html;
    }

    /**
     * チャット履歴をlocalStorageに保存する
     */
    function saveChatHistory() {
        if (chatWindow.innerHTML) {
            localStorage.setItem('chatbot_history', chatWindow.innerHTML);
        }
    }

    /**
     * localStorageからチャット履歴を読み込む
     * @returns {boolean} 履歴が読み込まれたかどうか
     */
    function loadChatHistory() {
        const savedHistory = localStorage.getItem('chatbot_history');
        if (savedHistory) {
            chatWindow.innerHTML = savedHistory;
            const messageElements = chatWindow.querySelectorAll('.bot-message-container[data-message-id]');
            messageElements.forEach(el => {
                const messageId = el.dataset.messageId;
                if (pinnedMessages.some(p => p.id === messageId)) {
                    const pinBtn = el.querySelector('.pin-btn');
                    if(pinBtn) pinBtn.classList.add('pinned');
                }
            });
            chatWindow.scrollTop = chatWindow.scrollHeight;
            return true; 
        }
        return false; 
    }

    /**
     * チャット履歴をクリアする
     */
    function clearChatHistory() {
        localStorage.removeItem('chatbot_history');
        chatWindow.innerHTML = ''; 
        displayBotMessage(uiStrings[currentLanguage].history_cleared);
        showWelcomeMenu();
    }

    /**
     * お気に入りメッセージをlocalStorageに保存する
     */
    function savePinnedMessages() {
        localStorage.setItem('chatbot_pinned_messages', JSON.stringify(pinnedMessages));
    }

    /**
     * お気に入りウィンドウをレンダリングする
     */
    function renderPinnedWindow() {
        pinnedWindow.innerHTML = '';
        if (pinnedMessages.length === 0) {
            const strings = uiStrings[currentLanguage];
            pinnedWindow.innerHTML = `
                <div id="pinned-empty-state">
                    <div class="icon"><i class="fas fa-thumbtack"></i></div>
                    <h3 class="font-bold text-lg mb-2">${strings.pinned_empty_title}</h3>
                    <p class="text-sm">${strings.pinned_empty_desc}</p>
                </div>
            `;
        } else {
            pinnedMessages.forEach(msg => {
                const card = document.createElement('div');
                card.className = 'pinned-message-card';
                card.dataset.messageId = msg.id;
                
                const textP = document.createElement('p');
                textP.className = 'pinned-message-text';
                textP.innerHTML = markdownToHtml(msg.text);
                
                const unpinBtn = document.createElement('button');
                unpinBtn.className = 'unpin-btn';
                unpinBtn.innerHTML = '<i class="fas fa-times"></i>';
                unpinBtn.title = 'Unpin';
                
                card.appendChild(textP);
                card.appendChild(unpinBtn);
                pinnedWindow.appendChild(card);
            });
        }
    }

    /**
     * メッセージをピン留め/ピン留め解除する
     * @param {HTMLElement} pinBtn - クリックされたピンボタン
     */
    function togglePinMessage(pinBtn) {
        const messageContainer = pinBtn.closest('.bot-message-container');
        const messageId = messageContainer.dataset.messageId;
        const bubble = messageContainer.querySelector('.bg-white');
        const messageText = bubble.querySelector('p').innerText;

        const isPinned = pinnedMessages.some(p => p.id === messageId);

        if (isPinned) {
            pinnedMessages = pinnedMessages.filter(p => p.id !== messageId);
            pinBtn.classList.remove('pinned');
        } else {
            pinnedMessages.push({ id: messageId, text: messageText });
            pinBtn.classList.add('pinned');
        }

        savePinnedMessages();
        if (!pinnedModal.classList.contains('hidden')) {
            renderPinnedWindow();
        }
    }
    
    /**
     * コンテナの端でスクロールした際に、親要素（ページ全体）がスクロールするのを防ぐ
     * @param {HTMLElement} elem - スクロール可能な要素
     */
    function preventParentScroll(elem) {
        elem.addEventListener('wheel', (e) => {
            const { scrollTop, scrollHeight, clientHeight } = elem;
            const deltaY = e.deltaY;

            if (scrollTop === 0 && deltaY < 0) {
                e.preventDefault();
                return;
            }

            if (scrollHeight - clientHeight - scrollTop <= 1 && deltaY > 0) {
                e.preventDefault();
                return;
            }
        }, { passive: false });
    }

    function updateSeasonalAnimation(themeName) {
        const container = document.getElementById('chatbot-animation-container');
        if (!container) return;
        container.innerHTML = ''; 

        if (themeName === 'simple') {
            return;
        }

        let particleConfig = null;
        const particleCount = 20;

        switch (themeName) {
            case 'spring':
                particleConfig = { type: 'span', className: 'sakura', content: '🌸', animation: 'fall' };
                break;
            case 'summer':
                particleConfig = { type: 'div', className: 'bubble', animation: 'rise' };
                break;
            case 'autumn':
                particleConfig = { type: 'span', className: 'leaf', content: '🍁', animation: 'fall' };
                break;
            case 'winter':
                particleConfig = { type: 'span', className: 'snow', content: '❄️', animation: 'fall' };
                break;
        }

        if (!particleConfig) return;

        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement(particleConfig.type);
            particle.className = 'particle ' + particleConfig.className;

            if (particleConfig.content) {
                particle.textContent = particleConfig.content;
                particle.style.fontSize = `${10 + Math.random() * 15}px`;
            } else {
                const size = 5 + Math.random() * 15;
                particle.style.width = `${size}px`;
                particle.style.height = `${size}px`;
            }

            particle.style.left = `${Math.random() * 100}%`;
            particle.style.animationName = particleConfig.animation;
            particle.style.animationDuration = `${8 + Math.random() * 12}s`;
            particle.style.animationDelay = `-${Math.random() * 10}s`;
            particle.style.opacity = `${0.3 + Math.random() * 0.6}`;
            
            container.appendChild(particle);
        }
    }

    function resetInquiryState() {
        inquiryState = { status: 'idle', name: '', email: '', message: '' };
    }

    function resetQuizState() {
        currentQuiz = null;
        askedQuizIndices.clear();
        currentDifficulty = null;
        quizScore = 0;
        quizLength = 0;
    }

    function showWelcomeMenu() {
        resetQuizState();
        const welcome = uiStrings[currentLanguage].welcome;
        displayBotMessage(welcome.message, { quickReplies: welcome.replies });
    }

    function switchLanguage(lang) {
        if (currentLanguage === lang) return;
        currentLanguage = lang;
        resetInquiryState();
        resetQuizState();
        const strings = uiStrings[lang];
        document.getElementById('header-title').textContent = strings.headerTitle;
        document.getElementById('header-lang-status').textContent = strings.langStatus;
        userInput.placeholder = strings.inputPlaceholder;
        
        if (langSwitcher) {
            const buttons = langSwitcher.querySelectorAll('button.lang-switch-btn');
            buttons.forEach(btn => {
                btn.classList.remove('active');
                if (btn.dataset.lang === lang) {
                    btn.classList.add('active');
                }
            });
        }
        
        translateSettingsMenu();
        renderPinnedWindow();
        displayBotMessage(uiStrings[currentLanguage].lang_switched);
        setTimeout(showWelcomeMenu, 1000);
    }

    function removeAllQuickReplies() {
        const existingReplies = document.querySelectorAll('.quick-replies-container');
        existingReplies.forEach(container => container.remove());
    }

    function displayUserMessage(text) {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'flex justify-end';
        const bubble = document.createElement('div');
        bubble.className = 'user-message-bubble max-w-2xl p-3 rounded-2xl shadow';
        bubble.textContent = text;
        messageDiv.appendChild(bubble);
        chatWindow.appendChild(messageDiv);
        chatWindow.scrollTop = chatWindow.scrollHeight;
        saveChatHistory();
    }

    function displayBotMessage(text, options = {}) {
        removeAllQuickReplies();
        const messageId = `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        const messageContainer = document.createElement('div');
        messageContainer.className = 'bot-message-container';
        messageContainer.dataset.messageId = messageId;
        
        const messageWrapper = document.createElement('div');
        messageWrapper.className = 'flex flex-col items-start space-y-2';

        const bubble = document.createElement('div');
        bubble.className = 'max-w-2xl p-4 rounded-2xl shadow bg-white text-gray-800 relative';
        const mainText = document.createElement('p');
        mainText.innerHTML = markdownToHtml(text);
        bubble.appendChild(mainText);
        
        const pinBtn = document.createElement('button');
        pinBtn.className = 'pin-btn';
        pinBtn.innerHTML = '<i class="fas fa-thumbtack fa-xs"></i>';
        if (pinnedMessages.some(p => p.id === messageId)) {
            pinBtn.classList.add('pinned');
        }
        bubble.appendChild(pinBtn);

        messageWrapper.appendChild(bubble);
        
        if (options.isAiResponse) {
            const feedbackContainer = document.createElement('div');
            feedbackContainer.className = 'feedback-container';
            feedbackContainer.dataset.messageId = messageId;

            const feedbackStrings = uiStrings[currentLanguage].feedback;

            const helpfulBtn = document.createElement('button');
            helpfulBtn.className = 'feedback-btn';
            helpfulBtn.dataset.feedback = 'helpful';
            helpfulBtn.innerHTML = `<i class="far fa-thumbs-up"></i> ${feedbackStrings.helpful}`;

            const unhelpfulBtn = document.createElement('button');
            unhelpfulBtn.className = 'feedback-btn';
            unhelpfulBtn.dataset.feedback = 'unhelpful';
            unhelpfulBtn.innerHTML = `<i class="far fa-thumbs-down"></i> ${feedbackStrings.unhelpful}`;

            feedbackContainer.appendChild(helpfulBtn);
            feedbackContainer.appendChild(unhelpfulBtn);
            messageWrapper.appendChild(feedbackContainer);
        }

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
            messageWrapper.appendChild(repliesContainer);
        }

        messageContainer.appendChild(messageWrapper);
        chatWindow.appendChild(messageContainer);
        chatWindow.scrollTop = chatWindow.scrollHeight;
        saveChatHistory();
    }

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

    async function getAIResponse(text) {
        displayBotMessage("..."); 

        const langMap = { ja: '日本語', en: 'English', zh: '中文' };
        const systemInstruction = `あなたは日本の文化とマナーについて教える専門家です。ユーザーからの質問に対して、${langMap[currentLanguage]}で、親切かつ詳細に、箇条書きやステップ・バイ・ステップの説明などを活用して分かりやすく答えてください。
例えば、「箸の正しい持ち方」のような視覚的な説明が必要なトピックについては、具体的な手順やコツを丁寧に解説してください。`;
        const userPrompt = text;

        const apiUrl = 'chatBOT/gemini_proxy.php'; 

        const payload = {
            contents: [
                {
                    "role": "user",
                    "parts": [{ "text": systemInstruction }]
                },
                {
                    "role": "model",
                    "parts": [{ "text": "はい、承知いたしました。日本のマナーについて、どのようなことでもお尋ねください。箇条書きなどを用いて、分かりやすく詳細に説明します。" }]
                },
                {
                    "role": "user",
                    "parts": [{ "text": userPrompt }]
                }
            ]
        };

        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            
            const loadingMessage = Array.from(chatWindow.querySelectorAll('.bot-message-container')).find(el => el.textContent === '...');
            if (loadingMessage) {
                loadingMessage.remove();
            }

            if (!response.ok) {
                const errorData = await response.json();
                console.error('Proxy or API Error:', response.status, errorData);
                throw new Error(`Proxy or API request failed with status ${response.status}`);
            }

            const result = await response.json();

            if (result.candidates && result.candidates.length > 0 &&
                result.candidates[0].content && result.candidates[0].content.parts &&
                result.candidates[0].content.parts.length > 0) {
                const aiText = result.candidates[0].content.parts[0].text;
                displayBotMessage(aiText, { isAiResponse: true });
            } else {
                console.error("Invalid AI response structure or content blocked:", result);
                displayBotMessage(uiStrings[currentLanguage].defaultReply, { isAiResponse: true });
            }
        } catch (error) {
            console.error('AI response fetch error:', error);
            const loadingMessage = Array.from(chatWindow.querySelectorAll('.bot-message-container')).find(el => el.textContent === '...');
            if (loadingMessage) {
                loadingMessage.remove();
            }
            displayBotMessage(uiStrings[currentLanguage].defaultReply, { isAiResponse: true });
        }
    }

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

    /** チャットボットの初期化処理 */
    function initializeChat() {
        chatWindow.classList.add('min-h-0');
        
        preventParentScroll(chatWindow);
        preventParentScroll(pinnedWindow);

        if (settingsBtn) {
            settingsBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                settingsContent.classList.toggle('hidden');
            });
        }

        const allThemes = ['theme-simple', 'theme-spring', 'theme-summer', 'theme-autumn', 'theme-winter'];
        const applyTheme = (themeName) => {
            allThemes.forEach(theme => chatModal.classList.remove(theme));
            chatModal.classList.add(`theme-${themeName}`);
            updateSeasonalAnimation(themeName);
        };
        applyTheme('simple'); 

        themeOptions.forEach(option => {
            option.addEventListener('click', (e) => {
                e.stopPropagation();
                const selectedTheme = option.dataset.theme;
                applyTheme(selectedTheme);
            });
        });
        
        if(clearHistoryBtn) {
            clearHistoryBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                clearChatHistory();
            });
        }

        if(langSwitcher) {
            const buttons = langSwitcher.querySelectorAll('button.lang-switch-btn');
            buttons.forEach(btn => {
                if (btn.dataset.lang === currentLanguage) {
                    btn.classList.add('active');
                }
            });

            langSwitcher.addEventListener('click', (e) => {
                 const button = e.target.closest('.lang-switch-btn');
                if (button && button.dataset.lang) {
                    e.stopPropagation();
                    switchLanguage(button.dataset.lang);
                }
            });
        }

        pinnedMenuBtn.addEventListener('click', (e) => {
            e.preventDefault();
            renderPinnedWindow();
            pinnedModal.classList.remove('hidden');
            settingsContent.classList.add('hidden');
        });

        pinnedModalCloseBtn.addEventListener('click', () => {
            pinnedModal.classList.add('hidden');
        });

        pinnedModal.addEventListener('click', (e) => {
            if (e.target === pinnedModal) {
                pinnedModal.classList.add('hidden');
            }
        });

        sendBtn.addEventListener('click', handleUserInput);
        userInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') handleUserInput();
        });

        chatWindow.addEventListener('click', function (e) {
            const pinBtn = e.target.closest('.pin-btn');
            if (pinBtn) {
                togglePinMessage(pinBtn);
                return;
            }

            const feedbackBtn = e.target.closest('.feedback-btn');
            if (feedbackBtn) {
                // ▼▼▼【修正】イベントの伝播を停止するコードを追加 ▼▼▼
                e.stopPropagation();
                // ▲▲▲ ここまで ▲▲▲
                const feedback = feedbackBtn.dataset.feedback;
                const container = feedbackBtn.parentElement;
                const messageId = container.dataset.messageId;
                const messageElement = document.querySelector(`.bot-message-container[data-message-id="${messageId}"] p`);
                const messageText = messageElement ? messageElement.innerText : '';
                
                console.log({
                    messageId: messageId,
                    feedback: feedback,
                    message: messageText,
                    language: currentLanguage
                });

                container.innerHTML = `<p class="feedback-thank-you">${uiStrings[currentLanguage].feedback.thank_you}</p>`;
                
                saveChatHistory();
                return; 
            }

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

        pinnedWindow.addEventListener('click', function(e) {
            const unpinBtn = e.target.closest('.unpin-btn');
            if (unpinBtn) {
                const card = unpinBtn.closest('.pinned-message-card');
                const messageId = card.dataset.messageId;
                
                pinnedMessages = pinnedMessages.filter(p => p.id !== messageId);
                savePinnedMessages();
                
                const originalMessagePinBtn = chatWindow.querySelector(`.bot-message-container[data-message-id="${messageId}"] .pin-btn`);
                if (originalMessagePinBtn) {
                    originalMessagePinBtn.classList.remove('pinned');
                }
                
                renderPinnedWindow();
            }
        });

        translateSettingsMenu();
        const historyLoaded = loadChatHistory();
        if (!historyLoaded) {
            showWelcomeMenu();
        }
    }

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

        document.addEventListener('click', (e) => {
            if (settingsContent && !settingsContent.classList.contains('hidden')) {
                if (!settingsContent.contains(e.target) && !settingsBtn.contains(e.target)) {
                    settingsContent.classList.add('hidden');
                }
            }
            
            if (chatModal.style.display === 'flex' && 
                !chatModal.contains(e.target) && 
                !openButton.contains(e.target) &&
                !pinnedModal.contains(e.target) &&
                pinnedModal.classList.contains('hidden')) { 
                toggleChat(false);
            }
        });

        openButton.addEventListener('click', (e) => {
            e.stopPropagation();
            const isVisible = chatModal.style.display === 'flex';
            toggleChat(!isVisible);
        });
    }
});
