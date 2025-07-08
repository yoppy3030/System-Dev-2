// --- 多言語UIテキスト ---
const uiStrings = {
    ja: {
        headerTitle: 'AIマナー学習ボット',
        langStatus: '言語: 日本語',
        inputPlaceholder: '日本のマナーについて質問してください',
        welcome: {
            message: 'こんにちは！私は日本のマナーについてお答えするAIです。どんなことでもお気軽にご質問ください。\n\n「クイズ」や「お問い合わせ」もできます。',
            replies: ['クイズ', 'お問い合わせ']
        },
        quiz_prompt: 'クイズの難易度を選択してください。',
        quiz_difficulty: ['簡単', '普通', '難しい'],
        quiz_question_count_prompt: '何問挑戦しますか？',
        quiz_question_counts: ['10問', '20問', '30問'],
        defaultReply: '申し訳ありません、うまく聞き取れませんでした。もう一度試していただけますか？',
        back_to_menu: 'メニューに戻る',
        continue_quiz: 'クイズを続ける',
        start_over_quiz: 'もう一度挑戦する',
        all_quizzes_done: 'この難易度のクイズはすべて完了しました！',
        quiz_complete: 'クイズ終了です！',
        getQuizResultMessage: (score, total) => {
            const percentage = total > 0 ? (score / total) * 100 : 0;
            let resultText = `${total}問中、${score}問正解でした！\n`;
            if (percentage === 100) {
                resultText += "全問正解です！素晴らしい、完璧ですね！🎉";
            } else if (percentage >= 80) {
                resultText += "素晴らしい成績です！よくご存知ですね。";
            } else if (percentage >= 50) {
                resultText += "よくできました！この調子で頑張りましょう。";
            } else if (score > 0) {
                resultText += "お疲れ様でした。もう一度挑戦してみましょう！";
            } else {
                resultText += "残念！次は頑張りましょう！";
            }
            return resultText;
        },
        lang_switched: '言語を日本語に切り替えました。',
        history_cleared: '会話の履歴を消去しました。',
        clear_history_button_title: '履歴をクリア',
        theme_selection: 'テーマ選択',
        language_settings: '言語設定',
        theme_simple: 'シンプル',
        theme_spring: '春',
        theme_summer: '夏',
        theme_autumn: '秋',
        theme_winter: '冬',
        clear_history: '履歴をクリア',
        view_pinned: 'お気に入り',
        open_menu: 'メニューを開く',
        close_menu: 'メニューを閉じる',
        pinned_empty_title: 'お気に入りはまだありません',
        pinned_empty_desc: 'ボットの回答の右上にあるピンアイコンをクリックして、重要な情報をここに保存しましょう。',
        inquiry: {
            start: 'お問い合わせですね。承知いたしました。まず、お名前を教えていただけますか？（途中で「キャンセル」と入力すると中断できます）',
            prompt_email: 'ありがとうございます。次に、ご連絡先のメールアドレスをお願いします。ご入力いただいたアドレスに確認メールをお送りします。',
            prompt_message: '承知いたしました。最後にお問い合わせ内容をご記入ください。',
            complete: 'お問い合わせいただき、ありがとうございます。ご入力いただいたメールアドレスに確認のメールを送信しました。担当者より追ってご連絡いたします。',
            invalid_email: '申し訳ありませんが、メールアドレスの形式が正しくないようです。もう一度入力していただけますか？',
            send_error: '申し訳ありません、送信中にエラーが発生しました。時間をおいて再度お試しください。',
            cancelled: 'お問い合わせをキャンセルしました。',
            cancel_keywords: ['キャンセル', 'やめる'],
        },
        feedback: {
            helpful: '役に立った',
            unhelpful: '役に立たなかった',
            thank_you: 'フィードバックありがとうございます！'
        },
        voice_listening: '話してください...',
        voice_not_supported: '申し訳ありません、お使いのブラウザは音声入力に対応していません。',
        voice_no_speech: '音声が検出されませんでした。もう一度お試しください。',
        voice_permission_denied: 'マイクへのアクセスが拒否されました。ブラウザの設定で許可してください。',
        voice_error: '音声入力でエラーが発生しました',
        mic_tooltip: 'マイクを使用',
        mic_tooltip_recording: '録音を停止',
        send_tooltip: '送信',
        // ▼▼▼【新機能】要約機能のテキストを追加 ▼▼▼
        summarize_conversation: '会話を要約',
        summary_title: '会話の要約',
        summarizing: '会話を要約しています...',
        summarize_error: '要約中にエラーが発生しました。もう一度お試しください。',
        summarize_no_history: '要約するには、もう少し会話が必要です。'
        // ▲▲▲ ここまで ▲▲▲
    },
    en: {
        headerTitle: 'AI Manners Learning Bot',
        langStatus: 'Language: English',
        inputPlaceholder: 'Ask about Japanese manners',
        welcome: {
            message: 'Hello! I am an AI that can answer your questions about Japanese manners. Feel free to ask me anything.\n\nYou can also try "Quiz" or "Contact".',
            replies: ['Quiz', 'Contact']
        },
        quiz_prompt: 'Please select a quiz difficulty.',
        quiz_difficulty: ['Easy', 'Normal', 'Hard'],
        quiz_question_count_prompt: 'How many questions would you like to try?',
        quiz_question_counts: ['10 Questions', '20 Questions', '30 Questions'],
        defaultReply: "I'm sorry, I didn't quite catch that. Could you please try again?",
        back_to_menu: 'Back to Menu',
        continue_quiz: 'Continue Quiz',
        start_over_quiz: 'Start Over',
        all_quizzes_done: 'You have completed all the quizzes for this difficulty! Excellent work.',
        quiz_complete: 'Quiz Complete!',
        getQuizResultMessage: (score, total) => {
            const percentage = total > 0 ? (score / total) * 100 : 0;
            let resultText = `You answered ${score} out of ${total} questions correctly!\n`;
            if (percentage === 100) {
                resultText += "Perfect score! Absolutely brilliant! 🎉";
            } else if (percentage >= 80) {
                resultText += "Excellent work! You know your stuff.";
            } else if (percentage >= 50) {
                resultText += "Good job! Keep up the great work.";
            } else if (score > 0) {
                resultText += "Nice try. Let's try again!";
            } else {
                resultText += "Don't worry, let's try again!";
            }
            return resultText;
        },
        lang_switched: 'Language switched to English.',
        history_cleared: 'Conversation history has been cleared.',
        clear_history_button_title: 'Clear History',
        theme_selection: 'Theme Selection',
        language_settings: 'Language Settings',
        theme_simple: 'Simple',
        theme_spring: 'Spring',
        theme_summer: 'Summer',
        theme_autumn: 'Autumn',
        theme_winter: 'Winter',
        clear_history: 'Clear History',
        view_pinned: 'Favorites',
        open_menu: 'Open menu',
        close_menu: 'Close menu',
        pinned_empty_title: 'No Favorites Yet',
        pinned_empty_desc: 'Click the pin icon on a bot response to save important information here.',
        inquiry: {
            start: 'Okay, you want to make an inquiry. First, could you please tell me your name? (You can type "cancel" to stop at any time)',
            prompt_email: 'Thank you. Next, please provide your email address. A confirmation email will be sent to this address.',
            prompt_message: 'Got it. Finally, please enter your message.',
            complete: 'Thank you for your inquiry. A confirmation email has been sent to your address. Our team will get back to you shortly.',
            invalid_email: "I'm sorry, but the email address format seems incorrect. Could you please enter it again?",
            send_error: 'Sorry, an error occurred while sending. Please try again later.',
            cancelled: 'The inquiry has been cancelled.',
            cancel_keywords: ['cancel', 'stop'],
        },
        feedback: {
            helpful: 'Helpful',
            unhelpful: 'Not Helpful',
            thank_you: 'Thank you for your feedback!'
        },
        voice_listening: 'Speak now...',
        voice_not_supported: 'Sorry, your browser does not support voice input.',
        voice_no_speech: 'No speech was detected. Please try again.',
        voice_permission_denied: 'Microphone access denied. Please allow access in your browser settings.',
        voice_error: 'Voice input error',
        mic_tooltip: 'Use microphone',
        mic_tooltip_recording: 'Stop recording',
        send_tooltip: 'Send',
        // ▼▼▼【新機能】要約機能のテキストを追加 ▼▼▼
        summarize_conversation: 'Summarize Conversation',
        summary_title: 'Conversation Summary',
        summarizing: 'Summarizing the conversation...',
        summarize_error: 'An error occurred while summarizing. Please try again.',
        summarize_no_history: 'More conversation is needed to create a summary.'
        // ▲▲▲ ここまで ▲▲▲
    },
    zh: {
        headerTitle: 'AI礼仪学习机器人',
        langStatus: '语言: 中文',
        inputPlaceholder: '询问有关日本礼仪的问题',
        welcome: {
            message: '您好！我是可以回答您关于日本礼仪问题的AI。请随时向我提问。\n\n您也可以尝试“测验”或“联系我们”。',
            replies: ['测验', '联系我们']
        },
        quiz_prompt: '请选择测验的难度。',
        quiz_difficulty: ['简单', '普通', '困难'],
        quiz_question_count_prompt: '您想挑战多少个问题？',
        quiz_question_counts: ['10个问题', '20个问题', '30个问题'],
        defaultReply: '很抱歉，我没太听清楚。可以请您再说一遍吗？',
        back_to_menu: '返回菜单',
        continue_quiz: '继续测验',
        start_over_quiz: '重新开始',
        all_quizzes_done: '您已完成此难度的所有测验！非常棒。',
        quiz_complete: '测验结束！',
        getQuizResultMessage: (score, total) => {
            const percentage = total > 0 ? (score / total) * 100 : 0;
            let resultText = `您在${total}题中答对了${score}题！\n`;
            if (percentage === 100) {
                resultText += "全部正确！太棒了，完美！🎉";
            } else if (percentage >= 80) {
                resultText += "非常棒的成绩！您非常了解。";
            } else if (percentage >= 50) {
                resultText += "做得很好！再接再厉。";
            } else if (score > 0) {
                resultText += "辛苦了。再挑战一次吧！";
            } else {
                resultText += "很遗憾！下次加油吧！";
            }
            return resultText;
        },
        lang_switched: '语言已切换至中文。',
        history_cleared: '对话记录已清除。',
        clear_history_button_title: '清除记录',
        theme_selection: '主题选择',
        language_settings: '语言设定',
        theme_simple: '简约',
        theme_spring: '春天',
        theme_summer: '夏天',
        theme_autumn: '秋天',
        theme_winter: '冬天',
        clear_history: '清除记录',
        view_pinned: '收藏',
        open_menu: '打开菜单',
        close_menu: '关闭菜单',
        pinned_empty_title: '尚无收藏的消息',
        pinned_empty_desc: '点击机器人回复右上方的图钉图标，即可在此处保存重要信息。',
        inquiry: {
            start: '好的，您想进行咨询。首先，请问您的名字是？（您可以随时输入“取消”来中断）',
            prompt_email: '谢谢。接下来，请输入您的电子邮件地址。我们将向此地址发送一封确认邮件。',
            prompt_message: '好的。最后，请输入您的咨询内容。',
            complete: '感谢您的咨询，我们已向您的邮箱发送了确认邮件。相关人员会尽快与您联系。',
            invalid_email: '抱歉，电子邮件地址的格式似乎不正确，可以请您再输入一次吗？',
            send_error: '抱歉，发送时发生错误，请稍后再试。',
            cancelled: '咨询已取消。',
            cancel_keywords: ['取消'],
        },
        feedback: {
            helpful: '有帮助',
            unhelpful: '没有帮助',
            thank_you: '感谢您的反馈！'
        },
        voice_listening: '请说话...',
        voice_not_supported: '抱歉，您的浏览器不支持语音输入。',
        voice_no_speech: '未检测到语音。请再试一次。',
        voice_permission_denied: '麦克风访问被拒绝。请在浏览器设置中允许访问。',
        voice_error: '语音输入错误',
        mic_tooltip: '使用麦克风',
        mic_tooltip_recording: '停止录音',
        send_tooltip: '发送',
        // ▼▼▼【新機能】要約機能のテキストを追加 ▼▼▼
        summarize_conversation: '总结对话',
        summary_title: '对话总结',
        summarizing: '正在总结对话...',
        summarize_error: '总结时发生错误，请重试。',
        summarize_no_history: '需要更多对话才能进行总结。'
        // ▲▲▲ ここまで ▲▲▲
    }
};

// --- ナレッジベース (特殊機能とクイズデータ) ---
const specialFeatures = {
    ja: { 'クイズ': { isQuiz: true }, 'お問い合わせ': { isInquiry: true } },
    en: { 'quiz': { isQuiz: true }, 'contact': { isInquiry: true } },
    zh: { '测验': { isQuiz: true }, '联系我们': { isInquiry: true } }
};

// ★★★ クイズデータを各難易度30問、合計90問に増量 ★★★
const quizData = {
    easy: [
        { question: { ja: '食事を始める前の挨拶は何ですか？', en: 'What do you say before starting a meal?', zh: '开始吃饭前应该说什么？' }, options: { ja: ['さようなら', 'いただきます', 'こんにちは'], en: ['Goodbye', 'Itadakimasu', 'Hello'], zh: ['再见', '我开动了', '你好'] }, correct: 1, explanation: { ja: '食事の前には、食材や作ってくれた人への感謝を込めて「いただきます」と言うのが日本の習慣です。', en: 'It is a Japanese custom to say "Itadakimasu" before meals to express gratitude for the food and those who prepared it.', zh: '在日本，饭前说“我开动了”是表示对食物和做饭人的感谢的习惯。' } },
        { question: { ja: '日本では、家に入るときに何をしますか？', en: 'What do you do when entering a Japanese home?', zh: '在日本，进屋时要做什么？' }, options: { ja: ['帽子をかぶる', '靴を脱ぐ', '歌をうたう'], en: ['Wear a hat', 'Take off shoes', 'Sing a song'], zh: ['戴帽子', '脱鞋', '唱歌'] }, correct: 1, explanation: { ja: '日本の家では、玄関で靴を脱いでから中に上がるのが基本的なマナーです。', en: 'It is basic manners to take off your shoes at the entrance before entering a Japanese house.', zh: '在日本的房子里，在玄关脱鞋再进去是基本礼仪。' } },
        { question: { ja: '人に会った時の昼間の挨拶は何ですか？', en: 'What is the daytime greeting when you meet someone?', zh: '白天见到人时的问候语是什么？' }, options: { ja: ['おやすみなさい', 'おはようございます', 'こんにちは'], en: ['Good night', 'Good morning', 'Hello'], zh: ['晚安', '早上好', '你好'] }, correct: 2, explanation: { ja: '昼間に使う最も一般的な挨拶は「こんにちは」です。', en: 'The most common greeting used during the daytime is "Konnichiwa".', zh: '白天最常用的问候语是“你好”。' } },
        { question: { ja: 'ゴミを道に捨てるのは良いことですか？', en: 'Is it okay to throw trash on the street?', zh: '把垃圾扔在路上是好事吗？' }, options: { ja: ['はい', 'いいえ', 'どちらでもない'], en: ['Yes', 'No', 'It depends'], zh: ['是', '不是', '都可以'] }, correct: 1, explanation: { ja: '公共の場所をきれいに保つため、ゴミは指定されたゴミ箱に捨てるか、持ち帰るのがマナーです。', en: 'To keep public spaces clean, it is mannerly to throw trash in designated bins or take it home with you.', zh: '为了保持公共场所的清洁，把垃圾扔到指定的垃圾箱或带回家是基本礼仪。' } },
        { question: { ja: '電車の中で大声で電話をするのはOKですか？', en: 'Is it okay to talk loudly on the phone on a train?', zh: '可以在电车里大声打电话吗？' }, options: { ja: ['はい', 'いいえ', '状況による'], en: ['Yes', 'No', 'It depends'], zh: ['可以', '不可以', '看情况'] }, correct: 1, explanation: { ja: '公共の交通機関では、他の乗客の迷惑にならないように静かにするのがマナーです。電話は通常控えます。', en: 'On public transportation, it is good manners to be quiet so as not to disturb other passengers. Phone calls are usually avoided.', zh: '在公共交通工具上，为了不打扰其他乘客，保持安静是基本礼仪。通常不打电话。' } },
        { question: { ja: 'レストランで店員を呼ぶとき、大きな声で叫びますか？', en: 'When calling a waiter in a restaurant, do you shout loudly?', zh: '在餐厅叫服务员时，应该大声喊叫吗？' }, options: { ja: ['はい、叫ぶのが普通', 'いいえ、手を挙げるかボタンを押す', '店員が来るまで待つ'], en: ['Yes, that\'s normal', 'No, raise your hand or press a button', 'Wait for them to come'], zh: ['是的，这是正常的', '不，应该举手或按按钮', '等着服务员过来'] }, correct: 1, explanation: { ja: '店員を呼ぶ際は、静かに手を挙げるか、テーブルにある呼び出しボタンを押すのが一般的です。', en: 'It is common to quietly raise your hand or press the call button on the table to call a waiter.', zh: '叫服务员时，通常是安静地举手或按桌上的呼叫按钮。' } },
        { question: { ja: 'エスカレーターに乗るとき、東京ではどちら側に立ちますか？', en: 'In Tokyo, which side do you stand on when riding an escalator?', zh: '在东京乘坐自动扶梯时，应该站在哪一边？' }, options: { ja: ['左側', '右側', '真ん中'], en: ['Left side', 'Right side', 'Middle'], zh: ['左边', '右边', '中间'] }, correct: 0, explanation: { ja: '東京を含む日本の多くの地域では、エスカレーターは左側に立ち、急ぐ人のために右側を空けるのが一般的です。大阪など一部地域では逆になります。', en: 'In many parts of Japan, including Tokyo, it is common to stand on the left side of the escalator and leave the right side open for people in a hurry. This is reversed in some regions like Osaka.', zh: '在日本包括东京在内的许多地区，通常是靠左站，右边留给赶时间的人。在大阪等部分地区则相反。' } },
        { question: { ja: '人から物を受け取るとき、片手で受け取っても良いですか？', en: 'Is it okay to receive something from someone with one hand?', zh: '从别人那里收东西时，可以用一只手接吗？' }, options: { ja: ['はい', 'いいえ、両手で受け取るのが丁寧', 'どちらでも良い'], en: ['Yes', 'No, it\'s polite to use both hands', 'It doesn\'t matter'], zh: ['可以', '不，用双手接更礼貌', '都可以'] }, correct: 1, explanation: { ja: '特に目上の人から物を受け取る際は、両手で受け取るのが敬意を示す丁寧な方法です。', en: 'Using both hands to receive items, especially from someone senior, is a polite way of showing respect.', zh: '用双手接收物品，特别是从长辈那里，是表示尊重的一种礼貌方式。' } },
        { question: { ja: 'くしゃみをする時、手で口を覆うだけで十分ですか？', en: 'When you sneeze, is it enough to cover your mouth with your hand?', zh: '打喷嚏时，只用手捂住嘴就够了吗？' }, options: { ja: ['はい、十分です', 'いいえ、マスクやハンカチを使うのが望ましい', '何もしなくても良い'], en: ['Yes, it is', 'No, using a mask or handkerchief is better', 'You don\'t need to do anything'], zh: ['是的，足够了', '不，最好使用口罩或手帕', '什么都不用做'] }, correct: 1, explanation: { ja: '飛沫を飛ばさないために、手だけでなく、マスク、ハンカチ、または腕の内側で口と鼻を覆うのが良いマナーです。', en: 'To prevent spreading droplets, it is good manners to cover your mouth and nose with a mask, a handkerchief, or the inside of your elbow.', zh: '为了防止飞沫传播，用口罩、手帕或手臂内侧遮住口鼻是更好的礼仪。' } },
        { question: { ja: 'お風呂に入る前には何をしますか？', en: 'What do you do before getting into a bathtub?', zh: '进入浴池前应该做什么？' }, options: { ja: ['そのまま浴槽に入る', '体を洗う、または「かけ湯」をする', '準備運動をする'], en: ['Get in the tub directly', 'Wash your body or do "kake-yu"', 'Do warm-up exercises'], zh: ['直接进入浴池', '先洗身体或“冲汤”', '做准备活动'] }, correct: 1, explanation: { ja: '浴槽のお湯を汚さないように、入る前に体の汚れを洗い流すか、お湯を体にかける「かけ湯」をするのがマナーです。', en: 'It is a manner to wash your body or pour hot water on yourself ("kake-yu") before entering the bathtub to keep the bathwater clean.', zh: '为了保持浴池水的清洁，进入前先冲洗身体或用热水浇身（“冲汤”）是基本礼仪。' } },
        { question: { ja: '映画館で上映中にスマートフォンを見るのは良いですか？', en: 'Is it okay to look at your smartphone during a movie in a cinema?', zh: '在电影院放映期间看手机可以吗？' }, options: { ja: ['はい、音を消せばOK', 'いいえ、画面の光が迷惑になる', '緊急時のみOK'], en: ['Yes, if it\'s silent', 'No, the screen light is distracting', 'Only in an emergency'], zh: ['可以，只要静音就行', '不，屏幕的光会打扰别人', '只有紧急情况可以'] }, correct: 1, explanation: { ja: '音を消していても、スマートフォンの明るい画面は周りの人の鑑賞の妨げになるため、使用は控えるべきです。', en: 'Even on silent, the bright screen of a smartphone can disturb others\' viewing experience and should be avoided.', zh: '即使静音，智能手机的亮屏也会干扰他人的观影体验，应该避免使用。' } },
        { question: { ja: '日本では、お辞儀はどのような意味を持ちますか？', en: 'In Japan, what does bowing signify?', zh: '在日本，鞠躬代表什么意思？' }, options: { ja: ['謝罪のみ', '挨拶、感謝、敬意など様々', '挨拶のみ'], en: ['Only apology', 'Greetings, thanks, respect, etc.', 'Only greetings'], zh: ['只表示道歉', '问候、感谢、尊敬等多种含义', '只表示问候'] }, correct: 1, explanation: { ja: 'お辞儀は「こんにちは」という挨拶だけでなく、感謝や謝罪、敬意を示すなど、様々な場面で使われる重要なコミュニケーションです。', en: 'Bowing is an important form of communication used in various situations, not just for greetings, but also to express gratitude, apology, and respect.', zh: '鞠躬不仅是问候，也是一种重要的交流方式，用于表达感谢、歉意和尊敬等多种情感。' } },
        { question: { ja: '割り箸を割った後、箸をこすり合わせるのは良いマナーですか？', en: 'After splitting disposable chopsticks, is it good manners to rub them together?', zh: '掰开一次性筷子后，互相摩擦筷子是好习惯吗？' }, options: { ja: ['はい、木くずを取るために必要', 'いいえ、あまり品が良くないとされる', 'どちらでもない'], en: ['Yes, to remove splinters', 'No, it\'s considered unrefined', 'It doesn\'t matter'], zh: ['是的，为了去除木屑', '不，被认为不太雅观', '都可以'] }, correct: 1, explanation: { ja: '箸をこすり合わせる行為は、その箸が安物だと示しているようで、お店に対して失礼と見なされることがあります。', en: 'Rubbing chopsticks together can imply that they are cheap, which may be seen as disrespectful to the establishment.', zh: '摩擦筷子的行为可能暗示筷子很廉价，这可能被视为对店家不敬。' } },
        { question: { ja: '日本ではチップ（心付け）の習慣はありますか？', en: 'Is there a tipping custom in Japan?', zh: '日本有给小费的习惯吗？' }, options: { ja: ['はい、常に必要', 'いいえ、基本的に不要', '高級な場所でのみ必要'], en: ['Yes, always required', 'No, basically unnecessary', 'Only in high-end places'], zh: ['有，总是需要', '没有，基本上不需要', '只在高级场所需要'] }, correct: 1, explanation: { ja: '日本ではサービス料が料金に含まれているため、ホテルやレストラン、タクシーなどでチップを渡す習慣は基本的にありません。', en: 'In Japan, a service charge is usually included in the bill, so there is no custom of tipping at hotels, restaurants, or in taxis.', zh: '在日本，服务费通常已包含在账单里，所以在酒店、餐厅或出租车上基本没有给小费的习惯。' } },
        { question: { ja: '公共の場で鼻をかむのはOKですか？', en: 'Is it okay to blow your nose in public?', zh: '在公共场合擤鼻涕可以吗？' }, options: { ja: ['はい、問題ない', 'いいえ、人前では音を立てずに静かに', 'トイレなど人目につかない場所で行うのが望ましい'], en: ['Yes, no problem', 'No, do it quietly without making noise', 'It\'s better to do it in private, like a restroom'], zh: ['可以，没问题', '不，应该安静地进行', '最好在洗手间等私密场所进行'] }, correct: 2, explanation: { ja: '人前で大きな音を立てて鼻をかむのは、不快に思う人もいます。できるだけ人目につかない場所で行うのが無難です。', en: 'Blowing your nose loudly in public can be considered unpleasant by some people. It is best to do so in a more private setting if possible.', zh: '在公共场合大声擤鼻涕可能会让一些人感到不舒服，最好在不引人注目的地方进行。' } },
        { question: { ja: '食事を食べ終えた後の挨拶は何ですか？', en: 'What do you say after finishing a meal?', zh: '吃完饭后应该说什么？' }, options: { ja: ['お疲れ様', 'ごちそうさまでした', 'また明日'], en: ['Good work', 'Gochisousama deshita', 'See you tomorrow'], zh: ['辛苦了', '我吃好了', '明天见'] }, correct: 1, explanation: { ja: '食事の後は、感謝を込めて「ごちそうさまでした」と言います。', en: 'After a meal, you say "Gochisousama deshita" to express gratitude.', zh: '饭后说“我吃好了”以表示感谢。' } },
        { question: { ja: '神社でお参りする前、手や口を清める場所を何と呼びますか？', en: 'What is the name of the place where you purify your hands and mouth before praying at a shrine?', zh: '在神社参拜前，清洗手和口的地方叫什么？' }, options: { ja: ['手水舎（ちょうずや）', 'お風呂', '噴水'], en: ['Chouzuya', 'Bath', 'Fountain'], zh: ['手水舍', '浴室', '喷泉'] }, correct: 0, explanation: { ja: '「手水舎（ちょうずや、てみずや）」で手と口を清めてから参拝するのが作法です。', en: 'It is proper etiquette to purify your hands and mouth at the "Chouzuya" before praying.', zh: '在“手水舍”清洗手和口是参拜前的礼仪。' } },
        { question: { ja: '日本では、贈り物をもらったらすぐ開けるべきですか？', en: 'In Japan, should you open a gift immediately after receiving it?', zh: '在日本，收到礼物后应该马上打开吗？' }, options: { ja: ['はい、すぐ開けるのが礼儀', 'いいえ、相手の前では開けないのが普通', '場合による'], en: ['Yes, it\'s polite to open it right away', 'No, it\'s common not to open it in front of the giver', 'It depends'], zh: ['是的，立刻打开是礼貌', '不，通常不在送礼人面前打开', '看情况'] }, correct: 1, explanation: { ja: '相手への配慮から、その場で開けずに持ち帰るのが一般的です。ただし、親しい間柄や相手から勧められた場合は開けても構いません。', en: 'Out of consideration for the giver, it is common to take the gift home without opening it on the spot.', zh: '出于对送礼人的体谅，通常不会当场打开礼物，而是带回家。' } },
        { question: { ja: 'エレベーターで、他の人が降りるのを待つとき、どのボタンを押しますか？', en: 'When waiting for others to get off an elevator, which button do you press?', zh: '在电梯里等别人下电梯时，应该按哪个按钮？' }, options: { ja: ['「閉」ボタン', '「開」ボタン', '自分の階のボタン'], en: ['"Close" button', '"Open" button', 'Your floor button'], zh: ['“关”按钮', '“开”按钮', '自己楼层的按钮'] }, correct: 1, explanation: { ja: '他の人がスムーズに乗り降りできるよう、「開」ボタンを押し続けるのが親切な行動です。', en: 'It is a kind gesture to hold the "Open" button to allow others to get on and off smoothly.', zh: '按住“开”按钮，方便他人上下电梯，是一种友好的行为。' } },
        { question: { ja: '日本では、数字の「４」が避けられることがありますが、なぜですか？', en: 'In Japan, the number "4" is sometimes avoided. Why?', zh: '在日本，数字“4”有时会被避开，这是为什么？' }, options: { ja: ['発音が「死」と同じだから', '形が悪いから', 'ラッキーナンバーだから'], en: ['Because it sounds like "death"', 'Because of its shape', 'Because it\'s a lucky number'], zh: ['因为发音与“死”相同', '因为形状不好', '因为是幸运数字'] }, correct: 0, explanation: { ja: '数字の「４（し）」は「死（し）」を連想させるため、縁起が悪いとされ、特に病院などで避けられることがあります。', en: 'The number "4 (shi)" is associated with "death (shi)," so it is considered unlucky and often avoided, especially in hospitals.', zh: '数字“4（shi）”的发音与“死（shi）”相同，因此被认为不吉利，尤其在医院等地会被避开。' } },
        { question: { ja: '食事の時、お椀に直接口をつけてスープを飲んでも良いですか？', en: 'Is it okay to drink soup directly from the bowl during a meal?', zh: '吃饭时，可以直接用碗喝汤吗？' }, options: { ja: ['はい、問題ありません', 'いいえ、必ずレンゲを使う', 'スープによる'], en: ['Yes, it\'s fine', 'No, you must use a soup spoon', 'It depends on the soup'], zh: ['可以，没问题', '不，必须用汤匙', '看是什么汤'] }, correct: 0, explanation: { ja: '味噌汁など、小さなお椀に入ったスープは、直接口をつけて飲んで構いません。', en: 'For soups served in small bowls, like miso soup, it is acceptable to drink directly from the bowl.', zh: '像味增汤这样盛在小碗里的汤，可以直接用碗喝。' } },
        { question: { ja: '日本では、朝の挨拶は何ですか？', en: 'What is the morning greeting in Japan?', zh: '在日本，早上的问候语是什么？' }, options: { ja: ['こんにちは', 'こんばんは', 'おはようございます'], en: ['Konnichiwa', 'Konbanwa', 'Ohayou gozaimasu'], zh: ['你好', '晚上好', '早上好'] }, correct: 2, explanation: { ja: '朝に使う挨拶は「おはようございます」です。親しい間柄では「おはよう」と言うこともあります。', en: 'The greeting used in the morning is "Ohayou gozaimasu." Among close friends, you can also say "Ohayou."', zh: '早上使用的问候语是“早上好”。在亲近的人之间也可以说“早”。' } },
        { question: { ja: '日本では、夜の挨拶は何ですか？', en: 'What is the evening/night greeting in Japan?', zh: '在日本，晚上/夜间的问候语是什么？' }, options: { ja: ['こんにちは', 'こんばんは', 'おはようございます'], en: ['Konnichiwa', 'Konbanwa', 'Ohayou gozaimasu'], zh: ['你好', '晚上好', '早上好'] }, correct: 1, explanation: { ja: '夜に使う挨拶は「こんばんは」です。寝る前の挨拶は「おやすみなさい」です。', en: 'The greeting used in the evening is "Konbanwa." The greeting before going to sleep is "Oyasuminasai."', zh: '晚上使用的问候语是“晚上好”。睡前的问候语是“晚安”。' } },
        { question: { ja: 'お箸を使って人を指すのは良いことですか？', en: 'Is it okay to point at people with your chopsticks?', zh: '可以用筷子指人吗？' }, options: { ja: ['はい', 'いいえ', '食べ物ならOK'], en: ['Yes', 'No', 'It\'s okay if it\'s food'], zh: ['可以', '不可以', '指食物就可以'] }, correct: 1, explanation: { ja: 'お箸で人を指す行為は「指し箸」と呼ばれ、非常に失礼なマナー違反です。', en: 'Pointing at someone with chopsticks is called "sashi-bashi" and is considered very rude.', zh: '用筷子指人被称为“指し箸”，是非常失礼的行为。' } },
        { question: { ja: '温泉や銭湯で、浴槽に入る前に体を洗うのはなぜですか？', en: 'At onsen or sento, why do you wash your body before entering the bathtub?', zh: '在温泉或公共澡堂，为什么进入浴池前要先洗身体？' }, options: { ja: ['体を温めるため', 'お湯を汚さないため', '決まりはない'], en: ['To warm up the body', 'To keep the water clean', 'There is no rule'], zh: ['为了让身体变暖', '为了不弄脏水', '没有规定'] }, correct: 1, explanation: { ja: '浴槽のお湯はみんなで使うものなので、体を洗ってから入るのが衛生上のマナーです。', en: 'The bathwater is shared by everyone, so it is a hygienic manner to wash your body before entering.', zh: '浴池的水是大家共用的，所以为了卫生，进去之前要先洗身体。' } },
        { question: { ja: '日本では、名刺を片手で渡しても良いですか？', en: 'In Japan, is it okay to give a business card with one hand?', zh: '在日本，可以用一只手递名片吗？' }, options: { ja: ['はい', 'いいえ、両手で渡すのが基本', '相手による'], en: ['Yes', 'No, using both hands is basic', 'It depends on the person'], zh: ['可以', '不，双手递是基本礼仪', '看对方是谁'] }, correct: 1, explanation: { ja: '名刺は相手の顔と考えるため、敬意を込めて両手で渡すのがビジネスマナーの基本です。', en: 'A business card is considered an extension of the person, so it is basic business etiquette to present it with both hands to show respect.', zh: '名片被认为是对方的代表，因此用双手递送以示尊敬是商务礼仪的基础。' } },
        { question: { ja: '電車やバスの優先席に、健康な若者が座っても良いですか？', en: 'Is it okay for a healthy young person to sit in a priority seat on a train or bus?', zh: '健康的年轻人可以坐在电车或巴士的优先座位上吗？' }, options: { ja: ['はい、空いていれば問題ない', 'いいえ、絶対に座ってはいけない', '空いていても、必要な人が来たら譲るべき'], en: ['Yes, if it\'s empty', 'No, you must never sit there', 'Even if it\'s empty, you should give it up if someone in need comes'], zh: ['可以，只要空着就没问题', '不，绝对不能坐', '即使空着，也应该让给有需要的人'] }, correct: 2, explanation: { ja: '優先席は、お年寄りや体の不自由な方、妊婦などのための席です。空いていても、常に譲る意識を持つことが大切です。', en: 'Priority seats are for the elderly, people with disabilities, pregnant women, etc. It is important to always be ready to give up the seat.', zh: '优先座位是为老年人、残疾人、孕妇等人准备的。即使空着，也应该时刻准备让座。' } },
        { question: { ja: '日本では、他人の家のペットを許可なく触っても良いですか？', en: 'In Japan, is it okay to pet someone else\'s pet without permission?', zh: '在日本，可以未经允许就抚摸别人的宠物吗？' }, options: { ja: ['はい、かわいいからOK', 'いいえ、必ず飼い主に許可をもらう', '犬ならOK'], en: ['Yes, it\'s okay because it\'s cute', 'No, always ask the owner for permission', 'It\'s okay if it\'s a dog'], zh: ['可以，因为它很可爱', '不，一定要先征得主人的同意', '如果是狗就可以'] }, correct: 1, explanation: { ja: 'ペットにも個性や体調があります。トラブルを避けるため、必ず飼い主に「触ってもいいですか？」と確認するのがマナーです。', en: 'Pets have their own personalities and health conditions. To avoid trouble, it is good manners to always ask the owner, "May I pet him/her?"', zh: '宠物也有自己的个性和身体状况。为了避免麻烦，礼貌的做法是先问主人“我可以摸它吗？”。' } },
        { question: { ja: '食事中、肘をついて食べるのは良いマナーですか？', en: 'Is it good manners to eat with your elbows on the table?', zh: '吃饭时把手肘放在桌子上是好习惯吗？' }, options: { ja: ['はい', 'いいえ', '家ならOK'], en: ['Yes', 'No', 'It\'s okay at home'], zh: ['是', '不是', '在家里就可以'] }, correct: 1, explanation: { ja: '食事中にテーブルに肘をつくのは、日本では行儀が悪いとされています。', en: 'Resting your elbows on the table while eating is considered bad manners in Japan.', zh: '在日本，吃饭时把手肘放在桌子上被认为是不礼貌的。' } },
        { question: { ja: '日本では、人前でゲップをするのは許されますか？', en: 'Is it acceptable to burp in public in Japan?', zh: '在日本，可以在公共场合打嗝吗？' }, options: { ja: ['はい、満腹のしるし', 'いいえ、失礼にあたる', '静かならOK'], en: ['Yes, it\'s a sign of being full', 'No, it\'s considered rude', 'It\'s okay if it\'s quiet'], zh: ['可以，表示吃饱了', '不，被认为很失礼', '安静地打就可以'] }, correct: 1, explanation: { ja: '日本では、人前でゲップをすることは失礼な行為と見なされます。', en: 'In Japan, burping in front of others is considered rude.', zh: '在日本，当众打嗝被认为是失礼的行为。' } },
    ],
    normal: [
        { question: { ja: 'レストランで、入り口から一番遠い席は誰が座る席でしょうか？', en: 'In a restaurant, who sits in the seat furthest from the entrance?', zh: '在餐厅里，离入口最远的座位是给谁坐的？' }, options: { ja: ['一番偉い人', '一番若い人', '誰でも良い'], en: ['The highest-ranking person', 'The youngest person', 'Anyone'], zh: ['地位最高的人', '最年轻的人', '任何人都可以'] }, correct: 0, explanation: { ja: '日本では、入り口から最も遠い席が「上座（かみざ）」とされ、最も敬意を払うべき人が座るのが一般的です。', en: 'In Japan, the seat furthest from the entrance is called "kamiza," and it is generally for the person who should be shown the most respect.', zh: '在日本，离入口最远的座位被称为“上座”，通常是给最应受尊敬的人坐的。' } },
        { question: { ja: '畳の部屋を歩くとき、踏んではいけないとされている場所はどこでしょう？', en: 'When walking in a tatami room, what part should you avoid stepping on?', zh: '在榻榻米房间行走时，哪个地方是规定不能踩的？' }, options: { ja: ['畳の中心', '畳の縁（へり）', '部屋の角'], en: ['Center of the tatami', 'Border of the tatami', 'Corner of the room'], zh: ['榻榻米的中心', '榻榻米的边缘', '房间的角落'] }, correct: 1, explanation: { ja: '畳の縁には家の紋章が入っていることがあり、その家や人を象徴するため、踏むことは失礼とされています。', en: 'The borders of tatami mats sometimes contain the family crest and are symbolic, so stepping on them is considered disrespectful.', zh: '榻榻米的边缘有时会饰有家徽，它象征着家族，因此踩踏它被认为是不礼貌的。' } },
        { question: { ja: '食事中、お箸からお箸へ直接食べ物を渡す行為を何と呼びますか？', en: 'What is the act of passing food directly from one pair of chopsticks to another called?', zh: '用餐时，用筷子直接将食物传递给别人的筷子的行为叫什么？' }, options: { ja: ['渡し箸', '合わせ箸', '拾い箸'], en: ['Watashi-bashi', 'Awase-bashi', 'Hiroi-bashi'], zh: ['渡し箸', '合わせ箸', '拾い箸'] }, correct: 2, explanation: { ja: '火葬後のお骨拾いを連想させるため、「拾い箸（合わせ箸とも言う）」は最大のタブーの一つです。', en: 'This is a major taboo as it resembles the practice of picking up bones at a funeral. It is often called "Hiroi-bashi" or "Awase-bashi".', zh: '这种行为会让人联想到火葬后捡拾骨灰的仪式，因此“拾い箸”是最大的禁忌之一。' } },
        { question: { ja: '温泉で、浴槽にタオルを入れるのは良いことですか？', en: 'Is it okay to put your towel in the bathtub at an onsen?', zh: '在温泉，把毛巾放进浴池里可以吗？' }, options: { ja: ['良い', '悪い', 'どちらでもない'], en: ['Yes', 'No', 'It does not matter'], zh: ['可以', '不可以', '无所谓'] }, correct: 1, explanation: { ja: '衛生上の理由から、タオルを浴槽に入れるのはマナー違反です。頭の上に置くのが一般的です。', en: 'For hygienic reasons, it is bad manners to put your towel in the bathwater. It is common to place it on your head.', zh: '出于卫生原因，将毛巾放入浴池是违反礼仪的。通常的做法是放在头顶上。' } },
        { question: { ja: 'タクシーの後部座席のドアは、乗客が自分で開け閉めするのが正しいですか？', en: 'When riding a taxi, is it correct for passengers to open and close the door themselves?', zh: '乘坐出租车时，乘客应该自己开关车门吗？' }, options: { ja: ['はい、自分で開閉する', 'いいえ、自動で開閉する', '運転手に頼む'], en: ['Yes, do it yourself', 'No, it\'s automatic', 'Ask the driver'], zh: ['是的，自己开关', '不，是自动的', '请司机帮忙'] }, correct: 1, explanation: { ja: '日本のタクシーの多くはドアが自動で開閉します。無理に開け閉めすると故障の原因になるため、触らないのがマナーです。', en: 'Most taxis in Japan have automatic rear doors operated by the driver. It\'s polite not to touch the door.', zh: '日本大多数出租车的后门都是由司机操控自动开关的。乘客最好不要触摸车门，以免造成损坏。' } },
        { question: { ja: '乾杯の時、目上の人のグラスより自分のグラスの位置をどうするのが良いですか？', en: 'When making a toast, how should you position your glass relative to a senior person\'s glass?', zh: '干杯时，自己的杯子相对于长辈的杯子应该处于什么位置？' }, options: { ja: ['高く上げる', '同じ高さにする', '少し下げる'], en: ['Raise it higher', 'Keep it at the same height', 'Lower it slightly'], zh: ['更高', '同样高度', '稍微低一点'] }, correct: 2, explanation: { ja: '乾杯の際、相手への敬意を示すために、自分のグラスの縁を目上の方のグラスより少し下げて合わせるのが丁寧なマナーです。', en: 'To show respect, it is polite to clink your glass with the rim of your glass slightly below the rim of the senior person\'s glass.', zh: '为表示尊敬，干杯时将自己的杯沿置于长辈杯沿的稍下方是礼貌的做法。' } },
        { question: { ja: '食事の際、一度口をつけた料理を残すのは失礼にあたりますか？', en: 'Is it rude to leave food on your plate after you have started eating it?', zh: '吃饭时，吃了一口的菜剩下是否失礼？' }, options: { ja: ['はい、必ず完食すべき', 'いいえ、問題ない', 'できるだけ避けるべき'], en: ['Yes, you must finish everything', 'No, it is not a problem', 'It should be avoided if possible'], zh: ['是的，必须吃完', '不，没问题', '应尽量避免'] }, correct: 2, explanation: { ja: '食べ物を残すことは、作った人や食材への感謝が足りないと見なされることがあるため、食べきれる量を注文し、できるだけ残さないのが良いマナーです。', en: 'Leaving food is sometimes seen as a lack of gratitude towards the person who prepared it and the ingredients, so it\'s good manners to order what you can finish.', zh: '剩下食物可能被视为对厨师和食材不够感激，所以点自己能吃完的量并尽量吃完是好习惯。' } },
        { question: { ja: '人の家を訪問した際、勧められる前に好きな席に座っても良いですか？', en: 'When visiting someone\'s home, is it okay to sit wherever you like before being invited to?', zh: '拜访他人家里时，可以在被邀请前就随便坐下吗？' }, options: { ja: ['はい、自由に座って良い', 'いいえ、案内されるまで待つべき', 'どちらでも良い'], en: ['Yes, you can sit freely', 'No, you should wait to be guided', 'It doesn\'t matter'], zh: ['可以，随便坐', '不，应该等主人安排', '都可以'] }, correct: 1, explanation: { ja: '訪問先では、部屋に通された後、ホストから「どうぞこちらへ」と勧められるまで、立って待つのが礼儀です。', en: 'It is polite to stand and wait until the host invites you to sit in a particular place after being shown into a room.', zh: '被领进房间后，礼貌的做法是站着等候，直到主人邀请你“请坐这边”。' } },
        { question: { ja: 'お葬式に参列する際の香典で、避けるべき紙幣は何ですか？', en: 'For condolence money (koden) at a funeral, what kind of banknote should be avoided?', zh: '参加葬礼时，作为慰问金的纸币应避免使用哪一种？' }, options: { ja: ['古いお札', '新しいお札（新札）', 'どれでも良い'], en: ['Old bills', 'New, crisp bills', 'Any bill is fine'], zh: ['旧纸币', '崭新的纸币', '任何纸币都可以'] }, correct: 1, explanation: { ja: '新札は「不幸を予期して準備していた」と連想させるため、あえて少し折り目をつけた古いお札を使うのが一般的です。', en: 'Using new bills can imply that you were expecting the death and had prepared for it, so it is common to use older bills with a fold.', zh: '使用新钞可能暗示你预料到不幸并为此做了准备，所以通常会使用稍有折痕的旧钞。' } },
        { question: { ja: '神社を参拝する際、鳥居をくぐる前に行うと良いとされることは何ですか？', en: 'When visiting a shrine, what is the proper etiquette before passing through the torii gate?', zh: '参拜神社时，穿过鸟居前最好做什么？' }, options: { ja: ['深呼吸する', '一礼する', '靴を脱ぐ'], en: ['Take a deep breath', 'Bow once', 'Take off shoes'], zh: ['深呼吸', '鞠一躬', '脱鞋'] }, correct: 1, explanation: { ja: '鳥居は神様の領域への入り口を示すものです。くぐる前に立ち止まり、軽く一礼するのが丁寧な作法です。', en: 'A torii gate marks the entrance to a sacred space. It is polite to stop and make a slight bow before passing through.', zh: '鸟居是进入神域的入口。在穿过之前停下来，轻轻鞠一躬是礼貌的做法。' } },
        { question: { ja: '食事中、お箸を置くときはどうするのが正しいですか？', en: 'During a meal, what is the correct way to place your chopsticks when taking a break?', zh: '用餐期间，暂时放下筷子时应该怎么放？' }, options: { ja: ['お皿の上に置く', 'お椀の縁にかける', '箸置きに置く'], en: ['On top of your plate', 'Across the rim of your bowl', 'On a chopstick rest'], zh: ['放在盘子上', '架在碗边', '放在筷架上'] }, correct: 2, explanation: { ja: '食事の途中で箸を置く際は、箸先がお皿につかないように、箸置きに置くのが正しいマナーです。箸置きがなければ、お皿の縁にかけます。', en: 'When not using your chopsticks, the correct manner is to place them on a chopstick rest so that the tips do not touch the plate. If there is no rest, you can place them on the edge of a dish.', zh: '暂时不用筷子时，正确的做法是将其放在筷架上，以免筷尖接触到盘子。如果没有筷架，可以架在小碟子边上。' } },
        { question: { ja: 'ビジネスの場で、相手を呼ぶときに「あなた」と言うのは適切ですか？', en: 'Is it appropriate to call someone "anata" (you) in a business setting?', zh: '在商务场合，称呼对方为“你”（あなた）合适吗？' }, options: { ja: ['はい、適切です', 'いいえ、相手の役職名や「様」を使う', 'どちらでも良い'], en: ['Yes, it is appropriate', 'No, use their title or "-sama"', 'It doesn\'t matter'], zh: ['是的，合适', '不，应该使用对方的职位或“様”', '都可以'] }, correct: 1, explanation: { ja: 'ビジネスシーンで「あなた」と呼ぶのは、相手を見下しているように聞こえる場合があり失礼です。「〇〇部長」や「〇〇様」のように呼ぶのが適切です。', en: 'Using "anata" in business can sound condescending and is considered rude. It is appropriate to use their title, like "〇〇 Bucho" (Director 〇〇), or their name with "-sama".', zh: '在商务场合称呼“你”可能会显得居高临下，被认为是不礼貌的。应该使用“〇〇部长”或“〇〇様”等称呼。' } },
        { question: { ja: 'お寿司を手で食べても良いですか？', en: 'Is it acceptable to eat sushi with your hands?', zh: '可以用手吃寿司吗？' }, options: { ja: ['はい、問題ない', 'いいえ、必ず箸を使う', '高級店のみ手で食べても良い'], en: ['Yes, it is fine', 'No, you must use chopsticks', 'Only in high-end restaurants'], zh: ['可以，没问题', '不，必须用筷子', '只在高级餐厅可以'] }, correct: 0, explanation: { ja: 'お寿司は、箸を使っても手で直接つまんで食べても、どちらも正式なマナーとして認められています。食べやすい方で構いません。', en: 'Eating sushi with either chopsticks or your hands is considered proper etiquette. You can use whichever method is more comfortable for you.', zh: '无论是用筷子还是直接用手吃寿司，都被认为是正式的礼仪。选择你觉得方便的方式即可。' } },
        { question: { ja: '日本では、時間を守ることはどれくらい重要視されますか？', en: 'How important is being on time in Japan?', zh: '在日本，守时有多重要？' }, options: { ja: ['あまり重要ではない', '非常に重要', '約束による'], en: ['Not very important', 'Extremely important', 'It depends on the appointment'], zh: ['不太重要', '非常重要', '看情况'] }, correct: 1, explanation: { ja: '日本の社会では、約束の時間に遅れることは相手への敬意を欠く行為と見なされ、時間を守ることは非常に重要視されます。', en: 'In Japanese society, being late is seen as a lack of respect, and punctuality is highly valued.', zh: '在日本社会，迟到被视为对对方不尊重，因此守时非常重要。' } },
        { question: { ja: '贈り物に「４」や「９」の数を含む品物を避けるのはなぜですか？', en: 'Why are gifts with "4" or "9" items often avoided?', zh: '为什么送礼物时常避免包含“4”或“9”个物品？' }, options: { ja: ['縁起が悪い数字だから', '高価すぎるから', '数が足りないから'], en: ['Because it\'s an unlucky number', 'Because it\'s too expensive', 'Because there are not enough'], zh: ['因为是不吉利的数字', '因为太贵了', '因为数量不够'] }, correct: 0, explanation: { ja: '数字の「４」は「死」、「９」は「苦」を連想させるため、お祝い事などの贈り物ではこれらの数に関連する品物は避ける習慣があります。', en: 'The number "4" sounds like "shi" (death) and "9" sounds like "ku" (suffering), so it is customary to avoid these numbers in gifts for celebrations.', zh: '数字“4”的发音像“死”，“9”的发音像“苦”，所以在庆祝等场合的礼物中，习惯上会避免这些数字。' } },
        { question: { ja: 'お辞儀をする時、首だけを曲げるのは正しいですか？', en: 'When bowing, is it correct to bend only your neck?', zh: '鞠躬时，只弯脖子正确吗？' }, options: { ja: ['はい', 'いいえ、腰から曲げる', 'どちらでも良い'], en: ['Yes', 'No, bend from the waist', 'Either is fine'], zh: ['是的', '不，要从腰部弯曲', '都可以'] }, correct: 1, explanation: { ja: '正しいお辞儀は、背筋を伸ばしたまま、腰から上半身を傾けるのが基本です。', en: 'The correct way to bow is to keep your back straight and bend from the waist.', zh: '正确的鞠躬姿势是保持背部挺直，从腰部开始弯曲上半身。' } },
        { question: { ja: '訪問先でコートを脱ぐベストなタイミングはいつですか？', en: 'What is the best timing to take off your coat when visiting someone?', zh: '拜访别人时，脱掉外套的最佳时机是什么时候？' }, options: { ja: ['玄関のチャイムを押す前', '玄関に入ってから', '部屋に通されてから'], en: ['Before ringing the doorbell', 'After entering the entrance', 'After being shown into the room'], zh: ['按门铃之前', '进入玄关之后', '被领进房间之后'] }, correct: 0, explanation: { ja: '外のホコリや花粉を家の中に持ち込まないように、玄関のチャイムを押す前にコートを脱いでおくのが最も丁寧なマナーです。', en: 'It is most polite to take off your coat before ringing the doorbell to avoid bringing outside dust and pollen into the house.', zh: '为了不将室外的灰尘和花粉带入室内，最礼貌的做法是在按门铃之前脱掉外套。' } },
        { question: { ja: 'お茶碗にご飯粒が残っていても、気にせず片付けて良いですか？', en: 'Is it okay to leave grains of rice in your bowl when you are finished?', zh: '吃完饭后，碗里剩下饭粒也没关系吗？' }, options: { ja: ['はい、問題ない', 'いいえ、きれいに食べるのがマナー', '少しならOK'], en: ['Yes, no problem', 'No, it\'s polite to eat cleanly', 'A little is okay'], zh: ['可以，没问题', '不，吃干净是礼貌', '剩一点可以'] }, correct: 1, explanation: { ja: '日本では、作ってくれた人やお米への感謝を示すため、ご飯粒を残さずきれいに食べるのが良いマナーとされています。', en: 'In Japan, it is considered good manners to eat every last grain of rice to show appreciation to the cook and for the rice itself.', zh: '在日本，为了表示对做饭人和大米的感谢，将米饭吃得干干净净被认为是良好的礼仪。' } },
        { question: { ja: 'ビジネスの電話で、相手より先に電話を切るのは失礼にあたりますか？', en: 'In a business phone call, is it rude to hang up before the other person?', zh: '在商务电话中，比对方先挂电话失礼吗？' }, options: { ja: ['はい、失礼にあたる', 'いいえ、問題ない', 'かけた側が先に切る'], en: ['Yes, it is rude', 'No, it is not a problem', 'The person who called hangs up first'], zh: ['是的，很失礼', '不，没问题', '打电话的人先挂'] }, correct: 0, explanation: { ja: '一般的に、電話をかけた側から切るのがマナーですが、相手が顧客や目上の場合は、相手が切るのを待つのがより丁寧です。', en: 'Generally, the person who initiated the call hangs up first, but if the other person is a customer or superior, it is more polite to wait for them to hang up.', zh: '通常情况下，打电话的一方先挂电话是礼貌，但如果对方是客户或上级，等待对方先挂会更显礼貌。' } },
        { question: { ja: 'お寿司の醤油は、ネタ（魚）とシャリ（ご飯）のどちらにつけるのが良いですか？', en: 'When eating sushi, should you dip the fish side or the rice side in soy sauce?', zh: '吃寿司时，酱油应该蘸在鱼肉上还是米饭上？' }, options: { ja: ['シャリ', 'ネタ', 'どちらでも良い'], en: ['Rice', 'Fish', 'Either is fine'], zh: ['米饭', '鱼肉', '都可以'] }, correct: 1, explanation: { ja: 'シャリに醤油をつけすぎるとご飯が崩れてしまうため、ネタの先に少しだけつけるのがスマートな食べ方です。', en: 'Dipping the rice can cause it to fall apart, so the elegant way is to apply a small amount of soy sauce to the fish topping.', zh: '如果米饭蘸太多酱油会散开，所以只在鱼肉上蘸一点酱油是更得体的吃法。' } },
        { question: { ja: '日本では、人にもらったプレゼントを他の人にあげても良いですか？', en: 'In Japan, is it okay to give a gift you received to someone else?', zh: '在日本，可以把自己收到的礼物再送给别人吗？' }, options: { ja: ['はい、自由にどうぞ', 'いいえ、贈ってくれた人に失礼', '未使用ならOK'], en: ['Yes, feel free', 'No, it\'s rude to the original giver', 'It\'s okay if it\'s unused'], zh: ['可以，随你便', '不，对送礼的人很失礼', '没用过就可以'] }, correct: 1, explanation: { ja: '贈り物は、その人の気持ちがこもったものです。それを他の人にあげるのは、贈ってくれた人に対して大変失礼にあたります。', en: 'A gift contains the giver\'s feelings. Giving it to someone else is considered very disrespectful to the person who gave it to you.', zh: '礼物包含了赠送者的心意。将其转送给他人对原赠送者是非常失礼的。' } },
        { question: { ja: '訪問先でお茶菓子を出されたら、すぐに食べるべきですか？', en: 'If you are served tea and sweets when visiting, should you eat them immediately?', zh: '在别人家做客时，如果主人端上茶点，应该马上吃吗？' }, options: { ja: ['はい、すぐに食べる', 'いいえ、相手に勧められてから', 'お茶だけ飲む'], en: ['Yes, eat immediately', 'No, after being prompted by the host', 'Only drink the tea'], zh: ['是的，马上吃', '不，等主人劝让后再吃', '只喝茶'] }, correct: 1, explanation: { ja: 'ホストが「どうぞ」と勧めてくれるのを待ってからいただくのが丁寧な作法です。', en: 'It is polite to wait until the host says "douzo" (please, go ahead) before you start eating or drinking.', zh: '礼貌的做法是等到主人说“请用”之后再开始享用。' } },
        { question: { ja: 'お箸が汚れた時、おしぼりで拭いても良いですか？', en: 'If your chopsticks get dirty, is it okay to wipe them with your wet towel (oshibori)?', zh: '如果筷子脏了，可以用湿毛巾擦吗？' }, options: { ja: ['はい', 'いいえ', '食べ物の汚れならOK'], en: ['Yes', 'No', 'It\'s okay if it\'s food stains'], zh: ['可以', '不可以', '如果是食物污渍就可以'] }, correct: 1, explanation: { ja: 'おしぼりは手を拭くためのものです。お箸の汚れは、懐紙やご飯でうまくきれいにするのが良いとされますが、難しい場合は器の隅でそっと拭う程度にします。', en: 'The oshibori is for wiping your hands. It is best to clean chopsticks with kaishi paper or by using rice. If difficult, you can gently wipe them on the corner of a dish.', zh: '湿毛巾是用来擦手的。筷子脏了最好用怀纸或米饭来清洁，如果不行，也只能在器皿的角落轻轻擦拭。' } },
        { question: { ja: '日本では、人前であくびをするのはどう思われますか？', en: 'How is yawning in front of people viewed in Japan?', zh: '在日本，当众打哈欠会被怎么看？' }, options: { ja: ['問題ない', '失礼、または退屈しているサインと見なされる', '眠いなら仕方ない'], en: ['No problem', 'Considered rude or a sign of boredom', 'It can\'t be helped if you\'re sleepy'], zh: ['没问题', '被认为失礼或表示无聊', '困的话也没办法'] }, correct: 1, explanation: { ja: '人前でのあくびは、退屈している、あるいは敬意を欠いていると見なされることがあるため、手で口を隠すなどの配慮が必要です。', en: 'Yawning in public can be seen as a sign of boredom or lack of respect, so you should cover your mouth with your hand.', zh: '当众打哈欠可能被视为无聊或不尊重，因此需要用手遮住嘴巴等体谅他人的举动。' } },
        { question: { ja: 'タクシーに乗る時、どの席が一番の上座（目上の人が座る席）ですか？', en: 'When taking a taxi, which seat is the highest-ranking (kamiza)?', zh: '乘坐出租车时，哪个座位是最高级的（上座）？' }, options: { ja: ['助手席', '後部座席の中央', '運転席の後ろの席'], en: ['Front passenger seat', 'Rear middle seat', 'The seat behind the driver'], zh: ['副驾驶座', '后排中间座位', '司机后面的座位'] }, correct: 2, explanation: { ja: 'タクシーでは、安全で乗り降りしやすい運転席の真後ろが最も位の高い「上座」とされています。', en: 'In a taxi, the seat directly behind the driver is considered the most senior seat, or "kamiza," as it is the safest and easiest to get in and out of.', zh: '在出租车里，最安全且上下车最方便的司机正后方的座位被认为是最高级的“上座”。' } },
        { question: { ja: 'お見舞いに行く時、鉢植えの植物を贈るのは良いですか？', en: 'Is it a good idea to give a potted plant as a gift when visiting someone in the hospital?', zh: '去医院探病时，送盆栽植物好吗？' }, options: { ja: ['はい、緑は癒されるから', 'いいえ、「根付く」＝「寝付く」を連想させるから', '花ならOK'], en: ['Yes, because green is healing', 'No, because "to take root" sounds like "to be bedridden"', 'Flowers are okay'], zh: ['好，因为绿色很治愈', '不好，因为“扎根”会让人联想到“卧床不起”', '如果是花就可以'] }, correct: 1, explanation: { ja: '鉢植えは「根付く（ねづく）」が、病気が長引く「寝付く（ねつく）」を連想させるため、お見舞いの品としてはタブーとされています。', en: 'Potted plants are taboo as get-well gifts because "nezuku" (to take root) sounds like "netsuku" (to be sick in bed), implying a long illness.', zh: '盆栽是探病的禁忌，因为“根付く”（扎根）的发音与“寝付く”（卧床不起）相近，会让人联想到病情迁延不愈。' } },
        { question: { ja: '食事の時、器に手を添えるのは良いマナーですか？', en: 'Is it good manners to place a hand on your bowl while eating?', zh: '吃饭时，用手扶着碗是好习惯吗？' }, options: { ja: ['はい、丁寧な所作です', 'いいえ、不要です', '男性だけが行う'], en: ['Yes, it is a polite gesture', 'No, it is unnecessary', 'Only men do it'], zh: ['是的，这是礼貌的举止', '不，没必要', '只有男性这样做'] }, correct: 0, explanation: { ja: 'ご飯茶碗や汁物のお椀など、手に持てる大きさの器は、持って食べるのが基本です。大きな器の場合は、手を添えることで丁寧さを示せます。', en: 'It is basic etiquette to pick up bowls of a manageable size, like rice bowls or soup bowls. For larger dishes, placing a hand on the side shows politeness.', zh: '像饭碗或汤碗这样可以拿在手里的器皿，基本都是端起来吃的。对于较大的器皿，用手扶着可以表示礼貌。' } },
        { question: { ja: '日本では、会話中に相手の目をじっと見続けるのはどうですか？', en: 'In Japan, what about staring directly into someone\'s eyes during a conversation?', zh: '在日本，谈话时一直盯着对方的眼睛看怎么样？' }, options: { ja: ['敬意の表れ', '失礼、または威圧的と感じられることがある', '普通のこと'], en: ['A sign of respect', 'Can be considered rude or intimidating', 'It is normal'], zh: ['表示尊敬', '可能被认为失礼或具有压迫感', '很正常'] }, correct: 1, explanation: { ja: '欧米とは異なり、日本では相手の目を長時間じっと見つめることは、失礼または威圧的と受け取られることがあります。適度に視線を外すのが自然です。', en: 'Unlike in the West, prolonged direct eye contact can be considered rude or intimidating in Japan. It is natural to avert your gaze periodically.', zh: '与西方不同，在日本，长时间直视对方的眼睛可能被视为失礼或具有压迫感。适时移开视线会更自然。' } },
        { question: { ja: 'お寿司屋さんで、ゲタ（寿司を乗せる木製の台）に直接醤油を垂らしても良いですか？', en: 'At a sushi restaurant, is it okay to pour soy sauce directly onto the wooden plate (geta)?', zh: '在寿司店，可以直接把酱油倒在木制盛台（下駄）上吗？' }, options: { ja: ['はい', 'いいえ', '少しならOK'], en: ['Yes', 'No', 'A little is okay'], zh: ['可以', '不可以', '倒一点可以'] }, correct: 1, explanation: { ja: '醤油は、必ず備え付けの小皿に注いで使います。ゲタに直接垂らすのはマナー違反です。', en: 'Soy sauce should always be poured into the small dish provided. Pouring it directly onto the geta is a breach of etiquette.', zh: '酱油必须倒在备好的小碟子里使用。直接倒在木台（下駄）上是违反礼仪的。' } },
    ],
    hard: [
        { question: { ja: '訪問先で手渡す手土産は、どのタイミングで渡すのが最も丁寧でしょうか？', en: 'When visiting someone\'s home, what is the most polite timing to give a gift (omiyage)?', zh: '拜访他人家里时，在什么时机送上礼物（手信）最礼貌？' }, options: { ja: ['玄関先ですぐに', '部屋に通されて挨拶が終わった後', '帰る直前'], en: ['Immediately at the entrance', 'After being shown into the room and finishing greetings', 'Just before leaving'], zh: ['在玄关立刻送上', '被领进房间，打完招呼后', '临走前'] }, correct: 1, explanation: { ja: '玄関先で渡すのは相手に手間をかけさせるため、部屋に通されて落ち着いてから渡すのが丁寧なマナーです。', en: 'Giving a gift at the entrance can be burdensome for the host, so it is more polite to give it after settling in the room.', zh: '在玄关送礼会给主人添麻烦，因此在进屋安顿好之后再送是更有礼貌的做法。' } },
        { question: { ja: '名刺交換の際、受け取った名刺はすぐにどうするべきですか？', en: 'When exchanging business cards, what should you do immediately with the card you receive?', zh: '交换名片时，收到的名片应该立刻怎么处理？' }, options: { ja: ['すぐに名刺入れにしまう', 'テーブルの上に自分の左側に置く', 'ポケットに入れる'], en: ['Put it in your card case right away', 'Place it on the table to your left', 'Put it in your pocket'], zh: ['马上放进名片夹', '放在桌上自己的左手边', '放进口袋里'] }, correct: 1, explanation: { ja: '受け取った名刺は相手の分身と考え、すぐにしまわず、商談が終わるまでテーブルの上に置いておくのが敬意の表れです。', en: 'A business card is considered an extension of the person, so you should respectfully place it on the table until the meeting is over.', zh: '收到的名片被认为是对方的代表，因此不应立即收起来，而应将其放在桌上直到商谈结束，以示尊重。' } },
        { question: { ja: 'エレベーターに乗る時、操作盤の前に立った人はどうするのが一般的ですか？', en: 'When riding an elevator, what is the common etiquette for the person standing in front of the control panel?', zh: '乘坐电梯时，站在控制面板前的人通常应该怎么做？' }, options: { ja: ['率先してボタンを押す', '何もしない', '他の人に操作を頼む'], en: ['Take the lead and press the buttons', 'Do nothing', 'Ask someone else to operate'], zh: ['主动按按钮', '什么都不做', '请别人操作'] }, correct: 0, explanation: { ja: '操作盤の前に立った人は、他の人が乗り降りしやすいようにドアの操作などをするのが親切とされています。', en: 'The person standing in front of the control panel is often expected to help others by operating the doors and selecting floors.', zh: '站在控制面板前的人，通常被期望通过操作门和选择楼层来帮助他人，这被认为是一种友好的姿态。' } },
        { question: { ja: '新幹線でリクライニングシートを倒す時、最も丁寧な行動はどれですか？', en: 'When reclining your seat on the Shinkansen (bullet train), what is the most polite action?', zh: '在新干线上放倒座椅时，最有礼貌的做法是？' }, options: { ja: ['何も言わずに倒す', '後ろの人に一声かける', '最大まで一気に倒す'], en: ['Recline without saying anything', 'Speak to the person behind you', 'Recline it all the way at once'], zh: ['不说话直接放倒', '问一下后面的人', '一下子放到底'] }, correct: 1, explanation: { ja: '後ろの人が飲み物等を置いている可能性があるため、一声かけるのが思いやりのあるマナーです。', en: 'It is considerate to ask the person behind you, as they might have drinks or a laptop on their table.', zh: '在放倒座椅之前，最好先问一下后面的人，因为他们可能在桌子上放了东西。' } },
        { question: { ja: '人に贈り物を渡す時、デパートの包装紙のまま渡すのは失礼にあたりますか？', en: 'When giving a gift, is it rude to give it in the store\'s wrapping paper?', zh: '送礼物给别人时，直接用百货公司的包装纸送会失礼吗？' }, options: { ja: ['はい、失礼にあたる', 'いいえ、失礼ではない', '場合による'], en: ['Yes, it is rude', 'No, it is not rude', 'It depends'], zh: ['是的，很失礼', '不，不会失礼', '看情况'] }, correct: 1, explanation: { ja: 'お店のきれいな包装紙で包んでもらった状態のまま渡すのが一般的で、信頼の証と見なされることもあります。', en: 'It is common and acceptable to give a gift in the store\'s original wrapping, as it can be a sign of quality.', zh: '在日本，直接用商店整洁的包装纸送礼物是很普遍的，甚至被视为品质的象征。' } },
        { question: { ja: '会食の席で、お酌をされたがお酒が飲めない場合、最も良い断り方はどれですか？', en: 'At a dinner, if someone offers you a drink but you cannot drink alcohol, what is the best way to refuse?', zh: '在宴会上，如果有人给你倒酒但你不能喝酒，最好的拒绝方式是什么？' }, options: { ja: ['黙ってグラスを伏せる', '「結構です」と強く断る', '感謝を述べ、グラスに口をつけるふりをする'], en: ['Silently turn your glass upside down', 'Firmly say "No, thank you"', 'Express thanks and pretend to take a sip'], zh: ['默默地把杯子倒扣过来', '坚决地说“不用了”', '表示感谢，然后假装抿一口'] }, correct: 2, explanation: { ja: '相手の厚意を無にしないよう、一度感謝して受け、飲めない理由を伝えた上で口をつける真似をするのが、角の立たない洗練された断り方です。', en: 'To not dismiss the person\'s kindness, it is a sophisticated manner to first accept with thanks, explain you cannot drink, and then just bring the glass to your lips without drinking.', zh: '为了不辜负对方的好意，礼貌的做法是先表示感谢并接受，说明自己不能喝，然后假装喝一口，这是比较圆滑的拒绝方式。' } },
        { question: { ja: '結婚祝いのご祝儀で、金額が「割り切れる」偶数を避けるのはなぜですか？', en: 'For a wedding gift of money, why are even numbers that can be "divided" avoided?', zh: '在婚礼礼金中，为什么通常避免使用可以“除尽”的偶数金额？' }, options: { ja: ['計算が難しいから', '「別れ」を連想させるから', '縁起が悪いから'], en: ['Because it\'s hard to calculate', 'Because it suggests "separation"', 'Because it\'s unlucky'], zh: ['因为计算困难', '因为它暗示“分离”', '因为不吉利'] }, correct: 1, explanation: { ja: '「割り切れる」＝「（夫婦が）分かれる、別れる」を連想させるため、結婚祝いでは奇数の金額が好まれます。ただし、ペアを意味する「２」や末広がりの「８」は例外的に良いとされます。', en: '"Divisible" can be associated with "dividing" or "separating" a couple, so odd numbers are preferred for wedding gifts. However, "2" (a pair) and "8" (prosperity) are exceptions.', zh: '因为“可以除尽”让人联想到“（夫妻）分开”，所以在婚礼礼金中偏爱奇数。但代表“成双成对”的“2”和寓意“广阔发展”的“8”是例外。' } },
        { question: { ja: '贈り物にハンカチを選ぶのが、時として避けられるのはなぜですか？', en: 'Why is giving a handkerchief as a gift sometimes avoided?', zh: '为什么有时会避免选择手帕作为礼物？' }, options: { ja: ['値段が安いから', '涙を拭うものなので「別れ」を意味するから', '実用的すぎるから'], en: ['Because it\'s cheap', 'Because it\'s for wiping tears, implying "farewell"', 'Because it\'s too practical'], zh: ['因为它便宜', '因为它用来擦眼泪，暗示“告别”', '因为它太实用了'] }, correct: 1, explanation: { ja: 'ハンカチは漢字で「手巾（てぎれ）」と書くことができ、これが「手切れ」を連想させるため、特に別れの場面以外での贈り物としては避けることがあります。', en: 'The Japanese word for handkerchief, "hankachi," can be written with characters that also mean "to cut ties," so it is sometimes avoided as a gift outside of farewell situations.', zh: '手帕在日语中的汉字可以写成“手巾”，发音与“手切れ”（断绝关系）相近，因此除了告别的场合，通常会避免作为礼物。' } },
        { question: { ja: '和室で、座布団を足で踏むのはなぜ失礼なのですか？', en: 'In a Japanese-style room, why is it rude to step on a zabuton (floor cushion)?', zh: '在和式房间里，为什么用脚踩坐垫是失礼的？' }, options: { ja: ['汚れるから', '座布団は「お客様をお迎えする心」の象徴だから', '滑って危ないから'], en: ['Because it gets dirty', 'Because it symbolizes the host\'s hospitality', 'Because it\'s slippery and dangerous'], zh: ['因为会弄脏', '因为坐垫象征着主人的款待之心', '因为滑倒危险'] }, correct: 1, explanation: { ja: '座布団は単なるクッションではなく、お客様への敬意や歓迎の気持ちを表すものです。それを足で踏む行為は、相手の心を踏みにじることと同じと見なされます。', en: 'A zabuton is not just a cushion but a symbol of respect and welcome for a guest. Stepping on it is like stepping on the host\'s heart.', zh: '坐垫不仅仅是一个垫子，它代表了对客人的敬意和欢迎。用脚踩它被视为等同于践踏主人的心意。' } },
        { question: { ja: '上司や取引先とタクシーに乗る際、最も下座（部下や接待側が座る席）はどこですか？', en: 'When taking a taxi with a boss or client, which seat is considered the lowest (for the subordinate)?', zh: '与上司或客户一起乘坐出租车时，哪个座位是最低的（下属或接待方坐的）？' }, options: { ja: ['後部座席の窓側', '助手席', '後部座席の中央'], en: ['Rear window seat', 'Passenger seat', 'Rear middle seat'], zh: ['后排靠窗座位', '副驾驶座', '后排中间座位'] }, correct: 1, explanation: { ja: 'タクシーでは運転席の後ろが最も上座とされ、支払いなどを行う助手席が最も下座となります。', en: 'In a taxi, the seat behind the driver is the highest-ranking seat, and the front passenger seat, where payments are handled, is the lowest.', zh: '在出租车里，司机后面的座位是最高级的，而负责支付等事宜的副驾驶座是最低的。' } },
        { question: { ja: 'お茶の入った湯呑みに蓋がある場合、飲んだ後どうするのが正しいですか？', en: 'If a teacup comes with a lid, what is the correct thing to do after drinking?', zh: '如果茶杯有盖子，喝完茶后正确的做法是什么？' }, options: { ja: ['蓋を裏返して置く', '蓋を湯呑みの横に置く', '元通りに蓋をする'], en: ['Place the lid upside down', 'Place the lid next to the teacup', 'Put the lid back on as it was'], zh: ['把盖子翻过来放', '把盖子放在茶杯旁边', '像原来一样盖好'] }, correct: 2, explanation: { ja: '飲み終わったら、元々あったように蓋を閉めるのが正しい作法です。裏返したり、ずらして置いたりするのはマナー違反です。', en: 'The proper etiquette is to replace the lid as it was originally. Placing it upside down or to the side is incorrect.', zh: '喝完茶后，正确的做法是把盖子像原来那样盖好。翻过来或放在旁边都是不合规矩的。' } },
        { question: { ja: '「ご無沙汰しております」という挨拶は、どのくらいの期間会っていない相手に使いますか？', en: 'When is it appropriate to use the greeting "Gobusata shiteorimasu" (It has been a while)?', zh: '“ご無沙汰しております”（好久不见）这个问候语，通常对多久没见的人使用？' }, options: { ja: ['1週間', '1ヶ月', '3ヶ月以上'], en: ['After one week', 'After one month', 'After three months or more'], zh: ['一周', '一个月', '三个月或更久'] }, correct: 2, explanation: { ja: '一般的に、3ヶ月以上から半年、1年と、かなり長期間会っていない相手に対して使うのが適切な言葉です。', en: 'This phrase is generally used when you have not seen someone for a significant period, typically three months or longer.', zh: '一般来说，这个词适用于超过三个月、半年或一年等相当长一段时间没见的人。' } },
        { question: { ja: 'ビジネスメールの宛名で、相手の部署全体に送る場合に使う敬称は何ですか？', en: 'In a business email, what is the correct honorific to use when addressing an entire department?', zh: '在商务邮件中，当收件人是整个部门时，应该使用哪个敬称？' }, options: { ja: ['各位', '御中', '様'], en: ['各位 (kaku-i)', '御中 (on-chū)', '様 (sama)'], zh: ['各位', '御中', '様'] }, correct: 1, explanation: { ja: '「御中」は会社や部署など、組織内の不特定の誰か（担当者）に宛てて送る際に使います。「各位」は複数の個人に宛てて使う言葉です。', en: '"On-chū" is used when addressing a company or department as a whole, rather than a specific individual. "Kaku-i" is used for addressing a group of individuals.', zh: '“御中”用于称呼公司或部门等组织，而不是特定的个人。“各位”用于称呼多位个人。' } },
        { question: { ja: 'お葬式で涙を流すのは、故人に対して失礼にあたりますか？', en: 'At a funeral, is it considered disrespectful to the deceased to cry?', zh: '在葬礼上哭泣是对逝者的不敬吗？' }, options: { ja: ['はい、失礼にあたる', 'いいえ、自然な感情の表れとして問題ない', '場合による'], en: ['Yes, it is disrespectful', 'No, it is a natural expression of grief', 'It depends'], zh: ['是的，不敬', '不，这是情感的自然流露', '看情况'] }, correct: 1, explanation: { ja: '故人を悼む気持ちからの涙は、決して失礼にはあたりません。ただし、大声で泣き叫ぶなど、他の参列者の迷惑になるほどの振る舞いは慎むべきです。', en: 'Tears shed out of grief for the deceased are not considered disrespectful. However, behavior that disturbs other mourners, such as loud wailing, should be avoided.', zh: '为悼念逝者而流泪绝非不敬。但是，应避免大声哭喊等打扰其他吊唁者的行为。' } },
        { question: { ja: 'お祝いの席で、使ってはいけない「忌み言葉」の例はどれですか？', en: 'What is an example of an "imi-kotoba" (taboo word) that should be avoided at a celebration?', zh: '在庆祝场合，应避免使用的“忌讳词”是哪个例子？' }, options: { ja: ['「終わる」「切れる」', '「始まる」「続く」', '「嬉しい」「楽しい」'], en: ['"End," "Cut"', '"Begin," "Continue"', '"Happy," "Joyful"'], zh: ['“结束”、“切断”', '“开始”、“继续”', '“高兴”、“快乐”'] }, correct: 0, explanation: { ja: '結婚式などのお祝いの場では、「終わる」「切れる」「離れる」「戻る」といった、別れや不幸を連想させる「忌み言葉」を使うのはタブーとされています。', en: 'At celebrations like weddings, it is taboo to use words that suggest separation or misfortune, such as "to end," "to cut," "to leave," or "to return".', zh: '在婚礼等庆祝活动中，使用暗示分离或不幸的词语，如“结束”、“切断”、“离开”、“返回”等，是禁忌。' } },
        { question: { ja: '和食の配膳で、ご飯は左右どちらに置くのが基本ですか？', en: 'In a traditional Japanese meal setting, on which side is the rice bowl placed?', zh: '在日式餐点摆盘时，饭碗通常放在左边还是右边？' }, options: { ja: ['右', '左', '中央'], en: ['Right', 'Left', 'Center'], zh: ['右', '左', '中央'] }, correct: 1, explanation: { ja: '日本では「左上位」の考え方があり、主食であるご飯は左側、汁物は右側に置くのが基本的な配膳（「一汁三菜」）です。', en: 'In Japan, based on the concept of "sa-jou-i" (left side is higher rank), the main staple, rice, is placed on the left, and the soup is placed on the right.', zh: '在日本有“左上位”的观念，主食米饭放在左边，汤放在右边是基本的摆盘方式。' } },
        { question: { ja: '訪問先で出されたお茶を、どのタイミングで飲むのが適切ですか？', en: 'When offered tea at someone\'s home, when is it appropriate to drink it?', zh: '在别人家做客时，主人端上茶后，什么时候喝最合适？' }, options: { ja: ['出されたらすぐに', '相手が「どうぞ」と言ってから', '話が一段落してから'], en: ['Immediately after it is served', 'After the host says "douzo"', 'After a pause in conversation'], zh: ['一端上来就喝', '等主人说了“请用”之后', '等谈话告一段落后'] }, correct: 1, explanation: { ja: '相手が「どうぞ」と勧めてくれるのを待つのが礼儀です。また、話に夢中になって全く口をつけないのも失礼にあたることがあります。', en: 'It is polite to wait for the host to offer it to you by saying "douzo." However, it can also be rude to not touch it at all because you are absorbed in conversation.', zh: '礼貌的做法是等主人劝让之后再喝。但如果因为谈话入神而完全不碰，也可能被视为失礼。' } },
        { question: { ja: 'ビジネス文書で、相手の会社を指す敬称は何ですか？', en: 'In business documents, what is the honorific term used to refer to the other party\'s company?', zh: '在商务文件中，称呼对方公司时使用的敬称是什么？' }, options: { ja: ['弊社（へいしゃ）', '貴社（きしゃ）', '当社（とうしゃ）'], en: ['Heisha', 'Kisha', 'Tousha'], zh: ['弊社', '貴社', '当社'] }, correct: 1, explanation: { ja: '相手の会社を敬って言う場合は「貴社（きしゃ）」を使います。「弊社」は自分の会社をへりくだって言う言葉です。', en: 'When referring to another company respectfully, you use "Kisha." "Heisha" is the humble term for one\'s own company.', zh: '尊敬地称呼对方公司时使用“貴社”。“弊社”是谦称自己公司时使用的词语。' } },
        { question: { ja: '結婚式のご祝儀袋、水引（飾り紐）の結び方はどれが正しいですか？', en: 'For a wedding money envelope, what is the correct type of knot for the mizuhiki cord?', zh: '婚礼礼金信封上的装饰绳（水引）应该用哪种结？' }, options: { ja: ['蝶結び', '結び切り', 'どちらでも良い'], en: ['Butterfly knot (Chou-musubi)', 'Knot that cannot be untied (Musubi-kiri)', 'Either is fine'], zh: ['蝴蝶结', '死结', '都可以'] }, correct: 1, explanation: { ja: '結婚は一度きりであってほしいという願いを込めて、簡単にほどけない「結び切り」や「あわじ結び」を使います。「蝶結び」は何度も繰り返したいお祝い事（出産など）に使います。', en: 'The "musubi-kiri" knot, which cannot be easily untied, is used to signify the wish for a once-in-a-lifetime event. The butterfly knot is for celebrations you hope will repeat, like childbirth.', zh: '为了寓意婚姻只有一次，使用不容易解开的“結び切り”或“あわじ結び”。“蝶結び”用于希望重复的喜事（如生子）。' } },
        { question: { ja: '焼香の作法で、お香を額に押しいただく回数は宗派によって異なりますか？', en: 'In the ritual of burning incense (shoko), does the number of times you bring the incense to your forehead vary by Buddhist sect?', zh: '在烧香的礼仪中，将香举到额头的次数会因宗派而异吗？' }, options: { ja: ['はい、異なる', 'いいえ、常に3回', '回数に決まりはない'], en: ['Yes, it differs', 'No, it is always 3 times', 'There is no set number'], zh: ['是的，不同', '不，都是3次', '没有固定次数'] }, correct: 0, explanation: { ja: 'はい、異なります。例えば、浄土真宗では押しいただかず、真言宗では3回、曹洞宗では1回（2回目はいただかない）など、宗派によって正式な作法が異なります。', en: 'Yes, it does. For example, in Jodo Shinshu, you do not bring it to your forehead, whereas in Shingon, it is three times. The formal etiquette varies by sect.', zh: '是的，不同。例如，净土真宗不举香到额头，真言宗是3次，曹洞宗是1次（第二次不举），不同宗派有不同的正式礼仪。' } },
        { question: { ja: '食事の際、器の蓋はどこに置くのが正しいですか？', en: 'When dining, where is the correct place to put the lid of a bowl?', zh: '吃饭时，碗盖应该放在哪里？' }, options: { ja: ['お盆の外の右側', 'お盆の中の右側', '裏返してお椀の上'], en: ['Outside the tray on the right', 'Inside the tray on the right', 'Upside down on top of the bowl'], zh: ['餐盘外的右侧', '餐盘内的右侧', '翻过来放在碗上'] }, correct: 0, explanation: { ja: 'お椀の蓋は、お椀の右側、お盆の外に置くのが基本です。水滴が垂れないように、蓋の内側を上にして置きます。', en: 'The lid should be placed outside the tray on the right side of the bowl, with the inside facing up to prevent condensation from dripping.', zh: '碗盖的基本放法是放在餐盘外的右侧，内侧朝上以防滴水。' } },
        { question: { ja: 'ビジネスメールで、自分の名前を名乗った後、相手に「お世話になっております」と書くのは正しいですか？', en: 'In a business email, is it correct to write "Osewa ni natte orimasu" after stating your name?', zh: '在商务邮件中，报上自己名字后写“承蒙关照”正确吗？' }, options: { ja: ['はい、正しい', 'いいえ、名乗る前に書く', '初めての相手には使わない'], en: ['Yes, it is correct', 'No, write it before your name', 'Do not use it for a first-time contact'], zh: ['是的，正确', '不，要在报名前写', '不要对初次联系的人使用'] }, correct: 1, explanation: { ja: 'ビジネスメールでは、まず宛名、次に挨拶（「お世話になっております」など）、そして自分の会社名と名前を名乗るのが正しい順序です。', en: 'The correct order in a business email is: Addressee, Greeting (like "Osewa ni natte orimasu"), and then your company name and your name.', zh: '商务邮件的正确顺序是：收件人姓名、问候语（如“承蒙关照”），然后是自己的公司名和姓名。' } },
        { question: { ja: '訪問先で「つまらないものですが」と言って手土産を渡すのはなぜですか？', en: 'Why do people say "Tsumaranai mono desu ga" (It\'s a dull thing, but...) when giving a gift?', zh: '为什么在送礼时会说“一点小意思”（つまらないものですが）？' }, options: { ja: ['本当に価値がないから', '謙遜の気持ちを表すため', '決まり文句で意味はない'], en: ['Because it truly has no value', 'To express humility', 'It\'s just a set phrase with no meaning'], zh: ['因为它真的没什么价值', '为了表示谦逊', '只是没有意义的客套话'] }, correct: 1, explanation: { ja: '「立派なあなたに差し上げるには、この贈り物は大したものではありませんが」という、相手を立てる謙遜の表現です。', en: 'It is a humble expression that elevates the receiver, implying, "This gift is not much for someone as great as you."', zh: '这是一种抬高对方、表示谦逊的说法，意思是“对于尊贵的您来说，这份薄礼不成敬意”。' } },
        {
            question: { ja: '和室の敷居（しきい）を踏んではいけないと言われる主な理由は何ですか？', en: 'What is the main reason it is said you should not step on the threshold (shikii) of a Japanese room?', zh: '据说不能踩在和室的门槛上，主要原因是什么？' },
            options: { ja: ['家の主人の頭だから', '滑って危ないから', '単なる迷信'], en: ['Because it represents the head of the household', 'Because it is slippery and dangerous', 'It is just a superstition'], zh: ['因为它代表一家之主', '因为它很滑很危险', '只是迷信'] },
            correct: 0,
            explanation: { ja: '敷居は、その家の内と外を分ける結界であり、またその家の主人の頭を象徴するとも言われ、踏むことは大変失礼とされています。', en: 'The threshold is a boundary separating the inside and outside of a house and is also said to symbolize the head of the household, making it very disrespectful to step on.', zh: '门槛是分隔房屋内外的结界，也象征着一家之主，因此踩踏门槛被认为是非常失礼的。' }
        },
        { question: { ja: '食事の際、一度取り皿に取った料理を、元の大きな皿に戻しても良いですか？', en: 'During a meal, is it okay to return food from your small plate back to the large serving dish?', zh: '吃饭时，可以把自己小盘子里的菜再放回大盘子里吗？' }, options: { ja: ['はい、誰も見ていなければ', 'いいえ、絶対にしてはいけない', '少しならOK'], en: ['Yes, if no one is watching', 'No, you must never do it', 'A little is okay'], zh: ['可以，如果没人看见的话', '不，绝对不可以', '一点点なら可以'] }, correct: 1, explanation: { ja: '一度自分の皿に取ったものを共有の大皿に戻すのは、衛生的に問題があるだけでなく、重大なマナー違反（「そら箸」）です。', en: 'Returning food to a shared platter after it has been on your personal plate is a major breach of etiquette ("sora-bashi") and is also unhygienic.', zh: '把自己盘子里的食物再放回公用的大盘子里，不仅不卫生，也是严重违反礼仪的（“そら箸”）。' } },
        { question: { ja: '新築祝いに「火」を連想させる贈り物（灰皿、ライターなど）を避けるのはなぜですか？', en: 'Why are gifts that evoke "fire" (like ashtrays or lighters) avoided for a housewarming?', zh: '为什么乔迁之喜时要避免送让人联想到“火”的礼物（如烟灰缸、打火机）？' }, options: { ja: ['値段が安いから', '火事を連想させるから', '煙が出るから'], en: ['Because they are cheap', 'Because they are associated with fires', 'Because they produce smoke'], zh: ['因为便宜', '因为会让人联想到火灾', '因为会冒烟'] }, correct: 1, explanation: { ja: '新築した家が火事になることを連想させるため、灰皿、ライター、ストーブ、また赤い色の贈り物なども避けるのが一般的です。', en: 'Gifts that are associated with fire, such as ashtrays, lighters, heaters, and even red-colored items, are generally avoided as they can be associated with a house fire.', zh: '为了避免让人联想到新居发生火灾，通常会避免赠送烟灰缸、打火机、暖炉以及红色的礼物。' } },
        { question: { ja: 'エレベーターで、目上の人と二人きりの場合、どちらが先に降りますか？', en: 'When in an elevator with a superior, who gets off first?', zh: '和上级单独乘坐电梯时，谁先下？' }, options: { ja: ['目上の人が先', '自分が先', '同時に降りる'], en: ['The superior gets off first', 'I get off first', 'Get off at the same time'], zh: ['上级先下', '我先下', '同时下'] }, correct: 1, explanation: { ja: 'ドアの操作や安全確保のため、目下の者が先に降りてドアを押さえ、目上の人を安全に誘導するのが正しいマナーです。', en: 'The subordinate should get off first to hold the door and ensure the superior can exit safely. This is proper etiquette.', zh: '为了操作电梯门和确保安全，下级应该先下电梯按住开门键，引导上级安全下梯，这才是正确的礼仪。' } },
        { question: { ja: '電話をかける時間帯として、一般的に避けるべきなのはいつですか？', en: 'What time of day should generally be avoided when making a phone call?', zh: '打电话时，通常应该避开哪个时间段？' }, options: { ja: ['午前中', '昼休み', '早朝や深夜'], en: ['Morning', 'Lunch break', 'Early morning and late night'], zh: ['上午', '午休', '清晨和深夜'] }, correct: 2, explanation: { ja: '相手のプライベートな時間を尊重するため、食事時や早朝・深夜など、非常識な時間帯に電話をかけるのは避けるべきです。', en: 'To respect the other person\'s private time, you should avoid calling during meal times, early in the morning, or late at night.', zh: '为了尊重对方的私人时间，应该避免在用餐时间、清晨或深夜等不合常理的时间段打电话。' } },
        { question: { ja: '会食で、相手のグラスが空になったらすぐにお酌をするべきですか？', en: 'At a dinner, should you pour a drink for someone as soon as their glass is empty?', zh: '在宴会上，对方的杯子一空就应该马上给他倒酒吗？' }, options: { ja: ['はい、すぐに注ぐのが礼儀', 'いいえ、相手に一声かけてから', '相手が自分で注ぐのを待つ'], en: ['Yes, pouring immediately is polite', 'No, ask them first', 'Wait for them to pour it themselves'], zh: ['是的，马上倒满是礼貌', '不，要先问一下对方', '等对方自己倒'] }, correct: 1, explanation: { ja: '相手のペースを尊重するため、「いかがですか？」と一声かけてからお酌するのが丁寧です。勝手に注ぎ続けるのは「すすめ上手」とは言えません。', en: 'To respect their pace, it is polite to ask "Ikaga desu ka?" (Would you like some more?) before pouring. Continuously pouring without asking is not considered good hosting.', zh: '为了尊重对方的节奏，礼貌的做法是先问一句“您还要吗？”再倒酒。自顾自地不停倒酒并不能算是“劝酒高手”。' } },
    ]
};
