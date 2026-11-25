/**
 * ============================================================================
 * 【模組 1：config.js 全域設定與雙語教材資料庫】
 *  ★ 日後新增/修改景點、英文單字、籤詩、鏡頭座標、南管音階，只需修改此檔！
 * ============================================================================
 */
export const APP_CONFIG = {
    // 1.1 場景與暗調暮色高對比光影參數
    scene: {
        bgColor: '#16120f',
        fogDensity: 0.0095,
        exposure: 0.72,
        parchmentSize: { width: 42, depth: 68, foldCols: 4 },
        overviewCamera: { pos: [-24, 28, 36], lookAt: [0, 0, 2.0] }
    },

    // 1.2 南管古樂五聲音階設定 (工尺譜頻率)
    nanguanMusic: {
        scale: [293.66, 329.63, 392.00, 440.00, 493.88, 587.33, 659.25],
        pattern: [0, 2, 3, 5, 4, 3, 2, 1, 0, 3, 4, 2],
        tempoMs: 780
    },

    // 1.3 線上擲筊雙語籤詩庫 (可隨時擴充勵志英語名言)
    fortuneSlips: [
        {
            type: "聖筊 Shengjiao (One Flat, One Curved — Yes!)",
            en: "\"Like a carp leaping over the Dragon Gate, your dedication to learning will bring brilliant success!\"",
            zh: "「魚躍龍門，你的努力將在學業與國際交流中大放異彩！」"
        },
        {
            type: "聖筊 Shengjiao (Auspicious Blessing!)",
            en: "\"Harmony and wisdom surround you. Share your culture proudly with friends around the world!\"",
            zh: "「祥和與智慧常伴左右，自信地向世界分享家鄉文化吧！」"
        },
        {
            type: "笑筊 Xiaojiao (Two Flat Sides — Keep Smiling!)",
            en: "\"The deities smile warmly! Stay curious, ask good questions, and enjoy the journey of discovery.\"",
            zh: "「神明會心一笑！保持好奇心與燦爛笑容，享受探索知識的樂趣。」"
        }
    ],

    // 1.4 十二大特色建築與雙語教學腳本 (對照官方平面圖編號 1~12)
    landmarks: [
        {
            id: 0,
            badgeNum: "1",
            moduleGroupIndex: 0,
            navZh: "① 山門與前埕",
            navEn: "01. Main Gate & Plaza",
            titleZh: "山門與前埕紅磚圍牆",
            titleEn: "Main Gate (Shanmen) & Front Plaza",
            vocab: ["12-Pillar Gate 十二柱牌樓", "Brick Perimeter Wall 前埕紅磚圍牆", "Banyan Trees 廟埕百年老榕"],
            descEn: "Flanked by low red-brick perimeter walls, side gates, and lush century-old banyan trees, the freestanding twelve-pillar Shanmen opens the grand 157-meter axial plaza.",
            descZh: "獨立於廟前廣場的十二柱牌樓式山門，兩側延伸低矮紅磚圍牆與瓦頂側門圍塑前埕，搭配濃蔭老榕樹，開啟全寺進深一百五十七公尺的修長格局。",
            prompt: "Describe how the low brick wall and banyan trees frame the entrance plaza of the temple.",
            camPos: [-5.8, 4.4, 29.8],
            lookAt: [0, 1.5, 22.8],
            pinPos: [0, 4.3, 23.0],
            triggerProgress: 0.04
        },
        {
            id: 1,
            badgeNum: "2",
            moduleGroupIndex: 1,
            navZh: "② 惜字亭",
            navEn: "02. Word-Cherishing Pavilion",
            titleZh: "惜字亭 (敬惜字紙爐)",
            titleEn: "Cherishing Written Words Pavilion (Xiziting)",
            vocab: ["Xiziting 惜字亭", "Reverence for Literacy 敬惜字紙文化", "Hexagonal Brick Furnace 六角紅磚爐"],
            descEn: "Located on the left side of the front plaza, this hexagonal red-brick furnace was built to respectfully burn paper bearing written characters—reflecting traditional reverence for education.",
            descZh: "位於前埕左側（山門與五門殿之間）的三層六角形紅磚焚字爐，古人將寫有文字的廢紙集中於此焚化，展現鹿港文風鼎盛與敬惜字紙的傳統精神。",
            prompt: "Explain to a foreign student why traditional Taiwanese scholars burned written paper respectfully.",
            camPos: [-0.8, 2.7, 21.8],
            lookAt: [-3.3, 1.25, 18.6],
            pinPos: [-3.3, 3.0, 18.6],
            triggerProgress: 0.11
        },
        {
            id: 2,
            badgeNum: "3",
            moduleGroupIndex: 2,
            navZh: "③ 五門殿・斷簷升箭口",
            navEn: "03. Five-Gate Hall",
            titleZh: "五門殿與「斷簷升箭口」",
            titleEn: "Five-Gate Hall & Triple-Tiered Eaves",
            vocab: ["Triple-Tiered Eaves 斷簷升箭口", "Hipped-Gable Roof 重簷歇山式", "Daoguang Era 1831 清道光十一年風格"],
            descEn: "Preserving its 1831 Daoguang-era style, the Five-Gate Hall features 'Duan-Yan Sheng-Jian-Kou', where the central roof ridge rises with an extra eave to create a rare triple-tiered roofline.",
            descZh: "完整保存清道光十一年（1831）重修風格，正面中央明間刻意將屋脊升高並前加一簷，形成全台極罕見的『斷簷升箭口』三重屋簷立面。",
            prompt: "Count the three distinct roof tiers in the center of the Five-Gate Hall!",
            camPos: [5.6, 4.2, 19.6],
            lookAt: [0, 2.2, 14.2],
            pinPos: [0, 4.9, 14.2],
            triggerProgress: 0.19
        },
        {
            id: 3,
            badgeNum: "4",
            moduleGroupIndex: 2,
            navZh: "④ 門神與青斗石獅",
            navEn: "04. Door Gods & Lions",
            titleZh: "郭新林門神與青斗石獅",
            titleEn: "Painted Door Gods & Guardian Lions",
            vocab: ["Guo Xinlin Door Gods 郭新林門神彩繪", "Greenstone Lions 青斗石獅", "Drum Stones 螺紋抱鼓石"],
            descEn: "Guarding the Five-Gate Hall are masterfully painted Door Gods by Guo Xinlin, flanked by Qing-dynasty greenstone guardian lions and carved drum stones.",
            descZh: "五門殿大門繪有鹿港彩繪大師郭新林之韋馱、伽藍與四大金剛門神，門前配有一對清代青斗石獅（左公獅踩繡球、右母獅戲幼獅）與抱鼓石。",
            prompt: "Spot the difference between the male lion (left) and female lion (right) in English!",
            camPos: [0.2, 1.9, 17.6],
            lookAt: [0, 1.1, 15.4],
            pinPos: [1.18, 1.65, 15.6],
            triggerProgress: 0.27
        },
        {
            id: 4,
            badgeNum: "5",
            moduleGroupIndex: 3,
            navZh: "⑤ 夔龍窗與憨番抬廟角",
            navEn: "05. Dragon Windows & Atlas",
            titleZh: "八角夔龍窗與憨番抬廟角",
            titleEn: "Kui-Dragon Windows & Corner Bearers",
            vocab: ["Octagonal Lattice Window 八角夔龍窗", "Carp Leaping Dragon Gate 鯉魚躍龍門", "Corner Atlas Figures 憨番抬廟角"],
            descEn: "Octagonal wooden lattice windows depict carps leaping the Dragon Gate, while foreign Atlas figures ('Han-Fan') carved under the eaves lift the heavy roof corners.",
            descZh: "五門殿兩側八角形木雕夔龍窗寓意『鯉魚躍龍門』；屋簷轉角處更雕有雙手高舉托住屋簷的『憨番抬廟角』力士，展現鹿港通商港口的文化交流趣味。",
            prompt: "What good luck wish does the 'Carp Leaping Dragon Gate' window bring to students?",
            camPos: [-3.2, 2.2, 17.3],
            lookAt: [-2.45, 1.55, 15.2],
            pinPos: [-2.45, 2.5, 15.2],
            triggerProgress: 0.35
        },
        {
            id: 5,
            badgeNum: "6",
            moduleGroupIndex: 4,
            navZh: "⑥ 戲台與八卦藻井",
            navEn: "06. Stage & Caisson",
            titleZh: "戲台與「八卦藻井」",
            titleEn: "Opera Stage & Octagonal Caisson Ceiling",
            vocab: ["Octagonal Caisson Ceiling 八卦藻井", "Nail-Free Brackets 無釘斗拱卡榫", "Acoustic Resonance 演戲物理共鳴"],
            descEn: "Above the opera stage behind the Five-Gate Hall rises Taiwan's oldest and largest Octagonal Caisson Ceiling, built with interlocking nail-free brackets that amplify opera music.",
            descZh: "位於五門殿後方的戲台上方，擁有全台最早且最大的八角形藻井，由層層斗拱無釘螺旋收攏成穹頂，兼具演戲物理共鳴（擴音）與鎮邪祈福意義。",
            prompt: "Click 'Explode Roof' at the top bar to lift the roof and inspect the spiral dome inside!",
            camPos: [3.1, 2.5, 13.6],
            lookAt: [0, 2.65, 10.2],
            pinPos: [0, 4.4, 10.2],
            triggerProgress: 0.43
        },
        {
            id: 6,
            badgeNum: "7",
            moduleGroupIndex: 6,
            navZh: "⑦ 重修龍山寺記碑(左)",
            navEn: "07. Restoration Steles (Left)",
            titleZh: "重修龍山寺記碑 (左側廂廊)",
            titleEn: "Historical Restoration Stone Steles",
            vocab: ["Qing Dynasty Steles 清代重修碑林", "Merchant Guilds 鹿港郊商捐資史料", "Left Wing Corridor 左側廂廊碑刻"],
            descEn: "Set along the left wing corridor, these Qing-dynasty stone steles record how Lukang's merchant guilds funded major temple restorations in 1786 and 1831.",
            descZh: "依官方平面圖配置於左側廂廊的珍貴歷史碑林，詳細記載清乾隆五十一年遷建與道光十一年鹿港八郊商紳捐資重修的珍貴史料。",
            prompt: "How did local merchant guilds (郊商) support temple preservation in historical Lukang?",
            camPos: [-0.6, 2.5, 8.2],
            lookAt: [-3.9, 1.35, 5.2],
            pinPos: [-3.9, 2.9, 5.2],
            triggerProgress: 0.52
        },
        {
            id: 7,
            badgeNum: "8",
            moduleGroupIndex: 6,
            navZh: "⑧ 百年古鐘(右)",
            navEn: "08. Daoguang Bronze Bell (Right)",
            titleZh: "清道光百年青銅古鐘 (右側廂廊)",
            titleEn: "Qing Daoguang-Era Bronze Bell",
            vocab: ["Daoguang Bronze Bell 道光千斤古鐘", "Evening Bell Chimes 鹿港八景「龍山聽唄」", "Right Wing Corridor 右側廂廊鐘架"],
            descEn: "Suspended in the right wing corridor, this massive Qing-dynasty bronze bell inspired 'Listening to Chants at Longshan', celebrated as one of Lukang's Eight Scenic Views.",
            descZh: "配置於右側廂廊的清道光年間千斤青銅古鐘，鐘聲宏亮悠遠、餘音繞樑，成就鹿港八景之『龍山聽唄』美譽。",
            prompt: "Imagine hearing the deep bronze bell echo across the quiet courtyard at dusk.",
            camPos: [0.6, 2.5, 7.6],
            lookAt: [3.9, 1.45, 4.4],
            pinPos: [3.9, 2.95, 4.4],
            triggerProgress: 0.60
        },
        {
            id: 8,
            badgeNum: "9",
            moduleGroupIndex: 5,
            navZh: "⑨ 拜殿・龍柱與龍虎井",
            navEn: "09. Prayer Hall & Wells",
            titleZh: "拜殿單龍盤柱與中庭龍虎井",
            titleEn: "Prayer Hall Dragon Pillars & Courtyard Wells",
            vocab: ["Single-Dragon Pillars 單龍盤柱工藝", "Dragon & Tiger Wells 龍虎井", "Bronze Incense Burner 青銅天公爐"],
            descEn: "In the second courtyard stand the octagonal Dragon and Tiger Wells, leading to the Prayer Hall's bold Qing-dynasty single-dragon stone pillars and bronze incense burner.",
            descZh: "第一進中庭綠蔭兩側設有『左青龍、右白虎』八角龍虎井；前方拜殿矗立清道光年間雕造的單龍盤柱與青銅天公爐，香煙裊裊。",
            prompt: "Compare the dragon pillars across the Five-Gate Hall, Prayer Hall, and Rear Hall!",
            camPos: [3.8, 2.8, 3.8],
            lookAt: [0, 1.6, 0.2],
            pinPos: [1.35, 3.3, 0.6],
            triggerProgress: 0.69
        },
        {
            id: 9,
            badgeNum: "10",
            moduleGroupIndex: 6,
            navZh: "⑩ 正殿・交趾陶剪黏",
            navEn: "10. Main Sanctuary",
            titleZh: "正殿 (觀音殿) 與交趾陶剪黏",
            titleEn: "Main Sanctuary & Koji Porcelain Art",
            vocab: ["Main Sanctuary 正殿觀音殿", "Koji Pottery & Jiannian 交趾陶與泥塑剪黏", "Heritage Conservation 古蹟修復保存"],
            descEn: "Enshrining Guanyin Bodhisattva, the towering Main Sanctuary showcases vibrant Koji pottery and cut-and-paste porcelain art (Jiannian) meticulously restored after the 1999 earthquake.",
            descZh: "奉祀主神觀音菩薩的核心正殿，重簷歇山屋脊飾有色彩斑斕的傳統交趾陶與泥塑剪黏工藝，並在九二一震災後依循古法完成國寶級修護。",
            prompt: "Discuss how traditional porcelain cut-and-paste art (Jiannian) is preserved during restorations.",
            camPos: [-4.5, 4.2, -0.4],
            lookAt: [0, 2.3, -5.2],
            pinPos: [0, 5.8, -5.2],
            triggerProgress: 0.78
        },
        {
            id: 10,
            badgeNum: "11",
            moduleGroupIndex: 7,
            navZh: "⑪ 後殿與龍泉井",
            navEn: "11. Rear Hall & Dragon Well",
            titleZh: "第四進後殿 (三世佛殿) 與龍泉井",
            titleEn: "Rear Hall & Dragon Spring Well",
            vocab: ["Rear Hall (Showa Rebuild) 後殿與三世佛", "Dragon Spring Well 龍泉井", "Four-Hall Axis 完整四進空間格局"],
            descEn: "At the deepest end of the 157-meter axis stands the Rear Hall enshrining Amitabha and the Buddhas of the Three Ages, accompanied by the historic Dragon Spring Well.",
            descZh: "龍山寺最深處的第四進『後殿』，昭和十一年（1936）重建並奉祀阿彌陀佛與三世佛，後庭設有『龍泉井』，兩側廂廊保留名家書法碑刻。",
            prompt: "Trace the full four-hall progression from the Main Gate all the way to the Rear Hall.",
            camPos: [4.8, 3.8, -11.5],
            lookAt: [0, 1.9, -17.5],
            pinPos: [0, 4.6, -17.5],
            triggerProgress: 0.87
        },
        {
            id: 11,
            badgeNum: "12",
            moduleGroupIndex: 6,
            navZh: "⑫ 廂廊・南管聚英社",
            navEn: "12. Nanguan Music Hall",
            titleZh: "護龍廂廊與「南管聚英社」",
            titleEn: "Side Wing Corridors & Nanguan Music Hall",
            vocab: ["Side Wing Corridors 兩側護龍廂廊", "Nanguan Classical Music 南管聚英社", "Intangible Heritage 非物質文化遺產"],
            descEn: "Stretching along both flanks of the courtyards, the brick wing corridors house 'Juyingshe', preserving Nanguan—one of the world's oldest classical chamber music traditions.",
            descZh: "縱貫中庭兩側的長條形紅磚護龍廂廊，為台灣傳統音樂『南管』（人類非物質文化遺產）重要傳習基地『聚英社』所在地。",
            prompt: "Click 'Nanguan' (南管古樂) on the top bar to listen to traditional pentatonic melodies!",
            camPos: [-1.4, 3.1, 11.4],
            lookAt: [-4.5, 1.4, 8.2],
            pinPos: [-4.5, 3.0, 8.2],
            triggerProgress: 0.95
        }
    ]
};