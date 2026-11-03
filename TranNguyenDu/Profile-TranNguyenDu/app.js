/* =====================================================================
   app.js – Giao diện, đa ngôn ngữ, captcha, đào mỏ mở khóa, nền 2D, Steve 2D
   Muốn sửa nội dung: sửa khối "NỘI DUNG" và "CHỮ GIAO DIỆN" ngay bên dưới.
   ===================================================================== */

/* ================= PIXEL ENGINE (vẽ con trỏ + Steve) ================= */
var Pixel = (function () {
  'use strict';
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
  var P_STEVE = {
    H: '#3d2b1f', S: '#c99a75', W: '#ffffff', B: '#3b4fd8', K: '#8a5a44',
    T: '#2aa7b0', Ts: '#238f96', L: '#3b3f9c', D: '#2f3379', A: '#c99a75'
  };
  function steveGrid() {
    var g = [];
    for (var y = 0; y < 32; y++) g.push(new Array(16).fill(null));
    function fill(x0, y0, w, h, col) {
      for (var y = y0; y < y0 + h; y++) for (var x = x0; x < x0 + w; x++) {
        if (g[y] && x >= 0 && x < 16) g[y][x] = col;
      }
    }
    function px(x, y, col) { if (g[y]) g[y][x] = col; }
    // Đầu
    fill(4, 0, 8, 2, P_STEVE.H);
    fill(4, 2, 8, 6, P_STEVE.S);
    fill(4, 2, 1, 6, P_STEVE.H);
    fill(11, 2, 1, 6, P_STEVE.H);
    px(6, 4, P_STEVE.W); px(7, 4, P_STEVE.B);
    px(8, 4, P_STEVE.B); px(9, 4, P_STEVE.W);
    px(7, 5, P_STEVE.K); px(8, 5, P_STEVE.K);
    px(6, 6, P_STEVE.K); px(7, 6, P_STEVE.K); px(8, 6, P_STEVE.K); px(9, 6, P_STEVE.K);
    // Thân
    fill(4, 8, 8, 12, P_STEVE.T);
    fill(4, 8, 8, 1, P_STEVE.Ts);
    fill(4, 18, 8, 2, P_STEVE.Ts);
    // Tay
    fill(0, 8, 4, 12, P_STEVE.A);
    fill(12, 8, 4, 12, P_STEVE.A);
    fill(0, 18, 4, 2, P_STEVE.T);
    fill(12, 18, 4, 2, P_STEVE.T);
    // Chân
    fill(4, 20, 4, 12, P_STEVE.L);
    fill(8, 20, 4, 12, P_STEVE.L);
    fill(4, 30, 4, 2, P_STEVE.D);
    fill(8, 30, 4, 2, P_STEVE.D);
    return g;
  }
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
          var isRightArm = !flip ? (x >= 12 && y >= 8 && y < 20) : (x < 4 && y >= 8 && y < 20);
          if (isRightArm && wave > 0) {
            var lift = Math.round(Math.sin(t * 10) * 3);
            var yy = y - 8 - lift;
            if (yy < 0) continue;
            ctx.fillStyle = col;
            ctx.fillRect((x - 8) * s, (yy - 32) * s, s, s);
          } else {
            ctx.fillStyle = col;
            ctx.fillRect((x - 8) * s, (y - 32) * s, s, s);
          }
        }
      }
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
  return {
    cursor: function (scale) { return texURL(CURSOR, { X: '#ffffff', '#': '#14151a' }, scale || 3); },
    steve: steve,
    texURL: texURL
  };
})();

var $ = function (s, r) { return (r || document).querySelector(s); };
var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;'); }

/* ================= NỘI DUNG (sửa ở đây) ================= */
var NAME = 'Trần Nguyễn Du';
var PROFILE = [
  ['lab_name', NAME], ['lab_birth', '07 / 09 / 2006'],
  ['lab_school', { vi: 'Đại học Công nghệ Thông tin', en: 'University of Information Technology' }],
  ['lab_major', { vi: 'Công nghệ thông tin', en: 'Information Technology' }],
  ['lab_year', { vi: 'Sinh viên năm 3', en: '3rd-year student' }],
  ['lab_loc', { vi: 'TP. Hồ Chí Minh', en: 'Ho Chi Minh City' }]
];
var SKILLS = [['JavaScript', 85], ['Python', 80], ['Java', 70], ['C++', 65], ['Lua (Roblox)', 95]];
var TECH = ['HTML/CSS', 'React', 'Node.js', 'MySQL', 'MongoDB', 'Git & GitHub', 'Docker', 'Figma'];
var SOFT = [{ vi: 'Làm việc nhóm', en: 'Teamwork' }, { vi: 'Giải quyết vấn đề', en: 'Problem solving' },
            { vi: 'Quản lý thời gian', en: 'Time management' }, { vi: 'Tiếng Anh', en: 'English' }];

// Link web / shop: thay example.com bằng link thật của bạn
var PROJECTS = [
  { key: 'roblox', year: '2026', name: { vi: 'Shop Dịch Vụ Roblox', en: 'Roblox Service Shop' }, web: 'https://bonevn.net/', shop: 'https://bonevn.net/category/clone-new-cookie-globalize',
    desc: { vi: 'Web hỗ trợ các loại acc roblox , clone để cho người dùng sử dụng. Báo đơn về Discord ngay khi khách đặt.', en: 'A Roblox services site: Robux, gamepasses and boosting. Orders are posted to Discord instantly.' },
    code: {
      Lua: `-- Give players starting coins when they join
local Players = game:GetService("Players")

Players.PlayerAdded:Connect(function(player)
  local coins = Instance.new("IntValue")
  coins.Name = "Coins"
  coins.Value = 100
  coins.Parent = player
end)`,
      JavaScript: `const prices = { Robux: 95, Gamepass: 120, Boost: 60 };

// Total price of a service (VND)
function total(service, qty) {
  return prices[service] * qty;
}`,
      Python: `import requests

# Post a new order to a Discord channel
def notify(name, service):
    requests.post(WEBHOOK, json={"content": name + " ordered " + service})` } },
  { key: 'captcha', year: '2026', name: { vi: 'Captcha Solver', en: 'Captcha Solver' }, web: 'https://zeropoint.to/', shop: null,
    desc: { vi: 'Công cụ tự động hóa giải captcha cho các tác vụ lặp lại (thí nghiệm học máy).', en: 'An automation tool that solves captchas for repetitive tasks (ML experiment).' },
    code: {
      Python: `def classify(email):
    if "sale" in email.lower():
        return "Promo"
    return "Important"`,
      'C++': `#include <iostream>
using namespace std;

int main() {
    int a = 7, b = 5;
    cout << "Sum = " << a + b << endl;
    return 0;
}` } }
];
var TIMELINE = [
  { y: '2024 – 2026', t: { vi: 'Đại học – Ngành Công nghệ thông tin', en: 'University – Information Technology' }, d: { vi: 'GPA hiện tại 3.2/4.0', en: 'Current GPA 3.2/4.0' } },
  { y: '2022 – 2026', t: { vi: 'Thành thạo các vấn đề về MMO', en: 'Skilled in MMO topics' }, d: { vi: 'Tìm hiểu sơ qua các ngôn ngữ mới như C, Java, Vibe Coding, Lua', en: 'A quick look at new languages such as C, Java, Vibe Coding and Lua' } },
  { y: '2025', t: { vi: 'Giải Ba cuộc thi lập trình cấp trường', en: 'Third prize, school programming contest' }, d: { vi: 'Câu lạc bộ lập trình của trường', en: 'School programming club' } },
  { y: '2024', t: { vi: 'Tốt nghiệp THPT', en: 'High school graduation' }, d: { vi: 'Đam mê môn Tin học', en: 'Passionate about Computer Science' } }
];
var FACTS = [
  { t: { vi: '⛏ Thợ mỏ chính hiệu', en: '⛏ A true miner' }, d: { vi: 'Mình mê Minecraft từ nhỏ, và trang này là cách mình mang nó vào code.', en: 'I have loved Minecraft since I was a kid, and this page brings it into code.' } },
  { t: { vi: '🛒 Làm shop từ sớm', en: '🛒 Selling early on' }, d: { vi: 'Từ năm 2022 mình đã tự dựng shop MMO và dịch vụ Roblox bằng code của mình.', en: 'Since 2022 I have built MMO and Roblox service shops with my own code.' } },
  { t: { vi: '🎯 Mục tiêu 2026', en: '🎯 Goal for 2026' }, d: { vi: 'Trở thành một Coder giỏi nhất và hoàn thành dự án full-stack đầu tiên.', en: 'Become the best Coder and finish my first full-stack project.' } }
];
var CONTACTS = [
  { label: { vi: 'Email', en: 'Email' }, url: 'mailto:trqnnguyendu45@gmail.com' },
  { label: { vi: 'GitHub', en: 'GitHub' }, url: 'https://github.com/trannguyendu', ext: true },
  { label: { vi: 'Nhắn Zalo', en: 'Message on Zalo' }, url: 'https://zalo.me/0816514308', ext: true },
  { label: { vi: 'Gọi điện', en: 'Call me' }, url: 'tel:0816514308' }
];
var MY_EMAIL = 'trqnnguyendu45@gmail.com';
var STAY_MS = 90000, HOLD_MS = 10000;

/* ================= NGUYÊN LIỆU & MỤC BỊ KHÓA ================= */
var ORES = { iron: { color: '#d8c3b0', weight: 30 }, gold: { color: '#ffd34d', weight: 22 }, silver: { color: '#dfe8f2', weight: 22 },
             diamond: { color: '#4be8e0', weight: 12 }, emerald: { color: '#3fd16c', weight: 14 } };
var LOCKS = [
  { id: 'skills', ore: 'iron', cost: 2, vi: 'Kỹ năng', en: 'Skills' },
  { id: 'projects', ore: 'gold', cost: 2, vi: 'Dự án', en: 'Projects' },
  { id: 'education', ore: 'silver', cost: 2, vi: 'Học vấn', en: 'Education' },
  { id: 'secrets', ore: 'emerald', cost: 1, vi: 'Bí mật', en: 'Secrets' },
  { id: 'contact', ore: 'diamond', cost: 1, vi: 'Liên hệ', en: 'Contact' }
];
var NAV = ['profile', 'mine', 'skills', 'projects', 'education', 'secrets', 'contact'];

/* ================= CHỮ GIAO DIỆN VI / EN ================= */
var TEXT = {
  vi: {
    nav: { profile: 'Hồ sơ', mine: 'Đào mỏ', skills: 'Kỹ năng', projects: 'Dự án', education: 'Học vấn', secrets: 'Bí mật', contact: 'Liên hệ' },
    sec: { mine: 'Đào mỏ', skills: 'Kỹ năng', projects: 'Dự án', education: 'Học vấn', secrets: 'Bí mật', contact: 'Liên hệ' },
    ore: { iron: 'Sắt', gold: 'Vàng', silver: 'Bạc', diamond: 'Kim cương', emerald: 'Ngọc lục bảo' },
    roles: ['Sinh viên Công nghệ thông tin', 'Lập trình viên web', 'Người thích vẽ đẹp của việc code'],
    hello: 'Xin chào, mình là',
    lead: 'Một lập trình viên đang trong quá trình học tập và phát triển kỹ năng. Thành thạo những kỹ năng sống cần thiết và hòa đồng, thích tìm hiểu những dự án mới và kiến thức ở mọi nơi đi qua.',
    cta_projects: 'Xem dự án', cta_contact: 'Liên hệ mình',
    card_title: 'PLAYER CARD',
    hero_tip: '👆 Bấm vào Steve để vẫy tay chào!',
    ore_lab: 'Bấm để đào',
    lab_name: 'Họ tên', lab_birth: 'Ngày sinh', lab_school: 'Trường', lab_major: 'Ngành', lab_year: 'Năm học', lab_loc: 'Nơi ở',
    st_projects: 'Dự án', st_tech: 'Công nghệ', st_years: 'Năm học',
    about1: 'Mình là sinh viên năm ba ngành Công nghệ thông tin, đang theo hướng lập trình web và phát triển phần mềm. Mình thích những bài toán cần tư duy logic và luôn muốn sản phẩm làm ra thật sự có ích cho người dùng.',
    about2: 'Ngoài giờ học, mình tham gia câu lạc bộ lập trình của trường, đọc mã nguồn mở và chơi cờ vua để rèn tư duy. Mục tiêu của mình là trở thành kỹ sư phần mềm full-stack sau khi tốt nghiệp.',
    mine_hint: 'Bấm vào khối đá để đào nguyên liệu, dùng chúng để mở khóa các mục của profile.',
    sk_langs: 'Ngôn ngữ lập trình', sk_tech: 'Công nghệ & công cụ', sk_soft: 'Kỹ năng mềm',
    proj_hint: 'Bấm vào tên ngôn ngữ để xem code mẫu.', btn_web: 'Trang web', btn_shop: 'Shop', btn_copy: 'Copy code', btn_copied: 'Đã copy!',
    f_title: 'Gửi tin nhắn cho mình', f_name: 'Tên của bạn', f_email: 'Email của bạn', f_msg: 'Nội dung', f_send: 'Gửi tin nhắn',
    footer: "Phấn đấu trở thành một người ' Coder ' giỏi nhất 2026.",
    gate_desc: 'Bấm vào thanh bên dưới để chứng minh bạn là con người. Bạn có thể kéo hoặc thu nhỏ bảng này.', gate_bar: 'Tôi không phải robot', gate_q: 'Câu', gate_ok: 'Xác nhận', speed: 'Nền',
    checking: 'Đang kiểm tra...', solve: 'Giải phép tính để tiếp tục', ok: 'Đã xác minh – Chào mừng!', right: 'Đúng rồi! Còn {n} câu.', wrong: 'Sai rồi, thử câu khác nhé!',
    sending: 'Đang gửi...', sent: 'Đã gửi! Cảm ơn bạn, mình sẽ trả lời sớm.', fallback: 'Không gửi trực tiếp được, mình mở ứng dụng email để bạn gửi.', subject: 'Tin nhắn từ ',
    need: 'Cần {n} {ore} (bạn có {have})', unlock: 'Mở khóa', goMine: '⛏ Đi đào', unlocked: 'Đã mở khóa: {name}!', welcome: 'Chào mừng đến với profile của mình!',
    idle_title: 'Bạn còn ở đó chứ?', idle_text: 'Bạn đã ở đây khá lâu. Hãy nhấn giữ nút bên dưới trong 10 giây để xác minh bạn là con người.', idle_btn: 'Nhấn giữ 10 giây',
    idle_hold: 'Đang xác minh... còn {s} giây', idle_release: 'Bạn đã thả tay! Hãy giữ đủ 10 giây.', idle_done: 'Đã xác minh, cảm ơn bạn!',
    chat_help: 'Lệnh: /time day|night · /speed 1|2|5 · /lang vi|en · /steve', chat_bad: 'Lệnh không đúng. Gõ /help',
    ach: { human: ['Human Verified', 'Vượt qua captcha'], miner: ['Miner', 'Đào 3 khối đá'], collector: ['Collector', 'Mở khóa mọi mục'],
           friend: ['Best Friend', 'Chào Steve'], coder: ['Hacker', 'Xem code mẫu'], patient: ['Patient', 'Nhấn giữ 10 giây'] }
  },
  en: {
    nav: { profile: 'Profile', mine: 'Mine', skills: 'Skills', projects: 'Projects', education: 'Education', secrets: 'Secrets', contact: 'Contact' },
    sec: { mine: 'Mine', skills: 'Skills', projects: 'Projects', education: 'Education', secrets: 'Secrets', contact: 'Contact' },
    ore: { iron: 'Iron', gold: 'Gold', silver: 'Silver', diamond: 'Diamond', emerald: 'Emerald' },
    roles: ['IT student', 'Web developer', 'Someone who loves the beauty of code'],
    hello: "Hello, I'm",
    lead: 'A programmer who is still learning and sharpening his skills. Good at the life skills that matter, easy to get along with, and always curious about new projects and knowledge wherever he goes.',
    cta_projects: 'View projects', cta_contact: 'Contact me',
    card_title: 'PLAYER CARD',
    hero_tip: '👆 Click Steve and he waves hello!',
    ore_lab: 'Click to mine',
    lab_name: 'Full name', lab_birth: 'Born', lab_school: 'School', lab_major: 'Major', lab_year: 'Year', lab_loc: 'Location',
    st_projects: 'Projects', st_tech: 'Tech', st_years: 'Years',
    about1: "I'm a third-year Information Technology student focusing on web programming and software development. I enjoy problems that need logical thinking and want what I build to be genuinely useful to users.",
    about2: 'Outside class I join the school programming club, read open-source code and play chess to train my mind. My goal is to become a full-stack software engineer after graduating.',
    mine_hint: 'Click the stone block to mine materials, then spend them to unlock profile sections.',
    sk_langs: 'Programming languages', sk_tech: 'Technologies & tools', sk_soft: 'Soft skills',
    proj_hint: 'Click a language to see sample code.', btn_web: 'Website', btn_shop: 'Shop', btn_copy: 'Copy code', btn_copied: 'Copied!',
    f_title: 'Send me a message', f_name: 'Your name', f_email: 'Your email', f_msg: 'Message', f_send: 'Send message',
    footer: "Aiming to become the best 'Coder' of 2026.",
    gate_desc: 'Click the bar below to prove you are human. You can drag or minimize this panel.', gate_bar: "I'm not a robot", gate_q: 'Question', gate_ok: 'Confirm', speed: 'BG',
    checking: 'Checking...', solve: 'Solve the sum to continue', ok: 'Verified – welcome!', right: 'Correct! {n} to go.', wrong: 'Wrong, try another one!',
    sending: 'Sending...', sent: 'Sent! Thank you, I will reply soon.', fallback: 'Could not send directly, opening your email app instead.', subject: 'Message from ',
    need: 'Need {n} {ore} (you have {have})', unlock: 'Unlock', goMine: '⛏ Go mine', unlocked: 'Unlocked: {name}!', welcome: 'Welcome to my profile!',
    idle_title: 'Are you still there?', idle_text: 'You have been here a while. Press and hold the button below for 10 seconds to verify you are human.', idle_btn: 'Hold for 10 seconds',
    idle_hold: 'Verifying... {s}s left', idle_release: 'You let go! Hold for the full 10 seconds.', idle_done: 'Verified, thank you!',
    chat_help: 'Commands: /time day|night · /speed 1|2|5 · /lang vi|en · /steve', chat_bad: 'Unknown command. Type /help',
    ach: { human: ['Human Verified', 'Passed the captcha'], miner: ['Miner', 'Mined 3 blocks'], collector: ['Collector', 'Unlocked every section'],
           friend: ['Best Friend', 'Said hi to Steve'], coder: ['Hacker', 'Viewed sample code'], patient: ['Patient', 'Held for 10 seconds'] }
  }
};

/* ================= NGÔN NGỮ ================= */
var lang = 'vi';
function T(key, vars) {
  var text = TEXT[lang][key];
  if (text === undefined) text = key;
  for (var name in vars) text = text.replace('{' + name + '}', vars[name]);
  return text;
}
function L(obj) { return typeof obj === 'string' ? obj : obj[lang]; }
function say(el, key, vars) {
  el.dataset.k = key; el.dataset.v = JSON.stringify(vars || {});
  el.textContent = T(key, vars);
}
function setLang(next) {
  lang = next;
  try { localStorage.setItem('lang', next); } catch (e) {}
  document.documentElement.lang = next;
  $$('[data-i]').forEach(function (el) { el.textContent = T(el.dataset.i); });
  $$('[data-k]').forEach(function (el) { el.textContent = T(el.dataset.k, JSON.parse(el.dataset.v)); });
  roles = TEXT[next].roles; roleIndex = 0; charIndex = 0; deleting = false;
  $('#langBtn').textContent = next === 'en' ? 'VI' : 'EN';
  Pixel2D.setLang(next);
  Steve2D.setLang(next);
  renderAll();
}

/* ================= TOAST, TIA LỬA, THÀNH TỰU ================= */
function toast(icon, text) {
  var el = document.createElement('div');
  el.className = 'toast';
  el.innerHTML = '<span>' + icon + '</span><div></div>';
  el.lastChild.textContent = text;
  $('#toasts').appendChild(el);
  setTimeout(function () { el.remove(); }, 4200);
}
var got = {};
function award(id) {
  if (got[id]) return;
  got[id] = true;
  var a = TEXT[lang].ach[id];
  toast('🏆', 'Advancement! ' + a[0] + ' – ' + a[1]);
}
function burst(x, y, colors, count) {
  if (reduce) return;
  for (var i = 0; i < count; i++) {
    var p = document.createElement('div'), angle = Math.random() * 6.283, dist = 40 + Math.random() * 90;
    p.className = 'fx';
    p.style.cssText = 'left:' + x + 'px;top:' + y + 'px;background:' + colors[i % colors.length];
    document.body.appendChild(p);
    p.animate([{ transform: 'translate(0,0)', opacity: 1 },
               { transform: 'translate(' + Math.cos(angle) * dist + 'px,' + (Math.sin(angle) * dist + 40) + 'px) rotate(180deg)', opacity: 0 }],
              { duration: 700, easing: 'ease-out' }).onfinish = p.remove.bind(p);
  }
}

/* ==== PHẦN TIẾP: nền 2D + Steve 2D + render nội dung ==== */

/* ================= NỀN ĐỘNG 2D – THẾ GIỚI MINECRAFT =================
   Địa hình bằng CỘT KHỐI vuông (cỏ/đất/đá), cây sồi block, mây dẹt MC,
   mặt trời vuông, sao pixel, đom đóm – chuyển ngày/đêm mượt                */
var Pixel2D = (function () {
  var canvas = $('#bg'), ctx = canvas.getContext('2d');
  var W = 0, H = 0, t = 0, speed = 1, dayNight = 1, targetDay = 1;
  var B = 36;                                                        // cỡ 1 khối (px)
  var cols = [];                                                     // cột địa hình
  var stars = [], clouds = [], motes = [], fireflies = [], birds = [], pigs = [];
  var COL = {
    day:   { grass: ['#5fae4f', '#6cbb4a', '#55a048'], dirt: '#8a6140', dirt2: '#7d5836', stone: '#7d8087', stone2: '#72757c' },
    night: { grass: ['#25462f', '#2a4f36', '#1f3d29'], dirt: '#4a3524', dirt2: '#42301f', stone: '#3c3f45', stone2: '#35383d' }
  };

  // Sinh địa hình cột khối: cao độ sin/cos + mảng heightmap, mỗi cột là chồng block
  function makeTerrain() {
    cols = [];
    var n = Math.ceil(W / B) + 2;
    for (var i = 0; i < n; i++) {
      var u = i * .45;
      var h = 3 + Math.round(2.2 * Math.sin(u) + 1.6 * Math.cos(u * .53 + 2) + Math.sin(u * .21 + 5));
      cols.push(h);
    }
  }
  function resize() {
    W = canvas.width = innerWidth; H = canvas.height = innerHeight;
    B = W < 700 ? 28 : 40;
    makeTerrain();
    stars = [];
    for (var i = 0; i < 90; i++) stars.push({ x: Math.random() * W, y: Math.random() * H * .6, s: Math.random() < .85 ? 2 : 3, tw: Math.random() * 6.28 });
    clouds = [];
    for (var c = 0; c < 7; c++) clouds.push({ x: Math.random() * W, y: 40 + Math.random() * H * .3, b: 3 + Math.floor(Math.random() * 2), w: 3 + Math.floor(Math.random() * 4), v: 8 + Math.random() * 14 });
    motes = [];
    for (var m = 0; m < 24; m++) motes.push({ x: Math.random() * W, y: Math.random() * H, r: 1 + Math.random() * 2, vx: -6 - Math.random() * 10, vy: -4 - Math.random() * 6 });
    fireflies = [];
    for (var f = 0; f < 16; f++) fireflies.push({ x: Math.random() * W, y: H * .5 + Math.random() * H * .45, tw: Math.random() * 6.28 });
    birds = [];
    for (var b = 0; b < 4; b++) birds.push({ x: Math.random() * W, y: 60 + Math.random() * H * .22, v: 30 + Math.random() * 20, ph: Math.random() * 6.28 });
    pigs = [];
    for (var p = 0; p < 2; p++) pigs.push({ i: Math.floor(Math.random() * cols.length), ph: Math.random() * 6.28, v: 3 + Math.random() * 3 });
  }
  resize();
  addEventListener('resize', resize);

  function lerp(a, b, k) { return a + (b - a) * k; }
  function mixHex(c1, c2, k) {
    var p = function (h) { return [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)]; };
    var a = p(c1), b = p(c2);
    return 'rgb(' + Math.round(lerp(a[0], b[0], k)) + ',' + Math.round(lerp(a[1], b[1], k)) + ',' + Math.round(lerp(a[2], b[2], k)) + ')';
  }

  function draw(dt) {
    t += dt * speed;
    dayNight += (targetDay - dayNight) * Math.min(1, dt * 1.2);
    var day = dayNight;

    // Trời
    var grad = ctx.createLinearGradient(0, 0, 0, H);
    grad.addColorStop(0, mixHex('#0d1120', '#78aef0', day));
    grad.addColorStop(1, mixHex('#16203a', '#a8d0f5', day));
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, H);

    // Mặt trời vuông / trăng (kiểu MC)
    var orbX = W * .78, orbY = H * .18, orbS = 40;
    if (day > .5) {
      ctx.save();
      ctx.shadowColor = '#ffd45e'; ctx.shadowBlur = 50;
      ctx.fillStyle = '#ffd45e';
      ctx.fillRect(orbX - orbS / 2, orbY - orbS / 2, orbS, orbS);
      ctx.restore();
    } else {
      ctx.save();
      ctx.shadowColor = '#cfe0ff'; ctx.shadowBlur = 36;
      ctx.fillStyle = '#e8ecf4';
      ctx.fillRect(orbX - orbS / 2 + 7, orbY - orbS / 2, orbS - 14, orbS);
      ctx.restore();
    }

    // Sao
    var starA = 1 - day;
    if (starA > .02) {
      stars.forEach(function (s) {
        var tw = .55 + .45 * Math.sin(t * 2.2 + s.tw);
        ctx.fillStyle = 'rgba(255,255,255,' + (starA * tw).toFixed(2) + ')';
        ctx.fillRect(s.x, s.y, s.s, s.s);
      });
    }

    // Mây dẹt kiểu MC (chữ nhật dài + vài nút)
    clouds.forEach(function (c) {
      c.x += c.v * dt * speed;
      if (c.x > W + 200) c.x = -240;
      var a = lerp(.22, .85, day);
      var y0 = c.y, cw = c.w * B * .8;
      ctx.fillStyle = 'rgba(255,255,255,' + a.toFixed(2) + ')';
      ctx.fillRect(c.x, y0, cw, c.b * B * .28);
      ctx.fillRect(c.x + cw * .18, y0 - B * .24, cw * .55, B * .26);
    });

    // Địa hình: chồng CỘT KHỐI (gravel viền tối kiểu MC)
    var C = COL.day, CN = COL.night;
    var scroll = Math.floor(t * 4 * speed) % B;                        // đất trôi rất chậm
    for (var i2 = 0; i2 < cols.length; i2++) {
      var x = i2 * B - scroll;
      var h = cols[i2];
      var top = H - h * B - B * .6;
      for (var y = 0; y < h + 2; y++) {
        var by = H - (y + 1) * B - B * .6;
        var col;
        if (y === 0) col = mixHex(C.grass[i2 % 3], CN.grass[i2 % 3], 1 - day);
        else if (y < 3) col = mixHex(y % 2 ? C.dirt : C.dirt2, y % 2 ? CN.dirt : CN.dirt2, 1 - day);
        else col = mixHex(y % 2 ? C.stone : C.stone2, y % 2 ? CN.stone : CN.stone2, 1 - day);
        ctx.fillStyle = col;
        ctx.fillRect(x + 1, by + 1, B - 2, B - 2);                     // khe 2px giữa các block
        // vân sáng trên + tối dưới cho từng block (như texture MC)
        ctx.fillStyle = 'rgba(255,255,255,.07)';
        ctx.fillRect(x + 1, by + 1, B - 2, 3);
        ctx.fillStyle = 'rgba(0,0,0,.13)';
        ctx.fillRect(x + 1, by + B - 6, B - 2, 5);
      }
      // CÂY: mỗi vài cột trồng cây sồi block
      if (i2 % 6 === 2 && h > 2) {
        var tx = x + B / 2, ty = H - h * B - B * .6;
        var trunkH = 3;
        ctx.fillStyle = mixHex('#6b4a2b', '#3a2a18', 1 - day);
        ctx.fillRect(tx - B * .18, ty - trunkH * B * .7, B * .36, trunkH * B * .7);
        var leaf = mixHex('#3f8f3a', '#1f4a20', 1 - day);
        ctx.fillStyle = leaf;
        ctx.fillRect(tx - B * .95, ty - trunkH * B * .7 - B * .75, B * 1.9, B * .8);
        ctx.fillRect(tx - B * .65, ty - trunkH * B * .7 - B * 1.4, B * 1.3, B * .7);
        ctx.fillStyle = 'rgba(255,255,255,.08)';
        ctx.fillRect(tx - B * .95, ty - trunkH * B * .7 - B * .75, B * 1.9, 4);
      }
      // HOA nhỏ trên cỏ
      if (i2 % 9 === 5 && h > 2) {
        var fx = x + B * .5, fy = H - h * B - B * .6 - 5;
        ctx.fillStyle = ['#e28fa1', '#ffe14d', '#ffffff'][i2 % 3];
        ctx.fillRect(fx - 2, fy - 2, 5, 5);
        ctx.fillStyle = mixHex('#3a8c3a', '#1d4520', 1 - day);
        ctx.fillRect(fx - 1, fy + 3, 2, 5);
      }
    }

    // CHÓ/MỘT CON heo pixel đi lại trên mặt cỏ (chỉ ban ngày)
    if (day > .5) {
      pigs.forEach(function (pg) {
        pg.ph += dt * pg.v * speed;
        var i3 = (pg.i + Math.floor(pg.ph)) % cols.length;
        var px2 = i3 * B + B / 2 - scroll + Math.sin(pg.ph) * 4;
        var py = H - cols[i3] * B - B * .6;
        var bob = Math.abs(Math.sin(pg.ph * 3)) * 2;
        ctx.fillStyle = mixHex('#e8a2a0', '#8c5050', .1);
        ctx.fillRect(px2 - 9, py - 12 - bob, 18, 10);                  // thân
        ctx.fillRect(px2 + 7, py - 9 - bob, 6, 6);                     // đầu + mũi
        ctx.fillStyle = '#c97f7e';
        ctx.fillRect(px2 - 7, py - 2, 3, 2); ctx.fillRect(px2 + 4, py - 2, 3, 2); // chân
      });
    } else {
      fireflies.forEach(function (f) {
        f.tw += dt * 2.2 * speed;
        f.x += Math.cos(f.tw * .5) * 10 * dt;
        f.y += Math.sin(f.tw * .8) * 8 * dt;
        var a = Math.max(0, Math.sin(f.tw * 1.4)) * (1 - day);
        if (a > .03) {
          ctx.fillStyle = 'rgba(190,255,140,' + a.toFixed(2) + ')';
          ctx.shadowColor = '#bef28c'; ctx.shadowBlur = 8;
          ctx.fillRect(f.x, f.y, 3, 3);
          ctx.shadowBlur = 0;
        }
      });
    }

    // Chim (ban ngày)
    if (day > .5) {
      birds.forEach(function (b) {
        b.x += b.v * dt * speed; b.ph += dt * 8 * speed;
        if (b.x > W + 40) b.x = -40;
        var flap = Math.sin(b.ph) * 4;
        ctx.strokeStyle = 'rgba(30,40,60,.75)'; ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(b.x - 7, b.y - flap); ctx.lineTo(b.x, b.y); ctx.lineTo(b.x + 7, b.y - flap);
        ctx.stroke();
      });
    }

    // Bụi sáng lơ lửng
    motes.forEach(function (m) {
      m.x += m.vx * dt * speed; m.y += m.vy * dt * speed;
      if (m.x < -8) { m.x = W + 8; m.y = Math.random() * H; }
      if (m.y < -8) { m.y = H + 8; m.x = Math.random() * W; }
      ctx.fillStyle = 'rgba(255,255,255,' + (.1 + .08 * Math.sin(t * 2 + m.x)).toFixed(2) + ')';
      ctx.fillRect(m.x, m.y, m.r, m.r);
    });
  }
  var last = performance.now();
  function loop(now) {
    var dt = Math.min(.05, (now - last) / 1000); last = now;
    if (!document.body.classList.contains('nobg')) draw(dt);
    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);

  return {
    setSpeed: function (n) { speed = n; },
    setTime: function (which) { targetDay = which === 'day' ? 1 : 0; },
    setLang: function () {}
  };
})();

/* ================= STEVE THÚ CƯNG (góc phải dưới, nhỏ hơn, kéo di chuyển) ================= */
var Steve2D = (function () {
  var holder = document.createElement('div');
  holder.id = 'petCorner';
  holder.setAttribute('role', 'button');
  holder.setAttribute('aria-label', 'Steve – bấm để vẫy tay, kéo để di chuyển');
  var cv = document.createElement('canvas');
  holder.appendChild(cv);
  document.body.appendChild(holder);

  var sprite = window.Pixel ? Pixel.steve(cv, { scale: 4 }) : null;
  var bubbleEl = $('#bubble'), bubbleT = 0;
  var LINES = {
    vi: ['Chào bạn! 👋', 'Profile đẹp không?', 'Thử đào mỏ đi!', 'Mình đứng đây cả ngày rồi 😄'],
    en: ['Hi there! 👋', 'Nice profile, right?', 'Go mine some ore!', "I've been standing here all day 😄"]
  };
  var lang2 = 'vi';
  function say() {
    if (!bubbleEl) return;
    var list = LINES[lang2];
    bubbleEl.textContent = list[Math.floor(Math.random() * list.length)];
    var r = holder.getBoundingClientRect();
    bubbleEl.style.left = (r.left + r.width / 2) + 'px';
    bubbleEl.style.top = (r.top - 8) + 'px';
    bubbleEl.style.display = 'block';
    bubbleT = 2.6;
  }

  // Kéo di chuyển Steve
  var dragData = null;
  holder.addEventListener('pointerdown', function (e) {
    var r = holder.getBoundingClientRect();
    dragData = { dx: e.clientX - r.left, dy: e.clientY - r.top, moved: false };
    holder.classList.add('dragging');
    holder.setPointerCapture(e.pointerId);
  });
  holder.addEventListener('pointermove', function (e) {
    if (!dragData) return;
    dragData.moved = true;
    holder.style.right = 'auto';
    holder.style.bottom = 'auto';
    holder.style.left = Math.max(0, Math.min(innerWidth - holder.offsetWidth, e.clientX - dragData.dx)) + 'px';
    holder.style.top = Math.max(0, Math.min(innerHeight - holder.offsetHeight, e.clientY - dragData.dy)) + 'px';
  });
  holder.addEventListener('pointerup', function () {
    holder.classList.remove('dragging');
    if (dragData && !dragData.moved) {
      // Click (không kéo): vẫy tay
      if (sprite) sprite.wave(2);
      say();
      award('friend');
    }
    dragData = null;
  });

  var last2 = performance.now();
  (function tick(now) {
    var dt = Math.min(.05, (now - last2) / 1000); last2 = now;
    if (bubbleT > 0) { bubbleT -= dt; if (bubbleT <= 0) bubbleEl.style.display = 'none'; }
    if (sprite && !document.body.classList.contains('nopet')) sprite.tick(dt);
    requestAnimationFrame(tick);
  })(last2);

  return { setLang: function (l) { lang2 = l; } };
})();

/* ==== PHẦN TIẾP: render nội dung, đào mỏ, captcha... ==== */

/* ================= VẼ NỘI DUNG ================= */
var tabState = {}, typing = {};
function tag(text) { return '<span class="tag">' + esc(text) + '</span>'; }

function renderProfile() {
  $('#info').innerHTML = PROFILE.map(function (row) { return '<div><b>' + T(row[0]) + '</b><span>' + esc(L(row[1])) + '</span></div>'; }).join('');
}
function renderSkills() {
  var shown = $('#skills').classList.contains('in');
  $('#skillBars').innerHTML = SKILLS.map(function (s) {
    return '<div class="skill"><div class="top"><span>' + s[0] + '</span><span class="lv">LV ' + s[1] + '</span></div><div class="xpb"><i data-lv="' + s[1] + '" style="width:' + (shown ? s[1] : 0) + '%"></i></div></div>';
  }).join('');
  $('#techTags').innerHTML = TECH.map(tag).join('');
  $('#softTags').innerHTML = SOFT.map(function (s) { return tag(L(s)); }).join('');
}
function renderProjects() {
  $('#projList').innerHTML = PROJECTS.map(function (p) {
    var langs = Object.keys(p.code), cur = tabState[p.key] = tabState[p.key] || langs[0];
    var links = (p.web ? '<a class="btn" href="' + p.web + '" target="_blank" rel="noopener">' + T('btn_web') + ' ↗</a>' : '') +
                (p.shop ? '<a class="btn" href="' + p.shop + '" target="_blank" rel="noopener">' + T('btn_shop') + ' ↗</a>' : '');
    return '<article class="proj" data-key="' + p.key + '"><span class="year">' + p.year + '</span><h3 class="px">' + esc(L(p.name)) + '</h3><p>' + esc(L(p.desc)) + '</p>' +
      '<div class="tabs">' + langs.map(function (l) { return '<button class="btn tab' + (l === cur ? ' on' : '') + '" type="button" data-lang="' + esc(l) + '">' + esc(l) + '</button>'; }).join('') + '</div>' +
      '<pre class="code"></pre><div class="row">' + links + '<button class="btn copy" type="button">' + T('btn_copy') + '</button></div></article>';
  }).join('');
  $$('.proj').forEach(function (card) { showCode(card, tabState[card.dataset.key], false); });
}
function highlight(src) {
  var safe = esc(src);
  var re = /(--[^\n]*|\/\/[^\n]*|#[^\n]*)|("[^"\n]*"|'[^'\n]*')|\b(const|let|function|async|await|return|if|local|then|end|import|from|while|for|in|def|class|public|private|void|int|new|True|SELECT|FROM|JOIN|ON|GROUP BY|ORDER BY|LIMIT|AS|SUM|COUNT)\b|\b(\d+)\b/g;
  return safe.replace(re, function (m, comment, str, keyword) { return '<span class="' + (comment ? 'c' : str ? 's' : keyword ? 'k' : 'n') + '">' + m + '</span>'; });
}
function showCode(card, langName, animate) {
  var project = PROJECTS.filter(function (p) { return p.key === card.dataset.key; })[0];
  var lines = project.code[langName].split('\n'), box = $('.code', card), shown = animate && !reduce ? 0 : lines.length;
  clearInterval(typing[project.key]);
  function paint() { box.innerHTML = highlight(lines.slice(0, shown).join('\n')); }
  paint();
  if (shown < lines.length) typing[project.key] = setInterval(function () { shown++; paint(); if (shown >= lines.length) clearInterval(typing[project.key]); }, 70);
}
function renderTimeline() {
  $('#timeline').innerHTML = TIMELINE.map(function (t, i) {
    return '<li style="--i:' + i + '"><b>' + esc(L(t.t)) + '</b><span>' + t.y + ' · ' + esc(L(t.d)) + '</span></li>';
  }).join('');
}
function renderFacts() {
  $('#facts').innerHTML = FACTS.map(function (f) {
    return '<div class="fact" tabindex="0"><div class="face front"><b>' + esc(L(f.t)) + '</b></div><div class="face back">' + esc(L(f.d)) + '</div></div>';
  }).join('');
}
function renderContact() {
  $('#contactLinks').innerHTML = CONTACTS.map(function (c) {
    return '<a class="btn" href="' + c.url + '"' + (c.ext ? ' target="_blank" rel="noopener"' : '') + '>' + esc(L(c.label)) + '</a>';
  }).join('');
}
function renderNav() {
  $('#nav').innerHTML = NAV.map(function (id, i) { return '<a class="btn" href="#' + id + '" data-sec="' + id + '" title="' + (i + 1) + '">' + T('nav')[id] + '</a>'; }).join('');
  markActive(currentSection);
  // tiêu đề các section (span thứ 2 trong h2): key nav_xxx -> tra bảng sec
  $$('h2 span[data-i^="nav_"]').forEach(function (sp) {
    var id = sp.dataset.i.slice(4);
    sp.textContent = (TEXT[lang].sec && TEXT[lang].sec[id]) || T('nav')[id] || id;
  });
}
function renderAll() { renderNav(); renderProfile(); renderSkills(); renderProjects(); renderTimeline(); renderFacts(); renderContact(); renderMine(); }

// Bấm tab ngôn ngữ / nút copy trong thẻ dự án
$('#projList').addEventListener('click', function (e) {
  var card = e.target.closest('.proj');
  if (!card) return;
  var tab = e.target.closest('.tab'), copy = e.target.closest('.copy');
  if (tab) {
    tabState[card.dataset.key] = tab.dataset.lang;
    $$('.tab', card).forEach(function (t) { t.classList.toggle('on', t === tab); });
    showCode(card, tab.dataset.lang, true);
    award('coder');
  } else if (copy) {
    var project = PROJECTS.filter(function (p) { return p.key === card.dataset.key; })[0];
    try { navigator.clipboard.writeText(project.code[tabState[card.dataset.key]]); } catch (err) {}
    copy.textContent = T('btn_copied');
    setTimeout(function () { copy.textContent = T('btn_copy'); }, 1200);
  }
});

/* ================= ĐÀO MỎ -> KHO ĐỒ -> MỞ KHÓA MỤC ================= */
var oreKeys = Object.keys(ORES), bag = {}, hits = 0, mined = 0, kind;
oreKeys.forEach(function (k) { bag[k] = 0; });
var oreCanvas = $('#ore'), oc = oreCanvas.getContext('2d');

function pickOre() {
  var total = 0;
  oreKeys.forEach(function (k) { total += ORES[k].weight; });
  var roll = Math.random() * total;
  for (var i = 0; i < oreKeys.length; i++) { roll -= ORES[oreKeys[i]].weight; if (roll < 0) return oreKeys[i]; }
  return oreKeys[0];
}
function newBlock() {
  kind = pickOre(); hits = 0;
  for (var y = 0; y < 16; y++) for (var x = 0; x < 16; x++) {
    var g = 105 + Math.floor(Math.random() * 45);
    oc.fillStyle = 'rgb(' + g + ',' + g + ',' + g + ')';
    oc.fillRect(x, y, 1, 1);
  }
  oc.fillStyle = ORES[kind].color;
  for (var i = 0; i < 9; i++) oc.fillRect(2 + Math.floor(Math.random() * 12), 2 + Math.floor(Math.random() * 12), 2, 2);
}
function mine() {
  hits++;
  oreCanvas.classList.remove('hit'); void oreCanvas.offsetWidth; oreCanvas.classList.add('hit');
  oc.fillStyle = 'rgba(0,0,0,.6)';
  for (var i = 0; i < 12; i++) oc.fillRect(Math.floor(Math.random() * 16), Math.floor(Math.random() * 16), 1, 1);
  if (hits < 3) return;
  var r = oreCanvas.getBoundingClientRect();
  burst(r.left + r.width / 2, r.top + r.height / 2, ['#8b8b8b', '#a0a0a0', ORES[kind].color], 16);
  bag[kind]++; mined++;
  if (mined >= 3) award('miner');
  renderMine();
  var slot = $('.slot[data-ore="' + kind + '"]');
  if (slot) slot.classList.add('pulse');
  newBlock();
}
oreCanvas.onclick = mine;
oreCanvas.onkeydown = function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); mine(); } };
function goTo(id) { $('#' + id).scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' }); }
$('#invBar').onclick = function () { goTo('mine'); };

function renderMine() {
  var names = TEXT[lang].ore;
  $('#invBar').innerHTML = oreKeys.map(function (k) {
    return '<div class="slot" data-ore="' + k + '" title="' + names[k] + '"><i style="background:' + ORES[k].color + '"></i><b>' + bag[k] + '</b></div>';
  }).join('');
  $('#recipes').innerHTML = LOCKS.map(function (l) {
    return '<span class="' + (l.done ? 'ok' : '') + '"><i class="chip-ore" style="background:' + ORES[l.ore].color + '"></i>' + l.cost + ' ' + names[l.ore] + ' → ' + l[lang] + (l.done ? ' ✔' : '') + '</span>';
  }).join('');
  LOCKS.forEach(function (l) {
    if (l.done || !l.box) return;
    $('.need', l.box).textContent = T('need', { n: l.cost, ore: names[l.ore], have: bag[l.ore] });
    $('.unlock', l.box).textContent = bag[l.ore] >= l.cost ? T('unlock') : T('goMine');
  });
}
function tryUnlock(l) {
  if (bag[l.ore] < l.cost) { goTo('mine'); return; }
  bag[l.ore] -= l.cost; l.done = true;
  l.sec.classList.remove('locked');
  Array.prototype.forEach.call(l.sec.children, function (c) { c.inert = false; });
  l.box.remove();
  var top = l.sec.getBoundingClientRect().top;
  burst(innerWidth / 2, Math.min(Math.max(top + 120, 100), innerHeight - 100), ['#d8c3b0', '#ffd34d', '#dfe8f2', '#4be8e0', '#3fd16c'], 26);
  toast('🔓', T('unlocked', { name: l[lang] }));
  renderMine();
  if (LOCKS.every(function (x) { return x.done; })) award('collector');
}
LOCKS.forEach(function (l) {
  l.sec = $('#' + l.id);
  l.sec.classList.add('gated', 'locked');
  l.box = document.createElement('div');
  l.box.className = 'lock';
  l.box.innerHTML = '<div class="lock-veil"></div><div class="big">🔒</div><div class="need"></div><button class="btn unlock" type="button"></button>';
  Array.prototype.forEach.call(l.sec.children, function (c) { if (!c.classList.contains('lock')) c.inert = true; });
  l.sec.appendChild(l.box);
  $('.unlock', l.box).onclick = function () { tryUnlock(l); };
});

/* ================= CHỮ TỰ GÕ, TÊN NHẢY, SỐ ĐẾM ================= */
var roles = TEXT.vi.roles, roleIndex = 0, charIndex = 0, deleting = false, typedEl = $('#typed');
function typeRole() {
  var text = roles[roleIndex];
  if (reduce) { typedEl.textContent = text; return; }
  typedEl.textContent = text.slice(0, charIndex);
  if (!deleting && charIndex < text.length) { charIndex++; setTimeout(typeRole, 70); }
  else if (!deleting) { deleting = true; setTimeout(typeRole, 1400); }
  else if (charIndex > 0) { charIndex--; setTimeout(typeRole, 35); }
  else { deleting = false; roleIndex = (roleIndex + 1) % roles.length; setTimeout(typeRole, 300); }
}
$('#heroName').innerHTML = NAME.split('').map(function (ch) { return ch === ' ' ? ' ' : '<span class="ltr">' + ch + '</span>'; }).join('');

$$('[data-count]').forEach(function (el) {
  var target = Number(el.dataset.count), step = 0;
  (function tick() { step++; el.textContent = Math.round(target * Math.min(step / 30, 1)); if (step < 30 && !reduce) requestAnimationFrame(tick); })();
});

/* ================= CUỘN TRANG: XP, MENU, HIỆN DẦN ================= */
var currentSection = 'profile';
function markActive(id) { $$('#nav .btn').forEach(function (b) { b.classList.toggle('on', b.dataset.sec === id); }); }
function onScroll() {
  var max = document.documentElement.scrollHeight - innerHeight;
  var pct = max > 0 ? Math.min(100, Math.round(scrollY / max * 100)) : 0;
  $('#xpFill').style.width = pct + '%'; $('#lvl').textContent = pct;
  var active = NAV[0];
  NAV.forEach(function (id) { if ($('#' + id).getBoundingClientRect().top < innerHeight * .45) active = id; });
  if (active !== currentSection) { currentSection = active; markActive(active); }
}
addEventListener('scroll', onScroll);

var io = new IntersectionObserver(function (entries) {
  entries.forEach(function (en) {
    if (!en.isIntersecting) return;
    en.target.classList.add('in');
    $$('[data-lv]', en.target).forEach(function (bar) { bar.style.width = bar.dataset.lv + '%'; });
    io.unobserve(en.target);
  });
}, { threshold: .12 });
$$('.reveal').forEach(function (s) { io.observe(s); });

/* ==== PHẦN TIẾP: captcha, chat, form, con trỏ, khởi động ==== */

/* ================= CAPTCHA ================= */
var panel = $('#gatePanel'), head = $('#gateHead'), panelPlaced = false;
function placePanel() {
  // chỉ đặt tọa độ khi panel đã có kích thước thật (tránh đẩy ra ngoài màn hình)
  var r = panel.getBoundingClientRect();
  if (r.width < 10) return;
  if (!panelPlaced) {
    panel.style.left = Math.max(8, (innerWidth - r.width) / 2) + 'px';
    panel.style.top = Math.max(8, (innerHeight - r.height) / 2.4) + 'px';
    panel.style.transform = 'none';
    panelPlaced = true;
    return;
  }
  panel.style.left = Math.max(8, Math.min(innerWidth - r.width - 8, r.left)) + 'px';
  panel.style.top = Math.max(8, Math.min(innerHeight - 48, r.top)) + 'px';
}
addEventListener('resize', function () {
  if (!panelPlaced) return;
  panel.style.left = Math.max(8, Math.min(innerWidth - panel.offsetWidth - 8, parseFloat(panel.style.left) || 0)) + 'px';
  panel.style.top = Math.max(8, Math.min(innerHeight - 48, parseFloat(panel.style.top) || 0)) + 'px';
});
if (document.readyState === 'complete') placePanel();
else addEventListener('load', placePanel);
setTimeout(placePanel, 60);
var drag = null;
head.addEventListener('pointerdown', function (e) {
  if (e.target.closest('button')) return;
  var r = panel.getBoundingClientRect();
  drag = { dx: e.clientX - r.left, dy: e.clientY - r.top };
  head.setPointerCapture(e.pointerId);
});
head.addEventListener('pointermove', function (e) {
  if (!drag) return;
  panel.style.left = Math.max(0, Math.min(innerWidth - panel.offsetWidth, e.clientX - drag.dx)) + 'px';
  panel.style.top = Math.max(0, Math.min(innerHeight - 44, e.clientY - drag.dy)) + 'px';
});
head.addEventListener('pointerup', function () { drag = null; });
$('#gateMin').onclick = function () { panel.classList.toggle('mini'); this.textContent = panel.classList.contains('mini') ? '▢' : '—'; placePanel(); };

var TOTAL = 2, round = 0, answer = 0, chk = $('#bar .chk');
function newQuestion() {
  var a = Math.floor(Math.random() * 9) + 2, b = Math.floor(Math.random() * 9) + 2;
  var op = ['+', '-', '×'][Math.floor(Math.random() * 3)];
  if (op === '-' && b > a) { var tmp = a; a = b; b = tmp; }
  answer = op === '+' ? a + b : op === '-' ? a - b : a * b;
  $('#q').textContent = a + ' ' + op + ' ' + b + ' = ?';
  $('#round').textContent = (round + 1) + '/' + TOTAL;
  $('#ans').value = ''; $('#ans').focus();
}
$('#bar').onclick = function () {
  if (this.dataset.started) return;
  this.dataset.started = 1;
  chk.classList.add('load');
  say($('#barText'), 'checking');
  setTimeout(function () {
    chk.classList.remove('load'); chk.textContent = '?';
    say($('#barText'), 'solve');
    $('#quiz').classList.add('show');
    newQuestion();
  }, 900);
};
$('#quiz').addEventListener('submit', function (e) {
  e.preventDefault();
  if (parseInt($('#ans').value, 10) === answer) {
    round++;
    if (round < TOTAL) { say($('#msg'), 'right', { n: TOTAL - round }); newQuestion(); return; }
    chk.textContent = '✔';
    say($('#barText'), 'ok');
    $('#quiz').style.display = 'none';
    setTimeout(openSite, 700);
  } else {
    say($('#msg'), 'wrong');
    panel.classList.remove('shake'); void panel.offsetWidth; panel.classList.add('shake');
    newQuestion();
  }
});
function setInert(flag) { $$('.nav, .wrap').forEach(function (el) { el.inert = flag; }); }
setInert(true);
function openSite() {
  $('#gate').classList.add('done');
  document.body.classList.remove('locked'); document.body.classList.add('ready', 'video-on-off');
  setInert(false);
  setTimeout(function () { $('#gate').remove(); }, 900);
  // Đổi nền: tắt video cổng, bật video + nhạc nền profile
  var v = $('#bgVideo');
  if (v) { try { v.pause(); } catch (e) {} }
  document.body.classList.remove('video-on');
  document.body.classList.add('profile-mode');

  // Phát video nền profile
  var pv = $('#bgProfileVideo');
  if (pv) {
    function onPV() { document.body.classList.add('pvideo-on'); pv.classList.add('pvideo-on'); }
    function offPV() { document.body.classList.remove('pvideo-on'); pv.classList.remove('pvideo-on'); }
    pv.addEventListener('playing', onPV);
    pv.addEventListener('loadeddata', function () { if (pv.readyState >= 2 && !pv.paused) onPV(); });
    pv.addEventListener('error', offPV);
    var pSources = pv.querySelectorAll('source');
    if (pSources.length) pSources[pSources.length - 1].addEventListener('error', offPV);
    var pp = pv.play(); if (pp && pp.catch) pp.catch(offPV);
  }

  // Phát nhạc nền profile
  var music = $('#bgMusic');
  if (music) {
    var playMusic = function () {
      var mp = music.play();
      if (mp && mp.catch) mp.catch(function () {});
    };
    // Auto-play có thể bị chặn: bật sau tương tác đầu tiên
    playMusic();
    if (music.paused) {
      var unlock = function () {
        playMusic();
        document.removeEventListener('click', unlock);
        document.removeEventListener('keydown', unlock);
      };
      document.addEventListener('click', unlock);
      document.addEventListener('keydown', unlock);
    }
  }

  toast('🏆', T('welcome'));
  award('human');
  onScroll(); armStay();
}

/* ================= NỀN + TỐC ĐỘ + NGÀY/ĐÊM ================= */
// Video nền: chỉ khi phát được mới bật .video-on (ngược lại giữ nền pixel canvas)
(function () {
  var v = $('#bgVideo');
  if (!v) return;
  function on() { document.body.classList.add('video-on'); }
  function off() { document.body.classList.remove('video-on'); }
  v.addEventListener('playing', on);
  v.addEventListener('loadeddata', function () { if (v.readyState >= 2 && !v.paused) on(); });
  v.addEventListener('error', off);
  // nguồn cuối cùng lỗi -> chắc chắn dùng nền canvas
  var sources = v.querySelectorAll('source');
  if (sources.length) {
    sources[sources.length - 1].addEventListener('error', off);
  }
  var meta = v.querySelector('source');
  // nếu video không có file: sau 3s mà chưa phát thì bỏ .video-on
  setTimeout(function () { if (v.readyState < 2 || v.paused) off(); }, 3000);
  var p = v.play(); if (p && p.catch) p.catch(function () { off(); });
})();
$$('.speed [data-speed]').forEach(function (b) {
  b.onclick = function () {
    $$('.speed [data-speed]').forEach(function (x) { x.classList.toggle('on', x === b); });
    var v = $('#bgVideo');
    if (v) { try { v.playbackRate = Number(b.dataset.speed); } catch (e) {} }
    Pixel2D.setSpeed(Number(b.dataset.speed));
  };
});
$$('.speed [data-time]').forEach(function (b) {
  b.onclick = function () {
    $$('.speed [data-time]').forEach(function (x) { x.classList.toggle('on', x === b); });
    Pixel2D.setTime(b.dataset.time);
  };
});
$('#langBtn').onclick = function () { setLang(lang === 'vi' ? 'en' : 'vi'); };

/* ================= Ở TRANG QUÁ LÂU: NHẤN GIỮ 10 GIÂY =================
   Chỉ hiện khi người dùng THỰC SỰ không thao tác gì trong STAY_MS.
   Mọi thao tác (chuột, cuộn, phím, chạm) đều đặt lại bộ đếm.            */
var stayTimer = 0, holdStart = 0, holdRaf = 0, holdOpen = false;
function armStay() {
  clearTimeout(stayTimer);
  // Chưa vào trong (còn cổng captcha) thì không hẹn giờ
  if (!document.body.classList.contains('ready')) return;
  stayTimer = setTimeout(showHold, STAY_MS);
}
function resetStay() {
  if (holdOpen) return;            // đang hiện bảng xác minh thì không đặt lại
  armStay();
}
function showHold() {
  // Kiểm tra lại: nếu đã rời trang hoặc đang có cổng captcha thì bỏ qua
  if (!document.body.classList.contains('ready') || document.hidden) { armStay(); return; }
  holdOpen = true;
  $('#hold').hidden = false; setInert(true);
  say($('#holdMsg'), 'idle_hold', { s: Math.round(HOLD_MS / 1000) });
}
function closeHold() {
  holdOpen = false; holdStart = 0;
  cancelAnimationFrame(holdRaf);
  $('#hold').hidden = true; $('#holdFill').style.width = '0%';
  setInert(false);
}
function tickHold(now) {
  var pct = Math.min(1, (now - holdStart) / HOLD_MS);
  $('#holdFill').style.width = pct * 100 + '%';
  say($('#holdMsg'), 'idle_hold', { s: Math.ceil((1 - pct) * HOLD_MS / 1000) });
  if (pct >= 1) { closeHold(); toast('✅', T('idle_done')); award('patient'); armStay(); return; }
  holdRaf = requestAnimationFrame(tickHold);
}
function startHold() { if (holdStart) return; holdStart = performance.now(); holdRaf = requestAnimationFrame(tickHold); }
function cancelHold() {
  if (!holdStart) return;
  cancelAnimationFrame(holdRaf); holdStart = 0;
  $('#holdFill').style.width = '0%'; say($('#holdMsg'), 'idle_release');
}
var holdBtn = $('#holdBtn');
holdBtn.addEventListener('pointerdown', startHold);
['pointerup', 'pointerleave', 'pointercancel'].forEach(function (ev) { holdBtn.addEventListener(ev, cancelHold); });
holdBtn.addEventListener('keydown', function (e) { if ((e.key === ' ' || e.key === 'Enter') && !e.repeat) { e.preventDefault(); startHold(); } });
holdBtn.addEventListener('keyup', cancelHold);

// Mọi thao tác của người dùng -> đặt lại bộ đếm "ở quá lâu"
['pointerdown', 'pointermove', 'wheel', 'keydown', 'touchstart', 'scroll'].forEach(function (ev) {
  addEventListener(ev, resetStay, { passive: true });
});
// Quay lại tab -> chắc chắn không hiện bảng xác minh
document.addEventListener('visibilitychange', function () {
  if (!document.hidden) { if (holdOpen) closeHold(); armStay(); }
});
// Nếu vì lý do nào đó trang tải lại mà đã sẵn sàng thì hẹn giờ luôn
if (document.body.classList.contains('ready')) armStay();

/* ================= CHAT LỆNH (nhấn / hoặc T) ================= */
var chat = $('#chat'), chatIn = $('#chatIn');
addEventListener('keydown', function (e) {
  var typingNow = /INPUT|TEXTAREA/.test(e.target.tagName);
  if (!document.body.classList.contains('ready') || typingNow) {
    if (e.key === 'Escape' && !chat.hidden) { chat.hidden = true; }
    return;
  }
  var n = parseInt(e.key, 10);
  if (n >= 1 && n <= NAV.length) goTo(NAV[n - 1]);
  else if (e.key === '/' || e.key === 't' || e.key === 'T') { e.preventDefault(); chat.hidden = false; chatIn.value = e.key === '/' ? '/' : ''; chatIn.focus(); }
});
chatIn.addEventListener('keydown', function (e) { if (e.key === 'Escape') { chat.hidden = true; chatIn.blur(); } });
chat.addEventListener('submit', function (e) {
  e.preventDefault();
  var parts = chatIn.value.trim().replace(/^\//, '').split(/\s+/), cmd = parts[0], arg = parts[1];
  chat.hidden = true; chatIn.value = ''; chatIn.blur();
  if (cmd === 'help') toast('💬', T('chat_help'));
  else if (cmd === 'time' && (arg === 'day' || arg === 'night')) { var tb = $('.speed [data-time="' + arg + '"]'); if (tb) tb.click(); }
  else if (cmd === 'speed' && ['1', '2', '5'].indexOf(arg) >= 0) { var b = $('.speed [data-speed="' + arg + '"]'); if (b) b.click(); }
  else if (cmd === 'lang' && (arg === 'vi' || arg === 'en')) setLang(arg);
  else if (cmd === 'steve') { var pt = $('#petCorner'); if (pt) pt.click(); }
  else toast('💬', T('chat_bad'));
});

/* ================= FORM GỬI EMAIL ================= */
var form = $('#msgForm'), statusEl = $('#formStatus');
function plane() {
  if (reduce) return;
  var el = document.createElement('div'), r = form.getBoundingClientRect();
  el.className = 'plane'; el.textContent = '✉';
  el.style.left = r.left + 40 + 'px'; el.style.top = r.bottom - 40 + 'px';
  document.body.appendChild(el);
  el.animate([{ transform: 'translate(0,0) rotate(0)', opacity: 1 }, { transform: 'translate(300px,-260px) rotate(25deg)', opacity: 0 }], { duration: 1200, easing: 'ease-in' }).onfinish = el.remove.bind(el);
}
form.addEventListener('submit', function (event) {
  event.preventDefault();
  var data = Object.fromEntries(new FormData(form));
  say(statusEl, 'sending');
  fetch('https://formsubmit.co/ajax/' + MY_EMAIL, {
    method: 'POST', headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
    body: JSON.stringify({ name: data.name, email: data.email, message: data.message, _subject: 'Tin nhắn mới từ trang profile' })
  })
  .then(function (res) { return res.json(); })
  .then(function (result) {
    if (String(result.success) !== 'true') throw new Error('fail');
    say(statusEl, 'sent'); plane(); form.reset();
  })
  .catch(function () {
    say(statusEl, 'fallback');
    location.href = 'mailto:' + MY_EMAIL + '?subject=' + encodeURIComponent(T('subject') + data.name) +
      '&body=' + encodeURIComponent(data.message + '\n\nEmail: ' + data.email);
  });
});

/* ================= CON TRỎ: CSS tự lo (xem style.css mục 15) =================
   Chỉ giữ hiệu ứng tia lửa khi bấm. Không ẩn/thay chuột bằng JS nữa.            */
if (matchMedia('(hover: hover) and (pointer: fine)').matches) {
  addEventListener('pointerdown', function (e) {
    burst(e.clientX, e.clientY, ['#7cc0ff', '#6ee7a0', '#ffd45e', '#ff8fab'], 6);
  });
}

/* ================= TIẾNG KHI CLICK ================= */
var Snd = (function () {
  var el = $('#clickSnd'), ok = true, ac = null;
  if (el) el.addEventListener('error', function () { ok = false; });
  if (el && el.querySelector('source')) {
    // Nếu không load được file thì dùng beep Web Audio
    setTimeout(function () { if (el.readyState === 0) ok = false; }, 2500);
  } else ok = false;
  function beep() {
    try {
      if (!ac) ac = new (window.AudioContext || window.webkitAudioContext)();
      if (ac.state === 'suspended') ac.resume();
      var o = ac.createOscillator(), g = ac.createGain();
      o.type = 'square'; o.frequency.value = 880;
      g.gain.setValueAtTime(0.04, ac.currentTime);
      g.gain.exponentialRampToValueAtTime(0.0001, ac.currentTime + 0.07);
      o.connect(g); g.connect(ac.destination);
      o.start(); o.stop(ac.currentTime + 0.08);
    } catch (e) {}
  }
  return {
    play: function () {
      if (ok && el && el.readyState >= 2) {
        try { el.currentTime = 0; var p = el.play(); if (p && p.catch) p.catch(function () { beep(); }); } catch (e) { beep(); }
      } else beep();
    }
  };
})();
document.addEventListener('click', function (e) {
  if (e.target.closest('a, button, .btn, [role="button"], .fact, #bar, #ore, .tab, .copy, .unlock, .slot')) Snd.play();
}, true);

/* ================= AVATAR: ảnh mặt trong player card ================= */
(function () {
  var wrap = $('#avatarWrap'), img = $('#heroAvatar'), cv = $('#heroSteve');
  if (!wrap || !img) return;
  // Nếu không có avatar.png (hoặc lỗi load) -> hiện Steve pixel như trước
  function fallback() {
    wrap.classList.add('nofoto');
    if (cv) cv.style.display = 'block';
  }
  img.addEventListener('error', fallback);
  if (img.complete && img.naturalWidth === 0) fallback();
  else wrap.classList.remove('nofoto');
  // Steve dự phòng: vẽ pixel (ẩn khi có ảnh)
  if (cv && window.Pixel) {
    try {
      var s = Pixel.steve(cv, { scale: 6 });
      s.drawNow();
      cv.addEventListener('click', function () { s.wave(2.2); award('friend'); });
      (function tickHero(now) {
        var last = tickHero.last || now, dt = Math.min(.05, (now - last) / 1000);
        tickHero.last = now;
        if (!wrap.classList.contains('nofoto')) s.tick(dt);
        requestAnimationFrame(tickHero);
      })(performance.now());
    } catch (err) { cv.style.display = 'none'; }
  }
})();

/* ================= KHỞI ĐỘNG ================= */
typeRole();
newBlock();
var savedLang = null;
try { savedLang = localStorage.getItem('lang'); } catch (e) {}
setLang(savedLang === 'en' ? 'en' : 'vi');
onScroll();

