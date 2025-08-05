// ゲーム状態管理
class GameState {
    constructor() {
        this.currentScene = 0;
        this.currentLine = 0;
        this.playerChoices = [];
        this.gameFlags = {
            morality: 0, // 良心値
            visitedScenes: [],
            savedMina: false,
            trustedShadow: false
        };
        this.isTyping = false;
        this.saveData = {};
    }

    // セーブ機能
    save() {
        const saveData = {
            currentScene: this.currentScene,
            currentLine: this.currentLine,
            playerChoices: this.playerChoices,
            gameFlags: this.gameFlags,
            timestamp: new Date().toISOString()
        };
        localStorage.setItem('demonCastleSave', JSON.stringify(saveData));
        alert('ゲームをセーブしました！');
    }

    // ロード機能
    load() {
        const saveData = localStorage.getItem('demonCastleSave');
        if (saveData) {
            const data = JSON.parse(saveData);
            this.currentScene = data.currentScene;
            this.currentLine = data.currentLine;
            this.playerChoices = data.playerChoices;
            this.gameFlags = data.gameFlags;
            game.loadScene(this.currentScene);
            alert('ゲームをロードしました！');
        } else {
            alert('セーブデータが見つかりません。');
        }
    }
}

// ゲームシナリオデータ
const gameScenarios = {
    0: { // オープニング
        background: "cottage",
        character: "sera",
        speaker: "セラ",
        lines: [
            "息子のアルが病に倒れて、もう三日になる...",
            "村の薬師は首を振るばかり。",
            "「魔王城に伝説の薬草がある」そんな噂を聞いた。",
            "危険を承知で、私は魔王城へ向かうことにした。"
        ],
        choices: [
            { text: "すぐに出発する", next: 1, morality: 1 },
            { text: "準備を整えてから", next: 2, morality: 0 },
            { text: "他の方法を探す", next: 3, morality: -1 }
        ]
    },
    1: { // 急いで出発
        background: "forest",
        character: "sera",
        speaker: "セラ",
        lines: [
            "夜の森は静寂に包まれている。",
            "月明かりが木々の間から差し込んで、不気味な影を作っている。",
            "急がなければ...アルが...",
            "その時、前方に巨大な城の影が見えてきた。"
        ],
        choices: [
            { text: "正面から堂々と入る", next: 4, morality: 1 },
            { text: "裏口を探す", next: 5, morality: 0 },
            { text: "様子を見る", next: 6, morality: -1 }
        ]
    },
    2: { // 準備してから出発
        background: "cottage",
        character: "sera",
        speaker: "セラ",
        lines: [
            "武器と食料を準備した。",
            "アルの枕元で手を握る。熱い...",
            "「お母さん、必ず帰ってくるよ」",
            "そう約束して、私は家を後にした。"
        ],
        choices: [
            { text: "森の小道を通る", next: 7, morality: 0 },
            { text: "街道を行く", next: 8, morality: 1 }
        ]
    },
    3: { // 他の方法を探す
        background: "cottage",
        character: "sera",
        speaker: "セラ",
        lines: [
            "村中を駆け回り、薬師や神父に助けを求めた。",
            "だが誰もアルを救う術を知らなかった。",
            "時間だけが無情に過ぎていく。",
            "私は覚悟を決めるしかない。"
        ],
        choices: [
            { text: "魔王城へ向かう", next: 2, morality: 0 },
            { text: "アルのそばに残る", next: 24, morality: -2 }
        ]
    },
    7: { // 森の小道
        background: "forest",
        character: "sera",
        speaker: "セラ",
        lines: [
            "森は静まり返り、遠くでフクロウの声が聞こえる。",
            "ふと足元で倒れた鹿を見つけた。",
            "息も絶え絶えのその目が、助けを求めている。",
            "時間はないけれど、見捨てるわけにはいかない。"
        ],
        choices: [
            { text: "鹿を介抱する", next: 15, morality: 1 },
            { text: "城へ急ぐ", next: 4, morality: 0 }
        ]
    },
    8: { // 街道
        background: "forest",
        character: "sera",
        speaker: "セラ",
        lines: [
            "街道は月光に照らされ、まっすぐ城へと伸びている。",
            "静かな夜風が、心細さを少しだけ和らげた。",
            "やがて遠くに魔王城の塔が見えてきた。"
        ],
        choices: [
            { text: "正面から堂々と入る", next: 4, morality: 1 }
        ]
    },
    4: { // 正面突破
        background: "castle_gate",
        character: "sera",
        speaker: "セラ",
        lines: [
            "魔王城の門は既に開いていた.",
            "まるで私を待っていたかのように...",
            "足音が石畳に響く。",
            "城内は薄暗く、どこからともなく視線を感じる。"
        ],
        choices: [
            { text: "大広間へ向かう", next: 9, morality: 1 },
            { text: "地下へ降りる", next: 10, morality: 0 }
        ]
    },
    9: { // 大広間
        background: "throne_room",
        character: "shadow",
        speaker: "影",
        lines: [
            "よく来たな、セラ...",
            "君の息子のことは知っている。",
            "薬草は確かにここにある。",
            "だが、それを得るには...代償が必要だ。"
        ],
        choices: [
            { text: "何でも払う", next: 11, morality: -1 },
            { text: "条件を聞く", next: 12, morality: 0 },
            { text: "拒否する", next: 13, morality: 1 }
        ]
    },
    11: { // 代償を受け入れる
        background: "altar",
        character: "shadow",
        speaker: "影",
        lines: [
            "そうか...では取引成立だ。",
            "薬草と引き換えに、君の記憶をもらおう。",
            "息子との思い出を...すべて。",
            "それでもいいのか？"
        ],
        choices: [
            { text: "受け入れる", next: 14, morality: -2 },
            { text: "やっぱり断る", next: 13, morality: 1 }
        ]
    },
    13: { // バッドエンド1: 取引を拒否
        background: "cottage",
        character: "sera",
        speaker: "セラ",
        lines: [
            "私は影の取引を拒んだ。",
            "薬草は手に入らなかった。",
            "家に戻ると、アルの体は冷たくなっていた。",
            "私の選択が、すべてを終わらせた。"
        ],
        isEnding: true,
        endingType: "bad",
    },
    14: { // バッドエンド2
        background: "cottage",
        character: "sera",
        speaker: "セラ",
        lines: [
            "私は家に帰った。",
            "手には確かに薬草が握られている。",
            "でも...なぜここにいるのか思い出せない。",
            "ベッドに寝ている少年は...誰だっけ？"
        ],
        isEnding: true,
        endingType: "bad"
    },
    15: { // 森の恩恵
        background: "forest",
        character: "sera",
        speaker: "セラ",
        lines: [
            "私は鹿の傷に手持ちの薬草を巻いた。",
            "すると森の奥から柔らかな光が現れた。",
            "『勇敢な者よ、感謝する』と声が響く。",
            "光は城への近道を照らし出した。"
        ],
        choices: [
            { text: "光の導きに従う", next: 4, morality: 0 }
        ]
    },
    12: { // 条件を聞く
        background: "mina",
        character: "mina",
        speaker: "ミーナ",
        lines: [
            "お母さん...？",
            "私よ、ミーナよ...",
            "昔、この城で殺された少女の霊。",
            "私を成仏させてくれるなら、薬草をあげる。"
        ],
        choices: [
            { text: "成仏させてあげる", next: 16, morality: 2 },
            { text: "本当にミーナなの？", next: 17, morality: 0 }
        ]
    },
    16: { // トゥルーエンド
        background: "mina_spirit",
        character: "sera",
        speaker: "セラ",
        lines: [
            "ミーナの魂は光に包まれて消えていった。",
            "残された薬草を手に、私は家路についた。",
            "アルは薬を飲んで、すぐに回復した。",
            "母と子の絆が、すべてを救ったのだ。"
        ],
        isEnding: true,
        endingType: "true"
    },
    17: { // 疑いを持つ
        background: "altar",
        character: "shadow",
        speaker: "影",
        lines: [
            "フフフ...鋭いな。",
            "そう、私は影。この城の主だ。",
            "ミーナは確かに存在した。だが今は...",
            "君はどちらを選ぶ？真実か、幻想か。"
        ],
        choices: [
            { text: "真実を求める", next: 18, morality: 1 },
            { text: "幻想でもいい", next: 19, morality: -1 }
        ]
    },
    18: { // 真実ルート
        background: "memory_maze",
        character: "sera",
        speaker: "セラ",
        lines: [
            "記憶の迷宮に足を踏み入れた。",
            "壁には無数の目が浮かんでいる。",
            "これは...私の過去の記憶？",
            "そうだ、私もかつてここで...何かを失った。"
        ],
        choices: [
            { text: "記憶を辿る", next: 20, morality: 1 },
            { text: "立ち去る", next: 21, morality: 0 }
        ]
    },
    20: { // 記憶の真実
        background: "memory_maze",
        character: "sera",
        speaker: "セラ",
        lines: [
            "思い出した...私は昔、娘を失った。",
            "ミーナ...それは私の娘の名前だった。",
            "この城で事故で...私が守れなかった。",
            "アルは二番目の子。同じ過ちは繰り返さない。"
        ],
        choices: [
            { text: "娘を許す", next: 22, morality: 2 },
            { text: "自分を許す", next: 23, morality: 1 }
        ]
    },
      22: { // 真の救済エンド
          background: "light",
          character: "mina",
          speaker: "本物のミーナ",
          lines: [
              "お母さん...ありがとう。",
              "私はもう大丈夫。弟を守って。",
              "これは私からの最後の贈り物。",
              "愛は時を超えて、すべてを癒すのね。"
          ],
          isEnding: true,
            endingType: "perfect"
        },
    5: { // 裏口ルート
        background: "castle_gate",
        character: "sera",
        speaker: "セラ",
        lines: [
            "城の裏手に回り込んだ。",
            "古い扉が半開きになっている。",
            "誰かが通った形跡がある...",
            "静かに中に入ろう。"
        ],
        choices: [
            { text: "慎重に進む", next: 9, morality: 0 },
            { text: "急いで進む", next: 4, morality: -1 }
        ]
    },
    6: { // 様子見ルート
        background: "forest",
        character: "sera",
        speaker: "セラ",
        lines: [
            "茂みに隠れて城の様子を窺った。",
            "城からは不気味な光が漏れている。",
            "でも時間が経つほど、アルが...",
            "もう躊躇している場合ではない。"
        ],
        choices: [
            { text: "正面から入る", next: 4, morality: 0 },
            { text: "裏口を探す", next: 5, morality: 1 }
        ]
    },
    10: { // 地下ルート
        background: "dungeon",
        character: "sera",
        speaker: "セラ",
        lines: [
            "地下は湿っぽく、鎖の音が響いている。",
            "牢屋がいくつも並んでいる。",
            "その奥で、小さな影が動いた。",
            "「助けて...」か細い声が聞こえる。"
        ],
        choices: [
            { text: "声の主を助ける", next: 12, morality: 2 },
            { text: "薬草を探しに行く", next: 9, morality: -1 }
        ]
    },
    19: { // 幻想を受け入れる
        background: "altar",
        character: "shadow",
        speaker: "影",
        lines: [
            "賢い選択だ...真実など苦痛でしかない。",
            "この美しい幻想の中で生きればいい。",
            "薬草をやろう。息子は救える。",
            "だが君は...永遠にここに留まるのだ。"
        ],
        choices: [
            { text: "受け入れる", next: 14, morality: -2 },
            { text: "やっぱり断る", next: 18, morality: 1 }
        ]
    },
    21: { // 記憶から立ち去る
        background: "castle_gate",
        character: "sera",
        speaker: "セラ",
        lines: [
            "過去を振り返るのはやめよう。",
            "今は息子を救うことだけを考えなければ。",
            "城を出て、別の方法を探そう。",
            "でも...本当にそれでいいのだろうか？"
        ],
        choices: [
            { text: "村に戻る", next: 24, morality: -1 },
            { text: "もう一度城に入る", next: 9, morality: 0 }
        ]
    },
    23: { // 自分を許すルート
        background: "memory_maze",
        character: "sera",
        speaker: "セラ",
        lines: [
            "そうだ...私も人間。完璧ではない。",
            "ミーナを失ったのは事故だった。",
            "今度こそ、アルを守り抜こう。",
            "薬草は...そこにある。"
        ],
        choices: [
            { text: "薬草を取る", next: 16, morality: 1 }
        ]
    },
      24: { // バッドエンド3: 諦め
        background: "cottage",
        character: "sera",
        speaker: "セラ",
        lines: [
            "私はアルのそばに残った。",
            "薬草を求める時間はもう残されていない。",
            "彼の体温は静かに失われていった。",
            "私の祈りは届かなかった。"
        ],
        isEnding: true,
        endingType: "bad"
    }
  };

// ゲームクラス
class DemonCastleGame {
    constructor() {
        this.state = new GameState();
        this.currentScenario = null;
        this.textSpeed = 50; // ミリ秒
        this.isAutoMode = false;

        // BGM プレイヤー設定
        this.bgmPlayer = new Audio();
        this.bgmPlayer.loop = true;
        this.currentBGM = '';
        this.isMuted = false;
        this.volumeOnIcon = `<svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true"><path d="M3 10v4h4l5 5V5L7 10H3z" fill="currentColor"/><path d="M16 7a5 5 0 010 10" stroke="currentColor" stroke-width="2" fill="none"/></svg>`;
        this.volumeOffIcon = `<svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true"><path d="M3 10v4h4l5 5V5L7 10H3z" fill="currentColor"/><path d="M16 7l5 5-5 5M21 7l-5 5 5 5" stroke="currentColor" stroke-width="2" fill="none"/></svg>`;

        this.initializeElements();
        this.bindEvents();
        this.showTitleScreen();
    }

    initializeElements() {
        // 画面要素
        this.titleScreen = document.getElementById('titleScreen');
        this.gameScreen = document.getElementById('gameScreen');
        this.menuScreen = document.getElementById('menuScreen');
        
        // ゲーム要素
        this.gameBackground = document.getElementById('gameBackground');
        this.textWindow = document.getElementById('textWindow');
        this.speakerName = document.getElementById('speakerName');
        this.gameText = document.getElementById('gameText');
        this.nextButton = document.getElementById('nextButton');
        this.choicesContainer = document.getElementById('choicesContainer');
        
        // ボタン
        this.startBtn = document.getElementById('startBtn');
        this.menuBtn = document.getElementById('menuBtn');
        this.saveBtn = document.getElementById('saveBtn');
        this.musicBtn = document.getElementById('musicBtn');
        this.resumeBtn = document.getElementById('resumeBtn');
        this.saveGameBtn = document.getElementById('saveGameBtn');
        this.loadGameBtn = document.getElementById('loadGameBtn');
        this.titleBtn = document.getElementById('titleBtn');

        if (this.musicBtn) {
            this.musicBtn.innerHTML = this.volumeOnIcon;
        }
    }

    bindEvents() {
        // タイトル画面
        this.startBtn.addEventListener('click', () => this.startGame());
        
        // ゲーム操作
        this.nextButton.addEventListener('click', () => this.nextLine());
        this.menuBtn.addEventListener('click', () => this.showMenu());
        this.saveBtn.addEventListener('click', () => this.quickSave());
        if (this.musicBtn) {
            this.musicBtn.addEventListener('click', () => this.toggleMusic());
        }
        
        // メニュー
        this.resumeBtn.addEventListener('click', () => this.hideMenu());
        this.saveGameBtn.addEventListener('click', () => this.saveGame());
        this.loadGameBtn.addEventListener('click', () => this.loadGame());
        this.titleBtn.addEventListener('click', () => this.returnToTitle());
        
        // キーボード操作
        document.addEventListener('keydown', (e) => this.handleKeyboard(e));
        
        // 選択肢クリック
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('choice-item')) {
                this.selectChoice(parseInt(e.target.dataset.choice));
            }
        });

        // タッチ操作対応
        this.gameText.addEventListener('touchend', () => this.nextLine());
    }

    handleKeyboard(e) {
        switch(e.key) {
            case ' ':
            case 'Enter':
                e.preventDefault();
                if (!this.choicesContainer.classList.contains('hidden')) return;
                this.nextLine();
                break;
            case 'Escape':
                this.showMenu();
                break;
            case 's':
            case 'S':
                if (e.ctrlKey) {
                    e.preventDefault();
                    this.quickSave();
                }
                break;
        }
    }

    showTitleScreen() {
        this.hideAllScreens();
        this.titleScreen.classList.add('active');
        this.playBGM('title');
    }

    startGame() {
        this.hideAllScreens();
        this.gameScreen.classList.add('active');
        this.state.currentScene = 0;
        this.state.currentLine = 0;
        this.loadScene(0);
        this.playBGM('game');
    }

    hideAllScreens() {
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.remove('active');
        });
    }

    loadScene(sceneId) {
        this.currentScenario = gameScenarios[sceneId];
        if (!this.currentScenario) {
            console.error('Scene not found:', sceneId);
            return;
        }
        
        this.state.currentScene = sceneId;
        this.state.currentLine = 0;
        
        // 背景を更新
        this.updateBackground(this.currentScenario.background);
        
        // 話者名を更新
        this.speakerName.textContent = this.currentScenario.speaker;
        
        // 選択肢を非表示
        this.choicesContainer.classList.add('hidden');
        
        // 最初のセリフを表示
        this.displayLine();
        
        // 訪問済みシーンに追加
        if (!this.state.gameFlags.visitedScenes.includes(sceneId)) {
            this.state.gameFlags.visitedScenes.push(sceneId);
        }
    }

    updateBackground(backgroundType) {
        const svg = this.gameBackground.querySelector('.scene-bg');
        const rect = svg.querySelector('#backgroundColor');
        const img = svg.querySelector('#backgroundImage');

        // デフォルトでは画像を非表示
        img.style.display = 'none';
        img.removeAttribute('href');

        switch(backgroundType) {
            case 'cottage':
                img.setAttribute('href', './images/sick.png');
                img.style.display = 'block';
                rect.setAttribute('fill', '#2d1f0f');
                break;
            case 'forest':
                img.setAttribute('href', './images/forest.png');
                img.style.display = 'block';
                rect.setAttribute('fill', '#0f2d0f');
                break;
            case 'castle_gate':
                img.setAttribute('href', './images/palece.png');
                img.style.display = 'block';
                rect.setAttribute('fill', '#2d1b3d');
                break;
            case 'throne_room':
                img.setAttribute('href', './images/maou.png');
                img.style.display = 'block';
                rect.setAttribute('fill', '#1a0033');
                break;
            case 'dungeon':
                img.setAttribute('href', './images/rouya.png');
                img.style.display = 'block';
                rect.setAttribute('fill', '#0a0a0a');
                break;
            case 'mina':
                img.setAttribute('href', './images/mina.png');
                img.style.display = 'block';
                rect.setAttribute('fill', '#330011');
                break;
            case 'mina_spirit':
                img.setAttribute('href', './images/minatenn.png');
                img.style.display = 'block';
                rect.setAttribute('fill', '#ff6b4a');
                break;
            case 'altar':
                rect.setAttribute('fill', '#330011');
                break;
            case 'memory_maze':
                rect.setAttribute('fill', '#1a1a2e');
                break;
            case 'sunrise':
                rect.setAttribute('fill', '#ff6b4a');
                break;
            case 'light':
                rect.setAttribute('fill', '#ffffff');
                break;
            default:
                rect.setAttribute('fill', '#2d1b3d');
        }
    }

    displayLine() {
        if (!this.currentScenario || this.state.isTyping) return;
        
        const lines = this.currentScenario.lines;
        const currentLine = lines[this.state.currentLine];
        
        if (!currentLine) {
            this.showChoices();
            return;
        }
        
        this.state.isTyping = true;
        this.gameText.textContent = '';
        
        // タイプライター効果
        this.typeLine(currentLine, 0);
    }

    typeLine(text, index) {
        if (index < text.length) {
            this.gameText.textContent += text[index];
            setTimeout(() => this.typeLine(text, index + 1), this.textSpeed);
        } else {
            this.state.isTyping = false;
        }
    }

    nextLine() {
        if (this.state.isTyping) {
            // タイピング中なら即座に完了
            this.state.isTyping = false;
            this.gameText.textContent = this.currentScenario.lines[this.state.currentLine];
            return;
        }
        
        this.state.currentLine++;
        this.displayLine();
    }

    showChoices() {
        if (!this.currentScenario.choices) {
            // エンディングチェック
            if (this.currentScenario.isEnding) {
                this.showEnding(this.currentScenario.endingType);
                return;
            }
            return;
        }
        
        const choicesWrapper = this.choicesContainer.querySelector('.choices-wrapper');
        choicesWrapper.innerHTML = '';
        
        this.currentScenario.choices.forEach((choice, index) => {
            const choiceElement = document.createElement('div');
            choiceElement.className = 'choice-item choice-appear';
            choiceElement.textContent = choice.text;
            choiceElement.dataset.choice = index;
            choiceElement.style.animationDelay = `${index * 0.1}s`;
            choicesWrapper.appendChild(choiceElement);
        });
        
        this.choicesContainer.classList.remove('hidden');
        this.playSE('choice_appear');
    }

    selectChoice(choiceIndex) {
        const choice = this.currentScenario.choices[choiceIndex];
        if (!choice) return;
        
        // 選択を記録
        this.state.playerChoices.push({
            scene: this.state.currentScene,
            choice: choiceIndex,
            text: choice.text
        });
        
        // 道徳値を更新
        this.state.gameFlags.morality += choice.morality || 0;
        
        // 効果音
        this.playSE('choice_select');
        
        // 次のシーンへ
        setTimeout(() => {
            this.loadScene(choice.next);
        }, 500);
    }

    showEnding(endingType) {
        let endingMessage = '';
        
        switch(endingType) {
            case 'bad':
                endingMessage = 'バッドエンド：記憶を失った母';
                break;
            case 'true':
                endingMessage = 'トゥルーエンド：愛の勝利';
                break;
            case 'perfect':
                endingMessage = 'パーフェクトエンド：真の救済';
                break;
        }
        
        setTimeout(() => {
            alert(`${endingMessage}\n\nゲームクリア！\n道徳値: ${this.state.gameFlags.morality}`);
            this.returnToTitle();
        }, 2000);
    }

    showMenu() {
        this.menuScreen.classList.remove('hidden');
        this.menuScreen.classList.add('active');
    }

    hideMenu() {
        this.menuScreen.classList.remove('active');
        this.menuScreen.classList.add('hidden');
    }

    quickSave() {
        this.state.save();
    }

    saveGame() {
        this.state.save();
        this.hideMenu();
    }

    loadGame() {
        this.state.load();
        this.hideMenu();
    }

    returnToTitle() {
        this.hideMenu();
        this.showTitleScreen();
        this.state = new GameState(); // リセット
    }

    // サウンド関連
    playBGM(bgmType) {
        const bgmMap = {
            title: './audio/Dust_city.mp3',
            game: './audio/Songs_of_the_Soulless.mp3'
        };

        const src = bgmMap[bgmType];
        if (!src) return;

        if (this.currentBGM === src) return;

        try {
            this.bgmPlayer.pause();
            this.bgmPlayer.src = src;
            this.bgmPlayer.muted = this.isMuted;
            this.bgmPlayer.play().catch(err => console.error('BGM play failed:', err));
            this.currentBGM = src;
        } catch (e) {
            console.error('BGM error:', e);
        }
    }

    toggleMusic() {
        this.isMuted = !this.isMuted;
        this.bgmPlayer.muted = this.isMuted;
        if (this.musicBtn) {
            this.musicBtn.innerHTML = this.isMuted ? this.volumeOffIcon : this.volumeOnIcon;
        }
    }

    playSE(seType) {
        console.log(`Playing SE: ${seType}`);
        // 実際の実装では効果音を再生
    }
}

// ゲーム初期化
let game;

function initGame() {
    game = new DemonCastleGame();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initGame);
} else {
    initGame();
}

// サービスワーカー登録（PWA対応の準備）
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('./sw.js')
            .then(() => console.log('SW registered'))
            .catch(() => console.log('SW registration failed'));
    });
}
