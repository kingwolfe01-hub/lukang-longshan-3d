/**
 * ============================================================================
 * 【模組 2：materials.js PBR 材質與程序化貼圖生成工廠】
 *  ★ 負責紅磚、黑瓦、老柚木、石材、彩繪門神與古宣紙底圖紋理快取
 * ============================================================================
 */
export const MaterialLib = {
    cache: {},

    getBrickMaterial() {
        if (this.cache.brick) return this.cache.brick;
        const w = 512, h = 512;
        const colC = document.createElement('canvas'); colC.width = w; colC.height = h;
        const ctx = colC.getContext('2d');
        const bumpC = document.createElement('canvas'); bumpC.width = w; bumpC.height = h;
        const bCtx = bumpC.getContext('2d');

        ctx.fillStyle = '#cbbca8'; ctx.fillRect(0, 0, w, h);
        bCtx.fillStyle = '#242424'; bCtx.fillRect(0, 0, w, h);

        const rows = 16, cols = 8, bh = h / rows, bw = w / cols;
        const tones = ['#963826', '#822c1c', '#a84431', '#732416', '#b04e39'];

        for (let r = 0; r < rows; r++) {
            const shift = (r % 2) * (bw * 0.5);
            for (let c = -1; c <= cols; c++) {
                const x = c * bw + shift, y = r * bh;
                ctx.fillStyle = tones[(r * 7 + c * 13 + 40) % tones.length];
                ctx.fillRect(x + 2, y + 2, bw - 4, bh - 4);
                if ((r + c) % 3 === 0) {
                    ctx.fillStyle = 'rgba(35, 20, 15, 0.2)';
                    ctx.fillRect(x + 3, y + 3, bw * 0.6, bh * 0.55);
                }
                bCtx.fillStyle = '#e2e2e2';
                bCtx.fillRect(x + 2.5, y + 2.5, bw - 5, bh - 5);
            }
        }
        const map = new THREE.CanvasTexture(colC);
        map.wrapS = map.wrapT = THREE.RepeatWrapping; map.repeat.set(2, 2); map.encoding = THREE.sRGBEncoding;
        const bumpMap = new THREE.CanvasTexture(bumpC);
        bumpMap.wrapS = bumpMap.wrapT = THREE.RepeatWrapping; bumpMap.repeat.set(2, 2);

        this.cache.brick = new THREE.MeshStandardMaterial({ map, bumpMap, bumpScale: 0.035, roughness: 0.92, metalness: 0.02 });
        return this.cache.brick;
    },

    getRoofMaterial(isGoldGlaze = false) {
        const key = isGoldGlaze ? 'goldRoof' : 'darkRoof';
        if (this.cache[key]) return this.cache[key];
        this.cache[key] = new THREE.MeshStandardMaterial({
            color: isGoldGlaze ? '#9c4316' : '#262423',
            roughness: isGoldGlaze ? 0.82 : 0.88,
            metalness: isGoldGlaze ? 0.06 : 0.03
        });
        return this.cache[key];
    },

    getWoodMaterial(isCrimson = false) {
        const key = isCrimson ? 'crimsonWood' : 'darkWood';
        if (this.cache[key]) return this.cache[key];
        const canvas = document.createElement('canvas'); canvas.width = 256; canvas.height = 256;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = isCrimson ? '#6e1910' : '#3b1f10';
        ctx.fillRect(0, 0, 256, 256);
        for (let i = 0; i < 360; i++) {
            ctx.fillStyle = 'rgba(15, 6, 2, 0.25)';
            ctx.fillRect(0, Math.random() * 256, 256, Math.random() * 2.5 + 1);
        }
        const tex = new THREE.CanvasTexture(canvas); tex.encoding = THREE.sRGBEncoding;
        this.cache[key] = new THREE.MeshStandardMaterial({ map: tex, bumpMap: tex, bumpScale: 0.015, roughness: 0.84, metalness: 0.02 });
        return this.cache[key];
    },

    getStoneMaterial() {
        if (this.cache.stone) return this.cache.stone;
        const canvas = document.createElement('canvas'); canvas.width = 256; canvas.height = 256;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#857f76'; ctx.fillRect(0, 0, 256, 256);
        for (let i = 0; i < 2500; i++) {
            const v = 100 + Math.floor(Math.random() * 50);
            ctx.fillStyle = `rgba(${v},${v - 4},${v - 10},0.38)`;
            ctx.fillRect(Math.random() * 256, Math.random() * 256, 3, 3);
        }
        const tex = new THREE.CanvasTexture(canvas); tex.encoding = THREE.sRGBEncoding;
        this.cache.stone = new THREE.MeshStandardMaterial({ map: tex, bumpMap: tex, bumpScale: 0.022, roughness: 0.9, metalness: 0.02 });
        return this.cache.stone;
    },

    getDoorGodMaterial(isLeft = true) {
        const key = isLeft ? 'doorGodL' : 'doorGodR';
        if (this.cache[key]) return this.cache[key];
        const canvas = document.createElement('canvas'); canvas.width = 256; canvas.height = 512;
        const ctx = canvas.getContext('2d');

        ctx.fillStyle = '#7a1c12'; ctx.fillRect(0, 0, 256, 512);
        ctx.strokeStyle = '#e0a93b'; ctx.lineWidth = 10; ctx.strokeRect(10, 10, 236, 492);

        ctx.fillStyle = isLeft ? '#295b7a' : '#3a6b48';
        ctx.beginPath(); ctx.ellipse(128, 280, 62, 125, 0, 0, Math.PI * 2); ctx.fill();
        ctx.strokeStyle = '#f2c14e'; ctx.lineWidth = 5; ctx.stroke();

        for (let y = 200; y < 350; y += 22) {
            ctx.beginPath(); ctx.arc(128, y, 36, 0.2, Math.PI - 0.2); ctx.stroke();
        }

        ctx.fillStyle = '#f0c49b';
        ctx.beginPath(); ctx.arc(128, 130, 34, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#1f1612';
        ctx.fillRect(96, 84, 64, 24);
        ctx.fillStyle = '#e0a93b';
        ctx.fillRect(104, 76, 48, 12);

        ctx.strokeStyle = '#f7d165'; ctx.lineWidth = 8;
        ctx.beginPath();
        ctx.moveTo(isLeft ? 175 : 81, 90);
        ctx.lineTo(isLeft ? 85 : 171, 410);
        ctx.stroke();

        const tex = new THREE.CanvasTexture(canvas); tex.encoding = THREE.sRGBEncoding;
        this.cache[key] = new THREE.MeshStandardMaterial({ map: tex, roughness: 0.45 });
        return this.cache[key];
    },

    getParchmentBaseMaterial() {
        if (this.cache.parchment) return this.cache.parchment;
        const w = 2048, h = 2560;
        const canvas = document.createElement('canvas'); canvas.width = w; canvas.height = h;
        const ctx = canvas.getContext('2d');

        const grad = ctx.createRadialGradient(w / 2, h / 2, 200, w / 2, h / 2, 1650);
        grad.addColorStop(0, '#c7b08a');
        grad.addColorStop(0.68, '#ad936b');
        grad.addColorStop(1, '#8c724c');
        ctx.fillStyle = grad; ctx.fillRect(0, 0, w, h);

        for (let i = 0; i < 65000; i++) {
            const a = Math.random() * 0.06;
            ctx.fillStyle = Math.random() > 0.5 ? `rgba(72, 48, 24, ${a})` : `rgba(235, 215, 180, ${a * 0.9})`;
            ctx.fillRect(Math.random() * w, Math.random() * h, 2, 1);
        }

        ctx.strokeStyle = 'rgba(65, 42, 22, 0.32)'; ctx.lineWidth = 4;
        [512, 1024, 1536].forEach(x => { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke(); });
        [853, 1706].forEach(y => { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke(); });

        ctx.fillStyle = 'rgba(138, 52, 34, 0.20)';
        ctx.fillRect(w / 2 - 265, 240, 530, 2080);
        ctx.strokeStyle = 'rgba(110, 40, 26, 0.45)'; ctx.lineWidth = 4;
        ctx.strokeRect(w / 2 - 265, 240, 530, 2080);

        ctx.strokeStyle = '#5c321b'; ctx.lineWidth = 8;
        ctx.strokeRect(48, 48, w - 96, h - 96);
        ctx.lineWidth = 3;
        ctx.strokeRect(64, 64, w - 128, h - 128);

        ctx.fillStyle = 'rgba(166, 44, 30, 0.92)';
        ctx.fillRect(1720, 2180, 165, 195);
        ctx.strokeStyle = '#e6d3b3'; ctx.lineWidth = 4;
        ctx.strokeRect(1730, 2190, 145, 175);
        ctx.fillStyle = '#e6d3b3';
        ctx.font = 'bold 40px "Noto Serif TC", serif';
        ctx.textAlign = 'center';
        ctx.fillText('鹿港', 1802, 2248);
        ctx.fillText('龍山寺', 1802, 2306);
        ctx.font = 'bold 20px "Inter", sans-serif';
        ctx.fillText('EST. 1786', 1802, 2348);

        const tex = new THREE.CanvasTexture(canvas);
        tex.encoding = THREE.sRGBEncoding; tex.anisotropy = 8;
        this.cache.parchment = new THREE.MeshStandardMaterial({ map: tex, bumpMap: tex, bumpScale: 0.015, roughness: 0.95, metalness: 0.0 });
        return this.cache.parchment;
    }
};