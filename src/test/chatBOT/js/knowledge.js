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
        defaultReply: '申し訳ありません、うまく聞き取れませんでした。もう一度試していただけますか？',
        back_to_menu: 'メニューに戻る',
        continue_quiz: 'クイズを続ける',
        start_over_quiz: 'もう一度挑戦する',
        all_quizzes_done: 'この難易度のクイズはすべて完了しました！',
        // ★★★ 変更点: スコアに応じたメッセージを返す関数を追加 ★★★
        getQuizResultMessage: (score, total) => {
            const percentage = total > 0 ? (score / total) * 100 : 0;
            let resultText = `${total}問中、${score}問正解でした！\n`;
            if (percentage === 100) {
                resultText += "全問正解です！素晴らしい、完璧ですね！�";
            } else if (percentage >= 80) {
                resultText += "素晴らしい成績です！よくご存知ですね。";
            } else if (percentage >= 50) {
                resultText += "よくできました！この調子で頑張りましょう。";
            } else if (score > 0) {
                resultText += "お疲れ様でした。もう一度挑戦してみましょう！";
            } else { // score is 0
                resultText += "残念！次は頑張りましょう！";
            }
            return resultText;
        },
        lang_switched: '言語を日本語に切り替えました。',
        inquiry: {
            start: 'お問い合わせですね。承知いたしました。まず、お名前を教えていただけますか？（途中で「キャンセル」と入力すると中断できます）',
            prompt_email: 'ありがとうございます。次に、ご連絡先のメールアドレスをお願いします。ご入力いただいたアドレスに確認メールをお送りします。',
            prompt_message: '承知いたしました。最後にお問い合わせ内容をご記入ください。',
            complete: 'お問い合わせいただき、ありがとうございます。ご入力いただいたメールアドレスに確認のメールを送信しました。担当者より追ってご連絡いたします。',
            invalid_email: '申し訳ありませんが、メールアドレスの形式が正しくないようです。もう一度入力していただけますか？',
            send_error: '申し訳ありません、送信中にエラーが発生しました。時間をおいて再度お試しください。',
            cancelled: 'お問い合わせをキャンセルしました。',
            cancel_keywords: ['キャンセル', 'やめる'],
        }
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
        defaultReply: "I'm sorry, I didn't quite catch that. Could you please try again?",
        back_to_menu: 'Back to Menu',
        continue_quiz: 'Continue Quiz',
        start_over_quiz: 'Start Over',
        all_quizzes_done: 'You have completed all the quizzes for this difficulty! Excellent work.',
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
            } else { // score is 0
                resultText += "Don't worry, let's try again!";
            }
            return resultText;
        },
        lang_switched: 'Language switched to English.',
        inquiry: {
            start: 'Okay, you want to make an inquiry. First, could you please tell me your name? (You can type "cancel" to stop at any time)',
            prompt_email: 'Thank you. Next, please provide your email address. A confirmation email will be sent to this address.',
            prompt_message: 'Got it. Finally, please enter your message.',
            complete: 'Thank you for your inquiry. A confirmation email has been sent to your address. Our team will get back to you shortly.',
            invalid_email: "I'm sorry, but the email address format seems incorrect. Could you please enter it again?",
            send_error: 'Sorry, an error occurred while sending. Please try again later.',
            cancelled: 'The inquiry has been cancelled.',
            cancel_keywords: ['cancel', 'stop'],
        }
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
        defaultReply: '很抱歉，我没太听清楚。可以请您再说一遍吗？',
        back_to_menu: '返回菜单',
        continue_quiz: '继续测验',
        start_over_quiz: '重新开始',
        all_quizzes_done: '您已完成此难度的所有测验！非常棒。',
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
            } else { // score is 0
                resultText += "很遗憾！下次加油吧！";
            }
            return resultText;
        },
        lang_switched: '语言已切换至中文。',
        inquiry: {
            start: '好的，您想进行咨询。首先，请问您的名字是？（您可以随时输入“取消”来中断）',
            prompt_email: '谢谢。接下来，请输入您的电子邮件地址。我们将向此地址发送一封确认邮件。',
            prompt_message: '好的。最后，请输入您的咨询内容。',
            complete: '感谢您的咨询，我们已向您的邮箱发送了确认邮件。相关人员会尽快与您联系。',
            invalid_email: '抱歉，电子邮件地址的格式似乎不正确，可以请您再输入一次吗？',
            send_error: '抱歉，发送时发生错误，请稍后再试。',
            cancelled: '咨询已取消。',
            cancel_keywords: ['取消'],
        }
    }
};

// --- ナレッジベース (特殊機能とクイズデータ) ---
const specialFeatures = {
    ja: {
        'クイズ': { isQuiz: true },
        'お問い合わせ': { isInquiry: true }
    },
    en: {
        'quiz': { isQuiz: true },
        'contact': { isInquiry: true }
    },
    zh: {
        '测验': { isQuiz: true },
        '联系我们': { isInquiry: true }
    }
};

const quizData = {
    easy: [
        { question: { ja: '食事を始める前の挨拶は何ですか？', en: 'What do you say before starting a meal?', zh: '开始吃饭前应该说什么？' }, options: { ja: ['さようなら', 'いただきます', 'こんにちは'], en: ['Goodbye', 'Itadakimasu', 'Hello'], zh: ['再见', '我开动了', '你好'] }, correct: 1, explanation: { ja: '食事の前には、食材や作ってくれた人への感謝を込めて「いただきます」と言うのが日本の習慣です。', en: 'It is a Japanese custom to say "Itadakimasu" before meals to express gratitude for the food and those who prepared it.', zh: '在日本，饭前说“我开动了”是表示对食物和做饭人的感谢的习惯。' } },
        { question: { ja: '日本では、家に入るときに何をしますか？', en: 'What do you do when entering a Japanese home?', zh: '在日本，进屋时要做什么？' }, options: { ja: ['帽子をかぶる', '靴を脱ぐ', '歌をうたう'], en: ['Wear a hat', 'Take off shoes', 'Sing a song'], zh: ['戴帽子', '脱鞋', '唱歌'] }, correct: 1, explanation: { ja: '日本の家では、玄関で靴を脱いでから中に上がるのが基本的なマナーです。', en: 'It is basic manners to take off your shoes at the entrance before entering a Japanese house.', zh: '在日本的房子里，在玄关脱鞋再进去是基本礼仪。' } },
        { question: { ja: '人に会った時の昼間の挨拶は何ですか？', en: 'What is the daytime greeting when you meet someone?', zh: '白天见到人时的问候语是什么？' }, options: { ja: ['おやすみなさい', 'おはようございます', 'こんにちは'], en: ['Good night', 'Good morning', 'Hello'], zh: ['晚安', '早上好', '你好'] }, correct: 2, explanation: { ja: '昼間に使う最も一般的な挨拶は「こんにちは」です。', en: 'The most common greeting used during the daytime is "Konnichiwa".', zh: '白天最常用的问候语是“你好”。' } },
        { question: { ja: 'ゴミを道に捨てるのは良いことですか？', en: 'Is it okay to throw trash on the street?', zh: '把垃圾扔在路上是好事吗？' }, options: { ja: ['はい', 'いいえ', 'どちらでもない'], en: ['Yes', 'No', 'It depends'], zh: ['是', '不是', '都可以'] }, correct: 1, explanation: { ja: '公共の場所をきれいに保つため、ゴミは指定されたゴミ箱に捨てるか、持ち帰るのがマナーです。', en: 'To keep public spaces clean, it is mannerly to throw trash in designated bins or take it home with you.', zh: '为了保持公共场所的清洁，把垃圾扔到指定的垃圾箱或带回家是基本礼仪。' } },
        { question: { ja: '電車の中で大声で電話をするのはOKですか？', en: 'Is it okay to talk loudly on the phone on a train?', zh: '可以在电车里大声打电话吗？' }, options: { ja: ['はい', 'いいえ', '状況による'], en: ['Yes', 'No', 'It depends'], zh: ['可以', '不可以', '看情况'] }, correct: 1, explanation: { ja: '公共の交通機関では、他の乗客の迷惑にならないように静かにするのがマナーです。電話は通常控えます。', en: 'On public transportation, it is good manners to be quiet so as not to disturb other passengers. Phone calls are usually avoided.', zh: '在公共交通工具上，为了不打扰其他乘客，保持安静是基本礼仪。通常不打电话。' } },
        { question: { ja: 'レストランで店員を呼ぶとき、大きな声で叫びますか？', en: 'When calling a waiter in a restaurant, do you shout loudly?', zh: '在餐厅叫服务员时，应该大声喊叫吗？' }, options: { ja: ['はい、叫ぶのが普通', 'いいえ、手を挙げるかボタンを押す', '店員が来るまで待つ'], en: ['Yes, that\'s normal', 'No, raise your hand or press a button', 'Wait for them to come'], zh: ['是的，这是正常的', '不，应该举手或按按钮', '等着服务员过来'] }, correct: 1, explanation: { ja: '店員を呼ぶ際は、静かに手を挙げるか、テーブルにある呼び出しボタンを押すのが一般的です。', en: 'It is common to quietly raise your hand or press the call button on the table to call a waiter.', zh: '叫服务员时，通常是安静地举手或按桌上的呼叫按钮。' } },
        { question: { ja: 'エスカレーターに乗るとき、大阪ではどちら側に立ちますか？', en: 'In Osaka, which side do you stand on when riding an escalator?', zh: '在大阪乘坐自动扶梯时，应该站在哪一边？' }, options: { ja: ['左側', '右側', '真ん中'], en: ['Left side', 'Right side', 'Middle'], zh: ['左边', '右边', '中间'] }, correct: 1, explanation: { ja: '東京では左側に立つのが一般的ですが、大阪では右側に立ち、急ぐ人のために左側を空ける習慣があります。', en: 'While it\'s common to stand on the left in Tokyo, people in Osaka stand on the right, leaving the left side open for those in a hurry.', zh: '虽然在东京通常是靠左站，但在大阪的习惯是靠右站，把左边留给赶时间的人。' } },
        { question: { ja: '人から物を受け取るとき、片手で受け取っても良いですか？', en: 'Is it okay to receive something from someone with one hand?', zh: '从别人那里收东西时，可以用一只手接吗？' }, options: { ja: ['はい', 'いいえ、両手で受け取るのが丁寧', 'どちらでも良い'], en: ['Yes', 'No, it\'s polite to use both hands', 'It doesn\'t matter'], zh: ['可以', '不，用双手接更礼貌', '都可以'] }, correct: 1, explanation: { ja: '特に目上の人から物を受け取る際は、両手で受け取るのが敬意を示す丁寧な方法です。', en: 'Using both hands to receive items, especially from someone senior, is a polite way of showing respect.', zh: '用双手接收物品，特别是从长辈那里，是表示尊重的一种礼貌方式。' } },
        { question: { ja: 'くしゃみをする時、手で口を覆うだけで十分ですか？', en: 'When you sneeze, is it enough to cover your mouth with your hand?', zh: '打喷嚏时，只用手捂住嘴就够了吗？' }, options: { ja: ['はい、十分です', 'いいえ、マスクやハンカチを使うのが望ましい', '何もしなくても良い'], en: ['Yes, it is', 'No, using a mask or handkerchief is better', 'You don\'t need to do anything'], zh: ['是的，足够了', '不，最好使用口罩或手帕', '什么都不用做'] }, correct: 1, explanation: { ja: '飛沫を飛ばさないために、手だけでなく、マスク、ハンカチ、または腕の内側で口と鼻を覆うのが良いマナーです。', en: 'To prevent spreading droplets, it is good manners to cover your mouth and nose with a mask, handkerchief, or the inside of your elbow.', zh: '为了防止飞沫传播，用口罩、手帕或手臂内侧遮住口鼻是更好的礼仪。' } },
        { question: { ja: 'お風呂に入る前には何をしますか？', en: 'What do you do before getting into a bathtub?', zh: '进入浴池前应该做什么？' }, options: { ja: ['そのまま浴槽に入る', '体を洗う、または「かけ湯」をする', '準備運動をする'], en: ['Get in the tub directly', 'Wash your body or do "kake-yu"', 'Do warm-up exercises'], zh: ['直接进入浴池', '先洗身体或“冲汤”', '做准备活动'] }, correct: 1, explanation: { ja: '浴槽のお湯を汚さないように、入る前に体の汚れを洗い流すか、お湯を体にかける「かけ湯」をするのがマナーです。', en: 'It is a manner to wash your body or pour hot water on yourself ("kake-yu") before entering the bathtub to keep the bathwater clean.', zh: '为了保持浴池水的清洁，进入前先冲洗身体或用热水浇身（“冲汤”）是基本礼仪。' } },
        { question: { ja: '映画館で上映中にスマートフォンを見るのは良いですか？', en: 'Is it okay to look at your smartphone during a movie in a cinema?', zh: '在电影院放映期间看手机可以吗？' }, options: { ja: ['はい、音を消せばOK', 'いいえ、画面の光が迷惑になる', '緊急時のみOK'], en: ['Yes, if it\'s silent', 'No, the screen light is distracting', 'Only in an emergency'], zh: ['可以，只要静音就行', '不，屏幕的光会打扰别人', '只有紧急情况可以'] }, correct: 1, explanation: { ja: '音を消していても、スマートフォンの明るい画面は周りの人の鑑賞の妨げになるため、使用は控えるべきです。', en: 'Even on silent, the bright screen of a smartphone can disturb others\' viewing experience and should be avoided.', zh: '即使静音，智能手机的亮屏也会干扰他人的观影体验，应该避免使用。' } },
        { question: { ja: '日本では、お辞儀はどのような意味を持ちますか？', en: 'In Japan, what does bowing signify?', zh: '在日本，鞠躬代表什么意思？' }, options: { ja: ['謝罪のみ', '挨拶、感謝、敬意など様々', '挨拶のみ'], en: ['Only apology', 'Greetings, thanks, respect, etc.', 'Only greetings'], zh: ['只表示道歉', '问候、感谢、尊敬等多种含义', '只表示问候'] }, correct: 1, explanation: { ja: 'お辞儀は「こんにちは」という挨拶だけでなく、感謝や謝罪、敬意を示すなど、様々な場面で使われる重要なコミュニケーションです。', en: 'Bowing is an important form of communication used in various situations, not just for greetings, but also to express gratitude, apology, and respect.', zh: '鞠躬不仅是问候，也是一种重要的交流方式，用于表达感谢、歉意和尊敬等多种情感。' } },
        { question: { ja: '割り箸を割った後、箸をこすり合わせるのは良いマナーですか？', en: 'After splitting disposable chopsticks, is it good manners to rub them together?', zh: '掰开一次性筷子后，互相摩擦筷子是好习惯吗？' }, options: { ja: ['はい、木くずを取るために必要', 'いいえ、あまり品が良くないとされる', 'どちらでもない'], en: ['Yes, to remove splinters', 'No, it\'s considered unrefined', 'It doesn\'t matter'], zh: ['是的，为了去除木屑', '不，被认为不太雅观', '都可以'] }, correct: 1, explanation: { ja: '箸をこすり合わせる行為は、その箸が安物だと示しているようで、お店に対して失礼と見なされることがあります。', en: 'Rubbing chopsticks together can imply that they are cheap, which may be seen as disrespectful to the establishment.', zh: '摩擦筷子的行为可能暗示筷子很廉价，这可能被视为对店家不敬。' } },
        { question: { ja: '日本ではチップ（心付け）の習慣はありますか？', en: 'Is there a tipping custom in Japan?', zh: '日本有给小费的习惯吗？' }, options: { ja: ['はい、常に必要', 'いいえ、基本的に不要', '高級な場所でのみ必要'], en: ['Yes, always required', 'No, basically unnecessary', 'Only in high-end places'], zh: ['有，总是需要', '没有，基本上不需要', '只在高级场所需要'] }, correct: 1, explanation: { ja: '日本ではサービス料が料金に含まれているため、ホテルやレストラン、タクシーなどでチップを渡す習慣は基本的にありません。', en: 'In Japan, a service charge is usually included in the bill, so there is no custom of tipping at hotels, restaurants, or in taxis.', zh: '在日本，服务费通常已包含在账单里，所以在酒店、餐厅或出租车上基本没有给小费的习惯。' } },
        { question: { ja: '公共の場で鼻をかむのはOKですか？', en: 'Is it okay to blow your nose in public?', zh: '在公共场合擤鼻涕可以吗？' }, options: { ja: ['はい、問題ない', 'いいえ、人前では音を立てずに静かに', 'トイレなど人目につかない場所で行うのが望ましい'], en: ['Yes, no problem', 'No, do it quietly without making noise', 'It\'s better to do it in private, like a restroom'], zh: ['可以，没问题', '不，应该安静地进行', '最好在洗手间等私密场所进行'] }, correct: 2, explanation: { ja: '人前で大きな音を立てて鼻をかむのは、不快に思う人もいます。できるだけ人目につかない場所で行うのが無難です。', en: 'Blowing your nose loudly in public can be considered unpleasant by some people. It is best to do so in a more private setting if possible.', zh: '在公共场合大声擤鼻涕可能会让一些人感到不舒服，最好在不引人注目的地方进行。' } }
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
        { question: { ja: '贈り物に「４」や「９」の数を含む品物を避けるのはなぜですか？', en: 'Why are gifts with "4" or "9" items often avoided?', zh: '为什么送礼物时常避免包含“4”或“9”个物品？' }, options: { ja: ['縁起が悪い数字だから', '高価すぎるから', '数が足りないから'], en: ['Because it\'s an unlucky number', 'Because it\'s too expensive', 'Because there are not enough'], zh: ['因为是不吉利的数字', '因为太贵了', '因为数量不够'] }, correct: 0, explanation: { ja: '数字の「４」は「死」、「９」は「苦」を連想させるため、お祝い事などの贈り物ではこれらの数に関連する品物は避ける習慣があります。', en: 'The number "4" sounds like "shi" (death) and "9" sounds like "ku" (suffering), so it is customary to avoid these numbers in gifts for celebrations.', zh: '数字“4”的发音像“死”，“9”的发音像“苦”，所以在庆祝等场合的礼物中，习惯上会避免这些数字。' } }
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
        { question: { ja: 'お祝いの席で、使ってはいけない「忌み言葉」の例はどれですか？', en: 'What is an example of an "imi-kotoba" (taboo word) that should be avoided at a celebration?', zh: '在庆祝场合，应避免使用的“忌讳词”是哪个例子？' }, options: { ja: ['「終わる」「切れる」', '「始まる」「続く」', '「嬉しい」「楽しい」'], en: ['"End," "Cut"', '"Begin," "Continue"', '"Happy," "Joyful"'], zh: ['“结束”、“切断”', '“开始”、“继续”', '“高兴”、“快乐”'] }, correct: 0, explanation: { ja: '結婚式などのお祝いの場では、「終わる」「切れる」「離れる」「戻る」といった、別れや不幸を連想させる「忌み言葉」を使うのはタブーとされています。', en: 'At celebrations like weddings, it is taboo to use words that suggest separation or misfortune, such as "to end," "to cut," "to leave," or "to return".', zh: '在婚礼等庆祝活动中，使用暗示分离或不幸的词语，如“结束”、“切断”、“离开”、“返回”等，是禁忌。' } }
    ]
};