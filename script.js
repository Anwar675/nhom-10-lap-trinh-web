const personalLinks = [
  ['Home','#home'],['About','#about'],['Resume','#resume'],['Portfolio','#projects'],['Services','#services'],['Contact','#contact']
];
const studioLinks = [
  ['Home','#studio-home'],['About','#studio-about'],['Resume','#team'],['Portfolio','#studio-work'],['Services','#studio-services'],['Contact','#studio-contact']
];
const personalProjects = [
 {index:'01',name:'DevScope',tag:'AI • SYSTEM ANALYSIS',copy:'Công cụ phân tích hệ thống bằng AI, giúp developer đo tải, hiểu hiệu năng và tìm hướng cải thiện kiến trúc.',result:'Real-time k6 metrics',href:'https://devscope-q7hq.vercel.app/',className:'project-blue'},
  {index:'02',name:'Alga Manga',tag:'FULL-STACK PLATFORM',copy:'Nền tảng đọc manga hiện đại với API type-safe, tìm kiếm nhanh, caching và trải nghiệm responsive.',result:'Next.js • tRPC • PostgreSQL',href:'https://www.alga.site/',className:'project-lime'}
];
const services = [
  ['01','Product Design','UI/UX, design systems và prototype rõ ràng, dễ sử dụng.'],
  ['02','Full-Stack Build','Ứng dụng web nhanh, an toàn và sẵn sàng để mở rộng.'],
  ['03','Brand & Content','Nhận diện thương hiệu và nội dung có câu chuyện nhất quán.'],
  ['04','System Strategy','Kiến trúc, audit hiệu năng và lộ trình kỹ thuật thực tế.']
];
const team = [
  ['img/anwar.jpg','Anwar','Tech Lead','Backend & System Design'],
  ['https://images.unsplash.com/photo-1754307943655-a76a567661e3?auto=format&fit=crop&w=700&q=85','Nguyễn Quang Hiếu','Creative Director','Brand & Art Direction'],
  ['https://images.unsplash.com/photo-1664123383279-3084c0731d41?auto=format&fit=crop&w=700&q=85','Trần Nguyễn Du','Product Designer','UX Research & Interface'],
  ['https://images.unsplash.com/photo-1664123383279-3084c0731d41?auto=format&fit=crop&w=700&q=85','Lâm Đức Hiếu','Content Strategist','Storytelling & Campaign'],
  ['https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=700&q=85','Lương Thế Bá','Engineer','Web Platform & APIs'],
  ['https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=700&q=85','Mai Thanh Tuyền','Project Manager','Operations & Delivery']
];
const arrow = '<span aria-hidden="true">↗</span>';
const teamLocalImages = ['img/anwar.jpg','img/Nguyễn Quang Hiếu.png','TranNguyenDu/avatar.png','https://images.unsplash.com/photo-1600376626886-23c873d28cbe?auto=format&fit=crop&w=700&q=85','CV LuongTheBa/LuongTheBa_Portfolio_Ganggang/img/avatar.jpg','CV-Mai Thanh Truyền/CV-Mai Thanh Truyền/avatar.jpg'];
const teamLinks = ['#personal','CV-Nguyễn Quang Hiếu/CV-Cá Nhân.html','TranNguyenDu/index.html','CV-Lâm Hiếu Đức/CV-Lâm Hiếu Đức/index.html','CV LuongTheBa/LuongTheBa_Portfolio_Ganggang/index.html','CV-Mai Thanh Truyền/CV-Mai Thanh Truyền/index.html'];
const title = (eyebrow, text) => `<div class="section-title"><p>${eyebrow}</p><h2>${text}</h2></div>`;
const projectCards = personalProjects.map(p => `<a class="project-card ${p.className}" href="${p.href}" target="_blank" rel="noreferrer"><div class="project-top"><span>${p.index}</span><span>${p.tag}</span>${arrow}</div><div class="project-visual">${p.image ? `<img src="${p.image}" alt="Giao diện ${p.name}" loading="lazy">` : ''}<div class="visual-grid"></div><span class="visual-word">${p.name.substring(0,3).toUpperCase()}</span><div class="metric"><small>STATUS</small><b>LIVE</b></div></div><h3>${p.name}</h3><p>${p.copy}</p><strong class="result">${p.result}</strong></a>`).join('');
const personalPage = () => `<main id="home">
<section class="personal-hero"><div class="hero-kicker"><span></span> Available for opportunities</div>
<h1>Building systems that <em>scale.</em></h1>
<div class="personal-hero-bottom"><p>Xin chào, tôi là <strong>Anwar</strong> — Full-Stack Developer tập trung vào Backend, System Design và những sản phẩm AI hữu ích.</p><div class="hero-actions"><a class="button primary" href="#projects">Xem dự án ${arrow}</a><a class="button ghost" href="https://github.com/Anwar675" target="_blank" rel="noreferrer">GitHub ${arrow}</a></div></div>
<div class="code-window" aria-hidden="true"><div class="window-bar"><i></i><i></i><i></i><span>anwar / philosophy.ts</span></div><pre><code><b>const</b> developer = {
  name: <u>'Anwar'</u>,
  mindset: <u>'build → understand → improve'</u>,
  focus: [<u>'backend'</u>, <u>'systems'</u>, <u>'AI'</u>]
}</code></pre></div>
<figure class="hero-portrait"><img src="img/anwar.jpg" alt="Lập trình viên trẻ làm việc với laptop"><figcaption><span>ANWAR / 2005</span><span>HCM, VN</span></figcaption></figure></section>
<section class="about-grid" id="about">${title('01 / About','Tò mò về cách mọi thứ vận hành ở phía sau.')}<div class="about-copy"><p>Sinh viên năm ba tại Đại học Giao thông Vận tải, Việt Nam. Tôi xây dựng ứng dụng full-stack với Next.js, TypeScript, Node.js và PostgreSQL.</p><p>Tôi đang đào sâu database transactions, concurrency control, caching, queues và kiến trúc có khả năng mở rộng — với mục tiêu trở thành Backend Engineer, sau đó là AI Product Engineer.</p><div class="stats"><div><strong>03</strong><span>Năm học &amp; xây dựng</span></div><div><strong>02</strong><span>Sản phẩm nổi bật</span></div><div><strong>∞</strong><span>Điều cần khám phá</span></div></div></div></section>
<section class="personal-gallery" id="services"><div class="gallery-heading"><p>WORK / LEARN / REPEAT</p><h2>Luôn học bằng cách <em>xây dựng.</em></h2></div><figure class="gallery-main"><img src="https://images.unsplash.com/photo-1640646291179-0402254c97de?auto=format&fit=crop&w=1200&q=85" alt="Không gian làm việc với nhiều màn hình"><figcaption>Deep work / System thinking</figcaption></figure><figure class="gallery-side"><img src="https://images.unsplash.com/photo-1657303201020-1db0b5299cc7?auto=format&fit=crop&w=800&q=85" alt="Lập trình viên tại bàn làm việc"><figcaption>Every problem starts with a question.</figcaption></figure></section>
<section class="projects-section" id="projects">${title('02 / Selected work','Dự án được chọn')}<div class="project-list">${projectCards}</div></section>
<section class="stack-section" id="resume">${title('03 / Toolkit','Công nghệ tôi sử dụng')}<div class="stack-grid">${[['Frontend','TypeScript, React, Next.js, Tailwind CSS'],['Backend','Node.js, Express, tRPC, REST APIs'],['Data','PostgreSQL, Prisma, Redis, Meilisearch'],['Infrastructure','Docker, Linux, Git, k6']].map(([a,b])=>`<div class="stack-card"><span>${a}</span><p>${b}</p></div>`).join('')}</div><div class="exploring"><span>HIỆN ĐANG KHÁM PHÁ</span><p>SQL optimization • Transaction boundaries • Message queues • Distributed systems • AI-assisted analysis</p></div></section>
<section class="contact-section" id="contact"><p>04 / Kết nối</p><h2>Cùng xây dựng một hệ thống <em>đáng tin cậy.</em></h2><div><a class="button light" href="mailto:anwar675.dev@gmail.com">Gửi email ${arrow}</a><a href="https://github.com/Anwar675" target="_blank" rel="noreferrer">GitHub ${arrow}</a><a href="https://www.facebook.com/oanthienan.928219" target="_blank" rel="noreferrer">Facebook ${arrow}</a></div><blockquote>“Build, understand, and improve — one system at a time.”</blockquote></section></main>`;

const studioPage = () => `<main class="studio-page" id="studio-home">
<section class="studio-hero"><p class="studio-kicker">Independent digital collective / Vietnam</p><h1>Small team.<br><em>Serious</em> impact.</h1><div class="orbit-mark"><span>4</span><small>CREATIVE<br>MINDS</small></div><div class="studio-intro"><p>Chúng tôi kết hợp chiến lược, thiết kế và công nghệ để biến những ý tưởng tốt thành sản phẩm số đáng nhớ.</p><a class="button dark" href="#studio-work">Khám phá dự án ${arrow}</a></div></section>
<section class="studio-about" id="studio-about">${title('01 / The studio','Không chỉ làm cho đẹp. Chúng tôi làm để tạo chuyển động.')}<div class="studio-about-copy"><p>Nhóm 10 được hình thành từ một nhóm bạn cùng tin rằng sản phẩm tốt bắt đầu bằng việc đặt đúng câu hỏi. Chúng tôi làm việc sát với khách hàng, từ chiến lược ban đầu đến dòng code cuối cùng.</p><div class="studio-stats"><div><strong>5+</strong><span>Năm kinh nghiệm</span></div><div><strong>48</strong><span>Dự án hoàn thành</span></div><div><strong>31</strong><span>Khách hàng hài lòng</span></div><div><strong>96%</strong><span>Tiếp tục hợp tác</span></div></div></div></section>
<section class="studio-photo-break"><img src="https://images.unsplash.com/photo-1572021335469-31706a17aaef?auto=format&fit=crop&w=1800&q=85" alt="Nhóm sáng tạo cùng thảo luận trong văn phòng"><div><span>TOGETHER, BETTER.</span><p>Ý tưởng lớn lên khi những góc nhìn khác nhau cùng ngồi lại.</p></div></section>
<section class="services-section" id="studio-services">${title('02 / Capabilities','Từ ý tưởng đến sản phẩm.')}<div class="services-list">${services.map(([n,t,c])=>`<div class="service-row"><span>${n}</span><h3>${t}</h3><p>${c}</p><span>↗</span></div>`).join('')}</div></section>
<section class="studio-work" id="studio-work">${title('03 / Selected work','Một vài dự án chúng tôi tự hào.')}<div class="case-grid"><article class="case-card case-orange"><div class="case-art"><span>NỐI</span><i>Brand system / Digital</i></div><h3>Nối Coffee</h3><p>Tái định vị thương hiệu chuỗi cà phê bản địa.</p><div class="case-result"><b>+42%</b><span>Tương tác sau 3 tháng</span></div></article><article class="case-card case-black"><div class="case-art"><span>flux</span><i>Product design / Development</i></div><h3>Flux Finance</h3><p>Trải nghiệm tài chính sáng rõ cho thế hệ mới.</p><div class="case-result"><b>2.4×</b><span>Tăng tỷ lệ hoàn tất</span></div></article><article class="case-card case-cream"><div class="case-art"><span>Sống.</span><i>Campaign / Content</i></div><h3>Sống Xanh</h3><p>Chiến dịch số biến nhận thức thành hành động.</p><div class="case-result"><b>1.2M</b><span>Lượt tiếp cận tự nhiên</span></div></article></div></section>
<section class="team-section" id="team">${title('04 / The people','Sáu góc nhìn. Một tiêu chuẩn.')}<div class="team-grid">${team.map(([img,name,role,skill],i)=>{const card=`<div class="portrait"><img src="${img}" alt="Ảnh mẫu ${name}" loading="lazy"></div><h3>${name}</h3><p>${role}</p><small>${skill}</small>`;return name==='Anwar'?`<a class="member member-${i+1}" href="#personal">${card}</a>`:`<article class="member member-${i+1}">${card}</article>`}).join('')}</div></section>
<section class="testimonial"><span>“</span><blockquote>Kernel không chỉ hiểu brief — họ giúp chúng tôi nhìn ra bài toán thật sự phía sau và biến nó thành một sản phẩm vượt kỳ vọng.</blockquote><p><strong>Minh Trần</strong> / Founder, Flux Finance</p></section>
<section class="studio-contact" id="studio-contact"><div><p>05 / Start a project</p><h2>Có một ý tưởng<br>đáng để <em>làm thật?</em></h2><span>hello@kernel.studio<br>+84 912 345 678<br>Hà Nội, Việt Nam</span></div><form id="contact-form"><label>Họ và tên<input name="name" required placeholder="Tên của bạn"></label><label>Email<input name="email" type="email" required placeholder="you@company.com"></label><label>Bạn cần gì?<textarea name="message" required placeholder="Hãy kể ngắn gọn về dự án..."></textarea></label><button class="button dark" type="submit">Gửi lời nhắn ${arrow}</button><p class="form-status" aria-live="polite"></p></form></section></main>`;

let page = location.hash === '#personal' ? 'personal' : 'studio';
const app = document.querySelector('.app');
const content = document.querySelector('#page-content');
const nav = document.querySelector('.main-nav');
const switchButtons = [...document.querySelectorAll('[data-page]')];

function render(nextPage, scrollTop = false) {
  page = nextPage;
  app.className = `app ${page}`;
  const links = page === 'personal' ? personalLinks : studioLinks;
  nav.innerHTML = links.map(([label, href]) => `<a href="${href}">${label}</a>`).join('');
  content.innerHTML = page === 'personal' ? personalPage() : studioPage();
  if (page === 'studio') document.querySelector('.studio-work .case-grid').innerHTML = `<article class="case-card case-safecheck"><div class="case-art"><img src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=85" alt="Giao diện SafeCheck VN" loading="lazy"><i>Product design / Development</i></div><h3>SafeCheck VN</h3><p>Nền tảng tra cứu và cảnh báo giúp kiểm tra thông tin trước khi chuyển tiền.</p><div class="case-result"><b>LIVE</b><span>SafeCheck VN</span></div></article>`;
  document.querySelector('.brand-mark').textContent = page === 'personal' ? 'AW' : 'N10';
  document.querySelector('.brand-name').textContent = page === 'personal' ? 'Anwar.' : 'Nhóm 10';
  document.querySelector('.footer-brand').textContent = page === 'personal' ? 'Anwar' : 'Nhóm 10';
  document.title = page === 'personal' ? 'Anwar — Full-Stack Developer' : 'Nhóm 10 — Digital Collective';
  switchButtons.forEach(button => button.classList.toggle('active', button.dataset.page === page));
  if (scrollTop) window.scrollTo({top:0, behavior:'smooth'});
  content.classList.remove('page-enter');
  void content.offsetWidth;
  content.classList.add('page-enter');
  observeSections();
  updateProgress();
  const form = document.querySelector('#contact-form');
  if (form) form.addEventListener('submit', event => {
    event.preventDefault();
    const status = form.querySelector('.form-status');
    status.textContent = 'Cảm ơn bạn! Form demo chưa kết nối dịch vụ gửi email.';
    form.querySelector('button').firstChild.textContent = 'Đã nhận lời nhắn ';
  });
}
function observeSections() {
  const sections = document.querySelectorAll('#page-content main section');
  if (!('IntersectionObserver' in window)) {
    sections.forEach(section => section.classList.add('visible'));
    return;
  }
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, {threshold:0.08});
  sections.forEach(section => {
    section.classList.add('reveal');
    const rect = section.getBoundingClientRect();
    if (rect.top < window.innerHeight * .92) section.classList.add('visible');
    observer.observe(section);
  });
}
function updateProgress() {
  const height = document.documentElement.scrollHeight - window.innerHeight;
  document.documentElement.style.setProperty('--progress', `${height > 0 ? (window.scrollY / height) * 100 : 0}%`);
}
switchButtons.forEach(button => button.addEventListener('click', () => {
  history.replaceState(null, '', button.dataset.page === 'studio' ? '#team' : '#personal');
  render(button.dataset.page, true);
}));
document.querySelector('[data-top]').addEventListener('click', () => window.scrollTo({top:0,behavior:'smooth'}));
window.addEventListener('scroll', updateProgress, {passive:true});
window.addEventListener('hashchange', () => {
  if (location.hash === '#team' && page !== 'studio') { render('studio'); useTeamLocalAssets(); }
  else if (location.hash === '#personal' && page !== 'personal') render('personal', true);
});
render(page);
function useTeamLocalAssets() { if (page !== 'studio') return; document.querySelectorAll('.member').forEach((member, i) => { const image = member.querySelector('img'); if (image) image.src = teamLocalImages[i]; const link = teamLinks[i]; if (link && i > 0) member.querySelector('.portrait').addEventListener('click', () => { window.location.href = link; }); }); }
useTeamLocalAssets();
