// main.js (データベース連携・ゲスト対応・データ移行改善版)

document.addEventListener('DOMContentLoaded', () => {

    // --- グローバル変数 ---
    let currentLanguage = 'ja';
    let inquiryState = { status: 'idle', name: '', email: '', message: '' };
    let isInRolePlay = false;
    let currentScenario = null;
    let currentQuiz = null;
    let askedQuizIndices = new Set();
    let currentDifficulty = null;
    let quizScore = 0;
    let quizLength = 0;
    let isChatInitialized = false;
    let pinnedMessages = [];
    let recognition; 
    let isRecording = false;
    let isSummarizing = false;
    let csrfToken = '';

    // ユーザー/ゲスト識別子
    let sessionIdentifier = { type: 'guest', id: null }; 

    // --- DOM要素 ---
    const chatWindow = document.getElementById('chat-window');
    const userInput = document.getElementById('user-input');
    const sendBtn = document.getElementById('send-btn');
    const micBtn = document.getElementById('mic-btn');
    const imageUploadBtn = document.getElementById('image-upload-btn');
    const imageUploadInput = document.getElementById('image-upload-input');
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
    const summarizeBtn = document.getElementById('summarize-btn');
    const summarizeMenuBtn = document.getElementById('summarize-menu-btn');
    const faqMenuBtn = document.getElementById('faq-menu-btn');
    const faqModal = document.getElementById('faq-modal');
    const faqModalCloseBtn = document.getElementById('faq-modal-close-btn');
    const faqList = document.getElementById('faq-list');
    const roleplayModal = document.getElementById('roleplay-modal');
    const roleplayModalCloseBtn = document.getElementById('roleplay-modal-close-btn');
    const roleplayList = document.getElementById('roleplay-list');
    
    // --- API通信ラッパー ---
    const api = {
        async request(endpoint, options = {}) {
            const url = `./chatBOT/chat_api.php?action=${endpoint}`;
            
            if (options.method === 'POST') {
                options.body = options.body || {};
                if (sessionIdentifier.type === 'guest' && sessionIdentifier.id) {
                    options.body.guest_session_id = sessionIdentifier.id;
                }
                options.body.csrf_token = csrfToken;
            }

            try {
                const response = await fetch(url, {
                    method: options.method || 'GET',
                    headers: { 'Content-Type': 'application/json', ...options.headers },
                    body: options.body ? JSON.stringify(options.body) : null
                });
                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
                }
                return response.json();
            } catch (error) {
                console.error(`API request to ${endpoint} failed:`, error);
                throw error;
            }
        },
        getSessionInfo: () => api.request('get_session_info'),
        getAllChatData: () => {
            let endpoint = 'get_all_chat_data';
            if (sessionIdentifier.type === 'guest' && sessionIdentifier.id) {
                endpoint += `&guest_session_id=${sessionIdentifier.id}`;
            }
            return api.request(endpoint);
        },
        migrateGuestData: (guest_session_id) => api.request('migrate_guest_data', { method: 'POST', body: { guest_session_id } }),
        saveHistory: (history_html) => api.request('save_history', { method: 'POST', body: { history_html } }),
        savePinnedMessages: (messages) => api.request('save_pinned_messages', { method: 'POST', body: { pinned_messages: messages } }),
        saveQuizResult: (result) => api.request('save_quiz_result', { method: 'POST', body: result }),
        saveLearnedTopic: (topic) => api.request('save_learned_topic', { method: 'POST', body: topic }),
        saveMistake: (mistake) => api.request('save_mistake', { method: 'POST', body: mistake }),
        clearHistory: () => api.request('clear_history', { method: 'POST', body: {} })
    };

    // --- 初期化処理 ---
    
    async function initializeChat() {
        if (isChatInitialized) return;
        isChatInitialized = true;

        try {
            const sessionInfo = await api.getSessionInfo();
            const guestIdInStorage = localStorage.getItem('chatbot_guest_session_id');

            if (sessionInfo.csrf_token) {
                csrfToken = sessionInfo.csrf_token;
            }

            if (sessionInfo.status === 'logged_in') {
                sessionIdentifier = { type: 'user', id: sessionInfo.user_id };
                if (guestIdInStorage) {
                    await api.migrateGuestData(guestIdInStorage);
                    localStorage.removeItem('chatbot_guest_session_id');
                    // ★★★ 改善点: ログイン成功を他のタブに通知 ★★★
                    localStorage.setItem('chatbot_login_status', 'logged_in_' + Date.now());
                }
            } else {
                let guestId = guestIdInStorage || sessionInfo.guest_session_id;
                localStorage.setItem('chatbot_guest_session_id', guestId);
                sessionIdentifier = { type: 'guest', id: guestId };
            }
        } catch (error) {
            console.error("Could not initialize session. Chat may not be saved.", error);
            const tempGuestId = localStorage.getItem('chatbot_guest_session_id') || `temp_${Date.now()}`;
            sessionIdentifier = { type: 'guest', id: tempGuestId };
        }

        currentLanguage = localStorage.getItem('chatbot_language') || 'ja';
        switchLanguage(currentLanguage, true);
        setupEventListeners();

        const dataLoaded = await loadChatData();
        if (!dataLoaded) {
            showWelcomeMenu();
        } else {
             chatWindow.scrollTop = chatWindow.scrollHeight;
        }
    }

    // ★★★ 改善点: 複数タブの同期処理 ★★★
    /**
     * 別のタブでログイン/ログアウトが起きたことを検知し、現在のタブの状態を更新する
     * @param {StorageEvent} e - ストレージイベント
     */
    function handleStorageChange(e) {
        if (e.key === 'chatbot_login_status' && e.newValue) {
            // ログインが検知された
            console.log('Login detected in another tab. Reloading session...');
            // 少し遅延させて、サーバー側のセッションが確実に更新されるのを待つ
            setTimeout(async () => {
                try {
                    const sessionInfo = await api.getSessionInfo();
                    if (sessionInfo.status === 'logged_in') {
                        sessionIdentifier = { type: 'user', id: sessionInfo.user_id };
                        csrfToken = sessionInfo.csrf_token;
                        // データを再読み込みしてUIを更新
                        await loadChatData();
                        console.log('Session updated to logged in user.');
                    }
                } catch (error) {
                    console.error('Failed to update session after detecting login:', error);
                }
            }, 500);
        }
    }
    // ★★★ ここまで ★★★

    function displaySkeletonLoader() {
        if (!chatWindow) return;
        const loaderContainer = document.createElement('div');
        loaderContainer.className = 'skeleton-loader-container'; 
        loaderContainer.innerHTML = `
            <div class="skeleton-bubble">
                <div class="skeleton-line"></div>
                <div class="skeleton-line"></div>
                <div class="skeleton-line"></div>
            </div>
        `;
        chatWindow.appendChild(loaderContainer);
        chatWindow.scrollTop = chatWindow.scrollHeight;
    }

    async function saveLearnedTopic(topic) {
        try {
            await api.saveLearnedTopic(topic);
        } catch (error) {
            console.error('Failed to save learned topic via API:', error);
        }
    }

    // ▼▼▼【セキュリティ修正】XSS対策を強化したHTML変換関数 ▼▼▼
    function markdownToHtml(text) {
        if (!text) return '';

        // 1. 一時的なdiv要素を作成し、textContentに設定することで、ブラウザにHTMLエスケープさせる
        const tempDiv = document.createElement('div');
        tempDiv.textContent = text;
        
        // 2. エスケープされた文字列を取得
        let escapedHtml = tempDiv.innerHTML;

        // 3. 安全なMarkdown記法（太字、改行）をHTMLタグに変換
        escapedHtml = escapedHtml
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\n/g, '<br>');
        
        // 4. 画像URLをimgタグに変換（この時点ではURL自体はエスケープされているが、src属性としては有効）
        const markdownImageRegex = /!\[(.*?)\]\((.*?)\)/g;
        escapedHtml = escapedHtml.replace(markdownImageRegex, '<img src="$2" alt="$1" class="bot-response-image">');
        
        const urlRegex = /(?<!src=")(https?:\/\/[^\s<>]+\.(?:png|jpg|jpeg|gif|webp|svg))/g;
        escapedHtml = escapedHtml.replace(urlRegex, '<img src="$1" alt="関連画像" class="bot-response-image">');

        return escapedHtml;
    }

    async function clearChatHistory() {
        try {
            await api.clearHistory();
            if (chatWindow) chatWindow.innerHTML = ''; 
            pinnedMessages = []; // フロントエンドのお気に入りもクリア
            displayBotMessage(uiStrings[currentLanguage].history_cleared);
            showWelcomeMenu();
        } catch(error) {
            console.error("Failed to clear history:", error);
            displayBotMessage(uiStrings[currentLanguage].defaultReply);
            setTimeout(showWelcomeMenu, 2000);
        }
    }
    
    async function getAIResponse(userPrompt) {
        displaySkeletonLoader();

        const langMap = { ja: '日本語', en: 'English', zh: '中文' };
        
        let systemInstruction;
        if (isInRolePlay && currentScenario) {
            systemInstruction = currentScenario.ai_role;
        } else {
            systemInstruction = `あなたは日本の文化とマナーについて教える専門家です。ユーザーからの質問に対して、${langMap[currentLanguage]}で、親切かつ詳細に、箇条書きやステップ・バイ・ステップの説明などを活用して分かりやすく答えてください。`;
        }
        
        const apiUrl = './chatBOT/gemini_proxy.php';
        
        const generatePayload = {
            contents: [
                { "role": "user", "parts": [{ "text": systemInstruction }] },
                { "role": "model", "parts": [{ "text": "はい、承知いたしました。" }] },
                { "role": "user", "parts": [{ "text": userPrompt }] }
            ]
        };

        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(generatePayload)
            });
            
            const skeleton = document.querySelector('.skeleton-loader-container');
            if (skeleton) skeleton.remove();

            if (!response.ok) throw new Error(`API request failed with status ${response.status}`);
            
            const result = await response.json();
            const aiText = result.candidates?.[0]?.content?.parts?.[0]?.text;

            if (aiText) {
                const options = { 
                    isAiResponse: !isInRolePlay,
                    showBackToMenu: isInRolePlay
                };
                displayBotMessage(aiText, options);

                if (!isInRolePlay) {
                    const summaryPrompt = `以下の文章を30字程度の日本語で簡潔に要約してください。:\n\n---\n${aiText}`;
                    const summarizePayload = { contents: [{ "role": "user", "parts": [{ "text": summaryPrompt }] }] };
                    
                    const summaryResponse = await fetch(apiUrl, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(summarizePayload)
                    });
                    
                    if (summaryResponse.ok) {
                        const summaryResult = await summaryResponse.json();
                        const summaryText = summaryResult.candidates?.[0]?.content?.parts?.[0]?.text;
                        if (summaryText) {
                            await saveLearnedTopic({
                                type: 'query',
                                question: userPrompt,
                                summary: summaryText.replace(/「|」/g, '')
                            });
                        }
                    }
                }
            } else {
                console.error("Invalid AI response structure or content blocked:", result);
                if (isInRolePlay) {
                    displayBotMessage(uiStrings[currentLanguage].role_play_error, { showBackToMenu: true });
                } else {
                    displayBotMessage(uiStrings[currentLanguage].defaultReply, { isAiResponse: true });
                }
            }
        } catch (error) {
            console.error('AI response fetch error:', error);
            const skeleton = document.querySelector('.skeleton-loader-container');
            if (skeleton) skeleton.remove();
            
            if (isInRolePlay) {
                displayBotMessage(uiStrings[currentLanguage].role_play_error, { showBackToMenu: true });
            } else {
                displayBotMessage(uiStrings[currentLanguage].defaultReply, { isAiResponse: true });
            }
        }
    }

    async function getAIResponseForImage(base64ImageData, mimeType) {
        displaySkeletonLoader();

        const promptText = uiStrings[currentLanguage].image_analysis_prompt;
        const base64Data = base64ImageData.split(',')[1];

        const payload = {
            contents: [{
                parts: [
                    { "text": promptText },
                    {
                        "inline_data": {
                            "mime_type": mimeType,
                            "data": base64Data
                        }
                    }
                ]
            }]
        };
        
        const apiUrl = './chatBOT/gemini_proxy.php';

        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            const skeleton = document.querySelector('.skeleton-loader-container');
            if (skeleton) skeleton.remove();

            if (!response.ok) throw new Error(`API request failed with status ${response.status}`);
            
            const result = await response.json();
            const aiText = result.candidates?.[0]?.content?.parts?.[0]?.text;

            if (aiText) {
                displayBotMessage(aiText, { isAiResponse: true });
            } else {
                console.error("Invalid AI response structure or content blocked:", result);
                displayBotMessage(uiStrings[currentLanguage].defaultReply, { isAiResponse: true });
            }

        } catch (error) {
            console.error('AI image response fetch error:', error);
            const skeleton = document.querySelector('.skeleton-loader-container');
            if (skeleton) skeleton.remove();
            displayBotMessage(uiStrings[currentLanguage].defaultReply, { isAiResponse: true });
        }
    }

    function removeAllQuickReplies() {
        const existingReplies = document.querySelectorAll('.quick-replies-container');
        existingReplies.forEach(container => container.remove());
    }

    function displayUserMessage(text) {
        if (!chatWindow) return;
        const messageDiv = document.createElement('div');
        messageDiv.className = 'flex justify-end mb-4';
        const bubble = document.createElement('div');
        bubble.className = 'user-message-bubble max-w-2xl p-3 rounded-2xl shadow';
        // XSS対策: textContent を使用してテキストを安全に設定
        bubble.textContent = text;
        messageDiv.appendChild(bubble);
        chatWindow.appendChild(messageDiv);
        chatWindow.scrollTop = chatWindow.scrollHeight;
        api.saveHistory(chatWindow.innerHTML).catch(e => console.error(e));
    }

    function displayUserMessageWithImage(base64ImageData) {
        if (!chatWindow) return;
        const messageDiv = document.createElement('div');
        messageDiv.className = 'flex justify-end mb-4';
        
        const bubble = document.createElement('div');
        bubble.className = 'user-message-bubble max-w-xs p-2 rounded-2xl shadow'; 
        
        const image = document.createElement('img');
        image.src = base64ImageData;
        image.className = 'rounded-xl';
        
        bubble.appendChild(image);
        messageDiv.appendChild(bubble);
        chatWindow.appendChild(messageDiv);
        chatWindow.scrollTop = chatWindow.scrollHeight;
        api.saveHistory(chatWindow.innerHTML).catch(e => console.error(e));
    }

    function displayBotMessage(text, options = {}) {
        if (!chatWindow) return;
        removeAllQuickReplies();
        const messageId = `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        const messageContainer = document.createElement('div');
        messageContainer.className = 'bot-message-container mb-4';
        messageContainer.dataset.messageId = messageId;
        
        const messageWrapper = document.createElement('div');
        messageWrapper.className = 'flex flex-col items-start space-y-2';

        const bubble = document.createElement('div');
        bubble.className = 'max-w-2xl p-4 rounded-2xl shadow bg-white text-gray-800 relative';
        const mainText = document.createElement('p');
        // XSS対策済みの関数を使用
        mainText.innerHTML = markdownToHtml(text);
        bubble.appendChild(mainText);
        
        const actionBtnGroup = document.createElement('div');
        actionBtnGroup.className = 'action-btn-group';
        
        const shareBtn = document.createElement('button');
        shareBtn.className = 'action-btn share-btn';
        shareBtn.title = uiStrings[currentLanguage].share_answer;
        shareBtn.innerHTML = '<i class="fas fa-share-alt fa-xs"></i>';

        const pinBtn = document.createElement('button');
        pinBtn.className = 'action-btn pin-btn';
        pinBtn.title = uiStrings[currentLanguage].view_pinned;
        pinBtn.innerHTML = '<i class="fas fa-thumbtack fa-xs"></i>';
        if (pinnedMessages.some(p => p.message_id === messageId)) {
            pinBtn.classList.add('pinned');
        }
        
        actionBtnGroup.appendChild(shareBtn);
        actionBtnGroup.appendChild(pinBtn);
        bubble.appendChild(actionBtnGroup);

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
                
                let actionType;
                if (options.quizOptions) {
                    actionType = 'quiz_option';
                } else if (options.quizFlow === 'difficulty') {
                    actionType = 'select_difficulty';
                } else if (options.quizFlow === 'question_count') {
                    actionType = 'select_question_count';
                } else {
                    const features = specialFeatures[currentLanguage];
                    const featureKey = Object.keys(features).find(key => key.toLowerCase() === replyText.toLowerCase());
                    if (featureKey) {
                        const feature = features[featureKey];
                        if(feature.isRolePlay) actionType = 'show_roleplay_scenarios';
                        else if(feature.isFaq) actionType = 'show_faq';
                        else if(feature.isInquiry) actionType = 'start_inquiry';
                        else if(feature.isQuiz) actionType = 'start_quiz';
                        else actionType = 'quick_reply';
                    } else {
                        actionType = 'quick_reply';
                    }
                }
                
                replyBtn.className = 'quick-reply-btn bg-white border border-sky-500 text-sky-500 text-sm font-semibold py-1 px-4 rounded-full hover:bg-sky-500 hover:text-white transition';
                replyBtn.dataset.action = actionType;
                repliesContainer.appendChild(replyBtn);
            });
        }
        
        const shouldAddBackButton = options.isAiResponse || options.showBackToMenu || options.quizFlow === 'continue' || options.quizFlow === 'end';

        if (options.quizFlow === 'continue') {
            const continueBtn = document.createElement('button');
            continueBtn.textContent = uiStrings[currentLanguage].continue_quiz;
            continueBtn.className = 'quick-reply-btn bg-sky-500 border border-sky-500 text-white text-sm font-semibold py-1 px-4 rounded-full hover:bg-sky-600 transition';
            continueBtn.dataset.action = 'next_quiz';
            repliesContainer.appendChild(continueBtn);
        } else if (options.quizFlow === 'end') {
            const startOverBtn = document.createElement('button');
            startOverBtn.textContent = uiStrings[currentLanguage].start_over_quiz;
            startOverBtn.className = 'quick-reply-btn bg-sky-500 border border-sky-500 text-white text-sm font-semibold py-1 px-4 rounded-full hover:bg-sky-600 transition';
            startOverBtn.dataset.action = 'start_over_quiz';
            repliesContainer.appendChild(startOverBtn);
        }

        if (shouldAddBackButton) {
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
        api.saveHistory(chatWindow.innerHTML).catch(e => console.error(e));
    }

    // (以降のコードは変更なし)
    // ...
    // The rest of the main.js file remains the same.
    // ...
    function handleUserInput() {
        if (!userInput) return;
        const inputText = userInput.value.trim();
        if (!inputText) return;
        displayUserMessage(inputText);
        userInput.value = '';
        userInput.style.height = 'auto';
        setTimeout(() => {
            if (isInRolePlay) {
                const cancelKeywords = {
                    ja: ['終了', 'やめる', 'キャンセル', 'メニューに戻る'],
                    en: ['end', 'stop', 'cancel', 'back to menu'],
                    zh: ['结束', '停止', '取消', '返回菜单']
                };
                if (cancelKeywords[currentLanguage].includes(inputText.toLowerCase())) {
                    endRolePlay();
                } else {
                    getAIResponse(inputText);
                }
                return;
            }

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
        displaySkeletonLoader();
        const payload = { ...inquiryState, lang: currentLanguage };
        try {
            const response = await fetch('./chatBOT/send_inquiry.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            const result = await response.json();
            const skeleton = document.querySelector('.skeleton-loader-container');
            if (skeleton) skeleton.remove();

            if (result.success) {
                displayBotMessage(uiStrings[currentLanguage].inquiry.complete);
            } else {
                console.error('Inquiry submission error:', result.error);
                displayBotMessage(uiStrings[currentLanguage].inquiry.send_error);
            }
        } catch (error) {
            console.error('Fetch API error during inquiry submission:', error);
            const skeleton = document.querySelector('.skeleton-loader-container');
            if (skeleton) skeleton.remove();
            displayBotMessage(uiStrings[currentLanguage].inquiry.send_error);
        } finally {
            resetInquiryState();
            setTimeout(showWelcomeMenu, 3000);
        }
    }

    function askNextQuizQuestion() {
        if (!quizData || Object.keys(quizData).length === 0 || !quizData[currentDifficulty] || quizData[currentDifficulty].length === 0) {
             displayBotMessage(uiStrings[currentLanguage].defaultReply);
             return;
        }
        if (askedQuizIndices.size >= quizLength) {
            const resultMessage = uiStrings[currentLanguage].getQuizResultMessage(quizScore, quizLength);
            displayBotMessage(uiStrings[currentLanguage].quiz_complete + "\n" + resultMessage, { quizFlow: 'end' });
            
            api.saveQuizResult({
                difficulty: currentDifficulty,
                score: quizScore,
                total: quizLength
            }).catch(e => console.error(e));
            
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
            if (foundFeature.isFaq) {
                openFaqModal();
            } else if (foundFeature.isInquiry) {
                inquiryState.status = 'awaiting_name';
                displayBotMessage(uiStrings[currentLanguage].inquiry.start);
            } else if (foundFeature.isQuiz) {
                resetQuizState();
                displayBotMessage(uiStrings[currentLanguage].quiz_prompt, { quickReplies: uiStrings[currentLanguage].quiz_difficulty, quizFlow: 'difficulty' });
            } 
            else if (foundFeature.isRolePlay) {
                openRolePlayModal();
            }
        } else {
            getAIResponse(text);
        }
    }

    async function summarizeConversation() {
        if (isSummarizing) return; 
        isSummarizing = true;
        if (summarizeBtn) summarizeBtn.disabled = true;
        if (summarizeMenuBtn) summarizeMenuBtn.disabled = true;

        if (!chatWindow) {
            isSummarizing = false;
            if (summarizeBtn) summarizeBtn.disabled = false;
            if (summarizeMenuBtn) summarizeMenuBtn.disabled = false;
            return;
        }
        const messages = Array.from(chatWindow.children);
        let conversationHistory = [];

        const systemMessagesToExclude = Object.values(uiStrings).flatMap(lang => [
            lang.lang_switched,
            lang.history_cleared,
            lang.summarizing,
            lang.summary_title,
            lang.welcome.message
        ]).filter(Boolean);

        messages.forEach(msgDiv => {
            const userBubble = msgDiv.querySelector('.user-message-bubble');
            const botBubble = msgDiv.querySelector('.bot-message-container .bg-white p');

            if (userBubble) {
                conversationHistory.push({ role: 'user', parts: [{ text: userBubble.textContent.trim() }] });
            } else if (botBubble) {
                const botText = botBubble.innerText.trim();
                if (botText && !systemMessagesToExclude.some(sysMsg => botText.includes(sysMsg))) {
                    conversationHistory.push({ role: 'model', parts: [{ text: botText }] });
                }
            }
        });

        if (conversationHistory.length < 4) {
            displayBotMessage(uiStrings[currentLanguage].summarize_no_history);
            setTimeout(showWelcomeMenu, 2500);
            isSummarizing = false;
            if (summarizeBtn) summarizeBtn.disabled = false;
            if (summarizeMenuBtn) summarizeMenuBtn.disabled = false;
            return;
        }

        displaySkeletonLoader();

        const langMap = { ja: '日本語', en: 'English', zh: '中文' };
        const summaryPrompt = `以下のチャットボットとユーザーの会話履歴を、重要なポイントを箇条書きで簡潔に要約してください。要約の言語は${langMap[currentLanguage]}でお願いします。\n\n---\n会話履歴:\n${conversationHistory.map(m => `${m.role === 'user' ? 'ユーザー' : 'ボット'}: ${m.parts[0].text}`).join('\n')}\n---`;

        const payload = {
            contents: [{ "role": "user", "parts": [{ "text": summaryPrompt }] }]
        };

        const apiUrl = './chatBOT/gemini_proxy.php';

        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            const skeleton = document.querySelector('.skeleton-loader-container');
            if (skeleton) skeleton.remove();

            if (!response.ok) throw new Error(`API request failed`);

            const result = await response.json();

            if (result.candidates && result.candidates[0].content && result.candidates[0].content.parts[0].text) {
                const summaryText = result.candidates[0].content.parts[0].text;
                const summaryTitle = uiStrings[currentLanguage].summary_title;
                displayBotMessage(`**${summaryTitle}**\n\n${summaryText}`, { showBackToMenu: true });
            } else {
                console.error("Invalid summary response structure:", result);
                displayBotMessage(uiStrings[currentLanguage].summarize_error, { showBackToMenu: true });
            }
        } catch (error) {
            console.error('Summarization fetch error:', error);
            const skeleton = document.querySelector('.skeleton-loader-container');
            if (skeleton) skeleton.remove();
            displayBotMessage(uiStrings[currentLanguage].summarize_error, { showBackToMenu: true });
        } finally {
            isSummarizing = false;
            if (summarizeBtn) summarizeBtn.disabled = false;
            if (summarizeMenuBtn) summarizeMenuBtn.disabled = false;
        }
    }

    function startSpeechRecognition() {
        if (!('webkitSpeechRecognition' in window)) {
            displayBotMessage(uiStrings[currentLanguage].voice_not_supported);
            setTimeout(showWelcomeMenu, 2000); 
            return;
        }

        recognition = new webkitSpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = true;
        recognition.lang = currentLanguage === 'ja' ? 'ja-JP' : (currentLanguage === 'zh' ? 'zh-CN' : 'en-US');

        recognition.onstart = () => {
            isRecording = true;
            micBtn.classList.add('recording');
            micBtn.innerHTML = '<i class="fas fa-microphone-alt-slash"></i>';
            micBtn.title = uiStrings[currentLanguage].mic_tooltip_recording;
            userInput.placeholder = uiStrings[currentLanguage].voice_listening;
            userInput.value = '';
        };

        recognition.onresult = (event) => {
            let interimTranscript = '';
            let finalTranscript = '';
            for (let i = event.resultIndex; i < event.results.length; ++i) {
                const transcript = event.results[i][0].transcript;
                if (event.results[i].isFinal) {
                    finalTranscript += transcript;
                } else {
                    interimTranscript += transcript;
                }
            }
            userInput.value = finalTranscript || interimTranscript;
        };

        recognition.onerror = (event) => {
            console.error('音声認識エラー:', event.error);
            if (event.error === 'no-speech') {
                displayBotMessage(uiStrings[currentLanguage].voice_no_speech);
            } else if (event.error === 'not-allowed') {
                displayBotMessage(uiStrings[currentLanguage].voice_permission_denied);
            } else {
                displayBotMessage(`${uiStrings[currentLanguage].voice_error}: ${event.error}`);
            }
            stopSpeechRecognition();
        };

        recognition.onend = () => {
            if (isRecording) {
                isRecording = false;
                micBtn.classList.remove('recording');
                micBtn.innerHTML = '<i class="fas fa-microphone"></i>';
                micBtn.title = uiStrings[currentLanguage].mic_tooltip;
                userInput.placeholder = uiStrings[currentLanguage].inputPlaceholder;
                if (userInput.value.trim() !== '') {
                    handleUserInput();
                }
            }
        };

        recognition.start();
    }

    function stopSpeechRecognition() {
        if (recognition && isRecording) {
            recognition.stop();
        }
    }

    async function loadChatData() {
        if (!chatWindow) return false;
        try {
            const data = await api.getAllChatData();
            if (data.history) {
                chatWindow.innerHTML = data.history;
            }
            if (data.pinned_messages) {
                pinnedMessages = data.pinned_messages;
                 // ピンの状態を復元
                const messageElements = chatWindow.querySelectorAll('.bot-message-container[data-message-id]');
                messageElements.forEach(el => {
                    const messageId = el.dataset.messageId;
                    if (pinnedMessages.some(p => p.message_id === messageId)) {
                        const pinBtn = el.querySelector('.pin-btn');
                        if (pinBtn) pinBtn.classList.add('pinned');
                    }
                });
            }
            chatWindow.scrollTop = chatWindow.scrollHeight;
            return !!data.history;
        } catch (error) {
            console.error("Failed to load chat data:", error);
            return false;
        }
    }

    function renderPinnedWindow() {
        if (!pinnedWindow) return;
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
                card.dataset.messageId = msg.message_id;
                
                const textP = document.createElement('p');
                textP.className = 'pinned-message-text';
                textP.innerHTML = markdownToHtml(msg.message_text);
                
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

    function togglePinMessage(pinBtn) {
        const messageContainer = pinBtn.closest('.bot-message-container');
        const messageId = messageContainer.dataset.messageId;
        const bubble = messageContainer.querySelector('.bg-white');
        const messageText = bubble.querySelector('p').innerText;

        const isPinned = pinnedMessages.some(p => p.message_id === messageId);

        if (isPinned) {
            pinnedMessages = pinnedMessages.filter(p => p.message_id !== messageId);
            pinBtn.classList.remove('pinned');
        } else {
            pinnedMessages.push({ message_id: messageId, message_text: messageText });
            pinBtn.classList.add('pinned');
            
            pinBtn.classList.add('pin-animation');
            pinBtn.addEventListener('animationend', () => {
                pinBtn.classList.remove('pin-animation');
            }, { once: true });
        }

        api.savePinnedMessages(pinnedMessages).catch(e => console.error(e));
        if (pinnedModal && !pinnedModal.classList.contains('hidden')) {
            renderPinnedWindow();
        }
    }

    function preventParentScroll(elem) {
        if (!elem) return;
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

    function openRolePlayModal() {
        if (!roleplayModal || !roleplayList || !document.getElementById('roleplay-modal-title')) return;
        
        const modalTitle = document.getElementById('roleplay-modal-title');
        roleplayList.innerHTML = '';
        modalTitle.textContent = uiStrings[currentLanguage].role_play_prompt;

        const scenarios = rolePlayingScenarios[currentLanguage];
        const categories = {};

        for (const key in scenarios) {
            const scenario = scenarios[key];
            if (!categories[scenario.category]) {
                categories[scenario.category] = [];
            }
            categories[scenario.category].push(scenario);
        }

        for (const categoryKey in categories) {
            const categoryName = uiStrings[currentLanguage].role_play_categories[categoryKey] || categoryKey;
            const categoryWrapper = document.createElement('div');
            categoryWrapper.innerHTML = `<h3 class="category-title"><i class="fas fa-folder-open text-sky-600"></i> ${categoryName}</h3>`;
            
            const scenarioGrid = document.createElement('div');
            scenarioGrid.className = 'scenario-grid';

            categories[categoryKey].forEach(scenario => {
                const button = document.createElement('button');
                button.className = 'scenario-btn';
                button.dataset.title = scenario.title;
                button.innerHTML = `<i class="${scenario.icon} fa-fw scenario-icon"></i><span>${scenario.title}</span>`;
                scenarioGrid.appendChild(button);
            });

            categoryWrapper.appendChild(scenarioGrid);
            roleplayList.appendChild(categoryWrapper);
        }
        roleplayModal.classList.remove('hidden');
    }

    function startRolePlay(scenarioTitle) {
        const scenarios = rolePlayingScenarios[currentLanguage];
        const scenarioKey = Object.keys(scenarios).find(key => scenarios[key].title === scenarioTitle);
        if (scenarioKey) {
            isInRolePlay = true;
            currentScenario = scenarios[scenarioKey];
            displayBotMessage(currentScenario.initial_prompt, { showBackToMenu: true });
        }
    }

    function endRolePlay() {
        if (!isInRolePlay) {
            showWelcomeMenu();
            return;
        }
        isInRolePlay = false;
        currentScenario = null;
        displayBotMessage(uiStrings[currentLanguage].role_play_cancel);
        setTimeout(showWelcomeMenu, 1000);
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

    function resetAllStates() {
        resetInquiryState();
        resetQuizState();
        isInRolePlay = false;
        currentScenario = null;
    }

    function showWelcomeMenu() {
        resetAllStates();
        const welcome = uiStrings[currentLanguage].welcome;
        displayBotMessage(welcome.message, { quickReplies: welcome.replies });
    }

    function switchLanguage(lang, isInitialLoad = false) {
        if (!isInitialLoad && currentLanguage === lang) return;
        
        currentLanguage = lang;
        localStorage.setItem('chatbot_language', currentLanguage);
        resetAllStates();
        
        const strings = uiStrings[lang];
        document.getElementById('header-title').textContent = strings.headerTitle;
        document.getElementById('header-lang-status').textContent = strings.langStatus;
        userInput.placeholder = strings.inputPlaceholder;
        
        if(imageUploadBtn) imageUploadBtn.title = strings.upload_image_tooltip;
        if (micBtn) micBtn.title = isRecording ? strings.mic_tooltip_recording : strings.mic_tooltip;
        if (sendBtn) sendBtn.title = strings.send_tooltip;
        if (summarizeBtn) summarizeBtn.title = strings.summarize_conversation;
        
        if (langSwitcher) {
            const buttons = langSwitcher.querySelectorAll('button.lang-switch-btn');
            buttons.forEach(btn => {
                btn.classList.remove('active');
                if (btn.dataset.lang === lang) btn.classList.add('active');
            });
        }
        
        translateSettingsMenu();
        renderPinnedWindow();

        if (settingsBtn) {
            const isHidden = settingsContent.classList.contains('hidden');
            settingsBtn.title = isHidden ? uiStrings[currentLanguage].open_menu : uiStrings[currentLanguage].close_menu;
        }
        
        if (openButton && chatModal) {
            const isVisible = chatModal.style.display === 'flex';
            openButton.title = isVisible ? strings.close_chatbot_tooltip : strings.open_chatbot_tooltip;
        }

        if (!isInitialLoad) {
            displayBotMessage(strings.lang_switched);
            setTimeout(showWelcomeMenu, 1000);
        }
    }
    
    function openFaqModal() {
        if (!faqList || !faqModal) return;
        faqList.innerHTML = '';
        
        const strings = uiStrings[currentLanguage];
        const faqStrings = strings.faq;
        
        const modalTitle = faqModal.querySelector('#faq-modal-title');
        if (modalTitle) modalTitle.textContent = strings.faq_title;

        faqStrings.questions.forEach(item => {
            const button = document.createElement('button');
            button.className = 'faq-question-btn w-full text-left p-3 bg-white rounded-lg shadow hover:bg-gray-50 transition';
            button.textContent = item.q;
            faqList.appendChild(button);
        });
        
        faqModal.classList.remove('hidden');
    }

    function translateSettingsMenu() {
        const elementsToTranslate = document.querySelectorAll('[data-translate]');
        elementsToTranslate.forEach(element => {
            const key = element.dataset.translate;
            const keys = key.split('.');
            let translation = uiStrings[currentLanguage];
            try {
                for (const k of keys) {
                    translation = translation[k];
                }
                if (typeof translation === 'string') {
                    element.textContent = translation;
                }
            } catch (e) {
                element.textContent = key;
            }
        });
    }
    
    function setupEventListeners() {
        preventParentScroll(chatWindow);
        preventParentScroll(pinnedWindow);
        preventParentScroll(faqList);
        preventParentScroll(roleplayList);

        if (settingsBtn) {
            settingsBtn.title = uiStrings[currentLanguage].open_menu;
            settingsBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                if(settingsContent) {
                    settingsContent.classList.toggle('hidden');
                    const isHidden = settingsContent.classList.contains('hidden');
                    settingsBtn.title = isHidden ? uiStrings[currentLanguage].open_menu : uiStrings[currentLanguage].close_menu;
                }
            });
        }
        
        if (imageUploadBtn && imageUploadInput) {
            imageUploadBtn.title = uiStrings[currentLanguage].upload_image_tooltip;
            imageUploadBtn.addEventListener('click', () => imageUploadInput.click());
            imageUploadInput.addEventListener('change', (event) => {
                const file = event.target.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = (e) => {
                        displayUserMessageWithImage(e.target.result);
                        getAIResponseForImage(e.target.result, file.type);
                    };
                    reader.readAsDataURL(file);
                }
                event.target.value = '';
            });
        }
        
        if (micBtn) {
            micBtn.title = uiStrings[currentLanguage].mic_tooltip;
            micBtn.addEventListener('click', () => {
                if (isRecording) stopSpeechRecognition();
                else startSpeechRecognition();
            });
        }
        if (sendBtn) {
            sendBtn.title = uiStrings[currentLanguage].send_tooltip;
            sendBtn.addEventListener('click', handleUserInput);
        }
        
        if(userInput) {
            userInput.addEventListener('input', () => {
                userInput.style.height = 'auto';
                userInput.style.height = `${userInput.scrollHeight}px`;
            });
            userInput.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleUserInput();
                }
            });
        }

        if (summarizeBtn) {
            summarizeBtn.title = uiStrings[currentLanguage].summarize_conversation;
            summarizeBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                summarizeConversation();
            });
        }
        if (summarizeMenuBtn) {
             summarizeMenuBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                if(settingsContent) settingsContent.classList.add('hidden');
                if(settingsBtn) settingsBtn.title = uiStrings[currentLanguage].open_menu;
                summarizeConversation();
            });
        }
        if (faqMenuBtn) {
            faqMenuBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                if(settingsContent) settingsContent.classList.add('hidden');
                if(settingsBtn) settingsBtn.title = uiStrings[currentLanguage].open_menu;
                openFaqModal();
            });
        }
        
        if (faqModal && faqModalCloseBtn && faqList) {
            const closeFaqModalAndReset = (e) => {
                e.stopPropagation();
                faqModal.classList.add('hidden');
                showWelcomeMenu();
            };
            faqModalCloseBtn.addEventListener('click', closeFaqModalAndReset);
            faqModal.addEventListener('click', (e) => {
                if (e.target === faqModal) {
                    closeFaqModalAndReset(e);
                }
            });
            faqList.addEventListener('click', (e) => {
                e.stopPropagation();
                const faqButton = e.target.closest('.faq-question-btn');
                if (faqButton) {
                    faqModal.classList.add('hidden');
                    const questionText = faqButton.textContent;
                    const faqData = uiStrings[currentLanguage].faq.questions.find(q => q.q === questionText);
                    if (faqData) {
                        displayUserMessage(faqData.q);
                        setTimeout(async () => {
                           displayBotMessage(faqData.a, { showBackToMenu: true });
                           await saveLearnedTopic({ type: 'faq', id: faqData.id, question: faqData.q });
                        }, 500);
                    }
                }
            });
        }

        if (roleplayModal && roleplayModalCloseBtn && roleplayList) {
            const closeRoleplayModalAndEnd = (e) => {
                e.stopPropagation();
                roleplayModal.classList.add('hidden');
                endRolePlay();
            };

            roleplayModalCloseBtn.addEventListener('click', closeRoleplayModalAndEnd);
            roleplayModal.addEventListener('click', (e) => { 
                if (e.target === roleplayModal) {
                    closeRoleplayModalAndEnd(e);
                }
            });
            roleplayList.addEventListener('click', (e) => {
                e.stopPropagation(); 
                
                const button = e.target.closest('.scenario-btn');
                if (button) {
                    const scenarioTitle = button.dataset.title;
                    roleplayModal.classList.add('hidden');
                    displayUserMessage(scenarioTitle);
                    setTimeout(() => startRolePlay(scenarioTitle), 500);
                }
            });
        }

        if(themeOptions){
            const allThemes = ['theme-simple', 'theme-spring', 'theme-summer', 'theme-autumn', 'theme-winter'];
            const applyTheme = (themeName) => {
                if(!chatModal) return;
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
        }
        
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

        if(pinnedMenuBtn && pinnedModal){
            pinnedMenuBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                renderPinnedWindow();
                pinnedModal.classList.remove('hidden');
                if(settingsContent) settingsContent.classList.add('hidden');
                if(settingsBtn) settingsBtn.title = uiStrings[currentLanguage].open_menu;
            });
        }
        
        if(pinnedModalCloseBtn && pinnedModal){
            pinnedModalCloseBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                pinnedModal.classList.add('hidden');
            });
            pinnedModal.addEventListener('click', (e) => {
                e.stopPropagation();
                if (e.target === pinnedModal) pinnedModal.classList.add('hidden');
            });
        }

        if(chatWindow){
            chatWindow.addEventListener('click', function (e) {
                const pinBtn = e.target.closest('.pin-btn');
                if (pinBtn) {
                    togglePinMessage(pinBtn);
                    return;
                }
                
                const shareBtn = e.target.closest('.share-btn');
                if (shareBtn) {
                    e.stopPropagation();
                    const bubble = shareBtn.closest('.bg-white');
                    const existingMenu = bubble.querySelector('.share-menu');
                    if (existingMenu) { existingMenu.remove(); return; }
                    document.querySelectorAll('.share-menu').forEach(menu => menu.remove());
                    const menu = document.createElement('div');
                    menu.className = 'share-menu';
                    const copyBtn = document.createElement('button');
                    copyBtn.className = 'share-menu-btn';
                    copyBtn.innerHTML = `<i class="fas fa-copy fa-fw"></i> ${uiStrings[currentLanguage].copy_to_clipboard}`;
                    const downloadBtn = document.createElement('button');
                    downloadBtn.className = 'share-menu-btn';
                    downloadBtn.innerHTML = `<i class="fas fa-download fa-fw"></i> ${uiStrings[currentLanguage].download_as_text}`;
                    menu.appendChild(copyBtn);
                    menu.appendChild(downloadBtn);
                    bubble.appendChild(menu);
                    setTimeout(() => {
                        document.addEventListener('click', function closeMenu(event) {
                            if (!menu.contains(event.target)) {
                                menu.remove();
                                document.removeEventListener('click', closeMenu);
                            }
                        });
                    }, 0);
                    copyBtn.addEventListener('click', (event) => {
                        event.stopPropagation();
                        const textToCopy = bubble.querySelector('p').innerText;
                        const tempTextarea = document.createElement('textarea');
                        tempTextarea.value = textToCopy;
                        document.body.appendChild(tempTextarea);
                        tempTextarea.select();
                        document.execCommand('copy');
                        document.body.removeChild(tempTextarea);
                        const feedback = document.createElement('div');
                        feedback.className = 'copy-feedback';
                        feedback.textContent = uiStrings[currentLanguage].copied_to_clipboard;
                        bubble.appendChild(feedback);
                        setTimeout(() => feedback.remove(), 2000);
                        menu.remove();
                    });
                    downloadBtn.addEventListener('click', (event) => {
                        event.stopPropagation();
                        const textToSave = bubble.querySelector('p').innerText;
                        const blob = new Blob([textToSave], { type: 'text/plain' });
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = 'chatbot-answer.txt';
                        document.body.appendChild(a);
                        a.click();
                        document.body.removeChild(a);
                        URL.revokeObjectURL(url);
                        menu.remove();
                    });
                    return;
                }

                const feedbackBtn = e.target.closest('.feedback-btn');
                if (feedbackBtn) {
                    e.stopPropagation();
                    const feedback = feedbackBtn.dataset.feedback;
                    const container = feedbackBtn.parentElement;
                    const messageId = container.dataset.messageId;
                    console.log({ messageId, feedback, language: currentLanguage });
                    container.innerHTML = `<p class="feedback-thank-you">${uiStrings[currentLanguage].feedback.thank_you}</p>`;
                    api.saveHistory(chatWindow.innerHTML).catch(e => console.error(e));
                    return; 
                }

                const targetButton = e.target.closest('.quick-reply-btn');
                if (!targetButton) return;
                
                e.stopPropagation();

                const replyText = targetButton.textContent;
                const action = targetButton.dataset.action;

                displayUserMessage(replyText);
                removeAllQuickReplies();
                
                switch (action) {
                    case 'show_roleplay_scenarios':
                        openRolePlayModal();
                        break;
                    case 'show_faq':
                        openFaqModal();
                        break;
                    case 'start_inquiry':
                        inquiryState.status = 'awaiting_name';
                        displayBotMessage(uiStrings[currentLanguage].inquiry.start);
                        break;
                    case 'start_quiz':
                        resetQuizState();
                        displayBotMessage(uiStrings[currentLanguage].quiz_prompt, { quickReplies: uiStrings[currentLanguage].quiz_difficulty, quizFlow: 'difficulty' });
                        break;
                    case 'back_to_menu':
                        endRolePlay();
                        break;
                    case 'start_over_quiz':
                        resetQuizState();
                        const quizKeyword = Object.keys(specialFeatures[currentLanguage]).find(key => specialFeatures[currentLanguage][key].isQuiz);
                        if (quizKeyword) {
                            getBotResponse(quizKeyword);
                        }
                        break;
                    case 'next_quiz':
                        askNextQuizQuestion();
                        break;
                    case 'select_difficulty':
                        const difficultyMap = { '簡単': 'easy', 'Easy': 'easy', '简单': 'easy', '普通': 'normal', 'Normal': 'normal', '困难': 'hard', '難しい': 'hard' };
                        currentDifficulty = difficultyMap[replyText];
                        displayBotMessage(uiStrings[currentLanguage].quiz_question_count_prompt, { quickReplies: uiStrings[currentLanguage].quiz_question_counts, quizFlow: 'question_count' });
                        break;
                    case 'select_question_count':
                        quizLength = parseInt(replyText) || 10;
                        askedQuizIndices.clear();
                        quizScore = 0;
                        currentQuiz = null;
                        askNextQuizQuestion();
                        break;
                    case 'quiz_option':
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
                            api.saveMistake({
                                ...quizData,
                                difficulty: currentDifficulty
                            }).catch(e => console.error(e));
                        }
                        currentQuiz = null;
                        setTimeout(() => displayBotMessage(resultMessage, { quizFlow: 'continue' }), 500);
                        break;
                    case 'quick_reply':
                    default:
                        setTimeout(() => getBotResponse(replyText), 500);
                        break;
                }
            });
        }

        if(pinnedWindow){
            pinnedWindow.addEventListener('click', function(e) {
                const unpinBtn = e.target.closest('.unpin-btn');
                if (unpinBtn) {
                    const card = unpinBtn.closest('.pinned-message-card');
                    const messageId = card.dataset.messageId;
                    
                    pinnedMessages = pinnedMessages.filter(p => p.message_id !== messageId);
                    api.savePinnedMessages(pinnedMessages).catch(e => console.error(e));
                    
                    const originalMessagePinBtn = document.querySelector(`.bot-message-container[data-message-id="${messageId}"] .pin-btn`);
                    if (originalMessagePinBtn) {
                        originalMessagePinBtn.classList.remove('pinned');
                    }
                    
                    renderPinnedWindow();
                }
            });
        }
    }

    if (openButton && chatModal) {
        const toggleChat = (show) => {
            const openTooltip = uiStrings[currentLanguage]?.open_chatbot_tooltip || 'Open Chatbot';
            const closeTooltip = uiStrings[currentLanguage]?.close_chatbot_tooltip || 'Close Chatbot';

            if (show) {
                chatModal.style.display = 'flex';
                openButton.innerHTML = '<i class="fas fa-times"></i>';
                openButton.title = closeTooltip; 
                if (!isChatInitialized) {
                    initializeChat();
                }
            } else {
                chatModal.style.display = 'none';
                openButton.innerHTML = '<i class="far fa-comments"></i>';
                openButton.title = openTooltip; 
            }
        };

        openButton.title = uiStrings[currentLanguage]?.open_chatbot_tooltip || 'Open Chatbot';

        openButton.addEventListener('click', (e) => {
            e.stopPropagation();
            const isVisible = chatModal.style.display === 'flex';
            toggleChat(!isVisible);
        });
        
        document.addEventListener('click', (e) => {
            if (settingsBtn && settingsContent && !settingsContent.classList.contains('hidden')) {
                const isClickInsideMenu = settingsContent.contains(e.target);
                const isClickOnSettingsBtn = settingsBtn.contains(e.target);

                if (!isClickInsideMenu && !isClickOnSettingsBtn) {
                    settingsContent.classList.add('hidden');
                    settingsBtn.title = uiStrings[currentLanguage].open_menu;
                }
            }

            if (chatModal.style.display !== 'flex') return;

            const isClickInsideChat = chatModal.contains(e.target);
            const isClickOnOpenButton = openButton.contains(e.target);
            
            if (!isClickInsideChat && !isClickOnOpenButton) {
                const modals = document.querySelectorAll('.fixed.inset-0');
                let clickInsideModal = false;
                modals.forEach(modal => {
                    if(modal.contains(e.target) && !modal.classList.contains('hidden')) {
                        clickInsideModal = true;
                    }
                });
                if(!clickInsideModal) {
                   toggleChat(false);
                }
            }
        });
    }
});
