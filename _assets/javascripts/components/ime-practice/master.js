var AppBox = React.createClass({
  getInitialState: function() {
    return {
      sentences: [],
      activeSentence: {
        "id": null,
        "bun": '',
        "kana": '',
        "eng": ''
      },
      activeSentenceCharacterGroups: [],
      activeCharacterGroup: {},
      currentSentencePosition: 0,
      isInputIncorrect: false
    };
  },
  componentDidMount: function() {
    $.ajax({
      url: this.props.url,
      dataType: 'json',
      cache: false,
      success: function(data) {
        // Below is placeholder data until the kana tables are complete (can't process katakana and some missing hiragana groups)
        var placeholder = [
          {
            "id": 75,
            "bun": "今日は、胃腸の調子が悪いです。",
            "kana": "きょうは、いちょうのちょうしがわるいです。",
            "eng": "My stomach is upset today."
          },
          {
            "id": 13,
            "bun": "私は、妻のことをもう好きじゃないのかもしれない。",
            "kana": "わたしは、つまのことをもうすきじゃないのかもしれない。",
            "eng": "I may not love my wife anymore."
          },
          {
            "id": 16,
            "bun": "髪を茶色くするつもりです。",
            "kana": "かみをちゃいろくするつもりです。",
            "eng": "I'm thinking of making my hair color brown."
          },
          {
            "id": 20,
            "bun": "赤ちゃんは、今にも眠りそうです。",
            "kana": "あかちゃんは、いまにもねむりそうです。",
            "eng": "The baby looks jsut about to fell asleep."
          },
          {
            "id": 21,
            "bun": "あなたの宿題を手伝いたいんです。",
            "kana": "あなたのしゅくだいをてつだいたいんです。",
            "eng": "I want to help your homework."
          },
          {
            "id": 28,
            "bun": "彼はハンサムだし、頭もいい。",
            "kana": "かれははんさむだし、あたまもいい。",
            "eng": "He is handsome and smart."
          }
        ]
        this.setState({sentences: placeholder});
        // this.setState({sentences: data});
        this.setActiveSentence();
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  handleInputCheck: function(input) {
    var correctInputs = this.state.activeCharacterGroup.romajis;
    var correctInputsSet = new Set(correctInputs);

    // Check if the user input completely matches with the current character group acceptable romaji
    if (correctInputsSet.has(input)) {
      return this.handleInputComplete();
    }

    // Continue if user input does not complete match current character group of accetable romaji

    // If the user input doesn't completely match, check if it is a substring match
    // If not, send an incorrect input flag
    var correctInputsSubstrings = correctInputs.map(function(romaji) {
      return romaji.substring(0, input.length);
    });
    var correctInputsSubstringsSet = new Set(correctInputsSubstrings);
    var isInputIncorrect;

    if (correctInputsSubstringsSet.has(input)) {
      isInputIncorrect = false;
    } else {
      isInputIncorrect = true;
    }
    this.setState({isInputIncorrect: isInputIncorrect});

    return { inputComplete: false };
  },
  handleInputComplete: function() {
    var newPosition = this.state.currentSentencePosition + 1;
    var isSentenceComplete = false;

    if (this.state.activeSentenceCharacterGroups.length < newPosition + 1) {
      isSentenceComplete = true;
    } else {
      this.setActiveCharacterGroup(newPosition, this.state.activeSentenceCharacterGroups);
    }
    return { inputComplete: true, sentenceComplete: isSentenceComplete };
  },
  handleSentenceComplete: function() {
    // Set new, random active sentence
    this.setActiveSentence();
  },
  kanaToRomaji: function(kana) {
    // add katakana equivalent
    var kanaTable = {
      あ: ['a'],
      い: ['i'],
      う: ['u'],
      え: ['e'],
      お: ['o'],
      ゔぁ: ['va'],
      ゔぃ: ['vi'],
      ゔ: ['vu'],
      ゔぇ: ['ve'],
      ゔぉ: ['vo'],
      か: ['ka'],
      き: ['ki'],
      きゃ: ['kya'],
      きぃ: ['kyi'],
      きゅ: ['kyu'],
      く: ['ku'],
      け: ['ke'],
      こ: ['ko'],
      が: ['ga'],
      ぎ: ['gi'],
      ぐ: ['gu'],
      げ: ['ge'],
      ご: ['go'],
      ぎゃ: ['gya'],
      ぎぃ: ['gyi'],
      ぎゅ: ['gyu'],
      ぎぇ: ['gye'],
      ぎょ: ['gyo'],
      さ: ['sa'],
      す: ['su'],
      せ: ['se'],
      そ: ['so'],
      ざ: ['za'],
      ず: ['zu'],
      ぜ: ['ze'],
      ぞ: ['zo'],
      し: ['shi', 'si'],
      しゃ: ['sha'],
      しゅ: ['shu'],
      しょ: ['sho'],
      じ: ['ji'],
      じゃ: ['ja', 'jya'],
      じゅ: ['ju', 'jyu'],
      じょ: ['jo', 'jyo'],
      た: ['ta'],
      ち: ['chi'],
      ちゃ: ['cha'],
      ちゅ: ['chu'],
      ちょ: ['cho'],
      つ: ['tsu'],
      て: ['te'],
      と: ['to'],
      だ: ['da'],
      ぢ: ['di'],
      づ: ['du'],
      で: ['de'],
      ど: ['do'],
      な: ['na'],
      に: ['ni'],
      にゃ: ['nya'],
      にゅ: ['nyu'],
      にょ: ['nyo'],
      ぬ: ['nu'],
      ね: ['ne'],
      の: ['no'],
      は: ['ha'],
      ひ: ['hi'],
      ふ: ['fu'],
      へ: ['he'],
      ほ: ['ho'],
      ひゃ: ['hya'],
      ひゅ: ['hyu'],
      ひょ: ['hyo'],
      ふぁ: ['fa'],
      ふぃ: ['fi'],
      ふぇ: ['fe'],
      ふぉ: ['fo'],
      ば: ['ba'],
      び: ['bi'],
      ぶ: ['bu'],
      べ: ['be'],
      ぼ: ['bo'],
      びゃ: ['bya'],
      びゅ: ['byu'],
      びょ: ['byo'],
      ぱ: ['pa'],
      ぴ: ['pi'],
      ぷ: ['pu'],
      ぺ: ['pe'],
      ぽ: ['po'],
      ぴゃ: ['pya'],
      ぴゅ: ['pyu'],
      ぴょ: ['pyo'],
      ま: ['ma'],
      み: ['mi'],
      む: ['mu'],
      め: ['me'],
      も: ['mo'],
      みゃ: ['mya'],
      みゅ: ['myu'],
      みょ: ['myo'],
      や: ['ya'],
      ゆ: ['yu'],
      よ: ['yo'],
      ら: ['ra'],
      り: ['ri'],
      る: ['ru'],
      れ: ['re'],
      ろ: ['ro'],
      りゃ: ['rya'],
      りゅ: ['ryu'],
      りょ: ['ryo'],
      わ: ['wa'],
      を: ['wo'],
      ん: ['nn', 'n '],
      ゐ: ['wi'],
      ゑ: ['we'],
      きぇ: ['kye'],
      きょ: ['kyo'],
      じぃ: ['jyi'],
      じぇ: ['jye'],
      ちぃ: ['cyi'],
      ちぇ: ['che'],
      ひぃ: ['hyi'],
      ひぇ: ['hye'],
      びぃ: ['byi'],
      びぇ: ['bye'],
      ぴぃ: ['pyi'],
      ぴぇ: ['pye'],
      みぇ: ['mye'],
      みぃ: ['myi'],
      りぃ: ['ryi'],
      りぇ: ['rye'],
      にぃ: ['nyi'],
      にぇ: ['nye'],
      しぃ: ['syi'],
      しぇ: ['she'],
      いぇ: ['ye'],
      うぁ: ['wha'],
      うぉ: ['who'],
      うぃ: ['wi'],
      うぇ: ['we'],
      ゔゃ: ['vya'],
      ゔゅ: ['vyu'],
      ゔょ: ['vyo'],
      すぁ: ['swa'],
      すぃ: ['swi'],
      すぅ: ['swu'],
      すぇ: ['swe'],
      すぉ: ['swo'],
      くゃ: ['qya'],
      くゅ: ['qyu'],
      くょ: ['qyo'],
      くぁ: ['qwa'],
      くぃ: ['qwi'],
      くぅ: ['qwu'],
      くぇ: ['qwe'],
      くぉ: ['qwo'],
      ぐぁ: ['gwa'],
      ぐぃ: ['gwi'],
      ぐぅ: ['gwu'],
      ぐぇ: ['gwe'],
      ぐぉ: ['gwo'],
      つぁ: ['tsa'],
      つぃ: ['tsi'],
      つぇ: ['tse'],
      つぉ: ['tso'],
      てゃ: ['tha'],
      てぃ: ['thi'],
      てゅ: ['thu'],
      てぇ: ['the'],
      てょ: ['tho'],
      とぁ: ['twa'],
      とぃ: ['twi'],
      とぅ: ['twu'],
      とぇ: ['twe'],
      とぉ: ['two'],
      ぢゃ: ['dya'],
      ぢぃ: ['dyi'],
      ぢゅ: ['dyu'],
      ぢぇ: ['dye'],
      ぢょ: ['dyo'],
      でゃ: ['dha'],
      でぃ: ['dhi'],
      でゅ: ['dhu'],
      でぇ: ['dhe'],
      でょ: ['dho'],
      どぁ: ['dwa'],
      どぃ: ['dwi'],
      どぅ: ['dwu'],
      どぇ: ['dwe'],
      どぉ: ['dwo'],
      ふぅ: ['fwu'],
      ふゃ: ['fya'],
      ふゅ: ['fyu'],
      ふょ: ['fyo'],
      っか: ['kka'],
      っき: ['kki'],
      っきゃ: ['kkya'],
      っきぃ: ['kkyi'],
      っきゅ: ['kkyu'],
      っく: ['kku'],
      っけ: ['kke'],
      っこ: ['kko'],
      っが: ['gga'],
      っぎ: ['ggi'],
      っぐ: ['ggu'],
      っげ: ['gge'],
      っご: ['ggo'],
      っぎゃ: ['ggya'],
      っぎぃ: ['ggyi'],
      っぎゅ: ['ggyu'],
      っぎぇ: ['ggye'],
      っぎょ: ['ggyo'],
      っさ: ['ssa'],
      っす: ['ssu'],
      っせ: ['sse'],
      っそ: ['sso'],
      っざ: ['zza'],
      っず: ['zzu'],
      っぜ: ['zze'],
      っぞ: ['zzo'],
      っし: ['sshi', 'ssi'],
      っしゃ: ['ssha'],
      っしゅ: ['sshu'],
      っしょ: ['ssho'],
      っじ: ['jji'],
      っじゃ: ['jja', 'jjya'],
      っじゅ: ['jju', 'jjyu'],
      っじょ: ['jjo', 'jjyo'],
      った: ['tta'],
      っち: ['cchi'],
      っちゃ: ['ccha'],
      っちゅ: ['cchu'],
      っちょ: ['ccho'],
      っつ: ['ttsu'],
      って: ['tte'],
      っと: ['tto'],
      っだ: ['dda'],
      っぢ: ['ddi'],
      っづ: ['ddu'],
      っで: ['dde'],
      っど: ['ddo'],
      っな: ['nna'],
      っに: ['nni'],
      っにゃ: ['nnya'],
      っにゅ: ['nnyu'],
      っにょ: ['nnyo'],
      っぬ: ['nnu'],
      っね: ['nne'],
      っの: ['nno'],
      っは: ['hha'],
      っひ: ['hhi'],
      っふ: ['ffu'],
      っへ: ['hhe'],
      っほ: ['hho'],
      っひゃ: ['hhya'],
      っひゅ: ['hhyu'],
      っひょ: ['hhyo'],
      っふぁ: ['ffa'],
      っふぃ: ['ffi'],
      っふぇ: ['ffe'],
      っふぉ: ['ffo'],
      っば: ['bba'],
      っび: ['bbi'],
      っぶ: ['bbu'],
      っべ: ['bbe'],
      っぼ: ['bbo'],
      っびゃ: ['bbya'],
      っびゅ: ['bbyu'],
      っびょ: ['bbyo'],
      っぱ: ['ppa'],
      っぴ: ['ppi'],
      っぷ: ['ppu'],
      っぺ: ['ppe'],
      っぽ: ['ppo'],
      っぴゃ: ['ppya'],
      っぴゅ: ['ppyu'],
      っぴょ: ['ppyo'],
      っま: ['mma'],
      っみ: ['mmi'],
      っむ: ['mmu'],
      っめ: ['mme'],
      っも: ['mmo'],
      っみゃ: ['mmya'],
      っみゅ: ['mmyu'],
      っみょ: ['mmyo'],
      っや: ['yya'],
      っゆ: ['yyu'],
      っよ: ['yyo'],
      っら: ['rra'],
      っり: ['rri'],
      っる: ['rru'],
      っれ: ['rre'],
      っろ: ['rro'],
      っりゃ: ['rrya'],
      っりゅ: ['rryu'],
      っりょ: ['rryo'],
      っわ: ['wwa'],
      っん: ['xtsunn', 'xtsun '],
      っゐ: ['wwi'],
      っゑ: ['wwe'],
      っきぇ: ['kkye'],
      っきょ: ['kkyo'],
      っじぃ: ['jjyi'],
      っじぇ: ['jjye'],
      っちぃ: ['ccyi'],
      っちぇ: ['cche'],
      っひぃ: ['hhyi'],
      っひぇ: ['hhye'],
      っびぃ: ['bbyi'],
      っびぇ: ['bbye'],
      っぴぃ: ['ppyi'],
      っぴぇ: ['ppye'],
      っみぇ: ['mmye'],
      っみぃ: ['mmyi'],
      っりぃ: ['rryi'],
      っりぇ: ['rrye'],
      っにぃ: ['nnyi'],
      っにぇ: ['nnye'],
      っしぃ: ['ssyi'],
      っしぇ: ['sshe'],
      っいぇ: ['yye'],
      っうぁ: ['wwha'],
      っうぉ: ['wwho'],
      っうぃ: ['wwi'],
      っうぇ: ['wwe'],
      っゔゃ: ['vvya'],
      っゔゅ: ['vvyu'],
      っゔょ: ['vvyo'],
      っすぁ: ['sswa'],
      っすぃ: ['sswi'],
      っすぅ: ['sswu'],
      っすぇ: ['sswe'],
      っすぉ: ['sswo'],
      っくゃ: ['qqya'],
      っくゅ: ['qqyu'],
      っくょ: ['qqyo'],
      っくぁ: ['qqwa'],
      っくぃ: ['qqwi'],
      っくぅ: ['qqwu'],
      っくぇ: ['qqwe'],
      っくぉ: ['qqwo'],
      っぐぁ: ['ggwa'],
      っぐぃ: ['ggwi'],
      っぐぅ: ['ggwu'],
      っぐぇ: ['ggwe'],
      っぐぉ: ['ggwo'],
      っつぁ: ['ttsa'],
      っつぃ: ['ttsi'],
      っつぇ: ['ttse'],
      っつぉ: ['ttso'],
      ってゃ: ['ttha'],
      ってぃ: ['tthi'],
      ってゅ: ['tthu'],
      ってぇ: ['tthe'],
      ってょ: ['ttho'],
      っとぁ: ['ttwa'],
      っとぃ: ['ttwi'],
      っとぅ: ['ttwu'],
      っとぇ: ['ttwe'],
      っとぉ: ['ttwo'],
      っぢゃ: ['ddya'],
      っぢぃ: ['ddyi'],
      っぢゅ: ['ddyu'],
      っぢぇ: ['ddye'],
      っぢょ: ['ddyo'],
      っでゃ: ['ddha'],
      っでぃ: ['ddhi'],
      っでゅ: ['ddhu'],
      っでぇ: ['ddhe'],
      っでょ: ['ddho'],
      っどぁ: ['ddwa'],
      っどぃ: ['ddwi'],
      っどぅ: ['ddwu'],
      っどぇ: ['ddwe'],
      っどぉ: ['ddwo'],
      っふぅ: ['ffwu'],
      っふゃ: ['ffya'],
      っふゅ: ['ffyu'],
      っふょ: ['ffyo'],
      '、': [','],
      '。': ['.'],
      '！': ['!'],
      ア: ["A"],
      イ: ["I"],
      ウ: ["U"],
      エ: ["E"],
      オ: ["O"],
      ゔァ: ["VA"],
      ゔィ: ["VI"],
      ゔ: ["VU"],
      ゔェ: ["VE"],
      ゔォ: ["VO"],
      カ: ["KA"],
      キ: ["KI"],
      キャ: ["KYA"],
      キィ: ["KYI"],
      キュ: ["KYU"],
      ク: ["KU"],
      ケ: ["KE"],
      コ: ["KO"],
      ガ: ["GA"],
      ギ: ["GI"],
      グ: ["GU"],
      ゲ: ["GE"],
      ゴ: ["GO"],
      ギャ: ["GYA"],
      ギィ: ["GYI"],
      ギュ: ["GYU"],
      ギェ: ["GYE"],
      ギョ: ["GYO"],
      サ: ["SA"],
      ス: ["SU"],
      セ: ["SE"],
      ソ: ["SO"],
      ザ: ["ZA"],
      ズ: ["ZU"],
      ゼ: ["ZE"],
      ゾ: ["ZO"],
      シ: ["SHI", "SI"],
      シャ: ["SHA"],
      シュ: ["SHU"],
      ショ: ["SHO"],
      ジ: ["JI"],
      ジャ: ["JA", "JYA"],
      ジュ: ["JU", "JYU"],
      ジョ: ["JO", "JYO"],
      タ: ["TA"],
      チ: ["CHI"],
      チャ: ["CHA"],
      チュ: ["CHU"],
      チョ: ["CHO"],
      ツ: ["TSU"],
      テ: ["TE"],
      ト: ["TO"],
      ダ: ["DA"],
      ヂ: ["DI"],
      ヅ: ["DU"],
      デ: ["DE"],
      ド: ["DO"],
      ナ: ["NA"],
      ニ: ["NI"],
      ニャ: ["NYA"],
      ニュ: ["NYU"],
      ニョ: ["NYO"],
      ヌ: ["NU"],
      ネ: ["NE"],
      ノ: ["NO"],
      ハ: ["HA"],
      ヒ: ["HI"],
      フ: ["FU"],
      ヘ: ["HE"],
      ホ: ["HO"],
      ヒャ: ["HYA"],
      ヒュ: ["HYU"],
      ヒョ: ["HYO"],
      ファ: ["FA"],
      フィ: ["FI"],
      フェ: ["FE"],
      フォ: ["FO"],
      バ: ["BA"],
      ビ: ["BI"],
      ブ: ["BU"],
      ベ: ["BE"],
      ボ: ["BO"],
      ビャ: ["BYA"],
      ビュ: ["BYU"],
      ビョ: ["BYO"],
      パ: ["PA"],
      ピ: ["PI"],
      プ: ["PU"],
      ペ: ["PE"],
      ポ: ["PO"],
      ピャ: ["PYA"],
      ピュ: ["PYU"],
      ピョ: ["PYO"],
      マ: ["MA"],
      ミ: ["MI"],
      ム: ["MU"],
      メ: ["ME"],
      モ: ["MO"],
      ミャ: ["MYA"],
      ミュ: ["MYU"],
      ミョ: ["MYO"],
      ヤ: ["YA"],
      ユ: ["YU"],
      ヨ: ["YO"],
      ラ: ["RA"],
      リ: ["RI"],
      ル: ["RU"],
      レ: ["RE"],
      ロ: ["RO"],
      リャ: ["RYA"],
      リュ: ["RYU"],
      リョ: ["RYO"],
      ワ: ["WA"],
      ヲ: ["WO"],
      ン: ["NN", "N "],
      ヰ: ["WI"],
      ヱ: ["WE"],
      キェ: ["KYE"],
      キョ: ["KYO"],
      ジィ: ["JYI"],
      ジェ: ["JYE"],
      チィ: ["CYI"],
      チェ: ["CHE"],
      ヒィ: ["HYI"],
      ヒェ: ["HYE"],
      ビィ: ["BYI"],
      ビェ: ["BYE"],
      ピィ: ["PYI"],
      ピェ: ["PYE"],
      ミェ: ["MYE"],
      ミィ: ["MYI"],
      リィ: ["RYI"],
      リェ: ["RYE"],
      ニィ: ["NYI"],
      ニェ: ["NYE"],
      シィ: ["SYI"],
      シェ: ["SHE"],
      イェ: ["YE"],
      ウァ: ["WHA"],
      ウォ: ["WHO"],
      ウィ: ["WI"],
      ウェ: ["WE"],
      ゔャ: ["VYA"],
      ゔュ: ["VYU"],
      ゔョ: ["VYO"],
      スァ: ["SWA"],
      スィ: ["SWI"],
      スゥ: ["SWU"],
      スェ: ["SWE"],
      スォ: ["SWO"],
      クャ: ["QYA"],
      クュ: ["QYU"],
      クョ: ["QYO"],
      クァ: ["QWA"],
      クィ: ["QWI"],
      クゥ: ["QWU"],
      クェ: ["QWE"],
      クォ: ["QWO"],
      グァ: ["GWA"],
      グィ: ["GWI"],
      グゥ: ["GWU"],
      グェ: ["GWE"],
      グォ: ["GWO"],
      ツァ: ["TSA"],
      ツィ: ["TSI"],
      ツェ: ["TSE"],
      ツォ: ["TSO"],
      テャ: ["THA"],
      ティ: ["THI"],
      テュ: ["THU"],
      テェ: ["THE"],
      テョ: ["THO"],
      トァ: ["TWA"],
      トィ: ["TWI"],
      トゥ: ["TWU"],
      トェ: ["TWE"],
      トォ: ["TWO"],
      ヂャ: ["DYA"],
      ヂィ: ["DYI"],
      ヂュ: ["DYU"],
      ヂェ: ["DYE"],
      ヂョ: ["DYO"],
      デャ: ["DHA"],
      ディ: ["DHI"],
      デュ: ["DHU"],
      デェ: ["DHE"],
      デョ: ["DHO"],
      ドァ: ["DWA"],
      ドィ: ["DWI"],
      ドゥ: ["DWU"],
      ドェ: ["DWE"],
      ドォ: ["DWO"],
      フゥ: ["FWU"],
      フャ: ["FYA"],
      フュ: ["FYU"],
      フョ: ["FYO"],
      ッカ: ["KKA"],
      ッキ: ["KKI"],
      ッキャ: ["KKYA"],
      ッキィ: ["KKYI"],
      ッキュ: ["KKYU"],
      ック: ["KKU"],
      ッケ: ["KKE"],
      ッコ: ["KKO"],
      ッガ: ["GGA"],
      ッギ: ["GGI"],
      ッグ: ["GGU"],
      ッゲ: ["GGE"],
      ッゴ: ["GGO"],
      ッギャ: ["GGYA"],
      ッギィ: ["GGYI"],
      ッギュ: ["GGYU"],
      ッギェ: ["GGYE"],
      ッギョ: ["GGYO"],
      ッサ: ["SSA"],
      ッス: ["SSU"],
      ッセ: ["SSE"],
      ッソ: ["SSO"],
      ッザ: ["ZZA"],
      ッズ: ["ZZU"],
      ッゼ: ["ZZE"],
      ッゾ: ["ZZO"],
      ッシ: ["SSHI", "SSI"],
      ッシャ: ["SSHA"],
      ッシュ: ["SSHU"],
      ッショ: ["SSHO"],
      ッジ: ["JJI"],
      ッジャ: ["JJA", "JJYA"],
      ッジュ: ["JJU", "JJYU"],
      ッジョ: ["JJO", "JJYO"],
      ッタ: ["TTA"],
      ッチ: ["CCHI"],
      ッチャ: ["CCHA"],
      ッチュ: ["CCHU"],
      ッチョ: ["CCHO"],
      ッツ: ["TTSU"],
      ッテ: ["TTE"],
      ット: ["TTO"],
      ッダ: ["DDA"],
      ッヂ: ["DDI"],
      ッヅ: ["DDU"],
      ッデ: ["DDE"],
      ッド: ["DDO"],
      ッナ: ["NNA"],
      ッニ: ["NNI"],
      ッニャ: ["NNYA"],
      ッニュ: ["NNYU"],
      ッニョ: ["NNYO"],
      ッヌ: ["NNU"],
      ッネ: ["NNE"],
      ッノ: ["NNO"],
      ッハ: ["HHA"],
      ッヒ: ["HHI"],
      ッフ: ["FFU"],
      ッヘ: ["HHE"],
      ッホ: ["HHO"],
      ッヒャ: ["HHYA"],
      ッヒュ: ["HHYU"],
      ッヒョ: ["HHYO"],
      ッファ: ["FFA"],
      ッフィ: ["FFI"],
      ッフェ: ["FFE"],
      ッフォ: ["FFO"],
      ッバ: ["BBA"],
      ッビ: ["BBI"],
      ッブ: ["BBU"],
      ッベ: ["BBE"],
      ッボ: ["BBO"],
      ッビャ: ["BBYA"],
      ッビュ: ["BBYU"],
      ッビョ: ["BBYO"],
      ッパ: ["PPA"],
      ッピ: ["PPI"],
      ップ: ["PPU"],
      ッペ: ["PPE"],
      ッポ: ["PPO"],
      ッピャ: ["PPYA"],
      ッピュ: ["PPYU"],
      ッピョ: ["PPYO"],
      ッマ: ["MMA"],
      ッミ: ["MMI"],
      ッム: ["MMU"],
      ッメ: ["MME"],
      ッモ: ["MMO"],
      ッミャ: ["MMYA"],
      ッミュ: ["MMYU"],
      ッミョ: ["MMYO"],
      ッヤ: ["YYA"],
      ッユ: ["YYU"],
      ッヨ: ["YYO"],
      ッラ: ["RRA"],
      ッリ: ["RRI"],
      ッル: ["RRU"],
      ッレ: ["RRE"],
      ッロ: ["RRO"],
      ッリャ: ["RRYA"],
      ッリュ: ["RRYU"],
      ッリョ: ["RRYO"],
      ッワ: ["WWA"],
      ッン: ["XTSUNN", "XTSUN "],
      ッヰ: ["WWI"],
      ッヱ: ["WWE"],
      ッキェ: ["KKYE"],
      ッキョ: ["KKYO"],
      ッジィ: ["JJYI"],
      ッジェ: ["JJYE"],
      ッチィ: ["CCYI"],
      ッチェ: ["CCHE"],
      ッヒィ: ["HHYI"],
      ッヒェ: ["HHYE"],
      ッビィ: ["BBYI"],
      ッビェ: ["BBYE"],
      ッピィ: ["PPYI"],
      ッピェ: ["PPYE"],
      ッミェ: ["MMYE"],
      ッミィ: ["MMYI"],
      ッリィ: ["RRYI"],
      ッリェ: ["RRYE"],
      ッニィ: ["NNYI"],
      ッニェ: ["NNYE"],
      ッシィ: ["SSYI"],
      ッシェ: ["SSHE"],
      ッイェ: ["YYE"],
      ッウァ: ["WWHA"],
      ッウォ: ["WWHO"],
      ッウィ: ["WWI"],
      ッウェ: ["WWE"],
      ッゔャ: ["VVYA"],
      ッゔュ: ["VVYU"],
      ッゔョ: ["VVYO"],
      ッスァ: ["SSWA"],
      ッスィ: ["SSWI"],
      ッスゥ: ["SSWU"],
      ッスェ: ["SSWE"],
      ッスォ: ["SSWO"],
      ックャ: ["QQYA"],
      ックュ: ["QQYU"],
      ックョ: ["QQYO"],
      ックァ: ["QQWA"],
      ックィ: ["QQWI"],
      ックゥ: ["QQWU"],
      ックェ: ["QQWE"],
      ックォ: ["QQWO"],
      ッグァ: ["GGWA"],
      ッグィ: ["GGWI"],
      ッグゥ: ["GGWU"],
      ッグェ: ["GGWE"],
      ッグォ: ["GGWO"],
      ッツァ: ["TTSA"],
      ッツィ: ["TTSI"],
      ッツェ: ["TTSE"],
      ッツォ: ["TTSO"],
      ッテャ: ["TTHA"],
      ッティ: ["TTHI"],
      ッテュ: ["TTHU"],
      ッテェ: ["TTHE"],
      ッテョ: ["TTHO"],
      ットァ: ["TTWA"],
      ットィ: ["TTWI"],
      ットゥ: ["TTWU"],
      ットェ: ["TTWE"],
      ットォ: ["TTWO"],
      ッヂャ: ["DDYA"],
      ッヂィ: ["DDYI"],
      ッヂュ: ["DDYU"],
      ッヂェ: ["DDYE"],
      ッヂョ: ["DDYO"],
      ッデャ: ["DDHA"],
      ッディ: ["DDHI"],
      ッデュ: ["DDHU"],
      ッデェ: ["DDHE"],
      ッデョ: ["DDHO"],
      ッドァ: ["DDWA"],
      ッドィ: ["DDWI"],
      ッドゥ: ["DDWU"],
      ッドェ: ["DDWE"],
      ッドォ: ["DDWO"],
      ッフゥ: ["FFWU"],
      ッフャ: ["FFYA"],
      ッフュ: ["FFYU"],
      ッフョ: ["FFYO"]
    }
    return kanaTable[kana]
  },
  selectRandomSentence: function() {
    var sentences = this.state.sentences;
    return sentences[Math.floor(Math.random()*sentences.length)];
  },
  setActiveCharacterGroup: function(position, sentenceCharacterGroups) {
    var activeCharacterGroup = sentenceCharacterGroups[position];
    var activeCharacterGroupRomajis = this.kanaToRomaji(activeCharacterGroup);
    var activeCharacterGroupInfo = {
      kana: activeCharacterGroup,
      romajis: activeCharacterGroupRomajis
    }

    this.setState({
      activeCharacterGroup: activeCharacterGroupInfo,
      currentSentencePosition: position,
      isInputIncorrect: false
    });
  },
  setActiveSentence: function() {
    var _this = this;
    var randomSentence = this.selectRandomSentence();
    var randomSentenceKana = randomSentence.kana;
    var randomSentenceCharacterGroups = [];

    while (randomSentenceKana.length > 0) {
      var potentialGroup = randomSentenceKana.substring(0,2);
      var potentialGroupRomajiSet = _this.kanaToRomaji(potentialGroup);

      if (potentialGroupRomajiSet) {
        randomSentenceCharacterGroups.push(potentialGroup);
        randomSentenceKana = randomSentenceKana.slice(2);
      } else {
        randomSentenceCharacterGroups.push(randomSentenceKana.substring(0,1));
        randomSentenceKana = randomSentenceKana.slice(1);
      }
    }

    this.setState({
      activeSentence: randomSentence,
      activeSentenceCharacterGroups: randomSentenceCharacterGroups
    });

    this.setActiveCharacterGroup(0, randomSentenceCharacterGroups);
  },
  render: function() {
    return (
      <div className="app-box">
        <VisualFeedback characterGroups={this.state.activeSentenceCharacterGroups} inputIncorrect={this.state.isInputIncorrect} currentSentencePosition={this.state.currentSentencePosition} />
        <UserInput onInputCheck={this.handleInputCheck} onSentenceComplete={this.handleSentenceComplete} inputIncorrect={this.state.isInputIncorrect} />
        <SentenceInformation sentence={this.state.activeSentence} />
      </div>
    );
  }
});

var VisualFeedback = React.createClass({
  render: function() {
    var inputIncorrect = this.props.inputIncorrect;
    var currentSentencePosition = this.props.currentSentencePosition;
    var characterGroupNodes = this.props.characterGroups.map(function(characterGroup, index) {
      var listItem;

      if (index < currentSentencePosition) {
        listItem = <li className="correct" data-position={index}>{characterGroup}</li>
      } else if (index == currentSentencePosition) {
        if (inputIncorrect) {
          listItem = <li className="incorrect" data-position={index}>{characterGroup}</li>;
        } else {
          listItem = <li data-position={index}>{characterGroup}</li>;
        }
      } else {
        listItem = <li data-position={index}>{characterGroup}</li>;
      }

      return (
        listItem
      );
    });
    return (
      <div className="basic-kana-sentence">
        <h2 className="mini muted">Basic kana sentence</h2>
        <ul lang="ja" className="sentence">
          {characterGroupNodes}
        </ul>
      </div>
    );
  }
});

var UserInput = React.createClass({
  getInitialState: function() {
    return { userInput: '' };
  },
  handleUserInputChange: function(e) {
    this.setState({userInput: e.target.value});
    var inputCheck = this.props.onInputCheck(e.target.value);

    if (inputCheck.inputComplete) {
      this.setState({userInput: ''});
    }

    if (inputCheck.sentenceComplete) {
      this.props.onSentenceComplete();
    }
  },
  handleSubmit: function(e) {
    e.preventDefault();
    var input = this.state.userInput.trim();
    // May not be required
  },
  render: function () {
    var userInputClass;
    if (this.props.inputIncorrect) {
      userInputClass = 'user-input incorrect'
    } else {
      userInputClass = 'user-input'
    };
    return (
      <div className={userInputClass}>
        <h2 className="mini invert muted">Type out the sentence in romaji</h2>
        <input
          type="text"
          name="user-input"
          value={this.state.userInput}
          onChange={this.handleUserInputChange}
          autocomplete="off"
          autocorrect="off"
          autocapitalize="off"
          spellcheck="false"
          autofocus
        />
      </div>
    );
  }
});


var SentenceInformation = React.createClass({
  render: function() {
    return (
      <div className="additional-sentence-information">
        <h2 className="mini muted">Advance kana sentence &amp; translation</h2>
        <dl>
          <dt className="real-word-sentence">{this.props.sentence.bun}</dt>
          <dd className="english-sentence-translation">{this.props.sentence.eng}</dd>
        </dl>
      </div>
    );
  }
});

var ErrorHistory;

var wrapper = document.getElementById('content')
ReactDOM.render(
  <AppBox url={wrapper.dataset.url} />,
  wrapper
);