/**
 * ============================================================================
 * 【模組 3：components.js 3D 傳統建築構件工廠】
 *  ★ 提供可重複使用的 3D 零件：筒瓦屋頂、龍柱、夔龍窗、石獅、憨番、燈籠、榕樹、惜字亭
 * ============================================================================
 */
import { MaterialLib } from './materials.js';

export const swingingLanterns = [];

export const TempleComponentFactory = {
    createTiledRoof(width, depth, height, isGoldGlaze = false, hasSwallowtail = true, hasJiannian = false) {
        const roofGroup = new THREE.Group();
        const tileMat = MaterialLib.getRoofMaterial(isGoldGlaze);

        const slopeAngle = Math.atan2(height, depth * 0.5);
        const slopeLen = Math.hypot(depth * 0.5, height);

        const baseGeo = new THREE.BoxGeometry(width, 0.12, slopeLen);
        const frontSlope = new THREE.Mesh(baseGeo, tileMat);
        frontSlope.position.set(0, height * 0.5, depth * 0.25);
        frontSlope.rotation.x = slopeAngle;
        frontSlope.castShadow = true; frontSlope.receiveShadow = true;
        roofGroup.add(frontSlope);

        const backSlope = new THREE.Mesh(baseGeo, tileMat);
        backSlope.position.set(0, height * 0.5, -depth * 0.25);
        backSlope.rotation.x = -slopeAngle;
        backSlope.castShadow = true; backSlope.receiveShadow = true;
        roofGroup.add(backSlope);

        const tileSpacing = 0.14;
        const cols = Math.floor((width - 0.1) / tileSpacing);
        const cylGeo = new THREE.CylinderGeometry(0.06, 0.06, slopeLen + 0.06, 8, 1, false, 0, Math.PI);
        const instancedTiles = new THREE.InstancedMesh(cylGeo, tileMat, cols * 2);
        instancedTiles.castShadow = true;

        const dummy = new THREE.Object3D();
        let idx = 0;
        const startX = -((cols - 1) * tileSpacing) / 2;
        for (let c = 0; c < cols; c++) {
            const x = startX + c * tileSpacing;
            dummy.position.set(x, height * 0.5 + 0.045, depth * 0.25 + 0.02);
            dummy.rotation.set(slopeAngle - Math.PI / 2, 0, 0);
            dummy.updateMatrix();
            instancedTiles.setMatrixAt(idx++, dummy.matrix);

            dummy.position.set(x, height * 0.5 + 0.045, -depth * 0.25 - 0.02);
            dummy.rotation.set(-slopeAngle - Math.PI / 2, 0, 0);
            dummy.updateMatrix();
            instancedTiles.setMatrixAt(idx++, dummy.matrix);
        }
        roofGroup.add(instancedTiles);

        const ridgeMat = new THREE.MeshStandardMaterial({ color: '#d4882a', roughness: 0.38, metalness: 0.22 });
        if (hasSwallowtail) {
            const curve = new THREE.CatmullRomCurve3([
                new THREE.Vector3(-width * 0.58, height + 0.34, 0),
                new THREE.Vector3(-width * 0.28, height + 0.06, 0),
                new THREE.Vector3(0, height + 0.05, 0),
                new THREE.Vector3(width * 0.28, height + 0.06, 0),
                new THREE.Vector3(width * 0.58, height + 0.34, 0)
            ]);
            const ridgeMesh = new THREE.Mesh(new THREE.TubeGeometry(curve, 28, 0.08, 8, false), ridgeMat);
            ridgeMesh.castShadow = true;
            roofGroup.add(ridgeMesh);

            if (hasJiannian) {
                const jiannianColors = ['#2e8b57', '#d93829', '#e6b422', '#2b6cb0'];
                [-0.32, -0.16, 0, 0.16, 0.32].forEach((rx, idx) => {
                    const ornament = new THREE.Mesh(
                        idx === 2 ? new THREE.OctahedronGeometry(0.16, 0) : new THREE.DodecahedronGeometry(0.11, 0),
                        new THREE.MeshStandardMaterial({
                            color: jiannianColors[idx % jiannianColors.length],
                            roughness: 0.32,
                            metalness: 0.2
                        })
                    );
                    ornament.position.set(width * rx, height + (idx === 2 ? 0.24 : 0.17), 0);
                    roofGroup.add(ornament);
                });
            }
        } else {
            const ridge = new THREE.Mesh(new THREE.BoxGeometry(width + 0.12, 0.14, 0.16), ridgeMat);
            ridge.position.set(0, height + 0.04, 0);
            roofGroup.add(ridge);
        }

        return roofGroup;
    },

    createDragonPillar(height = 2.4, radius = 0.14) {
        const group = new THREE.Group();
        const stoneMat = MaterialLib.getStoneMaterial();
        const goldMat = new THREE.MeshStandardMaterial({ color: '#cfa03c', metalness: 0.55, roughness: 0.32 });

        const pillar = new THREE.Mesh(new THREE.CylinderGeometry(radius, radius + 0.01, height, 16), stoneMat);
        pillar.position.y = height / 2;
        pillar.castShadow = true;
        group.add(pillar);

        const dragonPts = [];
        for (let s = 0; s <= 24; s++) {
            const t = s / 24;
            const ang = t * Math.PI * 4.5;
            dragonPts.push(new THREE.Vector3(Math.cos(ang) * (radius + 0.045), 0.2 + t * (height - 0.35), Math.sin(ang) * (radius + 0.045)));
        }
        const dragonBody = new THREE.Mesh(
            new THREE.TubeGeometry(new THREE.CatmullRomCurve3(dragonPts), 32, 0.042, 8, false),
            goldMat
        );
        group.add(dragonBody);
        return group;
    },

    createKuiDragonWindow(radius = 0.44) {
        const group = new THREE.Group();
        const woodMat = MaterialLib.getWoodMaterial(false);
        const goldMat = new THREE.MeshStandardMaterial({ color: '#d99e32', roughness: 0.4, metalness: 0.35 });

        const octFrame = new THREE.Mesh(new THREE.TorusGeometry(radius, 0.055, 8, 8), woodMat);
        octFrame.rotation.z = Math.PI / 8;
        octFrame.castShadow = true;
        group.add(octFrame);

        const backing = new THREE.Mesh(
            new THREE.CircleGeometry(radius * 0.92, 8),
            new THREE.MeshStandardMaterial({ color: '#edd4a6', emissive: '#ffaa44', emissiveIntensity: 0.25 })
        );
        backing.rotation.z = Math.PI / 8;
        backing.position.z = -0.02;
        group.add(backing);

        for (let i = 0; i < 4; i++) {
            const bar = new THREE.Mesh(new THREE.BoxGeometry(radius * 1.75, 0.03, 0.03), woodMat);
            bar.rotation.z = (i * Math.PI) / 4;
            bar.position.z = 0.01;
            group.add(bar);
        }
        [-0.12, 0.12].forEach((cx, idx) => {
            const carp = new THREE.Mesh(new THREE.SphereGeometry(0.085, 12, 10), goldMat);
            carp.scale.set(0.65, 1.5, 0.35);
            carp.position.set(cx, 0, 0.025);
            carp.rotation.z = idx === 0 ? -0.25 : 0.25;
            group.add(carp);
        });

        return group;
    },

    createGuardianLion(isMale = true) {
        const group = new THREE.Group();
        const stoneMat = MaterialLib.getStoneMaterial();

        const base = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.36, 0.56), stoneMat);
        base.position.y = 0.18;
        base.castShadow = true; base.receiveShadow = true;
        group.add(base);

        const torso = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.17, 0.36, 12), stoneMat);
        torso.position.set(0, 0.52, -0.04);
        torso.rotation.x = 0.22;
        torso.castShadow = true;
        group.add(torso);

        const head = new THREE.Mesh(new THREE.DodecahedronGeometry(0.16, 1), stoneMat);
        head.position.set(0, 0.72, 0.06);
        head.castShadow = true;
        group.add(head);

        const sphere = new THREE.Mesh(
            new THREE.SphereGeometry(0.085, 12, 12),
            new THREE.MeshStandardMaterial({ color: isMale ? '#c49035' : '#9c968c', roughness: 0.4 })
        );
        sphere.position.set(isMale ? -0.08 : 0.08, 0.42, 0.16);
        group.add(sphere);

        return group;
    },

    createCornerAtlas() {
        const group = new THREE.Group();
        const bodyMat = new THREE.MeshStandardMaterial({ color: '#b56e43', roughness: 0.5 });
        const tunicMat = new THREE.MeshStandardMaterial({ color: '#2b5876', roughness: 0.6 });

        const body = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.11, 0.28, 10), tunicMat);
        body.position.y = 0.14;
        group.add(body);

        const head = new THREE.Mesh(new THREE.SphereGeometry(0.085, 12, 12), bodyMat);
        head.position.y = 0.34;
        group.add(head);

        [-0.1, 0.1].forEach(ax => {
            const arm = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.24, 8), bodyMat);
            arm.position.set(ax, 0.36, 0.02);
            arm.rotation.z = ax < 0 ? 0.35 : -0.35;
            group.add(arm);
        });
        return group;
    },

    createSwingingLantern(scale = 1.0) {
        const pivot = new THREE.Group();
        const cord = new THREE.Mesh(new THREE.CylinderGeometry(0.01, 0.01, 0.28 * scale, 6), new THREE.MeshBasicMaterial({ color: '#2b180c' }));
        cord.position.y = -0.14 * scale;
        pivot.add(cord);

        const bodyGeo = new THREE.SphereGeometry(0.2 * scale, 16, 14);
        bodyGeo.scale(1, 1.18, 1);
        const bodyMat = new THREE.MeshStandardMaterial({
            color: '#e02916',
            emissive: '#ff4d1a',
            emissiveIntensity: 0.72,
            roughness: 0.38
        });
        const body = new THREE.Mesh(bodyGeo, bodyMat);
        body.position.y = -0.42 * scale;
        pivot.add(body);

        const goldMat = new THREE.MeshStandardMaterial({ color: '#e3ad3b', metalness: 0.6, roughness: 0.3 });
        const topCap = new THREE.Mesh(new THREE.CylinderGeometry(0.1 * scale, 0.1 * scale, 0.045 * scale, 12), goldMat);
        topCap.position.y = -0.21 * scale;
        const botCap = topCap.clone();
        botCap.position.y = -0.63 * scale;
        pivot.add(topCap, botCap);

        swingingLanterns.push({ pivot, phase: Math.random() * Math.PI * 2, speed: 1.8 + Math.random() * 0.7 });
        return pivot;
    },

    createPlaque(text, w = 1.4, h = 0.42) {
        const canvas = document.createElement('canvas'); canvas.width = 512; canvas.height = 160;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#210f07'; ctx.fillRect(0, 0, 512, 160);
        ctx.strokeStyle = '#e6b145'; ctx.lineWidth = 12; ctx.strokeRect(10, 10, 492, 140);
        ctx.fillStyle = '#f5c85c'; ctx.font = 'bold 76px "Noto Serif TC", serif';
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.fillText(text, 256, 84);
        const tex = new THREE.CanvasTexture(canvas); tex.encoding = THREE.sRGBEncoding;
        const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, 0.08), new THREE.MeshStandardMaterial({ map: tex, roughness: 0.35 }));
        mesh.castShadow = true;
        return mesh;
    },

    createBanyanTree(scale = 1.0) {
        const group = new THREE.Group();
        const barkMat = new THREE.MeshStandardMaterial({ color: '#453022', roughness: 0.92 });
        const leafColors = ['#2f5228', '#3c6632', '#4c783d'];

        const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.18 * scale, 0.32 * scale, 1.35 * scale, 10), barkMat);
        trunk.position.y = 0.675 * scale;
        trunk.castShadow = true;
        group.add(trunk);

        [[-0.35, 1.2, 0.25, 0.35], [0.35, 1.25, -0.2, -0.32], [0, 1.3, 0.35, 0.2]].forEach(([bx, by, bz, rz]) => {
            const branch = new THREE.Mesh(new THREE.CylinderGeometry(0.08 * scale, 0.14 * scale, 0.85 * scale, 8), barkMat);
            branch.position.set(bx * scale, by * scale, bz * scale);
            branch.rotation.z = rz;
            branch.castShadow = true;
            group.add(branch);
        });

        const crownOffsets = [
            [0, 2.05, 0, 0.95], [-0.62, 1.78, 0.35, 0.68], [0.65, 1.82, 0.28, 0.72],
            [-0.35, 1.75, -0.58, 0.66], [0.42, 1.85, -0.52, 0.65], [0, 2.38, -0.1, 0.62]
        ];
        crownOffsets.forEach(([cx, cy, cz, cr], idx) => {
            const leafMat = new THREE.MeshStandardMaterial({ color: leafColors[idx % leafColors.length], roughness: 0.86 });
            const crown = new THREE.Mesh(new THREE.DodecahedronGeometry(cr * scale, 1), leafMat);
            crown.position.set(cx * scale, cy * scale, cz * scale);
            crown.scale.set(1.15, 0.78, 1.15);
            crown.castShadow = true; crown.receiveShadow = true;
            group.add(crown);
        });

        return group;
    },

    createXiziting() {
        const group = new THREE.Group();
        const brickMat = MaterialLib.getBrickMaterial();
        const stoneMat = MaterialLib.getStoneMaterial();
        const tileMat = MaterialLib.getRoofMaterial(true);

        const base = new THREE.Mesh(new THREE.CylinderGeometry(0.68, 0.76, 0.35, 6), stoneMat);
        base.position.y = 0.175; base.castShadow = true; base.receiveShadow = true;
        group.add(base);

        const lowerBody = new THREE.Mesh(new THREE.CylinderGeometry(0.52, 0.56, 0.85, 6), brickMat);
        lowerBody.position.y = 0.775; lowerBody.castShadow = true;
        group.add(lowerBody);

        const furnaceOpening = new THREE.Mesh(
            new THREE.BoxGeometry(0.32, 0.36, 0.14),
            new THREE.MeshStandardMaterial({ color: '#1a0c06', emissive: '#ff6a1a', emissiveIntensity: 0.55 })
        );
        furnaceOpening.position.set(0, 0.72, 0.45);
        group.add(furnaceOpening);

        const midEave = new THREE.Mesh(new THREE.ConeGeometry(0.78, 0.32, 6), tileMat);
        midEave.position.y = 1.32; midEave.castShadow = true;
        const upperBody = new THREE.Mesh(new THREE.CylinderGeometry(0.36, 0.40, 0.62, 6), brickMat);
        upperBody.position.y = 1.72; upperBody.castShadow = true;
        group.add(midEave, upperBody);

        const topRoof = new THREE.Mesh(new THREE.ConeGeometry(0.62, 0.42, 6), tileMat);
        topRoof.position.y = 2.22; topRoof.castShadow = true;
        const finial = new THREE.Mesh(
            new THREE.SphereGeometry(0.11, 12, 12),
            new THREE.MeshStandardMaterial({ color: '#e3ad3b', metalness: 0.65, roughness: 0.25 })
        );
        finial.position.y = 2.48;
        group.add(topRoof, finial);

        return group;
    },

    createNumberBadgeSprite(numText) {
        const canvas = document.createElement('canvas');
        canvas.width = 128; canvas.height = 128;
        const ctx = canvas.getContext('2d');

        ctx.beginPath();
        ctx.arc(64, 64, 54, 0, Math.PI * 2);
        ctx.fillStyle = '#cf3220';
        ctx.fill();
        ctx.lineWidth = 7;
        ctx.strokeStyle = '#fff8eb';
        ctx.stroke();

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 54px "Inter", sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(numText, 64, 67);

        const tex = new THREE.CanvasTexture(canvas);
        tex.encoding = THREE.sRGBEncoding;
        const mat = new THREE.SpriteMaterial({ map: tex, transparent: true });
        const sprite = new THREE.Sprite(mat);
        sprite.scale.set(0.88, 0.88, 1);
        return sprite;
    }
};