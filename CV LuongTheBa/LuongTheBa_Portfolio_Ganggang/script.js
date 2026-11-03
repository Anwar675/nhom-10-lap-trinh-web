// 1. Quản lý Theme Dark / Light Mode
const htmlEl = document.documentElement;

function applyTheme(isDark) {
  const themeIcon = document.getElementById('themeIcon');
  const mobileThemeIcon = document.getElementById('mobileThemeIcon');

  if (isDark) {
    htmlEl.classList.add('dark');
    htmlEl.classList.remove('light');
    if (themeIcon) themeIcon.className = 'fa-solid fa-sun text-yellow-400';
    if (mobileThemeIcon) mobileThemeIcon.className = 'fa-solid fa-sun text-yellow-400';
    localStorage.setItem('theme', 'dark');
  } else {
    htmlEl.classList.remove('dark');
    htmlEl.classList.add('light');
    if (themeIcon) themeIcon.className = 'fa-solid fa-moon text-slate-800';
    if (mobileThemeIcon) mobileThemeIcon.className = 'fa-solid fa-moon text-slate-800';
    localStorage.setItem('theme', 'light');
  }
}

function toggleTheme() {
  const isDark = htmlEl.classList.contains('dark');
  applyTheme(!isDark);
}

// Khởi chạy khi DOM sẵn sàng
document.addEventListener('DOMContentLoaded', () => {
  // Gắn sự kiện click cho các nút đổi theme
  const themeToggleBtn = document.getElementById('themeToggleBtn');
  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', toggleTheme);
  }

  const mobileThemeToggleBtn = document.getElementById('mobileThemeToggleBtn');
  if (mobileThemeToggleBtn) {
    mobileThemeToggleBtn.addEventListener('click', toggleTheme);
  }

  // Khởi tạo theme ban đầu từ localStorage (mặc định dark)
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'light') {
    applyTheme(false);
  } else {
    applyTheme(true);
  }

  // 2. Mobile Menu Toggle
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const mobileMenu = document.getElementById('mobileMenu');
  if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener('click', () => {
      mobileMenu.classList.toggle('hidden');
    });
    // Tự động đóng menu khi bấm vào link
    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => mobileMenu.classList.add('hidden'));
    });
  }

  // 3. Back to Top Button
  const backToTopBtn = document.getElementById('backToTopBtn');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
      backToTopBtn?.classList.remove('hidden');
    } else {
      backToTopBtn?.classList.add('hidden');
    }
  });

  // 4. Đóng Modal khi click ngoài hộp modal
  const projectModal = document.getElementById('projectModal');
  window.addEventListener('click', (e) => {
    if (e.target === projectModal) {
      closeModal();
    }
  });
});

// 3. Bộ lọc Dự án (Filter Projects)
function filterProjects(category) {
  const items = document.querySelectorAll('.project-item');
  const buttons = document.querySelectorAll('.filter-btn');

  buttons.forEach(btn => {
    btn.classList.remove('active', 'bg-street-neon', 'text-black');
  });
  if (window.event && window.event.target) {
    window.event.target.classList.add('active', 'bg-street-neon', 'text-black');
  }

  items.forEach(item => {
    const itemCat = item.getAttribute('data-category');
    if (category === 'all' || itemCat === category) {
      item.style.display = 'block';
    } else {
      item.style.display = 'none';
    }
  });
}

// 4. Modal Chi tiết dự án
function openModal(title, desc, tech, link) {
  const projectModal = document.getElementById('projectModal');
  document.getElementById('modalTitle').textContent = title;
  document.getElementById('modalDesc').textContent = desc;
  document.getElementById('modalTech').textContent = tech;
  document.getElementById('modalLink').textContent = link;
  projectModal.classList.remove('hidden');
}

function closeModal() {
  const projectModal = document.getElementById('projectModal');
  projectModal.classList.add('hidden');
}

// 5. Kiểm tra dữ liệu Form Liên hệ (Validation) & Hiển thị Toast
function handleFormSubmit(e) {
  e.preventDefault();
  
  const nameInput = document.getElementById('nameInput');
  const emailInput = document.getElementById('emailInput');
  const messageInput = document.getElementById('messageInput');

  const nameError = document.getElementById('nameError');
  const emailError = document.getElementById('emailError');
  const messageError = document.getElementById('messageError');

  let isValid = true;

  // Validate Tên
  if (!nameInput.value.trim()) {
    nameError.classList.remove('hidden');
    isValid = false;
  } else {
    nameError.classList.add('hidden');
  }

  // Validate Email bằng Regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(emailInput.value.trim())) {
    emailError.classList.remove('hidden');
    isValid = false;
  } else {
    emailError.classList.add('hidden');
  }

  // Validate Tin nhắn
  if (messageInput.value.trim().length < 5) {
    messageError.classList.remove('hidden');
    isValid = false;
  } else {
    messageError.classList.add('hidden');
  }

  if (isValid) {
    // Reset form
    nameInput.value = '';
    emailInput.value = '';
    messageInput.value = '';

    // Hiện Toast
    showToast('Lời nhắn đã được mã hoá và gửi thành công!');
  }
}

function showToast(msg) {
  const toast = document.getElementById('toastNotification');
  document.getElementById('toastMessage').textContent = msg;
  toast.classList.remove('translate-x-full');
  setTimeout(() => {
    toast.classList.add('translate-x-full');
  }, 4000);
}

// 6. Back to Top Action
function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}
