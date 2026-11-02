/* animations.js — nạp SAU script.js (defer). Tự chạy lại mỗi khi script.js render trang. */
(() => {
  const content = document.querySelector('#page-content');
  const header = document.querySelector('.site-header');
  if (!content) return;

  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = matchMedia('(hover:hover) and (pointer:fine)').matches;

  const ITEMS = '.section-title > p,.hero-kicker,.personal-hero-bottom,.studio-kicker,.studio-intro,.about-copy > *,.stats > div,' +
    '.studio-about-copy > p,.studio-stats > div,.project-card,.stack-card,.exploring,.service-row,.case-card,.member,' +
    '.testimonial > *,.contact-section > p,.contact-section > div,.contact-section blockquote,.studio-contact > div > p,' +
    '.studio-contact > div > span,.studio-contact form,.gallery-heading > p,.personal-gallery figure';
  const HEADINGS = '.personal-hero h1,.studio-hero h1,.section-title h2,.gallery-heading h2,.contact-section h2,.studio-contact h2';
  const PARALLAX = [ // [selector, speed, mode]  mode: top = theo đầu section, mid = theo giữa viewport
    ['.hero-portrait', .14, 'top'], ['.code-window', .07, 'top'], ['.orbit-mark', .22, 'top'],
    ['.gallery-side', .1, 'mid'], ['.studio-photo-break img', .06, 'mid']
  ];

  /* ---------- tách từ cho tiêu đề ---------- */
  function splitWords(el) {
    let n = 0;
    el.setAttribute('aria-label', el.textContent.replace(/\s+/g, ' ').trim());
    const walk = node => [...node.childNodes].forEach(c => {
      if (c.nodeType === 3) {
        const frag = document.createDocumentFragment();
        c.textContent.split(/(\s+)/).forEach(t => {
          if (!t) return;
          if (/^\s+$/.test(t)) return frag.append(' ');
          const w = document.createElement('span'); w.className = 'w'; w.setAttribute('aria-hidden', 'true');
          const i = document.createElement('span'); i.className = 'wi'; i.textContent = t; i.style.setProperty('--w', n++);
          w.append(i); frag.append(w);
        });
        c.replaceWith(frag);
      } else if (c.nodeType === 1 && c.tagName !== 'BR') walk(c);
    });
    walk(el);
  }

  /* ---------- đếm số ---------- */
  function countUp(el) {
    const m = el.textContent.match(/^(\D*)(\d+(?:\.\d+)?)(.*)$/);
    if (!m) return;
    const [, pre, num, suf] = m, dec = (num.split('.')[1] || '').length, pad = dec ? 0 : num.length, end = parseFloat(num);
    const fmt = v => pre + (dec ? v.toFixed(dec) : String(Math.round(v)).padStart(pad, '0')) + suf;
    const t0 = performance.now(), dur = 1600;
    const tick = now => {
      const k = Math.min((now - t0) / dur, 1), e = k === 1 ? 1 : 1 - Math.pow(2, -10 * k);
      el.textContent = fmt(end * e);
      if (k < 1) requestAnimationFrame(tick);
    };
    el.textContent = fmt(0);
    requestAnimationFrame(tick);
  }

  /* ---------- parallax có lerp (translate riêng, không đụng transform) ---------- */
  let px = [], running = false;
  function frame() {
    let moving = false;
    px.forEach(p => {
      const r = p.host.getBoundingClientRect();
      if (r.bottom < -300 || r.top > innerHeight + 300) return;
      const target = p.mode === 'top' ? -r.top * p.speed : (innerHeight / 2 - (r.top + r.height / 2)) * p.speed;
      p.cur += (target - p.cur) * .12;
      if (Math.abs(target - p.cur) > .05) moving = true;
      p.el.style.translate = `0 ${p.cur.toFixed(2)}px`;
    });
    running = moving;
    if (moving) requestAnimationFrame(frame);
  }
  const kick = () => { if (!running && px.length) { running = true; requestAnimationFrame(frame); } };

  /* ---------- scroll: progress + header + parallax ---------- */
  let lastY = scrollY, queued = false;
  function onScroll() {
    if (queued) return;
    queued = true;
    requestAnimationFrame(() => {
      queued = false;
      const y = scrollY, max = document.documentElement.scrollHeight - innerHeight;
      document.documentElement.style.setProperty('--p', max > 0 ? (y / max).toFixed(4) : 0);
      header.classList.toggle('is-scrolled', y > 10);
      if (y > lastY + 4 && y > 240) header.classList.add('is-hidden');
      else if (y < lastY - 4 || y < 240) header.classList.remove('is-hidden');
      lastY = y;
      kick();
    });
  }

  /* ---------- enhance: chạy mỗi lần render trang ---------- */
  let io, spy;
  function enhance() {
    io && io.disconnect(); spy && spy.disconnect();
    px = [];
    header.classList.remove('is-hidden');

    if (!reduce) {
      PARALLAX.forEach(([s, speed, mode]) => content.querySelectorAll(s).forEach(el => {
        const host = el.closest('section') || el.parentElement;
        el.dataset.parallax = '1';
        px.push({ el, host, speed, mode, cur: 0 });
      }));
    }

    const sections = [...content.querySelectorAll('main > section')];
    sections.forEach(sec => {
      if (!reduce) sec.querySelectorAll(HEADINGS).forEach(h => { splitWords(h); h.dataset.split = '1'; });
      let i = 0;
      sec.querySelectorAll(ITEMS).forEach(el => {
        if (el.closest('[data-split]') && el.matches('[data-split]')) return;
        if (el.dataset.parallax) { el.setAttribute('data-fade', ''); return; }
        el.setAttribute('data-anim', ''); el.style.setProperty('--i', Math.min(i++, 9));
      });
      sec.querySelectorAll('[data-parallax]').forEach(el => el.setAttribute('data-fade', ''));
    });

    io = new IntersectionObserver(entries => entries.forEach(e => {
      if (!e.isIntersecting) return;
      e.target.classList.add('in');
      if (!reduce) e.target.querySelectorAll('.stats strong,.studio-stats strong').forEach(countUp);
      io.unobserve(e.target);
    }), { threshold: .12, rootMargin: '0px 0px -6% 0px' });
    requestAnimationFrame(() => requestAnimationFrame(() => sections.forEach(s => io.observe(s))));

    /* scrollspy cho menu */
    const links = [...document.querySelectorAll('.main-nav a')];
    spy = new IntersectionObserver(entries => entries.forEach(e => {
      if (!e.isIntersecting) return;
      links.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + e.target.id));
    }), { rootMargin: '-45% 0px -50% 0px' });
    content.querySelectorAll('main[id],section[id]').forEach(s => spy.observe(s));

    if (fine && !reduce) bindPointer();
    onScroll(); kick();
  }

  /* ---------- tilt thẻ dự án + magnetic button ---------- */
  function bindPointer() {
    content.querySelectorAll('.project-card').forEach(card => {
      card.addEventListener('pointermove', e => {
        const r = card.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
        card.style.setProperty('--ry', (x * 7).toFixed(2) + 'deg');
        card.style.setProperty('--rx', (-y * 7).toFixed(2) + 'deg');
      });
      card.addEventListener('pointerleave', () => { card.style.setProperty('--rx', '0deg'); card.style.setProperty('--ry', '0deg'); });
    });
    content.querySelectorAll('.button').forEach(btn => {
      btn.addEventListener('pointermove', e => {
        const r = btn.getBoundingClientRect();
        btn.style.translate = `${((e.clientX - r.left) / r.width - .5) * 14}px ${((e.clientY - r.top) / r.height - .5) * 10}px`;
      });
      btn.addEventListener('pointerleave', () => { btn.style.translate = ''; });
    });
  }

  addEventListener('scroll', onScroll, { passive: true });
  addEventListener('resize', kick, { passive: true });
  // script.js thay innerHTML của #page-content mỗi lần đổi trang → chạy lại enhance
  new MutationObserver(enhance).observe(content, { childList: true });
  if (content.children.length) enhance(); // lần render đầu đã xảy ra trước khi observer được tạo
})();
