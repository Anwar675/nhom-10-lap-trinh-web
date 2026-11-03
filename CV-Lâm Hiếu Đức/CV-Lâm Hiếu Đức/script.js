(() => {
      const $ = (selector, root = document) => root.querySelector(selector);
      const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      const cvContainer = $('.cv-container');
      let cvPageIndex = 0;
      let cvPages = [];
      let cvNavButtons = [];
      let cvTitle = null;
      let cvDescription = null;
      let cvPageCount = null;
      let cvProgress = null;
      let cvPrev = null;
      let cvNext = null;
      function activateCvPage(index) {
        if (!cvPages.length) return;
        cvPageIndex = Math.max(0, Math.min(index, cvPages.length - 1));
        cvPages.forEach((page, i) => page.classList.toggle('is-active', i === cvPageIndex));
        cvNavButtons.forEach((button, i) => {
          if (i === cvPageIndex) button.setAttribute('aria-current', 'page');
          else button.removeAttribute('aria-current');
        });
        const current = cvPages[cvPageIndex];
        cvTitle.textContent = current.dataset.title;
        cvDescription.textContent = current.dataset.description;
        cvPageCount.innerHTML = `<strong>${String(cvPageIndex + 1).padStart(2, '0')}</strong> / ${String(cvPages.length).padStart(2, '0')}`;
        [...cvProgress.children].forEach((bar, i) => bar.classList.toggle('is-done', i <= cvPageIndex));
        cvPrev.disabled = cvPageIndex === 0;
        cvNext.disabled = cvPageIndex === cvPages.length - 1;
      }
      if (cvContainer) {
        const original = [...cvContainer.children];
        const [cvTools, cvTop, cvPersonal, cvEducationWork, cvProjects, cvSkillsCertificates, cvHobbies, cvFooter] = original;
        const tools = $('.cv-tool-actions', cvTools);
        const backButton = document.createElement('button');
        backButton.type = 'button';
        backButton.className = 'cv-action';
        backButton.id = 'cvBackToPortfolio';
        backButton.textContent = '← Portfolio';
        tools.prepend(backButton);
        const workspace = document.createElement('div');
        workspace.className = 'cv-workspace';
        workspace.innerHTML = `<aside class="cv-rail"><p class="cv-rail-title">✦ Hồ sơ nhân vật</p><p class="cv-rail-subtitle">PERSONAL DATA ARCHIVE // SELECT A PAGE</p><nav class="cv-nav" aria-label="Các phần trong CV"></nav><div class="cv-rail-bottom"><div class="cv-rail-status">ARCHIVE STATUS<br><strong>● SYNCED</strong> · 6 DATA PAGES</div></div></aside><main class="cv-stage"><header class="cv-stage-head"><div><div class="cv-stage-kicker">PERSONAL DOSSIER // 2026</div><h2 class="cv-stage-title"></h2><p class="cv-stage-description"></p></div><div class="cv-page-count"></div></header><div class="cv-page-stack"></div><div class="cv-page-controls"><div class="cv-progress" aria-label="Tiến độ xem CV"></div><div class="cv-step-actions"><button class="cv-action cv-step-button cv-prev" type="button">← Trước</button><button class="cv-action cv-action-primary cv-step-button cv-next" type="button">Tiếp →</button></div></div></main>`;
        cvContainer.replaceChildren(cvTools, workspace, cvFooter);
        cvTitle = $('.cv-stage-title', workspace);
        cvDescription = $('.cv-stage-description', workspace);
        cvPageCount = $('.cv-page-count', workspace);
        cvProgress = $('.cv-progress', workspace);
        cvPrev = $('.cv-prev', workspace);
        cvNext = $('.cv-next', workspace);
        const nav = $('.cv-nav', workspace);
        const stack = $('.cv-page-stack', workspace);
        const definitions = [
          { key: 'overview', title: 'Tổng quan', description: 'Lời giới thiệu và định hướng nghề nghiệp.', label: 'Tổng quan', icon: '✦', node: cvTop },
          { key: 'personal', title: 'Thông tin cá nhân', description: 'Thông tin liên hệ và hồ sơ cơ bản.', label: 'Cá nhân', icon: '◈', node: cvPersonal },
          { key: 'education', title: 'Học vấn & kinh nghiệm', description: 'Quá trình học tập và trải nghiệm thực hành.', label: 'Học vấn', icon: '▤', node: cvEducationWork },
          { key: 'projects', title: 'Dự án & hoạt động', description: 'Những sản phẩm và bài thực hành tiêu biểu.', label: 'Dự án', icon: '⚒', node: cvProjects },
          { key: 'skills', title: 'Kỹ năng & chứng chỉ', description: 'Năng lực đang phát triển và khóa học đã hoàn thành.', label: 'Kỹ năng', icon: '✧', node: cvSkillsCertificates },
          { key: 'extras', title: 'Thông tin bổ sung', description: 'Sở thích và những điều tạo nên màu sắc cá nhân.', label: 'Bổ sung', icon: '♡', node: cvHobbies }
        ];
        definitions.forEach((definition, index) => {
          const page = document.createElement('section');
          page.className = 'cv-page';
          page.dataset.page = definition.key;
          page.dataset.title = definition.title;
          page.dataset.description = definition.description;
          const inner = document.createElement('div');
          inner.className = 'cv-page-inner';
          if (definition.node) inner.append(definition.node);
          page.append(inner);
          stack.append(page);
          const button = document.createElement('button');
          button.type = 'button';
          button.className = 'cv-nav-button';
          button.dataset.index = String(index);
          button.innerHTML = `<span class="cv-nav-icon" aria-hidden="true">${definition.icon}</span><span class="cv-nav-label">${definition.label}</span><span class="cv-nav-index">0${index + 1}</span>`;
          button.addEventListener('click', () => activateCvPage(index));
          nav.append(button);
          const progressBar = document.createElement('i');
          cvProgress.append(progressBar);
        });
        cvPages = $$('.cv-page', stack);
        cvNavButtons = $$('.cv-nav-button', nav);
        cvPrev.addEventListener('click', () => activateCvPage(cvPageIndex - 1));
        cvNext.addEventListener('click', () => activateCvPage(cvPageIndex + 1));
        backButton.addEventListener('click', () => document.body.classList.remove('showing-simple-cv', 'cv-active'));
        activateCvPage(0);
        document.addEventListener('keydown', event => {
          if (!document.body.classList.contains('showing-simple-cv')) return;
          if (event.key === 'ArrowRight' || event.key === 'PageDown') { event.preventDefault(); activateCvPage(cvPageIndex + 1); }
          if (event.key === 'ArrowLeft' || event.key === 'PageUp') { event.preventDefault(); activateCvPage(cvPageIndex - 1); }
          if (event.key === 'Escape') document.body.classList.remove('showing-simple-cv', 'cv-active');
        });
      }

      $('#year').textContent = new Date().getFullYear();

      const forestScene = $('#pixelForestScene');
      if (forestScene && !prefersReducedMotion) {
        for (let i = 0; i < 18; i++) {
          const particle = document.createElement('span');
          particle.className = `pixel-falling-particle ${i % 3 === 0 ? 'petal' : 'leaf'}`;
          particle.style.setProperty('--fall-x', `${(i * 37 + 9) % 100}%`);
          particle.style.setProperty('--fall-duration', `${15 + (i % 5) * 3}s`);
          particle.style.setProperty('--fall-delay', `${-((i * 7) % 23)}s`);
          forestScene.append(particle);
        }
      }

      const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
      if (finePointer) {
        let clickEffectIndex = 0;
        document.addEventListener('click', event => {
          if (event.button !== 0) return;
          const burst = document.createElement('span');
          const showFlower = clickEffectIndex++ % 2 === 1;
          burst.className = `pixel-click-effect${showFlower ? ' flower-click' : ''}`;
          burst.textContent = showFlower ? '✿' : '✦';
          burst.style.left = `${event.clientX}px`;
          burst.style.top = `${event.clientY}px`;
          document.body.append(burst);
          burst.addEventListener('animationend', () => burst.remove(), { once: true });
        });
      }

      const profilePhotoData = './image/avatar.jpg';
      const aboutAvatar = $('.avatar img');
      if (aboutAvatar) {
        aboutAvatar.src = './image/avatar.jpg';
        aboutAvatar.alt = 'Ảnh profile của Lâm Hiếu Đức';
      }
      const menuButton = $('#menuToggle');
      const navLinks = $('#navLinks');
      menuButton.addEventListener('click', () => {
        const opened = navLinks.classList.toggle('open');
        menuButton.setAttribute('aria-expanded', String(opened));
        menuButton.setAttribute('aria-label', opened ? 'Đóng menu' : 'Mở menu');
      });
      $$('#navLinks a').forEach(link => link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        menuButton.setAttribute('aria-expanded', 'false');
      }));

      const pageViews = $$('.page-view');
      const navAnchors = $$('#navLinks a');
      function activateView(id, updateAddress = true) {
        const target = document.getElementById(id);
        if (!target || !target.classList.contains('page-view')) return;
        pageViews.forEach(view => view.classList.toggle('active-view', view === target));
        navAnchors.forEach(link => {
          const active = link.getAttribute('href') === `#${id}`;
          link.classList.toggle('active', active);
          if (active) link.setAttribute('aria-current', 'page');
          else link.removeAttribute('aria-current');
        });
        target.querySelectorAll('.reveal').forEach(item => item.classList.add('is-visible'));
        navLinks.classList.remove('open');
        menuButton.setAttribute('aria-expanded', 'false');
        if (updateAddress && location.hash !== `#${id}`) history.pushState({ view: id }, '', `#${id}`);
      }
      navAnchors.forEach(link => link.addEventListener('click', event => {
        event.preventDefault();
        activateView(link.getAttribute('href').slice(1));
      }));
      window.addEventListener('popstate', () => activateView(location.hash.slice(1) || 'home', false));
      activateView(location.hash.slice(1) || 'home', false);

      const revealItems = $$('.reveal');
      if ('IntersectionObserver' in window && !prefersReducedMotion) {
        const revealObserver = new IntersectionObserver(entries => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              entry.target.classList.add('is-visible');
              revealObserver.unobserve(entry.target);
            }
          });
        }, { threshold: 0.12 });
        revealItems.forEach(item => revealObserver.observe(item));
      } else {
        revealItems.forEach(item => item.classList.add('is-visible'));
      }

      const phrases = ['học lập trình web', 'thiết kế trò chơi điện tử', 'rèn luyện tư duy giải quyết vấn đề'];
      const typedText = $('#typedText');
      if (!prefersReducedMotion) {
        let phraseIndex = 0;
        let charIndex = phrases[0].length;
        let deleting = true;
        const typeTimer = () => {
          const phrase = phrases[phraseIndex];
          if (deleting) {
            charIndex--;
            typedText.textContent = phrase.slice(0, Math.max(0, charIndex));
            if (charIndex <= 0) {
              deleting = false;
              phraseIndex = (phraseIndex + 1) % phrases.length;
              window.setTimeout(typeTimer, 350);
              return;
            }
          } else {
            charIndex++;
            typedText.textContent = phrases[phraseIndex].slice(0, charIndex);
            if (charIndex >= phrases[phraseIndex].length) {
              deleting = true;
              window.setTimeout(typeTimer, 1550);
              return;
            }
          }
          window.setTimeout(typeTimer, deleting ? 36 : 58);
        };
        window.setTimeout(typeTimer, 1800);
      }

      const backTop = $('#backTop');
      const updateBackTop = () => backTop.classList.toggle('visible', window.scrollY > 500);
      window.addEventListener('scroll', updateBackTop, { passive: true });
      updateBackTop();
      backTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' }));

      $('#printCV').textContent = '✦ Mở CV tương tác';
      $('#printCV').addEventListener('click', () => {
        document.body.classList.add('showing-simple-cv', 'cv-active');
        activateCvPage(0);
      });
      $('#printSimpleCV').addEventListener('click', () => {
        document.body.classList.add('cv-printing');
        window.print();
      });
      window.addEventListener('afterprint', () => document.body.classList.remove('cv-printing'));

      const cvPhotoInput = $('#cvPhotoInput');
      cvPhotoInput.addEventListener('change', () => {
        const file = cvPhotoInput.files && cvPhotoInput.files[0];
        if (!file) return;
        if (!file.type.startsWith('image/')) {
          toast('Vui lòng chọn một tệp ảnh hợp lệ.');
          cvPhotoInput.value = '';
          return;
        }
        const preview = $('#cvPhotoPreview');
        const oldUrl = preview.dataset.objectUrl;
        if (oldUrl) URL.revokeObjectURL(oldUrl);
        const objectUrl = URL.createObjectURL(file);
        preview.src = objectUrl;
        preview.dataset.objectUrl = objectUrl;
        preview.hidden = false;
        $('#cvPhotoText').hidden = true;
      });

      let toastTimer;
      function toast(message) {
        const el = $('#toast');
        el.textContent = message;
        el.classList.add('show');
        window.clearTimeout(toastTimer);
        toastTimer = window.setTimeout(() => el.classList.remove('show'), 2600);
      }
      $('#copyEmail').addEventListener('click', async () => {
        const email = $('#emailText').textContent.trim();
        try {
          await navigator.clipboard.writeText(email);
          toast('Copied');
        } catch {
          const range = document.createRange();
          range.selectNodeContents($('#emailText'));
          const selection = window.getSelection();
          selection.removeAllRanges();
          selection.addRange(range);
          toast('Unable to copy.');
        }
      });

      const musicButton = $('#musicToggle');
      const musicLabel = $('#musicLabel');
      const musicAudio = new Audio('music.mp3');
      musicAudio.loop = true;
      musicAudio.preload = 'none';
      musicAudio.volume = 0.45;
      let musicOn = false;
      function updateMusicButton(playing) {
        musicOn = playing;
        musicButton.setAttribute('aria-pressed', String(playing));
        musicButton.setAttribute('aria-label', playing ? 'Tạm dừng nhạc nền' : 'Phát nhạc nền');
        musicButton.title = playing ? 'Tạm dừng nhạc nền' : 'Phát nhạc nền';
        musicLabel.textContent = playing ? 'Tạm dừng' : 'Phát nhạc';
      }
      musicButton.addEventListener('click', async () => {
        if (musicOn) {
          musicAudio.pause();
          updateMusicButton(false);
          toast('Đã tạm dừng nhạc nền.');
          return;
        }
        try {
          await musicAudio.play();
          updateMusicButton(true);
          toast('Đang phát nhạc.');
        } catch {
          updateMusicButton(false);
          toast('Không tải được nhạc. Kiểm tra kết nối mạng rồi thử lại.');
        }
      });
      musicAudio.addEventListener('pause', () => updateMusicButton(false));
      musicAudio.addEventListener('play', () => updateMusicButton(true));
      musicAudio.addEventListener('error', () => {
        updateMusicButton(false);
        toast('Nguồn nhạc không truy cập được. Hãy thử lại khi có mạng.');
      });
    })();
