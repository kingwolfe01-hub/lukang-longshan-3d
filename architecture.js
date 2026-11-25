/**
 * ============================================================================
 * 【模組 4：architecture.js 寺廟八大建築群組裝器】
 *  ★ 獨立管理各進殿宇的組裝，方便日後單獨修改某一進建築的細節
 * ============================================================================
 */
import { MaterialLib } from './materials.js';
import { TempleComponentFactory } from './components.js';

export const explodableRoofs = [];
export const smokeParticles = [];

export const TempleArchitectureBuilder = {
    buildAll(scene) {
        const modules = [];
        modules.push(this.buildGateAndPlaza(scene));         // 0: 山門與前埕
        modules.push(this.buildXizitingModule(scene));       // 1: 惜字亭
        modules.push(this.buildFiveGateHall(scene));         // 2: 五門殿
        modules.push(this.buildCarvingDetails(scene));       // 3: 夔龍窗與憨番
        modules.push(this.buildStageAndCaisson(scene));      // 4: 戲台與八卦藻井
        modules.push(this.buildWorshipHallAndWells(scene));  // 5: 拜殿與龍虎井
        modules.push(this.buildMainHallAndCorridors(scene)); // 6: 正殿、廂廊、記碑與古鐘
        modules.push(this.buildRearHallAndWell(scene));      // 7: 後殿與龍泉井

        modules.forEach(m => m.group.scale.set(0.01, 0.001, 0.01));
        return modules;
    },

    buildGateAndPlaza(scene) {
        const brickMat = MaterialLib.getBrickMaterial();
        const stoneMat = MaterialLib.getStoneMaterial();
        const crimsonWood = MaterialLib.getWoodMaterial(true);

        const mod0 = new THREE.Group();
        mod0.position.set(0, 0, 23.0);

        const gatePlinth = new THREE.Mesh(new THREE.BoxGeometry(4.6, 0.24, 2.2), stoneMat);
        gatePlinth.position.y = 0.12; gatePlinth.receiveShadow = true;
        mod0.add(gatePlinth);

        [-1.8, -0.75, 0.75, 1.8].forEach(px => {
            [-0.65, 0.65].forEach(pz => {
                const col = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.12, 2.3, 14), crimsonWood);
                col.position.set(px, 1.35, pz);
                col.castShadow = true;
                mod0.add(col);
            });
        });

        const gateRoof = TempleComponentFactory.createTiledRoof(5.0, 2.4, 1.15, true, true, true);
        gateRoof.position.set(0, 2.45, 0);
        mod0.add(gateRoof);

        const gatePlaque = TempleComponentFactory.createPlaque('龍山寺', 1.35, 0.42);
        gatePlaque.position.set(0, 2.32, 0.72);
        mod0.add(gatePlaque);

        [-1.25, 1.25].forEach(lx => {
            const lantern = TempleComponentFactory.createSwingingLantern(1.0);
            lantern.position.set(lx, 2.38, 0.85);
            mod0.add(lantern);
        });

        [-3.6, 3.6].forEach(wx => {
            const frontLowWall = new THREE.Mesh(new THREE.BoxGeometry(2.6, 1.05, 0.26), brickMat);
            frontLowWall.position.set(wx, 0.525, 0);
            frontLowWall.castShadow = true; frontLowWall.receiveShadow = true;
            const wallTile = TempleComponentFactory.createTiledRoof(2.7, 0.52, 0.22, false, false, false);
            wallTile.position.set(wx, 1.05, 0);
            mod0.add(frontLowWall, wallTile);
        });

        [-4.85, 4.85].forEach(sx => {
            const sidePlazaWall = new THREE.Mesh(new THREE.BoxGeometry(0.26, 1.15, 7.6), brickMat);
            sidePlazaWall.position.set(sx, 0.575, -3.8);
            sidePlazaWall.castShadow = true; sidePlazaWall.receiveShadow = true;
            const sideWallRoof = TempleComponentFactory.createTiledRoof(7.7, 0.54, 0.24, false, false, false);
            sideWallRoof.rotation.y = Math.PI / 2;
            sideWallRoof.position.set(sx, 1.15, -3.8);
            mod0.add(sidePlazaWall, sideWallRoof);
        });

        const frontTreeL = TempleComponentFactory.createBanyanTree(1.05);
        frontTreeL.position.set(-3.3, 0, -1.6);
        const frontTreeR = TempleComponentFactory.createBanyanTree(1.18);
        frontTreeR.position.set(2.9, 0, -2.2);
        mod0.add(frontTreeL, frontTreeR);

        scene.add(mod0);
        return { group: mod0, progress: 0, triggered: false };
    },

    buildXizitingModule(scene) {
        const modXizi = new THREE.Group();
        modXizi.position.set(-3.3, 0, 18.6);
        modXizi.add(TempleComponentFactory.createXiziting());
        scene.add(modXizi);
        return { group: modXizi, progress: 0, triggered: false };
    },

    buildFiveGateHall(scene) {
        const brickMat = MaterialLib.getBrickMaterial();
        const stoneMat = MaterialLib.getStoneMaterial();
        const crimsonWood = MaterialLib.getWoodMaterial(true);

        const mod1 = new THREE.Group();
        mod1.position.set(0, 0, 14.2);

        const hallPlinth = new THREE.Mesh(new THREE.BoxGeometry(7.8, 0.3, 3.0), stoneMat);
        hallPlinth.position.y = 0.15; hallPlinth.receiveShadow = true;
        mod1.add(hallPlinth);

        const hallBody = new THREE.Mesh(new THREE.BoxGeometry(7.2, 2.2, 2.2), brickMat);
        hallBody.position.set(0, 1.4, -0.1);
        hallBody.castShadow = true; hallBody.receiveShadow = true;
        mod1.add(hallBody);

        [-0.82, 0.82].forEach(px => {
            const dp = TempleComponentFactory.createDragonPillar(2.15, 0.12);
            dp.position.set(px, 0.3, 1.18);
            mod1.add(dp);
        });

        const doorL = new THREE.Mesh(new THREE.BoxGeometry(0.68, 1.7, 0.08), MaterialLib.getDoorGodMaterial(true));
        doorL.position.set(-0.36, 1.15, 1.02);
        const doorR = new THREE.Mesh(new THREE.BoxGeometry(0.68, 1.7, 0.08), MaterialLib.getDoorGodMaterial(false));
        doorR.position.set(0.36, 1.15, 1.02);
        mod1.add(doorL, doorR);

        [-1.35, 1.35].forEach(dx => {
            const sideDoor = new THREE.Mesh(new THREE.BoxGeometry(0.75, 1.5, 0.08), crimsonWood);
            sideDoor.position.set(dx, 1.05, 1.02);
            mod1.add(sideDoor);
        });

        const lionLeft = TempleComponentFactory.createGuardianLion(true);
        lionLeft.position.set(-1.15, 0.3, 1.42);
        const lionRight = TempleComponentFactory.createGuardianLion(false);
        lionRight.position.set(1.15, 0.3, 1.42);
        mod1.add(lionLeft, lionRight);

        const fiveDoorRoofGroup = new THREE.Group();
        const wingRoof = TempleComponentFactory.createTiledRoof(7.6, 2.6, 0.95, false, true, false);
        wingRoof.position.set(0, 2.48, -0.05);
        fiveDoorRoofGroup.add(wingRoof);

        const elevatedBox = new THREE.Mesh(new THREE.BoxGeometry(2.8, 0.65, 2.1), crimsonWood);
        elevatedBox.position.set(0, 2.85, -0.05);
        fiveDoorRoofGroup.add(elevatedBox);

        const elevatedTopRoof = TempleComponentFactory.createTiledRoof(3.2, 2.3, 0.92, true, true, true);
        elevatedTopRoof.position.set(0, 3.12, -0.05);
        fiveDoorRoofGroup.add(elevatedTopRoof);

        const frontExtraEave = TempleComponentFactory.createTiledRoof(2.9, 1.1, 0.45, true, false, false);
        frontExtraEave.position.set(0, 2.52, 0.95);
        fiveDoorRoofGroup.add(frontExtraEave);

        mod1.add(fiveDoorRoofGroup);
        explodableRoofs.push({ group: fiveDoorRoofGroup, baseY: 0, liftY: 2.3 });

        [-2.4, -0.85, 0.85, 2.4].forEach(lx => {
            const l = TempleComponentFactory.createSwingingLantern(0.95);
            l.position.set(lx, 2.42, 1.18);
            mod1.add(l);
        });

        const frontLanternLight = new THREE.PointLight('#ff7726', 1.8, 8.5);
        frontLanternLight.position.set(0, 2.1, 1.2);
        mod1.add(frontLanternLight);

        scene.add(mod1);
        return { group: mod1, progress: 0, triggered: false };
    },

    buildCarvingDetails(scene) {
        const mod2 = new THREE.Group();
        mod2.position.set(0, 0, 14.2);

        [-2.45, 2.45].forEach(wx => {
            const win = TempleComponentFactory.createKuiDragonWindow(0.48);
            win.position.set(wx, 1.45, 1.04);
            mod2.add(win);
        });

        [-3.45, 3.45].forEach(ax => {
            const atlas = TempleComponentFactory.createCornerAtlas();
            atlas.position.set(ax, 2.15, 0.98);
            mod2.add(atlas);
        });

        scene.add(mod2);
        return { group: mod2, progress: 0, triggered: false };
    },

    buildStageAndCaisson(scene) {
        const crimsonWood = MaterialLib.getWoodMaterial(true);
        const darkWood = MaterialLib.getWoodMaterial(false);
        const goldMat = new THREE.MeshStandardMaterial({ color: '#e3ad3b', metalness: 0.65, roughness: 0.25 });

        const mod3 = new THREE.Group();
        mod3.position.set(0, 0, 10.2);

        const stageBase = new THREE.Mesh(new THREE.BoxGeometry(3.4, 0.55, 3.2), crimsonWood);
        stageBase.position.y = 0.275;
        stageBase.castShadow = true; stageBase.receiveShadow = true;
        mod3.add(stageBase);

        [-1.4, 1.4].forEach(px => {
            [-1.3, 1.3].forEach(pz => {
                const col = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.12, 2.4, 14), crimsonWood);
                col.position.set(px, 1.75, pz);
                col.castShadow = true;
                mod3.add(col);
            });
        });

        const caissonGroup = new THREE.Group();
        caissonGroup.position.set(0, 2.75, 0);

        const tiers = 5;
        for (let t = 0; t < tiers; t++) {
            const r = 1.35 - t * 0.22;
            const y = t * 0.16;
            const ring = new THREE.Mesh(
                new THREE.TorusGeometry(r, 0.055, 6, 8),
                t % 2 === 0 ? crimsonWood : goldMat
            );
            ring.rotation.x = Math.PI / 2;
            ring.rotation.z = (t * Math.PI) / 16;
            ring.position.y = y;
            caissonGroup.add(ring);

            for (let b = 0; b < 8; b++) {
                const ang = (b / 8) * Math.PI * 2 + (t * Math.PI) / 16;
                const bracket = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.14, 0.26), darkWood);
                bracket.position.set(Math.cos(ang) * r, y + 0.05, Math.sin(ang) * r);
                bracket.rotation.y = -ang;
                caissonGroup.add(bracket);
            }
        }

        const mirrorTop = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.32, 0.08, 8), goldMat);
        mirrorTop.position.y = tiers * 0.16 + 0.05;
        caissonGroup.add(mirrorTop);
        mod3.add(caissonGroup);

        const stageRoofGroup = new THREE.Group();
        const stageRoof = TempleComponentFactory.createTiledRoof(4.0, 3.8, 1.15, true, true, true);
        stageRoof.position.set(0, 2.95, 0);
        stageRoofGroup.add(stageRoof);
        mod3.add(stageRoofGroup);
        explodableRoofs.push({ group: stageRoofGroup, baseY: 0, liftY: 2.5 });

        const caissonLight = new THREE.PointLight('#ff9436', 2.4, 7.2);
        caissonLight.position.set(0, 2.2, 0);
        mod3.add(caissonLight);

        const courtTreeL = TempleComponentFactory.createBanyanTree(1.22);
        courtTreeL.position.set(-2.3, 0, -2.5);
        const courtTreeR = TempleComponentFactory.createBanyanTree(1.1);
        courtTreeR.position.set(2.4, 0, -4.6);
        mod3.add(courtTreeL, courtTreeR);

        scene.add(mod3);
        return { group: mod3, progress: 0, triggered: false };
    },

    buildWorshipHallAndWells(scene) {
        const brickMat = MaterialLib.getBrickMaterial();
        const stoneMat = MaterialLib.getStoneMaterial();

        const mod4 = new THREE.Group();
        mod4.position.set(0, 0, 0.0);

        const worshipPlinth = new THREE.Mesh(new THREE.BoxGeometry(4.4, 0.28, 2.8), stoneMat);
        worshipPlinth.position.y = 0.14; worshipPlinth.receiveShadow = true;
        mod4.add(worshipPlinth);

        [-1.35, 1.35].forEach(px => {
            const dp = TempleComponentFactory.createDragonPillar(2.5, 0.15);
            dp.position.set(px, 0.25, 0.85);
            mod4.add(dp);
        });

        const worshipRoof = TempleComponentFactory.createTiledRoof(4.8, 3.0, 0.95, false, false, false);
        worshipRoof.position.set(0, 2.7, 0);
        mod4.add(worshipRoof);

        const censer = new THREE.Mesh(
            new THREE.CylinderGeometry(0.32, 0.26, 0.52, 16),
            new THREE.MeshStandardMaterial({ color: '#b58030', metalness: 0.72, roughness: 0.3 })
        );
        censer.position.set(0, 0.54, 1.65);
        censer.castShadow = true;
        mod4.add(censer);

        for (let i = 0; i < 14; i++) {
            const p = new THREE.Mesh(
                new THREE.SphereGeometry(0.055, 8, 8),
                new THREE.MeshBasicMaterial({ color: '#fff8eb', transparent: true, opacity: 0.45 })
            );
            p.position.set((Math.random() - 0.5) * 0.15, 0.85 + i * 0.16, 1.65 + (Math.random() - 0.5) * 0.15);
            mod4.add(p);
            smokeParticles.push({ mesh: p, baseY: 0.85, offset: i * 0.4 });
        }

        [-2.9, 2.9].forEach(wx => {
            const wellGroup = new THREE.Group();
            wellGroup.position.set(wx, 0, 1.8);
            const wellRim = new THREE.Mesh(new THREE.CylinderGeometry(0.56, 0.6, 0.58, 8), brickMat);
            wellRim.position.y = 0.29;
            wellRim.castShadow = true;
            const stoneCap = new THREE.Mesh(new THREE.TorusGeometry(0.52, 0.06, 8, 8), stoneMat);
            stoneCap.rotation.x = Math.PI / 2;
            stoneCap.position.y = 0.58;
            const water = new THREE.Mesh(
                new THREE.CircleGeometry(0.48, 8),
                new THREE.MeshStandardMaterial({ color: '#1b3e42', roughness: 0.1, metalness: 0.85 })
            );
            water.rotation.x = -Math.PI / 2;
            water.position.y = 0.46;
            wellGroup.add(wellRim, stoneCap, water);
            mod4.add(wellGroup);
        });

        scene.add(mod4);
        return { group: mod4, progress: 0, triggered: false };
    },

    buildMainHallAndCorridors(scene) {
        const brickMat = MaterialLib.getBrickMaterial();
        const stoneMat = MaterialLib.getStoneMaterial();
        const crimsonWood = MaterialLib.getWoodMaterial(true);
        const darkWood = MaterialLib.getWoodMaterial(false);
        const goldMat = new THREE.MeshStandardMaterial({ color: '#e3ad3b', metalness: 0.65, roughness: 0.25 });

        const mod5 = new THREE.Group();
        mod5.position.set(0, 0, -5.2);

        const mainPlinth = new THREE.Mesh(new THREE.BoxGeometry(7.2, 0.36, 3.8), stoneMat);
        mainPlinth.position.y = 0.18; mainPlinth.receiveShadow = true;
        mod5.add(mainPlinth);

        const sanctuaryBody = new THREE.Mesh(new THREE.BoxGeometry(6.4, 2.7, 3.0), brickMat);
        sanctuaryBody.position.set(0, 1.7, 0);
        sanctuaryBody.castShadow = true; sanctuaryBody.receiveShadow = true;
        mod5.add(sanctuaryBody);

        const shrineOpening = new THREE.Mesh(
            new THREE.PlaneGeometry(1.8, 2.0),
            new THREE.MeshStandardMaterial({ color: '#ffd97d', emissive: '#ff9d2e', emissiveIntensity: 0.85 })
        );
        shrineOpening.position.set(0, 1.45, 1.52);
        mod5.add(shrineOpening);

        const sanctuaryLowerRoof = TempleComponentFactory.createTiledRoof(7.4, 3.8, 1.15, true, true, true);
        sanctuaryLowerRoof.position.set(0, 3.05, 0);
        mod5.add(sanctuaryLowerRoof);

        const sanctuaryUpperBox = new THREE.Mesh(new THREE.BoxGeometry(5.2, 0.75, 2.4), crimsonWood);
        sanctuaryUpperBox.position.set(0, 3.65, 0);
        mod5.add(sanctuaryUpperBox);

        const mainSanctuaryRoofGroup = new THREE.Group();
        const sanctuaryTopRoof = TempleComponentFactory.createTiledRoof(6.2, 2.8, 1.25, true, true, true);
        sanctuaryTopRoof.position.set(0, 4.0, 0);
        mainSanctuaryRoofGroup.add(sanctuaryTopRoof);
        mod5.add(mainSanctuaryRoofGroup);
        explodableRoofs.push({ group: mainSanctuaryRoofGroup, baseY: 0, liftY: 2.0 });

        const mainPlaque = TempleComponentFactory.createPlaque('慈航普度', 1.55, 0.45);
        mainPlaque.position.set(0, 2.85, 1.62);
        mod5.add(mainPlaque);

        [-4.65, 4.65].forEach((sx, idx) => {
            const wing = new THREE.Mesh(new THREE.BoxGeometry(1.3, 1.85, 31.0), brickMat);
            wing.position.set(sx, 0.925, 3.8);
            wing.castShadow = true; wing.receiveShadow = true;
            mod5.add(wing);

            const wingRoof = TempleComponentFactory.createTiledRoof(31.4, 1.68, 0.58, false, false, false);
            wingRoof.rotation.y = Math.PI / 2;
            wingRoof.position.set(sx, 1.85, 3.8);
            mod5.add(wingRoof);

            [-7.5, -1.5, 4.5, 10.5, 15.5].forEach(lz => {
                const wl = TempleComponentFactory.createSwingingLantern(0.8);
                wl.position.set(sx + (idx === 0 ? 0.72 : -0.72), 1.82, lz);
                mod5.add(wl);
            });

            if (idx === 0) {
                const nanguanPlaque = TempleComponentFactory.createPlaque('聚英社南管', 1.25, 0.34);
                nanguanPlaque.rotation.y = Math.PI / 2;
                nanguanPlaque.position.set(sx + 0.68, 1.65, 13.4);
                mod5.add(nanguanPlaque);

                const stand = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.75, 0.9), darkWood);
                stand.position.set(sx + 0.85, 0.375, 13.4);
                mod5.add(stand);

                const pipaBody = new THREE.Mesh(new THREE.SphereGeometry(0.2, 12, 12), goldMat);
                pipaBody.scale.set(0.35, 1.35, 0.95);
                pipaBody.position.set(sx + 0.88, 0.82, 13.25);
                pipaBody.rotation.set(0.35, Math.PI / 2, 0.3);
                mod5.add(pipaBody);
            }
        });

        const stelePlaque = TempleComponentFactory.createPlaque('重修龍山寺記碑', 1.45, 0.34);
        stelePlaque.rotation.y = Math.PI / 2;
        stelePlaque.position.set(-3.95, 1.68, 10.4);
        mod5.add(stelePlaque);

        [9.6, 10.4, 11.2].forEach((sz, idx) => {
            const steleGroup = new THREE.Group();
            steleGroup.position.set(-3.75, 0, sz);
            const base = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.25, 0.44), stoneMat);
            base.position.y = 0.125;
            const slab = new THREE.Mesh(new THREE.BoxGeometry(0.12, 1.2 + (idx % 2) * 0.18, 0.36), stoneMat);
            slab.position.y = 0.82;
            slab.castShadow = true;
            steleGroup.add(base, slab);
            mod5.add(steleGroup);
        });

        const bellFrameGroup = new THREE.Group();
        bellFrameGroup.position.set(3.75, 0, 9.6);
        bellFrameGroup.rotation.y = -Math.PI / 2;

        [-0.48, 0.48].forEach(bx => {
            const post = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.08, 2.1, 10), crimsonWood);
            post.position.set(bx, 1.05, 0);
            post.castShadow = true;
            bellFrameGroup.add(post);
        });
        const topBeam = new THREE.Mesh(new THREE.BoxGeometry(1.3, 0.16, 0.22), crimsonWood);
        topBeam.position.set(0, 2.05, 0);
        bellFrameGroup.add(topBeam);

        const bronzeMat = new THREE.MeshStandardMaterial({ color: '#4d6152', metalness: 0.78, roughness: 0.34 });
        const ancientBell = new THREE.Mesh(new THREE.CylinderGeometry(0.26, 0.38, 0.75, 20), bronzeMat);
        ancientBell.position.set(0, 1.48, 0);
        ancientBell.castShadow = true;
        bellFrameGroup.add(ancientBell);

        const bellPlaque = TempleComponentFactory.createPlaque('龍山聽唄', 0.95, 0.28);
        bellPlaque.position.set(0, 2.28, 0);
        bellFrameGroup.add(bellPlaque);
        mod5.add(bellFrameGroup);

        scene.add(mod5);
        return { group: mod5, progress: 0, triggered: false };
    },

    buildRearHallAndWell(scene) {
        const brickMat = MaterialLib.getBrickMaterial();
        const stoneMat = MaterialLib.getStoneMaterial();

        const mod6 = new THREE.Group();
        mod6.position.set(0, 0, -17.5);

        const rearPlinth = new THREE.Mesh(new THREE.BoxGeometry(6.8, 0.32, 3.0), stoneMat);
        rearPlinth.position.y = 0.16; rearPlinth.receiveShadow = true;
        mod6.add(rearPlinth);

        const rearBody = new THREE.Mesh(new THREE.BoxGeometry(6.0, 2.35, 2.4), brickMat);
        rearBody.position.set(0, 1.5, 0);
        rearBody.castShadow = true; rearBody.receiveShadow = true;
        mod6.add(rearBody);

        const rearShrine = new THREE.Mesh(
            new THREE.PlaneGeometry(1.5, 1.75),
            new THREE.MeshStandardMaterial({ color: '#ffd97d', emissive: '#ff9d2e', emissiveIntensity: 0.72 })
        );
        rearShrine.position.set(0, 1.3, 1.22);
        mod6.add(rearShrine);

        [-1.1, 1.1].forEach(px => {
            const dp = TempleComponentFactory.createDragonPillar(2.2, 0.13);
            dp.position.set(px, 0.32, 1.32);
            mod6.add(dp);
        });

        const rearRoof = TempleComponentFactory.createTiledRoof(6.8, 3.2, 1.1, true, true, true);
        rearRoof.position.set(0, 2.68, 0);
        mod6.add(rearRoof);

        const rearPlaque = TempleComponentFactory.createPlaque('三世佛殿', 1.4, 0.4);
        rearPlaque.position.set(0, 2.48, 1.35);
        mod6.add(rearPlaque);

        const dragonSpringWell = new THREE.Group();
        dragonSpringWell.position.set(2.4, 0, 2.6);
        const dswRim = new THREE.Mesh(new THREE.CylinderGeometry(0.52, 0.56, 0.55, 8), brickMat);
        dswRim.position.y = 0.275; dswRim.castShadow = true;
        const dswCap = new THREE.Mesh(new THREE.TorusGeometry(0.48, 0.055, 8, 8), stoneMat);
        dswCap.rotation.x = Math.PI / 2; dswCap.position.y = 0.55;
        dragonSpringWell.add(dswRim, dswCap);
        mod6.add(dragonSpringWell);

        const rearCenser = new THREE.Mesh(
            new THREE.CylinderGeometry(0.28, 0.22, 0.46, 14),
            new THREE.MeshStandardMaterial({ color: '#b58030', metalness: 0.72, roughness: 0.3 })
        );
        rearCenser.position.set(0, 0.23, 3.6);
        rearCenser.castShadow = true;
        mod6.add(rearCenser);

        const rearLight = new THREE.PointLight('#ff9436', 1.8, 8.0);
        rearLight.position.set(0, 2.2, 2.4);
        mod6.add(rearLight);

        scene.add(mod6);
        return { group: mod6, progress: 0, triggered: false };
    }
};