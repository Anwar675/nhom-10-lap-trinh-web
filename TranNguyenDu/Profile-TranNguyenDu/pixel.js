/* =====================================================================
   pixel.js – Vẽ sprite pixel dùng chung
   - window.Pixel.cursor(): ảnh data-URL của con trỏ mũi tên (viền trắng)
   - window.Pixel.steve(canvas, opts): vẽ Steve 2D đứng/đứng nghiêng
   ===================================================================== */
(function () {
  'use strict';

  /* ---- Con trỏ mũi tên pixel (X = viền trắng, # = thân đen, . = trống) ---- */
  var CURSOR = [
    'X#........',
    'X##.......',
    'X###......',
    'X####.....',
    'X#####....',
    'X######...',
    'X#######..',
    'X########.',
    'X#####....',
    'X##X###...',
    'XX..X##...',
    '.....X##..',
    '.....XX...'
  ];
  function texURL(rows, palette, scale) {
    var c = document.createElement('canvas');
    c.width = rows[0].length * scale; c.height = rows.length * scale;
    var g = c.getContext('2d');
    rows.forEach(function (row, y) {
      row.split('').forEach(function (ch, x) {
        if (ch === '.' || !palette[ch]) return;
        g.fillStyle = palette[ch];
        g.fillRect(x * scale, y * scale, scale, scale);
      });
    });
    return c.toDataURL();
  }

  /* ---- Steve pixel-art (16 rộng x 32 cao, đúng tỉ lệ Minecraft) ----
     Vẽ từng bộ phận: đầu 8x8, thân 8x12, tay 4x12, chân 4x12               */
  var P_STEVE = {
    H: '#3d2b1f',                    // tóc
    S: '#c99a75',                    // da
    W: '#ffffff',                    // trắng mắt
    B: '#3b4fd8',                    // con ngươi
    K: '#8a5a44',                    // miệng/mũi
    T: '#2aa7b0',                    // áo
    Ts: '#238f96',                   // áo (bóng)
    L: '#3b3f9c',                    // quần
    D: '#2f3379',                    // quần (bóng)
    A: '#c99a75'                     // tay (da)
  };

  // Trả về mảng 2D màu 16x32 của Steve nhìn thẳng
  function steveGrid() {
    var g = [];
    for (var y = 0; y < 32; y++) { g.push(new Array(16).fill(null)); }
    function fill(x0, y0, w, h, col) {
      for (var y = y0; y < y0 + h; y++) for (var x = x0; x < x0 + w; x++) {
        if (g[y] && x >= 0 && x < 16) g[y][x] = col;
      }
    }
    function px(x, y, col) { if (g[y]) g[y][x] = col; }

    // ĐẦU (x 4..11, y 0..7)
    fill(4, 0, 8, 2, P_STEVE.H);            // tóc trên
    fill(4, 2, 8, 6, P_STEVE.S);            // mặt
    fill(4, 2, 1, 6, P_STEVE.H);            // tóc hai bên
    fill(11, 2, 1, 6, P_STEVE.H);
    px(6, 4, P_STEVE.W); px(7, 4, P_STEVE.B);   // mắt trái
    px(8, 4, P_STEVE.B); px(9, 4, P_STEVE.W);   // mắt phải
    px(7, 5, P_STEVE.K); px(8, 5, P_STEVE.K);   // mũi
    px(6, 6, P_STEVE.K); px(7, 6, P_STEVE.K);   // miệng
    px(8, 6, P_STEVE.K); px(9, 6, P_STEVE.K);

    // THÂN (x 4..11, y 8..19)
    fill(4, 8, 8, 12, P_STEVE.T);
    fill(4, 8, 8, 1, P_STEVE.Ts);           // cổ áo
    fill(4, 18, 8, 2, P_STEVE.Ts);          // gấu áo

    // TAY (x 0..3 và 12..15, y 8..19)
    fill(0, 8, 4, 12, P_STEVE.A);
    fill(12, 8, 4, 12, P_STEVE.A);
    fill(0, 18, 4, 2, P_STEVE.T);           // tay áo
    fill(12, 18, 4, 2, P_STEVE.T);

    // CHÂN (x 4..7 và 8..11, y 20..31)
    fill(4, 20, 4, 12, P_STEVE.L);
    fill(8, 20, 4, 12, P_STEVE.L);
    fill(4, 30, 4, 2, P_STEVE.D);           // giày
    fill(8, 30, 4, 2, P_STEVE.D);
    return g;
  }

  // Vẽ Steve lên canvas, có thể lật ngang, nhún, vẫy tay phải
  function steve(canvas, opts) {
    opts = opts || {};
    var s = opts.scale || 4;
    var grid = steveGrid();
    var ctx = canvas.getContext('2d');
    var t = 0, wave = 0, flip = !!opts.flip;
    canvas.width = 16 * s + 8; canvas.height = 32 * s + 8;
    function draw() {
      var hop = Math.abs(Math.sin(t * 2)) * 2 * s;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.save();
      ctx.translate(canvas.width / 2, canvas.height - 4);
      if (flip) ctx.scale(-1, 1);
      ctx.translate(0, -hop);
      ctx.imageSmoothingEnabled = false;
      for (var y = 0; y < 32; y++) {
        for (var x = 0; x < 16; x++) {
          var col = grid[y][x];
          if (!col) continue;
          // vẫy tay: xóa & vẽ tay phải nâng lên
          var isRightArm = !flip ? (x >= 12 && y >= 8 && y < 20) : (x < 4 && y >= 8 && y < 20);
          if (isRightArm && wave > 0) {
            var lift = Math.round(Math.sin(t * 10) * 3);
            var yy = y - 8 - lift;                       // tay nâng lên (cạnh đầu)
            if (yy < 0) continue;
            ctx.fillStyle = col;
            ctx.fillRect((x - 8) * s, (yy - 32) * s, s, s);
          } else {
            ctx.fillStyle = col;
            ctx.fillRect((x - 8) * s, (y - 32) * s, s, s);
          }
        }
      }
      // bóng đổ
      ctx.fillStyle = 'rgba(0,0,0,.28)';
      ctx.fillRect(-5 * s, -1 - hop, 10 * s, 3);
      ctx.restore();
    }
    return {
      tick: function (dt) { t += dt; if (wave > 0) wave -= dt; draw(); },
      wave: function (secs) { wave = secs || 2; },
      drawNow: draw
    };
  }

  window.Pixel = {
    cursor: function (scale) {
      return texURL(CURSOR, { X: '#ffffff', '#': '#14151a' }, scale || 3);
    },
    steve: steve,
    texURL: texURL
  };
})();
