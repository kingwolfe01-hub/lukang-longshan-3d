/**
 * ============================================================================
 * 【模組 1：config.js 全域設定與雙語教材資料庫 (國小童趣雙語版)】
 *  ★ 專為國小學生設計：生動擬人中文故事 + 輕鬆好唸的英語短句！
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

    // 1.3 線上擲筊雙語籤詩庫 (國小暖心正能量童趣版 - 完整 6 首對應 fortune_01~06.mp3)
    fortuneSlips: [
        {
            id: 1,
            type: "聖筊 Shengjiao (一平一凸 — 神明說 YES！)",
            en: "\"You are a super learner! Just like a brave little fish jumping over the Dragon Gate, you can do anything!\"",
            zh: "「學習小超人籤：你就像勇敢跳過龍門的小鯉魚，今天上課一定超棒、難不倒你！」"
        },
        {
            id: 2,
            type: "聖筊 Shengjiao (大吉大利 — 小小外交官！)",
            en: "\"Keep smiling and stay curious! Share the fun stories of Lukang with your friends around the world!\"",
            zh: "「快樂探索家籤：保持滿滿的好奇心！把鹿港龍山寺的有趣故事分享給全世界的朋友吧！」"
        },
        {
            id: 3,
            type: "聖筊 Shengjiao (好運滿滿 — 勇氣大冒險！)",
            en: "\"Raise your hand, speak English loudly, and shine like a star today!\"",
            zh: "「勇氣大冒險籤：你有一顆勇敢又善良的心，今天大膽舉手、大聲說英文，你一定會像星星一樣閃亮！」"
        },
        {
            id: 4,
            type: "笑筊 Xiaojiao (兩個平面 — 神明笑嘻嘻！)",
            en: "\"The temple gods are smiling at you! Take a deep breath, have fun, and try asking again!\"",
            zh: "「神明笑嘻嘻籤：神明對你露出溫暖的微笑喔！放輕鬆、開心地探索每一個小角落吧！」"
        },
        {
            id: 5,
            type: "笑筊 Xiaojiao (神明好開心 — 快樂開心果！)",
            en: "\"Your question makes the gods very happy! Share a big smile with your classmates right now!\"",
            zh: "「快樂開心果籤：你的問題讓神明笑得合不攏嘴呢！現在就轉頭對旁邊的同學露出一個大大的微笑吧！」"
        },
        {
            id: 6,
            type: "陰筊 Yinjiao (兩個凸面 — 再接再厲小勇士！)",
            en: "\"Don't worry, little hero! Every great explorer tries again. Take a closer look and toss the blocks one more time!\"",
            zh: "「再接再厲小勇士籤：別灰心喔小勇士！每個厲害的探險家都會多試幾次，再仔細觀察一下寺廟，重新擲筊問問看吧！」"
        }
    ],

    // 1.4 十二大特色建築與雙語教學腳本 (國小童趣版，對照官方平面圖編號 1~12)
    landmarks: [
        {
            id: 0,
            badgeNum: "1",
            moduleGroupIndex: 0,
            navZh: "① 山門與前埕",
            navEn: "01. Big Gate & Yard",
            titleZh: "山門與大榕樹前埕",
            titleEn: "The Big Gate & Giant Banyan Tree",
            vocab: ["Big Gate 大山門", "Banyan Tree 老榕樹爺爺", "Red Brick Wall 紅磚矮牆"],
            descEn: "Welcome to the big gate! Look at the 12 tall pillars and the giant old banyan tree. It looks like a big green umbrella!",
            descZh: "歡迎來到龍山寺大門口！這裡有 12 根高高的木柱子、一圈紅磚矮牆，還有一棵像綠色大雨傘的百年老榕樹爺爺在迎接你喔！",
            prompt: "Count how many tall pillars you see at the big gate! Can you find the giant green tree?",
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
            navEn: "02. Magic Paper Tower",
            titleZh: "惜字亭 (愛惜文字的魔法小塔)",
            titleEn: "Magic Paper Tower (Xiziting)",
            vocab: ["Paper Tower 惜字亭小塔", "Love Books 愛惜書本", "Respect Teachers 尊師重道"],
            descEn: "This is a magic paper tower! Long ago, people burned paper with words here to show respect for books and teachers.",
            descZh: "這是古時候的「魔法紙張小塔」！以前的人非常愛惜寫過字的紙，會放進這座六角形紅磚塔裡燒掉，代表尊重知識和老師喔！",
            prompt: "Why did people put paper with words into this little brick tower long ago?",
            camPos: [-0.8, 2.7, 21.8],
            lookAt: [-3.3, 1.25, 18.6],
            pinPos: [-3.3, 3.0, 18.6],
            triggerProgress: 0.11
        },
        {
            id: 2,
            badgeNum: "3",
            moduleGroupIndex: 2,
            navZh: "③ 五門殿・三重屋頂",
            navEn: "03. Triple-Roof Hall",
            titleZh: "五門殿與「戴三層帽子的屋頂」",
            titleEn: "Five-Gate Hall & Triple-Tiered Roof",
            vocab: ["Five Doors 五扇大門", "Three Roofs 三層大屋頂", "Swallowtail Roof 燕子尾巴屋脊"],
            descEn: "Look at the roof! The middle part pops up higher to wear three layers of roofs, just like a fancy crown!",
            descZh: "哇！快看屋頂中間！它特別長高了一截，還多加一層屋簷，就像戴了三層華麗皇冠的大屋頂，全台灣超級少見喔！",
            prompt: "Look at the middle roof! Can you count 1, 2, 3 layers of roofs?",
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
            titleZh: "帥氣門神與石獅子好朋友",
            titleEn: "Colorful Door Gods & Stone Lions",
            vocab: ["Door Gods 門神畫像", "Stone Lions 石獅子", "Play Ball 踩繡球"],
            descEn: "Brave Door Gods guard the doors! In front of them, the daddy lion plays with a ball, and the mommy lion plays with a baby lion.",
            descZh: "大門上畫著超帥氣的門神守護寺廟！門前還有一對石獅子好朋友：左邊的獅子爸爸踩著大繡球，右邊的獅子媽媽正和小獅子玩耍呢！",
            prompt: "Look closely! Which lion is playing with a ball, and which one has a baby lion?",
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
            navEn: "05. Magic Windows & Strong Men",
            titleZh: "鯉魚花窗與「屋角大力士」",
            titleEn: "Dragon Windows & Roof Strong Men",
            vocab: ["Octagon Window 八角花窗", "Jumping Carp 跳躍的鯉魚", "Strong Men 大力士叔叔"],
            descEn: "Look at the octagonal windows with jumping carps! And look up at the roof corners—two strong men are holding up the heavy roof!",
            descZh: "看看牆上的八角形木雕花窗，裡面藏著「鯉魚躍龍門」的祝福！再抬頭看屋頂角落，有兩位可愛的大力士叔叔正用雙手撐住屋頂喔！",
            prompt: "Look up at the roof corners! Can you spot the strong men holding up the roof?",
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
            navEn: "06. Stage & Magic Dome",
            titleZh: "戲台與「黃金蜘蛛網大屋頂」",
            titleEn: "Opera Stage & Giant Golden Dome",
            vocab: ["Golden Dome 黃金藻井穹頂", "No Nails 不用一根釘子", "Big Speaker 天然大喇叭"],
            descEn: "Look up! The ceiling looks like a giant golden spider web. It has no nails, and it works like a big speaker for singing!",
            descZh: "抬頭看天花板！這像不像一朵巨大的金色蓮花或蜘蛛網？它不用一根釘子就拼起來，還能把演戲唱歌的聲音變大聲，就像天然大喇叭！",
            prompt: "Click 'Explode Roof' at the top bar to lift the roof and peek at the golden dome inside!",
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
            navEn: "07. History Stone Books (Left)",
            titleZh: "石頭故事書 (左側廂廊碑林)",
            titleEn: "Giant Stone Storybooks (Left Wing)",
            vocab: ["Stone Books 石頭故事書", "Helping Hands 大家一起幫忙", "Left Corridor 左邊長走廊"],
            descEn: "Along the left corridor stand giant stone tablets. They are like stone storybooks telling how kind people helped fix the temple long ago!",
            descZh: "左邊的長走廊排滿了高大的石碑，它們就像一本本「石頭故事書」，記錄著以前鹿港的熱心商人如何大家一起出錢出力修好龍山寺！",
            prompt: "Touch the stone tablets with your eyes! What stories do they tell about Lukang?",
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
            navEn: "08. Giant Bronze Bell (Right)",
            titleZh: "跟小大象一樣重的百年古鐘",
            titleEn: "Giant Bronze Bell (Right Wing)",
            vocab: ["Bronze Bell 青銅大鐘", "Baby Elephant 小大象一樣重", "DONG Sound 咚——悠揚鐘聲"],
            descEn: "This giant bronze bell is as heavy as a baby elephant! When it rings, \"DONG!\" you can hear it far, far away.",
            descZh: "右邊走廊掛著一座超巨大的青銅大鐘，重得跟一隻小大象一樣！每次敲響時，「咚——」的聲音又低沉又好聽，傳到好遠的地方喔！",
            prompt: "Close your eyes and imagine the giant bell ringing: DONG—! How far can it travel?",
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
            navEn: "09. Dragon Pillars & Wells",
            titleZh: "飛龍石柱與中庭「龍虎井」",
            titleEn: "Dragon Pillars & Dragon-Tiger Wells",
            vocab: ["Dragon Pillar 飛龍盤柱", "Two Wells 龍井與虎井", "Incense Burner 青銅大香爐"],
            descEn: "In the sunny yard are two wells: Dragon Well and Tiger Well! Look at the stone pillars—a cool dragon is climbing up each one!",
            descZh: "陽光灑落的中庭裡有兩口八角古井，左邊叫龍井、右邊叫虎井！再看看拜殿前的石柱，有超神氣的立體飛龍正緊緊抱著柱子往上飛喔！",
            prompt: "Find the two wells in the yard and the cool dragons climbing up the stone pillars!",
            camPos: [3.8, 2.8, 3.8],
            lookAt: [0, 1.6, 0.2],
            pinPos: [1.35, 3.3, 0.6],
            triggerProgress: 0.69
        },
        {
            id: 9,
            badgeNum: "10",
            moduleGroupIndex: 6,
            navZh: "⑩ 正殿・彩色剪黏",
            navEn: "10. Main Hall & Colorful Art",
            titleZh: "正殿 (觀音殿) 與彩色瓷片藝術",
            titleEn: "Main Hall & Colorful Porcelain Art",
            vocab: ["Main Hall 最高大的正殿", "Guanyin 慈悲的觀音菩薩", "Colorful Roof 彩色瓷片拼貼"],
            descEn: "This tallest hall is the home of Guanyin. Look at the roof—artists used colorful broken bowls to make pretty flowers and dragons!",
            descZh: "這是整座寺廟最高大的正殿，裡面住著慈悲的觀音菩薩！屋頂上有好多五顏六色的花朵和神獸，都是師傅用彩色瓷碗一片片剪貼出來的喔！",
            prompt: "Look at the colorful decorations on the tallest roof! What colors can you see?",
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
            navEn: "11. Back Hall & Secret Well",
            titleZh: "最後面的後殿與「龍泉井」",
            titleEn: "The Back Hall & Dragon Spring Well",
            vocab: ["Back Hall 第四進後殿", "Secret Well 神秘龍泉井", "Long Walk 走完 157 公尺"],
            descEn: "You walked all the way to the back hall! Behind this hall hides a secret water well called the Dragon Spring Well.",
            descZh: "恭喜你一路闖關走到最深處的第四進「後殿」！在後殿的後面，還藏著一口清涼的「龍泉井」，整座寺廟真的好深好壯觀呀！",
            prompt: "You reached the very end of the temple! Look back to see how far you walked.",
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
            navEn: "12. Ancient Music Room",
            titleZh: "南管聚英社 (古早味音樂教室)",
            titleEn: "Nanguan Ancient Music Room",
            vocab: ["Music Room 古典音樂教室", "Pipa Lute 抱著彈的琵琶", "Sweet Music 優美的南管古樂"],
            descEn: "Inside this side room, musicians play Nanguan—very gentle, old-time music using wooden instruments like the Pipa!",
            descZh: "兩側紅磚走廊裡有一間「古早味音樂教室」叫聚英社！音樂家們在這裡彈奏琵琶和洞簫，演奏出全世界最古老、最溫柔的「南管」音樂喔！",
            prompt: "Click 'Nanguan' (南管古樂) at the top bar to listen to the gentle ancient music!",
            camPos: [-1.4, 3.1, 11.4],
            lookAt: [-4.5, 1.4, 8.2],
            pinPos: [-4.5, 3.0, 8.2],
            triggerProgress: 0.95
        }
    ]
};
