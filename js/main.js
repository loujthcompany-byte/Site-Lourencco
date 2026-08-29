/**
 * LOURENCCO - OFFICIAL WEBSITE JAVASCRIPT
 * Interactions, Discography filters, Modals, Tour Ticket Checkout,
 * Lyrics Viewer, and Ambient Particle Atmosphere.
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initDiscographyFilters();
  initModals();
  initForms();
  initAmbientParticles();
});

/* ==========================================================================
   1. NAVBAR & NAVIGATION
   ========================================================================== */
function initNavbar() {
  const navbar = document.getElementById('navbar');
  const menuToggle = document.getElementById('menuToggle');
  const navLinks = document.getElementById('navLinks');
  const navLinkItems = document.querySelectorAll('.nav-link');

  // Scroll effect
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    updateActiveNav();
  });

  // Mobile menu toggle
  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
      navLinks.classList.toggle('active');
    });

    // Close menu when clicking link
    navLinkItems.forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('active');
      });
    });
  }

  // Active link on scroll
  function updateActiveNav() {
    const sections = document.querySelectorAll('section[id]');
    const scrollY = window.pageYOffset + 120;

    sections.forEach(sec => {
      const secHeight = sec.offsetHeight;
      const secTop = sec.offsetTop;
      const secId = sec.getAttribute('id');
      const navItem = document.querySelector(`.nav-link[href*="${secId}"]`);

      if (scrollY >= secTop && scrollY < secTop + secHeight) {
        navLinkItems.forEach(l => l.classList.remove('active'));
        if (navItem) navItem.classList.add('active');
      }
    });
  }
}

/* ==========================================================================
   2. DISCOGRAPHY FILTERS & TRACK ACTIONS
   ========================================================================== */
function initDiscographyFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const albumCards = document.querySelectorAll('.album-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      albumCards.forEach(card => {
        if (filter === 'all' || card.getAttribute('data-category') === filter) {
          card.style.display = 'flex';
          card.style.opacity = '1';
        } else {
          card.style.display = 'none';
          card.style.opacity = '0';
        }
      });
    });
  });
}

/* ==========================================================================
   3. MODALS (LYRICS & TOUR TICKETS)
   ========================================================================== */
function initModals() {
  const modalOverlay = document.getElementById('modalOverlay');
  const modalTitle = document.getElementById('modalTitle');
  const modalBody = document.getElementById('modalBody');
  const modalCloseBtn = document.getElementById('modalCloseBtn');

  if (modalCloseBtn && modalOverlay) {
    modalCloseBtn.addEventListener('click', closeModal);
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) closeModal();
    });
  }

  function openModal(title, htmlContent) {
    if (!modalOverlay || !modalTitle || !modalBody) return;
    modalTitle.textContent = title;
    modalBody.innerHTML = htmlContent;
    modalOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    if (!modalOverlay) return;
    modalOverlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  window.openLyricsModal = function(trackTitle, albumName) {
    const track = window.audioApp ? window.audioApp.tracks.find(t => t.title.toLowerCase() === trackTitle.toLowerCase()) : null;
    const lyricsText = track ? track.lyrics : `Letra oficial de "${trackTitle}" do álbum ${albumName}.\n\nLourencco - Marca Própria e Produção Sertaneja 2025.\n\nDisponível em todas as plataformas digitais.`;

    const content = `
      <div style="text-align: center; margin-bottom: 20px;">
        <span style="font-size: 0.8rem; color: var(--color-amber-light); text-transform: uppercase; letter-spacing: 0.1em; font-weight: 700;">${albumName}</span>
        <h3 style="font-size: 1.5rem; color: #fff; margin-top: 4px; font-family: var(--font-brand);">${trackTitle}</h3>
        <span style="font-size: 0.8rem; color: var(--text-dim);">Composição: Lourencco</span>
      </div>
      <div style="background: rgba(10, 7, 5, 0.7); border: 1px solid var(--border-wood); border-radius: var(--radius-md); padding: 24px; max-height: 280px; overflow-y: auto; white-space: pre-line; color: var(--text-main); font-size: 0.95rem; line-height: 1.8; text-align: center; font-style: italic;">
${lyricsText}
      </div>
      <div style="margin-top: 24px; display: flex; gap: 12px; justify-content: center;">
        <button class="btn btn-gold" onclick="window.audioApp.selectTrackById('${trackTitle}'); document.getElementById('modalCloseBtn').click();">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
          Ouvir Prévia Acústica
        </button>
        <a href="https://open.spotify.com/intl-pt/artist/3PKPhziZyHcO1m0dW76g1M" target="_blank" rel="noopener noreferrer" class="btn btn-spotify">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/></svg>
          Ouvir no Spotify
        </a>
      </div>
    `;
    openModal(`Letra: ${trackTitle}`, content);
  };
}

/* ==========================================================================
   4. FORMS & TOAST NOTIFICATIONS
   ========================================================================== */
function initForms() {
  const bookingForm = document.getElementById('bookingForm');
  const newsletterForm = document.getElementById('newsletterForm');

  if (bookingForm) {
    bookingForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const contractorName = document.getElementById('contractorName')?.value;
      const eventCity = document.getElementById('eventCity')?.value;
      showToast(`✨ Proposta de show em ${eventCity} recebida, ${contractorName}! A equipe de produção de Lourencco entrará em contato em breve.`);
      bookingForm.reset();
    });
  }

  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      showToast('🐎 Bem-vindo ao Fã-Clube Oficial Lourencco! Você receberá lançamentos exclusivos.');
      newsletterForm.reset();
    });
  }
}

function showToast(message) {
  let toast = document.getElementById('toastNotification');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toastNotification';
    toast.className = 'toast-notification';
    document.body.appendChild(toast);
  }

  toast.innerHTML = `
    <div style="font-size: 1.2rem; color: var(--color-amber);">✓</div>
    <div style="font-size: 0.9rem; font-weight: 500;">${message}</div>
  `;

  toast.classList.add('show');
  setTimeout(() => {
    toast.classList.remove('show');
  }, 4500);
}

/* ==========================================================================
   5. AMBIENT PARTICLES (WARM AMBER STAGE DUST & GLOW)
   ========================================================================== */
function initAmbientParticles() {
  const canvas = document.createElement('canvas');
  canvas.id = 'ambientParticlesCanvas';
  canvas.style.position = 'fixed';
  canvas.style.top = '0';
  canvas.style.left = '0';
  canvas.style.width = '100%';
  canvas.style.height = '100%';
  canvas.style.pointerEvents = 'none';
  canvas.style.zIndex = '3';
  canvas.style.opacity = '0.45';
  document.body.appendChild(canvas);

  const ctx = canvas.getContext('2d');
  let particles = [];
  const particleCount = 35;

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  for (let i = 0; i < particleCount; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      radius: Math.random() * 2 + 0.8,
      speedY: Math.random() * 0.4 + 0.15,
      speedX: (Math.random() - 0.5) * 0.2,
      alpha: Math.random() * 0.6 + 0.2,
      pulse: Math.random() * 0.02
    });
  }

  function renderParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach(p => {
      p.y -= p.speedY;
      p.x += p.speedX;
      p.alpha += Math.sin(Date.now() * 0.002 + p.x) * 0.005;

      if (p.y < 0) {
        p.y = canvas.height + 10;
        p.x = Math.random() * canvas.width;
      }

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(229, 169, 59, ${Math.max(0.1, Math.min(0.8, p.alpha))})`;
      ctx.shadowColor = '#e5a93b';
      ctx.shadowBlur = 6;
      ctx.fill();
    });

    requestAnimationFrame(renderParticles);
  }

  renderParticles();
}
