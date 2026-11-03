/* =====================================================================
   scene3d.js – Thế giới 3D kiểu Minecraft bằng three.js (r128)
   - Phông nền: đảo TRÔI trên trời, KÉO CHUỘT xoay 360°, ngày-đêm, NPC
   - Steve thú cưng chạy quanh màn hình, kéo thả được
   - Steve 3D trong thẻ profile (#hero3d): kéo xoay 360°, bấm vẫy tay
   Cần mạng để tải three.js. Không có three.js thì trang vẫn chạy, chỉ mất 3D.
   ===================================================================== */
(function () {
  'use strict';
  if (!window.THREE) { window.World3D = null; return; }
  var THREE = window.THREE;

  /* ---------- 1. Tiện ích ---------- */
  function rnd(n) { var s = Math.sin(n * 127.1 + 311.7) * 43758.5453; return s - Math.floor(s); }
  function lerp(a, b, k) { return a + (b - a) * k; }
  function turn(cur, target, k) {
    var d = Math.atan2(Math.sin(target - cur), Math.cos(target - cur));
    return cur + d * Math.min(1, k);
  }
  function pixelTex(rows, palette) {
    var c = document.createElement('canvas');
    c.width = rows[0].length; c.height = rows.length;
    var g = c.getContext('2d');
    rows.forEach(function (row, y) {
      row.split('').forEach(function (ch, x) { g.fillStyle = palette[ch] || '#f0f'; g.fillRect(x, y, 1, 1); });
    });
    var t = new THREE.CanvasTexture(c);
    t.magFilter = THREE.NearestFilter; t.minFilter = THREE.NearestFilter;
    return t;
  }
  function lam(color) { return new THREE.MeshLambertMaterial({ color: color }); }
  function faceMat(rows, palette, glow) {
    var opt = { map: pixelTex(rows, palette) };
    return glow ? new THREE.MeshBasicMaterial(opt) : new THREE.MeshLambertMaterial(opt);
  }
  function box(w, h, d, mat, x, y, z) {
    var m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
    m.position.set(x || 0, y || 0, z || 0);
    return m;
  }
  function limb(w, h, d, mat, x, y, z) {
    var g = new THREE.Group();
    g.position.set(x, y, z);
    g.add(box(w, h, d, mat, 0, -h / 2, 0));
    return g;
  }

  /* ---------- 2. Mô hình nhân vật (16 pixel = 1 khối) ---------- */
  function humanoid(o) {
    var g = new THREE.Group(), r = { group: g };
    r.legL = limb(o.leg.w, o.leg.h, o.leg.d, o.leg.mat, -o.leg.x, o.leg.h, 0);
    r.legR = limb(o.leg.w, o.leg.h, o.leg.d, o.leg.mat, o.leg.x, o.leg.h, 0);
    g.add(box(o.body.w, o.body.h, o.body.d, o.body.mat, 0, o.leg.h + o.body.h / 2, 0));
    var shoulder = o.leg.h + o.body.h - (o.arm.drop || 0), neck = o.leg.h + o.body.h;
    r.armL = limb(o.arm.w, o.arm.h, o.arm.d, o.arm.mat, -o.arm.x, shoulder, 0);
    r.armR = limb(o.arm.w, o.arm.h, o.arm.d, o.arm.mat, o.arm.x, shoulder, 0);
    r.head = new THREE.Group();
    r.head.position.set(0, neck, 0);
    r.head.add(box(o.head.w, o.head.h, o.head.d, o.head.mats, 0, o.head.h / 2, 0));
    g.add(r.legL, r.legR, r.armL, r.armR, r.head);
    r.height = neck + o.head.h;
    return r;
  }

  var SKIN = '#c99a75';
  function buildSteve() {
    var P = { H: '#3d2b1f', S: SKIN, W: '#fff', B: '#3b4fd8', K: '#8a5a44' };
    var side = faceMat(['HHHHHHHH', 'HHHHHHHH', 'SSSSSSSS', 'SSSSSSSS', 'SSSSSSSS', 'SSSSSSSS', 'SSSSSSSS', 'SSSSSSSS'], P);
    var hair = faceMat(['HHHHHHHH', 'HHHHHHHH', 'HHHHHHHH', 'HHHHHHHH', 'HHHHHHHH', 'HHHHHHHH', 'HHHHHHHH', 'HHHHHHHH'], P);
    var face = faceMat(['HHHHHHHH', 'HHHHHHHH', 'SSSSSSSS', 'SWBSSBWS', 'SSSSSSSS', 'SSSKKSSS', 'SSKKKKSS', 'SSSSSSSS'], P);
    var back = faceMat(['HHHHHHHH', 'HHHHHHHH', 'HHHHHHHH', 'HHHHHHHH', 'HHHHHHHH', 'SSSSSSSS', 'SSSSSSSS', 'SSSSSSSS'], P);
    return humanoid({
      head: { w: 8, h: 8, d: 8, mats: [side, side, hair, lam(SKIN), face, back] },
      body: { w: 8, h: 12, d: 4, mat: lam('#2aa7b0') },
      arm: { w: 4, h: 12, d: 4, mat: lam(SKIN), x: 6 },
      leg: { w: 4, h: 12, d: 4, mat: lam('#3b3f9c'), x: 2 }
    });
  }
  function buildSkeleton() {
    var P = { W: '#d9d9d0', K: '#1c1c1c' }, bone = lam('#d2d2c8'), skull = lam('#d9d9d0');
    var face = faceMat(['WWWWWWWW', 'WWWWWWWW', 'WKKWWKKW', 'WKKWWKKW', 'WWWKKWWW', 'WWKWWKWW', 'WWKKKKWW', 'WWWWWWWW'], P);
    return humanoid({
      head: { w: 8, h: 8, d: 8, mats: [skull, skull, skull, skull, face, skull] },
      body: { w: 8, h: 12, d: 4, mat: lam('#c4c4ba') },
      arm: { w: 2, h: 12, d: 2, mat: bone, x: 5 }, leg: { w: 2, h: 12, d: 2, mat: bone, x: 2 }
    });
  }
  function buildEnder() {
    var P = { K: '#101014', P: '#c07bff', W: '#f1d9ff' }, black = lam('#16161c');
    var face = faceMat(['KKKKKKKK', 'KKKKKKKK', 'KKKKKKKK', 'PWKKKKWP', 'PPKKKKPP', 'KKKKKKKK', 'KKKKKKKK', 'KKKKKKKK'], P, true);
    return humanoid({
      head: { w: 8, h: 8, d: 8, mats: [black, black, black, black, face, black] },
      body: { w: 8, h: 12, d: 4, mat: black },
      arm: { w: 2, h: 24, d: 2, mat: black, x: 5 }, leg: { w: 2, h: 24, d: 2, mat: black, x: 2 }
    });
  }
  function buildGolem() {
    var iron = lam('#cfd2d4'), dark = lam('#a9acae');
    var r = humanoid({
      head: { w: 8, h: 10, d: 8, mats: [iron, iron, iron, iron, iron, iron] },
      body: { w: 18, h: 14, d: 11, mat: iron },
      arm: { w: 4, h: 26, d: 6, mat: dark, x: 11, drop: 2 }, leg: { w: 6, h: 13, d: 6, mat: dark, x: 4 }
    });
    r.head.add(box(2, 4, 2, lam('#b88a6a'), 0, 4, 5));
    r.flower = new THREE.Group();
    r.flower.position.set(0, -27, 0);
    r.flower.add(box(1, 5, 1, lam('#3a8c3a'), 0, 2.5, 0), box(4, 4, 4, lam('#e0314f'), 0, 6, 0));
    r.flower.visible = false;
    r.armR.add(r.flower);
    return r;
  }
  function buildCreeper() {
    var P = { a: '#5fae5f', b: '#3d7f45', X: '#101010' };
    var noise = faceMat(['abababab', 'babababa', 'abababab', 'babababa', 'abababab', 'babababa', 'abababab', 'babababa'], P);
    var face = faceMat(['abababab', 'babababa', 'aXXbaXXb', 'bXXabXXa', 'abaXXbab', 'baXXXXab', 'abXXXXba', 'baXbaXab'], P);
    var g = new THREE.Group(), r = { group: g, mats: [noise, face] };
    r.legL = new THREE.Group(); r.legL.position.set(-2, 6, 0);
    r.legR = new THREE.Group(); r.legR.position.set(2, 6, 0);
    [r.legL, r.legR].forEach(function (leg) { leg.add(box(4, 6, 4, noise, 0, -3, -2), box(4, 6, 4, noise, 0, -3, 2)); });
    g.add(box(8, 12, 4, noise, 0, 12, 0));
    r.head = new THREE.Group(); r.head.position.set(0, 18, 0);
    r.head.add(box(8, 8, 8, [noise, noise, noise, noise, face, noise], 0, 4, 0));
    g.add(r.legL, r.legR, r.head);
    r.height = 26;
    return r;
  }
  function swing(r, phase, amp) {
    var s = Math.sin(phase) * amp;
    r.legL.rotation.x = s; r.legR.rotation.x = -s;
    if (r.armL) { r.armL.rotation.x = -s; r.armR.rotation.x = s; }
  }

  /* ---------- 3. Lời thoại + bong bóng chat ---------- */
  var LINES = {
    vi: { steve: ['Xin chào! Mình là Steve 👋', 'Bạn đào được kim cương chưa?', 'Đừng bấm vào Creeper nhé!'],
          skeleton: ['Cạch cạch! 🏹', 'Nhắm này!'], enderman: ['Đừng nhìn vào mắt tôi!', 'Biến!'],
          golem: ['Tặng bạn một bông hoa 🌹', 'Mình bảo vệ ngôi làng!'], creeper: ['Ssss...'],
          pet: ['Profile này đẹp nhỉ?', 'Mình chạy quanh trang cả ngày!', 'Thử đào mỏ đi!', 'Kéo mình đi chơi nào!'],
          drag: ['Aaa! Thả mình xuống!', 'Cao quá!'], dance: ['Nhảy nào! 💃'], cheer: ['Mở khóa rồi! 🎉'] },
    en: { steve: ['Hi! I am Steve 👋', 'Found any diamonds yet?', 'Do not click the Creeper!'],
          skeleton: ['Clack clack! 🏹', 'Take aim!'], enderman: ['Do not look at my eyes!', 'Begone!'],
          golem: ['A flower for you 🌹', 'I protect the village!'], creeper: ['Ssss...'],
          pet: ['Nice profile, right?', 'I run around this page all day!', 'Go mine some ore!', 'Drag me around!'],
          drag: ['Aaa! Put me down!', 'Too high!'], dance: ['Let us dance! 💃'], cheer: ['Unlocked! 🎉'] }
  };
  var lang = 'vi', bubbleEl = null, bubbleTime = 0, bubbleXY = null;
  function line(kind) { var list = LINES[lang][kind]; return list[Math.floor(Math.random() * list.length)]; }
  function showBubble(text, xyFn, secs) {
    if (!bubbleEl) return;
    bubbleEl.textContent = text; bubbleXY = xyFn; bubbleTime = secs || 2.4; bubbleEl.style.display = 'block';
  }
  function updateBubble(dt) {
    if (!bubbleEl || bubbleTime <= 0) return;
    bubbleTime -= dt;
    if (bubbleTime <= 0) { bubbleEl.style.display = 'none'; return; }
    var p = bubbleXY();
    bubbleEl.style.left = p.x + 'px'; bubbleEl.style.top = p.y + 'px';
  }

  /* ==== PHẦN TIẾP: thế giới đảo trôi + kéo xoay ==== */

  /* ---------- 4. Thế giới nền: ĐẢO TRÔI, kéo chuột xoay 360° ---------- */
  function createWorld(canvas) {
    var renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: false });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
    var scene = new THREE.Scene();
    scene.background = new THREE.Color(0x7fb2ec);
    scene.fog = new THREE.Fog(0x7fb2ec, 36, 110);
    var camera = new THREE.PerspectiveCamera(55, 1, .1, 300);
    var amb = new THREE.AmbientLight(0xffffff, .6), sun = new THREE.DirectionalLight(0xfff2cc, .9);
    scene.add(amb, sun);

    // --- Địa hình: đảo trôi (mặt trên + phần đá treo lơ lửng bên dưới) ---
    var N = 44, HALF = N / 2;
    function heightAt(i, j) { return Math.max(1, 2 + Math.floor(1.7 * Math.sin(i * .33) + 1.5 * Math.cos(j * .29) + Math.sin((i + j) * .17))); }
    function groundY(x, z) {
      var i = Math.max(0, Math.min(N - 1, Math.round(x + HALF))), j = Math.max(0, Math.min(N - 1, Math.round(z + HALF)));
      return heightAt(i, j);
    }
    var blocks = [], leaves = [], decor = [];
    var GRASS = ['#6cbb4a', '#5fae4f', '#79c655'], DIRT = ['#8a6140', '#7d5836'], STONE = ['#7d8087', '#72757c'];
    var DEEP = ['#565a61', '#4e5258'];
    for (var i = 0; i < N; i++) for (var j = 0; j < N; j++) {
      var h = heightAt(i, j), far = Math.hypot(i - HALF, j - HALF) > 7, dist = Math.hypot(i - HALF, j - HALF);
      for (var y = Math.max(0, h - 3); y < h; y++) {
        blocks.push({ x: i - HALF, y: y + .5, z: j - HALF, c: y === h - 1 ? GRASS[Math.floor(rnd(i * 7 + j * 13) * 3)] : y >= h - 2 ? DIRT[(i + j) % 2] : STONE[(i + j) % 2] });
      }
      // phần đảo treo bên dưới: càng gần giữa càng dày, mép mỏng dần -> hình đảo lơ lửng
      var depth = Math.round(6.5 - dist * .75 + (rnd(i * 31 + j * 17) - .5) * 1.5);
      for (var k2 = 1; k2 <= depth; k2++) {
        blocks.push({ x: i - HALF, y: h - 2.5 - k2, z: j - HALF, c: k2 < 2 ? DIRT[(i + j) % 2] : DEEP[(i + j + k2) % 2] });
      }
      if (dist > 7.5 && i % 4 === 1 && j % 4 === 1 && rnd(i * 17 + j * 31) > .45) {      // cây
        var th = 4 + Math.floor(rnd(i + j) * 2);
        for (var t = 0; t < th; t++) blocks.push({ x: i - HALF, y: h + t + .5, z: j - HALF, c: '#6b4a2b' });
        for (var dx = -2; dx <= 2; dx++) for (var dz = -2; dz <= 2; dz++) {
          if (Math.abs(dx) === 2 && Math.abs(dz) === 2) continue;
          leaves.push({ x: i - HALF + dx, y: h + th - .5, z: j - HALF + dz, c: rnd(dx * 9 + dz * 5 + i) > .5 ? '#3f8f3a' : '#357a32' });
          if (Math.abs(dx) <= 1 && Math.abs(dz) <= 1) leaves.push({ x: i - HALF + dx, y: h + th + .5, z: j - HALF + dz, c: '#4aa043' });
        }
        leaves.push({ x: i - HALF, y: h + th + 1.5, z: j - HALF, c: '#4aa043' });
      } else if (far && rnd(i * 3 + j * 5) > .93) {                                      // hoa
        decor.push({ x: i - HALF, y: h + .25, z: j - HALF, sx: .22, sy: .5, sz: .22, c: ['#e28fa1', '#ffe14d', '#8fb9f2', '#ffffff'][(i + j) % 4] });
      }
    }
    function instanced(list) {
      var mesh = new THREE.InstancedMesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshLambertMaterial(), list.length);
      var m = new THREE.Matrix4(), col = new THREE.Color();
      list.forEach(function (b, k) {
        var s = .96;                                         // khe hở nhỏ giữa các khối -> rõ nét kiểu Minecraft
        m.makeScale(s * (b.sx || 1), s * (b.sy || 1), s * (b.sz || 1)); m.setPosition(b.x, b.y, b.z);
        mesh.setMatrixAt(k, m); mesh.setColorAt(k, col.set(b.c));
      });
      mesh.instanceMatrix.needsUpdate = true; mesh.instanceColor.needsUpdate = true;
      mesh.frustumCulled = false;
      return mesh;
    }
    scene.add(instanced(blocks), instanced(leaves), instanced(decor));

    // --- Mặt trời, trăng, sao, mây ---
    var sunMesh = box(8, 8, 1, new THREE.MeshBasicMaterial({ color: 0xffe9a8, fog: false })),
        moonMesh = box(6, 6, 1, new THREE.MeshBasicMaterial({ color: 0xe8ecf4, fog: false }));
    scene.add(sunMesh, moonMesh);
    var starPos = new Float32Array(600);
    for (var s = 0; s < 200; s++) {
      var a1 = rnd(s) * 6.283, a2 = rnd(s + 99) * 1.4 + .1;
      starPos[s * 3] = Math.cos(a1) * Math.cos(a2) * 110; starPos[s * 3 + 1] = Math.sin(a2) * 110; starPos[s * 3 + 2] = Math.sin(a1) * Math.cos(a2) * 110;
    }
    var starGeo = new THREE.BufferGeometry();
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
    var starMat = new THREE.PointsMaterial({ color: 0xffffff, size: 2, sizeAttenuation: false, transparent: true, fog: false });
    scene.add(new THREE.Points(starGeo, starMat));
    var cloudMat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: .88, fog: false }), clouds = [];
    for (var c = 0; c < 8; c++) {
      var cl = new THREE.Group();
      cl.add(box(8, 1.2, 4, cloudMat, 0, 0, 0), box(5, 1.2, 3, cloudMat, 1, 1.2, 0));
      cl.position.set(rnd(c) * 90 - 45, 19 + rnd(c + 5) * 4, rnd(c + 9) * 70 - 35);
      scene.add(cl); clouds.push(cl);
    }

    // --- NPC ---
    var NPC_DEF = [
      { type: 'steve', build: buildSteve, x: -3, z: -2, speed: 1.6 }, { type: 'skeleton', build: buildSkeleton, x: 4, z: -3, speed: 1.4 },
      { type: 'enderman', build: buildEnder, x: -6, z: 4, speed: 2 }, { type: 'golem', build: buildGolem, x: 5, z: 4, speed: .9 },
      { type: 'creeper', build: buildCreeper, x: 0, z: 6, speed: 1.3 }
    ];
    var npcs = [], groups = [], particles = [], arrows = [], listener = null, hoverCb = null;
    NPC_DEF.forEach(function (d) {
      var rig = d.build(), n = { type: d.type, rig: rig, x: d.x, z: d.z, tx: d.x, tz: d.z, speed: d.speed, wait: Math.random() * 2, phase: 0, mode: 'wander', timer: 0, t: 0, face: 0, hop: 0, dead: 0 };
      rig.group.scale.setScalar(1 / 16);
      rig.group.userData.npc = n;
      scene.add(rig.group); npcs.push(n); groups.push(rig.group);
    });
    function emit(type) { if (listener) listener(type); }

    var pGeo = new THREE.BoxGeometry(.2, .2, .2), pMats = {};
    function burst3(x, y, z, colors, count) {
      for (var k = 0; k < count; k++) {
        var col = colors[k % colors.length];
        pMats[col] = pMats[col] || new THREE.MeshBasicMaterial({ color: col });
        var m = new THREE.Mesh(pGeo, pMats[col]);
        m.position.set(x, y, z);
        scene.add(m);
        particles.push({ m: m, vx: (Math.random() - .5) * 6, vy: Math.random() * 5 + 1, vz: (Math.random() - .5) * 6, life: .9 });
      }
    }
    function shoot(n) {
      var arrow = box(.07, .07, .9, new THREE.MeshBasicMaterial({ color: 0x6b4a2b }), 0, 0, 0);
      arrow.position.set(n.x, groundY(n.x, n.z) + 1.3, n.z);
      arrow.rotation.y = n.face;
      scene.add(arrow);
      arrows.push({ m: arrow, dx: Math.sin(n.face), dz: Math.cos(n.face), life: 1.2 });
    }
    function bubbleFor(n) {
      var v = new THREE.Vector3();
      return function () {
        v.set(n.x, groundY(n.x, n.z) + n.rig.height / 16 * 1.1 + 0.2, n.z).project(camera);
        return { x: (v.x + 1) / 2 * innerWidth, y: (1 - v.y) / 2 * innerHeight };
      };
    }
    function resetPose(n) {
      var r = n.rig;
      [r.armL, r.armR, r.legL, r.legR, r.head].forEach(function (p) { if (p) p.rotation.set(0, 0, 0); });
      n.hop = 0; r.group.scale.setScalar(1 / 16);
      if (r.flower) r.flower.visible = false;
      if (r.mats) r.mats.forEach(function (m) { m.emissive.setHex(0); });
    }
    function randomSpot() { return { x: (Math.random() - .5) * 20, z: (Math.random() - .5) * 20 }; }

    function interact(n) {
      if (n.dead > 0 || n.mode === 'react') return;
      n.mode = 'react'; n.t = 0;
      var kind = n.type;
      if (kind === 'steve') { n.timer = 1.8; n.face = Math.atan2(camera.position.x - n.x, camera.position.z - n.z); }
      else if (kind === 'skeleton') { n.timer = 1.4; n.face = Math.atan2(camera.position.x - n.x, camera.position.z - n.z); shoot(n); }
      else if (kind === 'enderman') {
        n.timer = .9;
        burst3(n.x, groundY(n.x, n.z) + 1.5, n.z, [0xc07bff, 0x6a2fb0, 0x101014], 18);
        var s = randomSpot(); n.x = n.tx = s.x; n.z = n.tz = s.z;
        burst3(n.x, groundY(n.x, n.z) + 1.5, n.z, [0xc07bff, 0x6a2fb0, 0x101014], 18);
      }
      else if (kind === 'golem') { n.timer = 2.2; n.rig.flower.visible = true; }
      else { n.timer = 1.3; }
      showBubble(line(kind), bubbleFor(n), 2.2);
      emit('npc');
    }
    function react(n, dt) {
      n.t += dt;
      var r = n.rig, t = n.t;
      if (n.type === 'steve') { r.armR.rotation.x = -2.6 + Math.sin(t * 14) * .4; n.hop = Math.abs(Math.sin(t * 5)) * .3; }
      else if (n.type === 'skeleton') { r.armL.rotation.x = r.armR.rotation.x = -1.5; r.head.rotation.y = Math.sin(t * 20) * .15; }
      else if (n.type === 'enderman') { r.head.rotation.y = Math.sin(t * 25) * .35; r.armL.rotation.z = .5; r.armR.rotation.z = -.5; }
      else if (n.type === 'golem') { r.armL.rotation.x = r.armR.rotation.x = -2 + Math.sin(t * 3) * .1; }
      else if (n.type === 'creeper') {
        r.group.scale.setScalar((1 + .35 * t / 1.3) / 16);
        var flash = Math.floor(t * 8) % 2 ? 0x888888 : 0;
        r.mats.forEach(function (m) { m.emissive.setHex(flash); });
      }
    }
    function endReact(n) {
      if (n.type === 'creeper') {
        burst3(n.x, groundY(n.x, n.z) + 1, n.z, [0x5fae5f, 0x3d7f45, 0xffb300, 0xff6d00, 0xcfcfcf], 36);
        n.rig.group.visible = false; n.dead = 3.5; n.mode = 'dead';
        emit('boom');
      } else { resetPose(n); n.mode = 'wander'; }
    }
    function updateNPC(n, dt) {
      var r = n.rig;
      if (n.mode === 'dead') {
        n.dead -= dt;
        if (n.dead <= 0) { var s = randomSpot(); n.x = n.tx = s.x; n.z = n.tz = s.z; resetPose(n); r.group.visible = true; n.mode = 'wander'; }
        return;
      }
      if (n.mode === 'wander') {
        var dx = n.tx - n.x, dz = n.tz - n.z, d = Math.hypot(dx, dz);
        if (n.wait > 0) { n.wait -= dt; swing(r, 0, 0); }
        else if (d < .2) { n.wait = 1.5 + Math.random() * 3; var s2 = randomSpot(); n.tx = s2.x; n.tz = s2.z; }
        else {
          var step = Math.min(d, n.speed * dt);
          n.x += dx / d * step; n.z += dz / d * step;
          n.face = Math.atan2(dx, dz); n.phase += dt * n.speed * 5;
          swing(r, n.phase, .8);
        }
      } else {
        n.timer -= dt; react(n, dt);
        if (n.timer <= 0) endReact(n);
      }
      r.group.rotation.y = turn(r.group.rotation.y, n.face, dt * 8);
      r.group.position.set(n.x, groundY(n.x, n.z) + n.hop, n.z);
    }

    // --- Bấm vào NPC (khi còn ở cổng captcha) ---
    var ray = new THREE.Raycaster(), ndc = new THREE.Vector2(), mode = 'gate';
    function pick(e) {
      ndc.set(e.clientX / innerWidth * 2 - 1, -(e.clientY / innerHeight) * 2 + 1);
      scene.updateMatrixWorld(); camera.updateMatrixWorld();
      ray.setFromCamera(ndc, camera);
      var hits = ray.intersectObjects(groups, true);
      if (!hits.length) return null;
      var o = hits[0].object;
      while (o && !o.userData.npc) o = o.parent;
      return o ? o.userData.npc : null;
    }
    canvas.addEventListener('pointerdown', function (e) { if (mode !== 'gate') return; var n = pick(e); if (n) interact(n); });
    canvas.addEventListener('pointermove', function (e) { if (mode === 'gate' && hoverCb) hoverCb(Boolean(pick(e))); });

    /* ==== PHẦN TIẾP: camera kéo xoay + vòng lặp ==== */

    // --- KÉO CHUỘT để xoay đảo 360° (thả tay ~2.5s thì tự quay lại) ---
    var NO_ORBIT = 'a,button,input,textarea,select,label,#ore,#hero3d,.fact,[role="button"],.gui,.frame,.nav,.hud,.speed,.gate-panel,#chat,#hold,.toast';
    var dragging = false, px = 0, py = 0;
    var yaw = .6, tgtYaw = .6, pitch = 0, tgtPitch = 0;
    var R = 24, tgtR = 24, baseElev = .34, lastDrag = -10;
    var CENTER_Y = 2.2;
    function applyCam() {
      var elev = Math.max(.06, Math.min(.9, baseElev + pitch));
      camera.position.set(Math.sin(yaw) * R * Math.cos(elev), CENTER_Y + Math.sin(elev) * R, Math.cos(yaw) * R * Math.cos(elev));
      camera.lookAt(0, CENTER_Y, 0);
    }
    addEventListener('pointerdown', function (e) {
      if (e.button !== 0) return;
      if (e.target.closest && e.target.closest(NO_ORBIT)) return;   // không xoay khi bấm vào UI
      dragging = true; px = e.clientX; py = e.clientY;
      document.body.classList.add('orbiting');
      e.preventDefault();
    });
    addEventListener('pointermove', function (e) {
      if (!dragging) return;
      tgtYaw += (e.clientX - px) * .006;                            // xoay ngang tự do 360°
      tgtPitch = Math.max(-.14, Math.min(.5, tgtPitch + (e.clientY - py) * .0035));
      px = e.clientX; py = e.clientY; lastDrag = tWorld;
    });
    function endOrbit() {
      if (!dragging) return;
      dragging = false;
      document.body.classList.remove('orbiting');
      lastDrag = tWorld;
    }
    addEventListener('pointerup', endOrbit);
    addEventListener('pointercancel', endOrbit);

    // --- Vòng cập nhật mỗi khung hình ---
    var tWorld = 0, timeOffset = 0, skyCss = 'rgb(127,178,236)';
    var NIGHT = new THREE.Color(0x0d1220), DAY = new THREE.Color(0x7fb2ec), sky = new THREE.Color(), tint = new THREE.Color();
    function phase() { return (((tWorld / 80 + .12 + timeOffset) % 1) + 1) % 1; }
    function update(dt, real) {
      tWorld += dt;
      var p = phase(), a = p * 6.2832, k = Math.min(1, Math.max(0, Math.sin(a)) * 1.8);
      sky.copy(NIGHT).lerp(DAY, k);
      scene.background.copy(sky); scene.fog.color.copy(sky);
      amb.intensity = lerp(.42, .75, k); sun.intensity = lerp(.14, .95, k);
      sun.position.set(Math.cos(a) * 40, Math.sin(a) * 40 + 5, -10);
      sunMesh.position.set(Math.cos(a) * 60, Math.sin(a) * 60, -20); moonMesh.position.copy(sunMesh.position).multiplyScalar(-1);
      sunMesh.visible = sunMesh.position.y > -4; moonMesh.visible = moonMesh.position.y > -4;
      starMat.opacity = Math.max(0, 1 - k * 2.2);
      cloudMat.opacity = lerp(.3, .88, k); cloudMat.color.setScalar(lerp(.55, 1, k));
      // màu cho cổng captcha: trộn thêm 35% màu ban ngày để luôn dễ đọc
      tint.copy(sky).lerp(DAY, .35);
      skyCss = 'rgb(' + Math.round(tint.r * 255) + ',' + Math.round(tint.g * 255) + ',' + Math.round(tint.b * 255) + ')';

      clouds.forEach(function (cl) { cl.position.x += dt * 1.2; if (cl.position.x > 50) cl.position.x = -50; });
      // đang kéo thì camera theo tay; thả 2.5s thì tự xoay chậm quanh đảo
      if (!dragging && tWorld - lastDrag > 2.5) tgtYaw += dt * .045;
      yaw += (tgtYaw - yaw) * Math.min(1, real * 7);
      pitch += (tgtPitch - pitch) * Math.min(1, real * 7);
      R += (tgtR - R) * Math.min(1, real * 1.5);
      applyCam();

      npcs.forEach(function (n) { updateNPC(n, dt); });
      for (var i = particles.length - 1; i >= 0; i--) {
        var pt = particles[i];
        pt.life -= dt; pt.vy -= 14 * dt;
        pt.m.position.x += pt.vx * dt; pt.m.position.y += pt.vy * dt; pt.m.position.z += pt.vz * dt;
        if (pt.life <= 0) { scene.remove(pt.m); particles.splice(i, 1); }
      }
      for (var q = arrows.length - 1; q >= 0; q--) {
        var ar = arrows[q];
        ar.life -= dt; ar.m.position.x += ar.dx * 10 * dt; ar.m.position.z += ar.dz * 10 * dt;
        if (ar.life <= 0) { scene.remove(ar.m); arrows.splice(q, 1); }
      }
    }
    function resize() {
      renderer.setSize(innerWidth, innerHeight, false);
      camera.aspect = innerWidth / Math.max(1, innerHeight); camera.updateProjectionMatrix();
    }
    resize();
    update(0.01, 0.01);

    return {
      update: update, resize: resize, render: function () { renderer.render(scene, camera); },
      setMode: function (m) { mode = m; tgtR = m === 'gate' ? 24 : 30; baseElev = m === 'gate' ? .34 : .42; },
      setTime: function (which) {
        var target = which === 'day' ? .25 : .75;
        timeOffset += target - phase();
      },
      on: function (cb) { listener = cb; }, onHover: function (cb) { hoverCb = cb; },
      sky: function () { return skyCss; }, npcs: npcs, interact: interact
    };
  }

  /* ==== PHẦN TIẾP: Steve thú cưng ==== */

  /* ---------- 5. Steve thú cưng chạy quanh màn hình ---------- */
  function createPet(canvas, emit, hoverCb) {
    var renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: false });
    renderer.setPixelRatio(1); renderer.setClearColor(0x000000, 0);
    var scene = new THREE.Scene(), cam = new THREE.OrthographicCamera(0, 1, 0, -1, -2000, 2000);
    cam.position.z = 1000;
    scene.add(new THREE.AmbientLight(0xffffff, .85));
    var key = new THREE.DirectionalLight(0xffffff, .5); key.position.set(.3, 1, 1); scene.add(key);
    var rig = buildSteve(), SCALE = 3.4;
    rig.group.scale.setScalar(SCALE); scene.add(rig.group);

    var W = 1, H = 1, M = { l: 40, r: 1, t: 140, b: 1 }, w = 1, h = 1, len = 4;
    var st = { mode: 'run', s: 0, x: 60, y: 600, vy: 0, t: 0, timer: 0, kind: '', tx: 0, ty: 0, custom: false, face: 0, moved: false };
    var on = false, ptr = { x: 0, y: 0 };
    var FACE = [Math.PI / 2, Math.PI, -Math.PI / 2, 0];

    function layout() {
      W = innerWidth; H = innerHeight;
      cam.left = 0; cam.right = W; cam.top = 0; cam.bottom = -H; cam.updateProjectionMatrix();
      renderer.setSize(W, H, false);
      // chừa chỗ cho HUD (dưới) + menu (trên) để Steve không che giao diện
      M.r = W - 40; M.b = H - 110; M.t = Math.min(140, H * .3);
      w = M.r - M.l; h = M.b - M.t; len = 2 * (w + h);
    }
    function onPath(s) {
      s = ((s % len) + len) % len;
      if (s < w) return { x: M.l + s, y: M.b, d: 0 };
      s -= w; if (s < h) return { x: M.r, y: M.b - s, d: 1 };
      s -= h; if (s < w) return { x: M.r - s, y: M.t, d: 2 };
      s -= w; return { x: M.l, y: M.t + s, d: 3 };
    }
    function nearest(x, y) {
      var px2 = Math.min(M.r, Math.max(M.l, x)), py2 = Math.min(M.b, Math.max(M.t, y));
      var dl = px2 - M.l, dr = M.r - px2, du = py2 - M.t, dd = M.b - py2, m = Math.min(dl, dr, du, dd);
      if (m === dd) return px2 - M.l;
      if (m === dr) return w + (M.b - py2);
      if (m === du) return w + h + (M.r - px2);
      return 2 * w + h + (py2 - M.t);
    }
    function goToPath() {
      st.s = nearest(st.x, st.y);
      var p = onPath(st.s); st.tx = p.x; st.ty = p.y; st.custom = false; st.mode = 'go';
    }
    function pose0() { [rig.armL, rig.armR, rig.legL, rig.legR].forEach(function (p) { p.rotation.set(0, 0, 0); }); }
    function say(kind, secs) { showBubble(line(kind), function () { return { x: st.x, y: st.y - 125 }; }, secs); }
    function react(kind, secs) { st.mode = 'react'; st.kind = kind; st.t = 0; st.timer = secs; st.face = 0; if (kind === 'dance') say('dance'); else if (kind === 'cheer') say('cheer'); else say('pet'); }

    function update(dt) {
      if (!on) return;
      st.t += dt;
      var hopPx = 0;
      if (st.mode === 'run') {
        st.s += 150 * dt;
        var p = onPath(st.s); st.x = p.x; st.y = p.y; st.face = FACE[p.d];
        swing(rig, st.t * 10, .9);
      } else if (st.mode === 'go') {
        var dx = st.tx - st.x, dy = st.ty - st.y, d = Math.hypot(dx, dy);
        if (d < 8) { if (st.custom) { st.mode = 'idle'; st.timer = 1.6; pose0(); } else { st.mode = 'run'; } }
        else {
          st.x += dx / d * 280 * dt; st.y += dy / d * 280 * dt;
          st.face = Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? FACE[0] : FACE[2]) : (dy > 0 ? FACE[3] : FACE[1]);
          swing(rig, st.t * 14, .9);
        }
      } else if (st.mode === 'idle') {
        st.timer -= dt; if (st.timer <= 0) goToPath();
      } else if (st.mode === 'react') {
        st.timer -= dt;
        if (st.kind === 'dance') { st.face += dt * 12; rig.armL.rotation.x = rig.armR.rotation.x = -2.6 + Math.sin(st.t * 10) * .4; hopPx = Math.abs(Math.sin(st.t * 6)) * 14; }
        else if (st.kind === 'cheer') { rig.armL.rotation.x = rig.armR.rotation.x = -2.8; hopPx = Math.abs(Math.sin(st.t * 8)) * 26; }
        else { rig.armR.rotation.x = -2.6 + Math.sin(st.t * 14) * .4; hopPx = Math.abs(Math.sin(st.t * 5)) * 12; }
        if (st.timer <= 0) { pose0(); goToPath(); }
      } else if (st.mode === 'drag') {
        if (st.moved) { st.x = ptr.x; st.y = ptr.y + 80; }
        rig.legL.rotation.x = Math.sin(st.t * 8) * .4; rig.legR.rotation.x = -rig.legL.rotation.x;
        rig.armL.rotation.x = rig.armR.rotation.x = -2.8; st.face = 0;
      } else if (st.mode === 'fall') {
        st.vy += 2400 * dt; st.y += st.vy * dt;
        if (st.y >= M.b) { st.y = M.b; st.vy *= -.35; if (Math.abs(st.vy) < 120) { pose0(); goToPath(); } }
      }
      rig.group.rotation.y = turn(rig.group.rotation.y, st.face, dt * 10);
      rig.group.position.set(st.x, -st.y + hopPx, 0);
    }

    var ray = new THREE.Raycaster(), ndc = new THREE.Vector2();
    function hit(cx, cy) {
      ndc.set(cx / W * 2 - 1, -(cy / H) * 2 + 1);
      scene.updateMatrixWorld(); cam.updateMatrixWorld();
      ray.setFromCamera(ndc, cam);
      return ray.intersectObject(rig.group, true).length > 0;
    }
    var suppressUntil = 0, lastClick = 0;
    addEventListener('pointerdown', function (e) {
      if (!on || e.button !== 0 || st.mode === 'drag' || !hit(e.clientX, e.clientY)) return;
      e.stopPropagation(); e.preventDefault();
      suppressUntil = performance.now() + 500;
      st.mode = 'drag'; st.moved = false; st.t = 0; ptr.x = e.clientX; ptr.y = e.clientY; st.sx = e.clientX; st.sy = e.clientY;
    }, true);
    addEventListener('pointermove', function (e) {
      ptr.x = e.clientX; ptr.y = e.clientY;
      if (st.mode === 'drag' && !st.moved && Math.hypot(e.clientX - st.sx, e.clientY - st.sy) > 6) { st.moved = true; say('drag', 2.5); }
      else if (on && st.mode !== 'drag' && hoverCb) hoverCb(hit(e.clientX, e.clientY));
    });
    addEventListener('pointerup', function () {
      if (st.mode !== 'drag') return;
      if (st.moved) { st.mode = 'fall'; st.vy = 0; }
      else {
        var now = performance.now();
        react(now - lastClick < 450 ? 'dance' : 'wave', now - lastClick < 450 ? 2.4 : 1.8);
        lastClick = now; emit('steve');
      }
    });
    addEventListener('click', function (e) { if (performance.now() < suppressUntil) { e.stopPropagation(); e.preventDefault(); } }, true);

    layout();
    return {
      update: update, resize: layout, render: function () { if (on) renderer.render(scene, cam); },
      enable: function (v) { on = v; if (v) { st.mode = 'run'; st.s = 0; } },
      cheer: function () { if (on && st.mode === 'run') react('cheer', 1.4); },
      callTo: function (x, y) { if (!on) return; st.mode = 'go'; st.custom = true; st.tx = Math.max(20, Math.min(W - 20, x)); st.ty = Math.max(120, Math.min(H - 24, y + 60)); },
      say: function () { if (on) say('pet'); }
    };
  }

  /* ==== PHẦN TIẾP: Steve 3D trong thẻ profile + API ==== */

  /* ---------- 6. Steve 3D trong thẻ profile: kéo xoay 360°, bấm vẫy tay ---------- */
  function createHero(canvas, emit) {
    var renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setClearColor(0x000000, 0);
    var scene = new THREE.Scene();
    var cam = new THREE.PerspectiveCamera(34, 1, .1, 50);
    cam.position.set(0, 1.0, 3.7);
    cam.lookAt(0, .92, 0);
    scene.add(new THREE.AmbientLight(0xffffff, .8));
    var key = new THREE.DirectionalLight(0xffffff, .55); key.position.set(2, 3, 4); scene.add(key);
    var rim = new THREE.DirectionalLight(0x9fc4ff, .3); rim.position.set(-3, 2, -3); scene.add(rim);

    // đế Minecraft
    var base = box(1.7, .14, 1.7, lam('#8fdcb8'), 0, -.07, 0);
    base.add(box(1.76, .05, 1.76, lam('#5a5f68'), 0, .05, 0));
    scene.add(base);

    var rig = buildSteve();
    rig.group.scale.setScalar(.072);                        // 32 pixel cao ~ 2.3 đơn vị
    rig.group.position.y = 0;
    scene.add(rig.group);

    // bóng đổ giả dưới chân
    var shadow = new THREE.Mesh(new THREE.CircleGeometry(.42, 24),
      new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: .25 }));
    shadow.rotation.x = -Math.PI / 2; shadow.position.y = .012;
    scene.add(shadow);

    var W = 1, H = 1, yaw = -.5, tgtYaw = -.5, pitch = .06, tgtPitch = .06;
    var dragging = false, sx = 0, sy = 0, wave = 0, idle = 0, bobT = 0;
    var moved = false;

    function layout() {
      var r = canvas.getBoundingClientRect();
      W = Math.max(1, r.width); H = Math.max(1, r.height);
      renderer.setSize(W, H, false);
      cam.aspect = W / H; cam.updateProjectionMatrix();
    }
    layout();
    addEventListener('resize', layout);

    canvas.addEventListener('pointerdown', function (e) {
      dragging = true; moved = false; sx = e.clientX; sy = e.clientY;
      canvas.setPointerCapture(e.pointerId);
      e.preventDefault();
    });
    canvas.addEventListener('pointermove', function (e) {
      if (!dragging) return;
      var dx = e.clientX - sx, dy = e.clientY - sy;
      if (Math.abs(dx) + Math.abs(dy) > 3) moved = true;
      tgtYaw += dx * .011;                                  // xoay ngang 360° tự do
      tgtPitch = Math.max(-.3, Math.min(.5, tgtPitch + dy * .006));
      sx = e.clientX; sy = e.clientY;
    });
    function up(e) {
      if (!dragging) return;
      dragging = false;
      if (!moved) {                                         // bấm (không kéo) -> Steve vẫy tay
        wave = 1.8; emit('steve');
      }
    }
    canvas.addEventListener('pointerup', up);
    canvas.addEventListener('pointercancel', function () { dragging = false; });

    function update(dt) {
      bobT += dt;
      if (!dragging) tgtYaw += dt * .3;                     // tự xoay chậm khi để yên
      yaw += (tgtYaw - yaw) * Math.min(1, dt * 8);
      pitch += (tgtPitch - pitch) * Math.min(1, dt * 8);
      rig.group.rotation.y = yaw;
      // nghiêng người nhẹ theo pitch khi kéo
      rig.group.rotation.x = pitch * .35;
      // đung đưa nhẹ như thở + nhún theo pitch
      var bob = Math.sin(bobT * 1.8) * .02;
      rig.group.position.y = bob - pitch * .3;
      shadow.scale.setScalar(1 - bob * .8);
      // vẫy tay khi được bấm
      if (wave > 0) {
        wave -= dt;
        rig.armR.rotation.x = -2.6 + Math.sin(bobT * 14) * .4;
        rig.armR.rotation.z = Math.sin(bobT * 10) * .25;
      } else {
        rig.armR.rotation.x *= (1 - Math.min(1, dt * 6));
        rig.armR.rotation.z *= (1 - Math.min(1, dt * 6));
      }
    }
    return {
      update: update,
      render: function () { renderer.render(scene, cam); },
      resize: layout
    };
  }

  /* ---------- 7. API cho app.js ---------- */
  window.World3D = {
    start: function (opts) {
      try {
        bubbleEl = opts.bubble;
        var world = createWorld(opts.bg),
            pet = createPet(opts.pet, function (t) { if (listener) listener(t); }, function (v) { if (hoverCb) hoverCb(v); }),
            hero = opts.hero ? createHero(opts.hero, function (t) { if (listener) listener(t); }) : null;
        var speed = 1, listener = null, hoverCb = null, last = performance.now();
        world.on(function (t) { if (listener) listener(t); });
        world.onHover(function (v) { if (hoverCb) hoverCb(v); });
        var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
        function frame(now) {
          var real = Math.min(.05, (now - last) / 1000); last = now;
          world.update(real * speed, real);
          pet.update(real);
          if (hero) hero.update(real);
          updateBubble(real);
          world.render(); pet.render();
          if (hero) hero.render();
          requestAnimationFrame(frame);
        }
        addEventListener('resize', function () { world.resize(); pet.resize(); if (hero) hero.resize(); });
        if (reduce) { world.render(); if (hero) hero.render(); } else { requestAnimationFrame(frame); }
        return {
          setSpeed: function (n) { speed = n; },
          setTime: world.setTime,
          setMode: world.setMode,
          setLang: function (l) { lang = l; },
          on: function (cb) { listener = cb; },
          onHover: function (cb) { hoverCb = cb; },
          sky: world.sky,
          petOn: pet.enable, cheer: pet.cheer, callPet: pet.callTo,
          npcs: world.npcs, interact: world.interact
        };
      } catch (err) {
        console.warn('3D không khởi động được:', err);
        return null;
      }
    }
  };
})();

