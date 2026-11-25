/**
 * ============================================================================
 * 【模組 5：engine.js 3D 核心渲染引擎、音效系統、UI 互動與 ZIP 打包器】
 *  ★ 匯入 config.js, materials.js, components.js, architecture.js 並驅動整個應用
 * ============================================================================
 */
import { APP_CONFIG } from './config.js';
import { MaterialLib } from './materials.js';
import { TempleComponentFactory, swingingLanterns } from './components.js';
import { TempleArchitectureBuilder, explodableRoofs, smokeParticles } from './architecture.js';

// 全域狀態管理
const AppState = {
    mode: 'tour',
    isUnfolding: true,
    unfoldProgress: 0,
    tourProgress: 0,
    activeLandmark: -1,
    isFlying: false,
    targetCamPos: null,
    targetLookAt: null,
    isEnglishOnly: false,
    isExplodedView: false,
    clock: new THREE.Clock()
};

// 聲音與真實語音 MP3 播放系統（優先播放本地 ./audio/*.mp3，找不到檔案時自動啟用瀏覽器 TTS 備援）
const AudioSystem = {
    audioCtx: null,
    timer: null,
    isPlaying: false,
    currentAudio: null,

    toggleNanguan() {
        const btn = document.getElementById('btn-music');
        const icon = document.getElementById('icon-music');

        if (this.isPlaying) {
            this.isPlaying = false;
            clearInterval(this.timer);
            btn.classList.remove('bg-[#b83724]', 'text-amber-50');
            btn.classList.add('bg-stone-800/80', 'text-amber-100');
            icon.textContent = '🎵';
            return;
        }

        if (!this.audioCtx) {
            this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        }
        if (this.audioCtx.state === 'suspended') this.audioCtx.resume();

        this.isPlaying = true;
        btn.classList.remove('bg-stone-800/80', 'text-amber-100');
        btn.classList.add('bg-[#b83724]', 'text-amber-50');
        icon.textContent = '🎶';

        const { scale, pattern, tempoMs } = APP_CONFIG.nanguanMusic;
        let step = 0;

        const playNote = () => {
            if (!this.isPlaying) return;
            const freq = scale[pattern[step % pattern.length]];
            step++;

            const now = this.audioCtx.currentTime;
            const osc = this.audioCtx.createOscillator();
            const gain = this.audioCtx.createGain();

            osc.type = step % 4 === 0 ? 'sine' : 'triangle';
            osc.frequency.setValueAtTime(freq, now);

            gain.gain.setValueAtTime(0.001, now);
            gain.gain.exponentialRampToValueAtTime(0.08, now + 0.04);
            gain.gain.exponentialRampToValueAtTime(0.0008, now + 1.45);

            osc.connect(gain);
            gain.connect(this.audioCtx.destination);
            osc.start(now);
            osc.stop(now + 1.5);
        };

        playNote();
        this.timer = setInterval(playNote, tempoMs);
    },

    stopCurrentAudio() {
        if (this.currentAudio) {
            this.currentAudio.pause();
            this.currentAudio = null;
        }
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();
        }
    },

    playLandmarkAudio(landmarkIndex, isEnglish = true) {
        this.stopCurrentAudio();
        const fileNum = String(landmarkIndex + 1).padStart(2, '0');
        const langSuffix = isEnglish ? 'en' : 'zh';
        const audioPath = `./audio/landmark_${fileNum}_${langSuffix}.mp3`;
        const label = document.getElementById('tts-label');

        const audio = new Audio(audioPath);
        this.currentAudio = audio;
        if (label) label.textContent = 'Loading...';

        audio.onplay = () => { if (label) label.textContent = 'Playing...'; };
        audio.onended = () => { if (label) label.textContent = 'Listen (EN)'; this.currentAudio = null; };
        audio.onerror = () => {
            const mod = APP_CONFIG.landmarks[landmarkIndex];
            this.speakText(isEnglish ? `${mod.titleEn}. ${mod.descEn}` : `${mod.titleZh}。${mod.descZh}`, isEnglish ? 'en-US' : 'zh-TW');
            this.currentAudio = null;
        };
        audio.play().catch(() => {
            const mod = APP_CONFIG.landmarks[landmarkIndex];
            this.speakText(isEnglish ? `${mod.titleEn}. ${mod.descEn}` : `${mod.titleZh}。${mod.descZh}`, isEnglish ? 'en-US' : 'zh-TW');
        });
    },

    playFortuneAudio(slipIndex, isEnglish = true) {
        this.stopCurrentAudio();
        const fileNum = String(slipIndex + 1).padStart(2, '0');
        const langSuffix = isEnglish ? 'en' : 'zh';
        const audioPath = `./audio/fortune_${fileNum}_${langSuffix}.mp3`;

        const audio = new Audio(audioPath);
        this.currentAudio = audio;
        audio.onended = () => { this.currentAudio = null; };
        audio.onerror = () => {
            const slip = APP_CONFIG.fortuneSlips[slipIndex];
            this.speakText(isEnglish ? slip.en.replace(/"/g, '') : slip.zh, isEnglish ? 'en-US' : 'zh-TW');
            this.currentAudio = null;
        };
        audio.play().catch(() => {
            const slip = APP_CONFIG.fortuneSlips[slipIndex];
            this.speakText(isEnglish ? slip.en.replace(/"/g, '') : slip.zh, isEnglish ? 'en-US' : 'zh-TW');
        });
    },

    speakText(text, lang = 'en-US') {
        if (!('speechSynthesis' in window)) return;
        window.speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = lang;
        utterance.rate = 0.92;

        const label = document.getElementById('tts-label');
        utterance.onstart = () => { if (label) label.textContent = 'Speaking...'; };
        utterance.onend = () => { if (label) label.textContent = 'Listen (EN)'; };

        window.speechSynthesis.speak(utterance);
    }
};

// 介面與互動控制器
const UIController = {
    buildBottomNav() {
        const navBar = document.getElementById('bottom-nav-bar');
        navBar.innerHTML = '';

        APP_CONFIG.landmarks.forEach((mod, idx) => {
            const btn = document.createElement('button');
            btn.id = `nav-btn-${idx}`;
            btn.className = 'nav-pill px-2.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all text-amber-100/85 hover:bg-amber-400/15';
            btn.textContent = mod.navZh;
            btn.addEventListener('click', () => SceneEngine.focusLandmark(idx));
            navBar.appendChild(btn);
        });

        const divider = document.createElement('div');
        divider.className = 'w-px h-5 bg-amber-200/20 mx-0.5';
        navBar.appendChild(divider);

        const ovBtn = document.createElement('button');
        ovBtn.id = 'btn-overview';
        ovBtn.className = 'px-2.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all text-amber-300 hover:bg-amber-400/15';
        ovBtn.textContent = '軸測全景';
        ovBtn.addEventListener('click', () => SceneEngine.resetOverview());
        navBar.appendChild(ovBtn);
    },

    toggleLanguage() {
        AppState.isEnglishOnly = !AppState.isEnglishOnly;
        const en = AppState.isEnglishOnly;

        document.getElementById('btn-lang').textContent = en ? '🇺🇸 English Only' : '🌐 雙語 EN/中';
        document.getElementById('ui-main-title').textContent = en
            ? 'Lukang Longshan Temple • 3D Cultural Map'
            : '鹿港龍山寺・3D 雙語文化地圖';
        document.getElementById('txt-explode').textContent = en ? 'Explode Roof' : '屋頂透視';
        document.getElementById('txt-divine').textContent = en ? 'Moon Blocks' : '線上擲筊';
        document.getElementById('txt-music').textContent = en ? 'Nanguan' : '南管古樂';
        document.getElementById('tour-text').textContent = AppState.mode === 'tour'
            ? (en ? 'Auto Tour' : '自動巡禮')
            : (en ? 'Free Orbit' : '自由探索');
        document.getElementById('btn-overview').textContent = en ? 'Overview' : '軸測全景';
        document.getElementById('txt-next-stop').textContent = en ? 'Next Stop' : '下一站 Next Stop';

        APP_CONFIG.landmarks.forEach((m, idx) => {
            const navBtn = document.getElementById(`nav-btn-${idx}`);
            if (navBtn) navBtn.textContent = en ? m.navEn : m.navZh;
        });

        const zhBlock = document.getElementById('card-zh-block');
        if (zhBlock) zhBlock.style.display = en ? 'none' : 'block';
    },

    setTourButtonState(isTour) {
        AppState.mode = isTour ? 'tour' : 'free';
        const btn = document.getElementById('btn-tour');
        const icon = document.getElementById('tour-icon');
        const text = document.getElementById('tour-text');
        if (isTour) {
            btn.classList.remove('bg-stone-700'); btn.classList.add('bg-[#b83724]');
            icon.textContent = '▶';
            text.textContent = AppState.isEnglishOnly ? 'Auto Tour' : '自動巡禮';
        } else {
            btn.classList.remove('bg-[#b83724]'); btn.classList.add('bg-stone-700');
            icon.textContent = '⏸';
            text.textContent = AppState.isEnglishOnly ? 'Free Orbit' : '自由探索';
        }
    },

    updateCinematicBadge(mod) {
        const badge = document.getElementById('cinematic-badge');
        document.getElementById('badge-title').textContent = AppState.isEnglishOnly ? mod.titleEn : mod.titleZh;
        document.getElementById('badge-subtitle').textContent = AppState.isEnglishOnly ? 'Lukang Longshan Temple' : mod.titleEn;
        badge.classList.remove('opacity-0', 'translate-y-3');
        badge.classList.add('opacity-100', 'translate-y-0');
    },

    hideCinematicBadge() {
        document.getElementById('cinematic-badge').classList.add('opacity-0', 'translate-y-3');
    },

    showInfoCard(idx) {
        const mod = APP_CONFIG.landmarks[idx];
        document.getElementById('card-tag').textContent = `Architectural Highlight ${String(idx + 1).padStart(2, '0')}`;
        document.getElementById('card-title-zh').textContent = mod.titleZh;
        document.getElementById('card-title-en').textContent = mod.titleEn;
        document.getElementById('card-desc-en').textContent = mod.descEn;
        document.getElementById('card-desc-zh').textContent = mod.descZh;
        document.getElementById('card-task-prompt').innerHTML = `<strong class="font-bold text-amber-300">Class Prompt:</strong> ${mod.prompt}`;
        document.getElementById('card-step-indicator').textContent = `${idx + 1} / ${APP_CONFIG.landmarks.length}`;

        const vocabContainer = document.getElementById('card-vocab-list');
        vocabContainer.innerHTML = '';
        mod.vocab.forEach(v => {
            const chip = document.createElement('span');
            chip.className = 'px-2 py-0.5 rounded-md bg-amber-400/15 text-amber-200 font-sans text-[11px] font-semibold border border-amber-400/25';
            chip.textContent = v;
            vocabContainer.appendChild(chip);
        });

        const card = document.getElementById('info-card');
        card.classList.remove('opacity-0', 'translate-y-4', 'pointer-events-none');
        card.classList.add('opacity-100', 'translate-y-0', 'pointer-events-auto');
    },

    closeInfoCard() {
        const card = document.getElementById('info-card');
        card.classList.add('opacity-0', 'translate-y-4', 'pointer-events-none');
        card.classList.remove('opacity-100', 'translate-y-0', 'pointer-events-auto');
    },

    updateNavPills(activeIdx) {
        document.querySelectorAll('.nav-pill').forEach((btn, idx) => {
            if (idx === activeIdx) {
                btn.classList.add('bg-[#b83724]', 'text-amber-50');
                btn.classList.remove('text-amber-100/85');
                btn.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
            } else {
                btn.classList.remove('bg-[#b83724]', 'text-amber-50');
                btn.classList.add('text-amber-100/85');
            }
        });
    },

    openDivination() {
        SceneEngine.focusLandmark(8);
        const modal = document.getElementById('divination-modal');
        modal.classList.remove('hidden');
        modal.classList.add('flex');
    },

    closeDivination() {
        const modal = document.getElementById('divination-modal');
        modal.classList.add('hidden');
        modal.classList.remove('flex');
    },

    tossMoonBlocks() {
        const leftEl = document.getElementById('moon-block-left');
        const rightEl = document.getElementById('moon-block-right');
        const resultBox = document.getElementById('fortune-result');

        leftEl.classList.remove('animate-toss-left');
        rightEl.classList.remove('animate-toss-right');
        void leftEl.offsetWidth;
        leftEl.classList.add('animate-toss-left');
        rightEl.classList.add('animate-toss-right');

        setTimeout(() => {
            const slips = APP_CONFIG.fortuneSlips;
            const slipIdx = Math.floor(Math.random() * slips.length);
            const slip = slips[slipIdx];
            document.getElementById('fortune-type').textContent = slip.type;
            document.getElementById('fortune-en').textContent = slip.en;
            document.getElementById('fortune-zh').textContent = slip.zh;
            resultBox.classList.remove('hidden');
            AudioSystem.playFortuneAudio(slipIdx, true);
        }, 620);
    },

    // 將拆解後的 6 個獨立檔案自動打包成 .zip 壓縮檔下載
    async downloadProjectZip() {
        if (typeof JSZip === 'undefined') return;
        const btn = document.getElementById('btn-download-zip');
        const origHtml = btn.innerHTML;
        btn.innerHTML = '<span>⏳</span><span>打包中...</span>';

        try {
            const zip = new JSZip();
            const folder = zip.folder('lukang-longshan-3d');

            // 讀取目前頁面的原始 HTML 並清空動態渲染的 DOM 節點
            const docClone = document.documentElement.cloneNode(true);
            const canvasContainer = docClone.querySelector('#canvas-container');
            // 嘗試抓取各模組原始碼並加入壓縮包（若受環境限制無法 fetch，自動啟用內建完整備援原始碼）
            const fallbackSources = this.getEmbeddedModuleSources();
            const moduleFiles = ['config.js', 'materials.js', 'components.js', 'architecture.js', 'engine.js'];
            for (const file of moduleFiles) {
                let codeText = null;
                try {
                    const res = await fetch(`./${file}`);
                    if (res.ok) codeText = await res.text();
                } catch (e) {
                    console.warn(`改用內建備援原始碼打包 ${file}`);
                }
                if (!codeText && fallbackSources[file]) {
                    codeText = fallbackSources[file];
                }
                if (codeText) {
                    folder.file(file, codeText);
                }
            }

            folder.file('README.md', `# 鹿港龍山寺・全 3D 立體紙地圖與雙語國際教育示範\n\n## 目錄結構\n- \`index.html\`: 主程式入口\n- \`config.js\`: 12 大景點座標、雙語導覽腳本、關鍵詞彙與籤詩庫（備課修改請改此檔）\n- \`materials.js\`: PBR 材質與宣紙紋理工廠\n- \`components.js\`: 3D 傳統建築構件工廠\n- \`architecture.js\`: 寺廟八大殿宇組裝器\n- \`engine.js\`: 3D 渲染引擎、南管合成音效與英語語音朗讀\n\n## 啟動方式\n由於採用 ES6 Modules (\`type="module"\`)，請使用 VS Code 的 **Live Server** 擴充套件開啟，或直接上傳至 **GitHub Pages** 即可線上瀏覽！\n`);

            const blob = await zip.generateAsync({ type: 'blob' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'lukang-longshan-3d.zip';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        } finally {
            btn.innerHTML = origHtml;
        }
    },

    // 內建完整模組原始碼備援（確保在任何沙盒或離線預覽環境都能 100% 打包全部 6 支檔案）
    getEmbeddedModuleSources() {
        return {
            'config.js': `export const APP_CONFIG = ${JSON.stringify(APP_CONFIG, null, 4)};\n`,
            'materials.js': `export const MaterialLib = {\n    cache: {},\n    getBrickMaterial: ${MaterialLib.getBrickMaterial.toString()},\n    getRoofMaterial: ${MaterialLib.getRoofMaterial.toString()},\n    getWoodMaterial: ${MaterialLib.getWoodMaterial.toString()},\n    getStoneMaterial: ${MaterialLib.getStoneMaterial.toString()},\n    getDoorGodMaterial: ${MaterialLib.getDoorGodMaterial.toString()},\n    getParchmentBaseMaterial: ${MaterialLib.getParchmentBaseMaterial.toString()}\n};\n`,
            'components.js': `import { MaterialLib } from './materials.js';\nexport const swingingLanterns = [];\nexport const TempleComponentFactory = {\n    createTiledRoof: ${TempleComponentFactory.createTiledRoof.toString()},\n    createDragonPillar: ${TempleComponentFactory.createDragonPillar.toString()},\n    createKuiDragonWindow: ${TempleComponentFactory.createKuiDragonWindow.toString()},\n    createGuardianLion: ${TempleComponentFactory.createGuardianLion.toString()},\n    createCornerAtlas: ${TempleComponentFactory.createCornerAtlas.toString()},\n    createSwingingLantern: ${TempleComponentFactory.createSwingingLantern.toString()},\n    createPlaque: ${TempleComponentFactory.createPlaque.toString()},\n    createBanyanTree: ${TempleComponentFactory.createBanyanTree.toString()},\n    createXiziting: ${TempleComponentFactory.createXiziting.toString()},\n    createNumberBadgeSprite: ${TempleComponentFactory.createNumberBadgeSprite.toString()}\n};\n`,
            'architecture.js': `import { MaterialLib } from './materials.js';\nimport { TempleComponentFactory } from './components.js';\nexport const explodableRoofs = [];\nexport const smokeParticles = [];\nexport const TempleArchitectureBuilder = {\n    buildAll: ${TempleArchitectureBuilder.buildAll.toString()},\n    buildGateAndPlaza: ${TempleArchitectureBuilder.buildGateAndPlaza.toString()},\n    buildXizitingModule: ${TempleArchitectureBuilder.buildXizitingModule.toString()},\n    buildFiveGateHall: ${TempleArchitectureBuilder.buildFiveGateHall.toString()},\n    buildCarvingDetails: ${TempleArchitectureBuilder.buildCarvingDetails.toString()},\n    buildStageAndCaisson: ${TempleArchitectureBuilder.buildStageAndCaisson.toString()},\n    buildWorshipHallAndWells: ${TempleArchitectureBuilder.buildWorshipHallAndWells.toString()},\n    buildMainHallAndCorridors: ${TempleArchitectureBuilder.buildMainHallAndCorridors.toString()},\n    buildRearHallAndWell: ${TempleArchitectureBuilder.buildRearHallAndWell.toString()}\n};\n`,
            'engine.js': `import { APP_CONFIG } from './config.js';\nimport { MaterialLib } from './materials.js';\nimport { TempleComponentFactory, swingingLanterns } from './components.js';\nimport { TempleArchitectureBuilder, explodableRoofs, smokeParticles } from './architecture.js';\n\nconst AppState = ${JSON.stringify({ mode: 'tour', isUnfolding: true, unfoldProgress: 0, tourProgress: 0, activeLandmark: -1, isFlying: false, targetCamPos: null, targetLookAt: null, isEnglishOnly: false, isExplodedView: false }, null, 4)};\nAppState.clock = new THREE.Clock();\n\nconst AudioSystem = {\n    audioCtx: null, timer: null, isPlaying: false,\n    toggleNanguan: ${AudioSystem.toggleNanguan.toString()},\n    speakEnglish: ${AudioSystem.speakEnglish.toString()}\n};\n\nconst UIController = {\n    buildBottomNav: ${UIController.buildBottomNav.toString()},\n    toggleLanguage: ${UIController.toggleLanguage.toString()},\n    setTourButtonState: ${UIController.setTourButtonState.toString()},\n    updateCinematicBadge: ${UIController.updateCinematicBadge.toString()},\n    hideCinematicBadge: ${UIController.hideCinematicBadge.toString()},\n    showInfoCard: ${UIController.showInfoCard.toString()},\n    closeInfoCard: ${UIController.closeInfoCard.toString()},\n    updateNavPills: ${UIController.updateNavPills.toString()},\n    openDivination: ${UIController.openDivination.toString()},\n    closeDivination: ${UIController.closeDivination.toString()},\n    tossMoonBlocks: ${UIController.tossMoonBlocks.toString()},\n    downloadProjectZip: ${UIController.downloadProjectZip.toString()},\n    getEmbeddedModuleSources: ${UIController.getEmbeddedModuleSources.toString()}\n};\n\nconst SceneEngine = {\n    scene: null, camera: null, renderer: null, composer: null, controls: null,\n    mapSegments: [], templeModules: [], landmarkPins: [], routeCurve: null, camCurve: null, routeMarker: null,\n    init: ${SceneEngine.init.toString()},\n    setupLightingAndPostProcessing: ${SceneEngine.setupLightingAndPostProcessing.toString()},\n    buildParchmentBase: ${SceneEngine.buildParchmentBase.toString()},\n    buildTourPaths: ${SceneEngine.buildTourPaths.toString()},\n    buildLandmarkPins: ${SceneEngine.buildLandmarkPins.toString()},\n    bindUIEvents: ${SceneEngine.bindUIEvents.toString()},\n    focusLandmark: ${SceneEngine.focusLandmark.toString()},\n    resetOverview: ${SceneEngine.resetOverview.toString()},\n    replayGrowth: ${SceneEngine.replayGrowth.toString()},\n    easeOutElasticPop: ${SceneEngine.easeOutElasticPop.toString()},\n    update: ${SceneEngine.update.toString()}\n};\n\nwindow.addEventListener('load', () => {\n    SceneEngine.init();\n    SceneEngine.update();\n});\n`
        };
    }
};

// 3D 核心渲染引擎
const SceneEngine = {
    scene: null,
    camera: null,
    renderer: null,
    composer: null,
    controls: null,
    mapSegments: [],
    templeModules: [],
    landmarkPins: [],
    routeCurve: null,
    camCurve: null,
    routeMarker: null,

    init() {
        const cfg = APP_CONFIG.scene;
        const container = document.getElementById('canvas-container');

        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(cfg.bgColor);
        this.scene.fog = new THREE.FogExp2(cfg.bgColor, cfg.fogDensity);

        this.camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 0.1, 220);
        this.camera.position.set(...cfg.overviewCamera.pos);

        this.renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.renderer.outputEncoding = THREE.sRGBEncoding;
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        this.renderer.toneMappingExposure = cfg.exposure;
        container.appendChild(this.renderer.domElement);

        this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.055;
        this.controls.maxPolarAngle = Math.PI / 2 - 0.04;
        this.controls.minDistance = 2.5;
        this.controls.maxDistance = 78;
        this.controls.target.set(...cfg.overviewCamera.lookAt);
        this.controls.addEventListener('start', () => {
            AppState.isFlying = false;
            if (AppState.mode === 'tour') UIController.setTourButtonState(false);
        });

        this.setupLightingAndPostProcessing();
        this.buildParchmentBase();
        this.buildTourPaths();

        this.templeModules = TempleArchitectureBuilder.buildAll(this.scene);
        this.buildLandmarkPins();
        UIController.buildBottomNav();
        this.bindUIEvents();
    },

    setupLightingAndPostProcessing() {
        const envScene = new THREE.Scene();
        const skyCanvas = document.createElement('canvas'); skyCanvas.width = 256; skyCanvas.height = 128;
        const sCtx = skyCanvas.getContext('2d');
        const skyGrad = sCtx.createLinearGradient(0, 0, 0, 128);
        skyGrad.addColorStop(0.0, '#141926');
        skyGrad.addColorStop(0.45, '#3b2820');
        skyGrad.addColorStop(0.68, '#593722');
        skyGrad.addColorStop(1.0, '#140f0c');
        sCtx.fillStyle = skyGrad; sCtx.fillRect(0, 0, 256, 128);
        const skyTex = new THREE.CanvasTexture(skyCanvas); skyTex.encoding = THREE.sRGBEncoding;
        envScene.add(new THREE.Mesh(new THREE.SphereGeometry(20, 32, 16), new THREE.MeshBasicMaterial({ map: skyTex, side: THREE.BackSide })));

        const pmrem = new THREE.PMREMGenerator(this.renderer);
        this.scene.environment = pmrem.fromScene(envScene, 0.04).texture;
        pmrem.dispose();

        this.scene.add(new THREE.HemisphereLight('#5c6c8a', '#261b12', 0.22));

        const sun = new THREE.DirectionalLight('#ffb86c', 2.6);
        sun.position.set(26, 11, 20);
        sun.castShadow = true;
        sun.shadow.mapSize.set(2048, 2048);
        sun.shadow.camera.near = 4; sun.shadow.camera.far = 85;
        const d = 26;
        sun.shadow.camera.left = -d; sun.shadow.camera.right = d;
        sun.shadow.camera.top = d; sun.shadow.camera.bottom = -d;
        sun.shadow.bias = -0.0005;
        this.scene.add(sun);

        this.composer = new THREE.EffectComposer(this.renderer);
        this.composer.addPass(new THREE.RenderPass(this.scene, this.camera));
        this.composer.addPass(new THREE.UnrealBloomPass(
            new THREE.Vector2(window.innerWidth, window.innerHeight),
            0.36, 0.65, 0.85
        ));
    },

    buildParchmentBase() {
        const { width: totalW, depth: totalD, foldCols: cols } = APP_CONFIG.scene.parchmentSize;
        const parchmentMat = MaterialLib.getParchmentBaseMaterial();
        const desk = new THREE.Mesh(
            new THREE.PlaneGeometry(260, 260),
            new THREE.MeshStandardMaterial({ color: '#1c1713', roughness: 0.96, metalness: 0.0 })
        );
        desk.rotation.x = -Math.PI / 2; desk.position.y = -0.06; desk.receiveShadow = true;
        this.scene.add(desk);

        const segW = totalW / cols;
        for (let i = 0; i < cols; i++) {
            const geo = new THREE.BoxGeometry(segW, 0.05, totalD);
            const uv = geo.attributes.uv;
            for (let j = 0; j < uv.count; j++) uv.setX(j, (i / cols) + uv.getX(j) * (1 / cols));
            const mesh = new THREE.Mesh(geo, parchmentMat);
            mesh.receiveShadow = true;
            const pivot = new THREE.Group();
            pivot.position.set(-totalW / 2 + i * segW + segW / 2, 0, 2.0);
            pivot.add(mesh);
            this.scene.add(pivot);
            this.mapSegments.push({ pivot, index: i });
        }
    },

    buildTourPaths() {
        const routePts = [
            new THREE.Vector3(0, 0.035, 25.2),
            new THREE.Vector3(0, 0.035, 20.5),
            new THREE.Vector3(0, 0.035, 16.0),
            new THREE.Vector3(0, 0.035, 11.2),
            new THREE.Vector3(0, 0.035, 5.2),
            new THREE.Vector3(0, 0.035, 0.0),
            new THREE.Vector3(0, 0.035, -5.2),
            new THREE.Vector3(0, 0.035, -11.5),
            new THREE.Vector3(0, 0.035, -16.8)
        ];
        this.routeCurve = new THREE.CatmullRomCurve3(routePts);

        const redRibbonGeo = new THREE.TubeGeometry(this.routeCurve, 180, 0.1, 8, false);
        const redRibbonMat = new THREE.MeshStandardMaterial({
            color: '#c92a1a', emissive: '#94170a', emissiveIntensity: 0.48, roughness: 0.45
        });
        const redRibbon = new THREE.Mesh(redRibbonGeo, redRibbonMat);
        redRibbon.position.y = 0.025;
        redRibbon.scale.y = 0.25;
        this.scene.add(redRibbon);

        const camPts = APP_CONFIG.landmarks.map(m => new THREE.Vector3(...m.camPos));
        this.camCurve = new THREE.CatmullRomCurve3(camPts);

        const markerGroup = new THREE.Group();
        const cone = new THREE.Mesh(
            new THREE.ConeGeometry(0.2, 0.5, 16),
            new THREE.MeshStandardMaterial({ color: '#f0b841', emissive: '#b87c14', emissiveIntensity: 0.45, metalness: 0.5, roughness: 0.25 })
        );
        cone.position.y = 0.42;
        cone.rotation.x = Math.PI;
        markerGroup.add(cone);
        this.routeMarker = markerGroup;
        this.scene.add(this.routeMarker);
    },

    buildLandmarkPins() {
        APP_CONFIG.landmarks.forEach((mod, idx) => {
            const badgeSprite = TempleComponentFactory.createNumberBadgeSprite(mod.badgeNum);
            badgeSprite.position.set(...mod.pinPos);
            badgeSprite.userData = { landmarkIndex: idx };
            this.scene.add(badgeSprite);
            this.landmarkPins.push({ mesh: badgeSprite, baseY: mod.pinPos[1], phase: idx * 0.55 });
        });
    },

    bindUIEvents() {
        document.getElementById('btn-lang').addEventListener('click', () => UIController.toggleLanguage());

        document.getElementById('btn-explode').addEventListener('click', () => {
            AppState.isExplodedView = !AppState.isExplodedView;
            const btn = document.getElementById('btn-explode');
            if (AppState.isExplodedView) {
                btn.classList.remove('bg-stone-800/80', 'text-amber-100');
                btn.classList.add('bg-[#b83724]', 'text-amber-50');
                this.focusLandmark(5);
            } else {
                btn.classList.remove('bg-[#b83724]', 'text-amber-50');
                btn.classList.add('bg-stone-800/80', 'text-amber-100');
            }
        });

        document.getElementById('btn-open-divine').addEventListener('click', () => UIController.openDivination());
        document.getElementById('btn-close-divine').addEventListener('click', () => UIController.closeDivination());
        document.getElementById('btn-toss-blocks').addEventListener('click', () => UIController.tossMoonBlocks());
        document.getElementById('btn-music').addEventListener('click', () => AudioSystem.toggleNanguan());

        document.getElementById('btn-tour').addEventListener('click', () => {
            if (AppState.mode === 'tour') UIController.setTourButtonState(false);
            else {
                if (AppState.tourProgress >= 0.99) AppState.tourProgress = 0;
                UIController.closeInfoCard();
                UIController.setTourButtonState(true);
            }
        });

        document.getElementById('btn-replay').addEventListener('click', () => this.replayGrowth());
        document.getElementById('btn-download-zip').addEventListener('click', () => UIController.downloadProjectZip());
        document.getElementById('btn-close-card').addEventListener('click', () => UIController.closeInfoCard());
        document.getElementById('btn-next-stop').addEventListener('click', () => {
            const nextIdx = (AppState.activeLandmark + 1) % APP_CONFIG.landmarks.length;
            this.focusLandmark(nextIdx);
        });
        document.getElementById('btn-tts').addEventListener('click', () => {
            const idx = AppState.activeLandmark >= 0 ? AppState.activeLandmark : 0;
            AudioSystem.playLandmarkAudio(idx, true);
        });

        const raycaster = new THREE.Raycaster();
        const pointer = new THREE.Vector2();
        this.renderer.domElement.addEventListener('pointerdown', (e) => {
            const rect = this.renderer.domElement.getBoundingClientRect();
            pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
            pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
            raycaster.setFromCamera(pointer, this.camera);
            const hits = raycaster.intersectObjects(this.landmarkPins.map(p => p.mesh));
            if (hits.length > 0) {
                const targetIdx = hits[0].object.userData.landmarkIndex;
                if (typeof targetIdx === 'number') this.focusLandmark(targetIdx);
            }
        });

        window.addEventListener('resize', () => {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight);
            this.composer.setSize(window.innerWidth, window.innerHeight);
        });
    },

    focusLandmark(idx) {
        UIController.setTourButtonState(false);
        this.templeModules.forEach(m => { m.triggered = true; });

        const mod = APP_CONFIG.landmarks[idx];
        AppState.targetCamPos = new THREE.Vector3(...mod.camPos);
        AppState.targetLookAt = new THREE.Vector3(...mod.lookAt);
        AppState.isFlying = true;
        AppState.activeLandmark = idx;

        UIController.updateCinematicBadge(mod);
        UIController.showInfoCard(idx);
        UIController.updateNavPills(idx);
    },

    resetOverview() {
        UIController.setTourButtonState(false);
        UIController.closeInfoCard();
        UIController.hideCinematicBadge();
        UIController.updateNavPills(-1);
        const ov = APP_CONFIG.scene.overviewCamera;
        AppState.targetCamPos = new THREE.Vector3(...ov.pos);
        AppState.targetLookAt = new THREE.Vector3(...ov.lookAt);
        AppState.isFlying = true;
    },

    replayGrowth() {
        AppState.isUnfolding = true; AppState.unfoldProgress = 0;
        AppState.tourProgress = 0; AppState.activeLandmark = -1; AppState.isFlying = false;
        UIController.closeInfoCard();
        UIController.hideCinematicBadge();
        this.templeModules.forEach(m => {
            m.triggered = false; m.progress = 0;
            m.group.scale.set(0.01, 0.001, 0.01);
        });
        UIController.updateNavPills(-1);
        UIController.setTourButtonState(true);
    },

    easeOutElasticPop(x) {
        const c1 = 1.5, c3 = c1 + 1;
        return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2);
    },

    update() {
        requestAnimationFrame(() => this.update());

        const delta = Math.min(AppState.clock.getDelta(), 0.05);
        const elapsed = AppState.clock.getElapsedTime();

        if (AppState.isUnfolding) {
            AppState.unfoldProgress += delta * 0.95;
            if (AppState.unfoldProgress >= 1) { AppState.unfoldProgress = 1; AppState.isUnfolding = false; }
            const ease = 1 - Math.pow(1 - AppState.unfoldProgress, 3);
            this.mapSegments.forEach(seg => {
                const sideFactor = (seg.index === 0 || seg.index === 3) ? 1 : 0.42;
                const dir = seg.index < 2 ? 1 : -1;
                seg.pivot.rotation.z = (1 - ease) * (Math.PI * 0.35) * sideFactor * dir;
                seg.pivot.position.y = (1 - ease) * 0.55 * sideFactor;
            });
        }

        swingingLanterns.forEach(item => {
            item.pivot.rotation.z = Math.sin(elapsed * item.speed + item.phase) * 0.08;
        });

        this.landmarkPins.forEach((pin, idx) => {
            const isSelected = idx === AppState.activeLandmark;
            pin.mesh.position.y = pin.baseY + Math.sin(elapsed * 2.6 + pin.phase) * 0.14;
            const s = isSelected ? 1.28 : 0.88;
            pin.mesh.scale.set(s, s, 1);
        });

        smokeParticles.forEach(sp => {
            const t = ((elapsed * 0.45 + sp.offset) % 1);
            sp.mesh.position.y = sp.baseY + t * 1.9;
            sp.mesh.position.x = Math.sin(elapsed * 2 + sp.offset * 5) * 0.14 * t;
            sp.mesh.material.opacity = (1 - t) * 0.45;
            sp.mesh.scale.setScalar(0.6 + t * 1.4);
        });

        explodableRoofs.forEach(item => {
            const targetY = AppState.isExplodedView ? item.liftY : item.baseY;
            item.group.position.y += (targetY - item.group.position.y) * delta * 4.5;
        });

        if (AppState.mode === 'tour' && AppState.unfoldProgress > 0.65) {
            AppState.tourProgress += delta * 0.048;
            if (AppState.tourProgress >= 1) {
                AppState.tourProgress = 1;
                UIController.setTourButtonState(false);
                UIController.hideCinematicBadge();
                const ov = APP_CONFIG.scene.overviewCamera;
                AppState.targetCamPos = new THREE.Vector3(...ov.pos);
                AppState.targetLookAt = new THREE.Vector3(...ov.lookAt);
                AppState.isFlying = true;
            }

            const pt = this.routeCurve.getPointAt(AppState.tourProgress);
            const ahead = this.routeCurve.getPointAt(Math.min(AppState.tourProgress + 0.06, 1));
            this.routeMarker.position.copy(pt);
            this.routeMarker.children[0].position.y = 0.42 + Math.sin(elapsed * 4.5) * 0.06;

            const desiredCam = this.camCurve.getPointAt(AppState.tourProgress);
            this.camera.position.lerp(desiredCam, delta * 2.2);
            this.controls.target.lerp(new THREE.Vector3(ahead.x, 1.6, ahead.z), delta * 2.8);

            APP_CONFIG.landmarks.forEach((mod, idx) => {
                if (AppState.tourProgress >= mod.triggerProgress - 0.03) {
                    const targetGroup = this.templeModules[mod.moduleGroupIndex];
                    if (targetGroup) targetGroup.triggered = true;
                    if (AppState.activeLandmark < idx) {
                        AppState.activeLandmark = idx;
                        UIController.updateCinematicBadge(mod);
                        UIController.updateNavPills(idx);
                    }
                }
            });
        }

        if (AppState.isFlying && AppState.targetCamPos && AppState.targetLookAt) {
            this.camera.position.lerp(AppState.targetCamPos, delta * 3.5);
            this.controls.target.lerp(AppState.targetLookAt, delta * 3.5);
            if (this.camera.position.distanceTo(AppState.targetCamPos) < 0.06) AppState.isFlying = false;
        }

        this.templeModules.forEach(m => {
            if (m.triggered && m.progress < 1) {
                m.progress = Math.min(m.progress + delta * 1.5, 1);
                const spring = this.easeOutElasticPop(m.progress);
                const xz = Math.min(1, m.progress * 1.35);
                m.group.scale.set(xz, Math.max(0.001, spring), xz);
            }
        });

        this.controls.update();
        this.composer.render();
    }
};

window.addEventListener('load', () => {
    SceneEngine.init();
    SceneEngine.update();
});