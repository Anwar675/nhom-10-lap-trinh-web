(() => {
      const $ = (selector, root = document) => root.querySelector(selector);
      const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      // Chuyển CV dài thành các màn hình riêng, không cuộn cả trang.
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

      // Cập nhật năm tự động.
      $('#year').textContent = new Date().getFullYear();

      // Tạo vài cánh hoa và chiếc lá pixel rơi chậm trên nền rừng.
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

      // Con trỏ pixel và hiệu ứng bung pixel tại vị trí nhấp chuột.
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

      // Dùng ảnh profile đã gắn trực tiếp trong mã HTML, không cần tải ảnh lên.
      const profilePhotoData = 'data:image/webp;base64,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';
      $$('.owner-profile-photo').forEach(image => { image.src = profilePhotoData; });
      const aboutAvatar = $('.avatar img');
      if (aboutAvatar) {
        aboutAvatar.src = profilePhotoData;
        aboutAvatar.alt = 'Ảnh profile của Lâm Hiếu Đức';
      }
      // Menu gọn trên điện thoại.
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

      // Chuyển màn hình như một game dashboard, không cuộn qua toàn bộ trang.
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

      // Hiệu ứng hiện dần khi cuộn trang.
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

      // Dòng giới thiệu luân phiên, có thể tắt khi người xem giảm chuyển động.
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

      // Nút quay lại đầu trang.
      const backTop = $('#backTop');
      const updateBackTop = () => backTop.classList.toggle('visible', window.scrollY > 500);
      window.addEventListener('scroll', updateBackTop, { passive: true });
      updateBackTop();
      backTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' }));

      // CV: mở hộp thoại in của trình duyệt; có thể chọn "Save as PDF".
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

      // Cho phép chọn ảnh cá nhân từ máy tính và hiển thị ngay trên CV.
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

      // Thông báo ngắn cho các thao tác sao chép.
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

      // Nhạc nền cố định: Erik Satie - Gymnopedie No. 1 (bản piano của A-M Classical, CC BY).
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
