/**
 * Multi-View Hero Showcase — Venue-Styled Editorial Split
 * Provides interactive slide navigation, keyboard accessibility, and auto-rotation
 * mirroring the Venue section architecture.
 */
export function initHeroUI() {
  const gallery = document.getElementById('heroGallery');
  if (!gallery) return;

  const slides = Array.from(gallery.querySelectorAll('.hero-gallery-slide'));
  if (slides.length === 0) return;

  const prevBtn = document.getElementById('heroPrevBtn');
  const nextBtn = document.getElementById('heroNextBtn');
  const counterEl = document.getElementById('heroGalleryCounter');
  const captionEl = document.getElementById('heroCanvasCaption');
  const spaceItems = Array.from(document.querySelectorAll('.hero-space-row'));

  let currentIndex = 0;
  const total = slides.length;
  let autoTimer = null;
  const AUTO_INTERVAL_MS = 7000;

  // If only 1 slide, hide navigation controls
  if (total <= 1) {
    if (prevBtn) prevBtn.style.display = 'none';
    if (nextBtn) nextBtn.style.display = 'none';
    if (counterEl) counterEl.style.display = 'none';
    return;
  }

  function goToSlide(newIndex) {
    if (newIndex < 0) {
      currentIndex = total - 1;
    } else if (newIndex >= total) {
      currentIndex = 0;
    } else {
      currentIndex = newIndex;
    }

    const activeSlide = slides[currentIndex];

    // 1. Update slides active state
    slides.forEach((slide, idx) => {
      const isActive = (idx === currentIndex);
      slide.classList.toggle('active', isActive);
      slide.setAttribute('aria-hidden', isActive ? 'false' : 'true');
    });

    // 2. Update caption
    if (captionEl && activeSlide) {
      captionEl.innerHTML = activeSlide.dataset.caption || activeSlide.dataset.label || '';
    }

    // 3. Update counter
    if (counterEl) {
      const curStr = String(currentIndex + 1).padStart(2, '0');
      const totStr = String(total).padStart(2, '0');
      counterEl.textContent = `${curStr} / ${totStr}`;
    }

    // 4. Update corresponding spec row highlight
    spaceItems.forEach(item => {
      const targetIdx = parseInt(item.dataset.heroTarget, 10);
      const isActive = (targetIdx === currentIndex);
      item.classList.toggle('active', isActive);
      item.setAttribute('aria-selected', isActive ? 'true' : 'false');
    });
  }

  function nextSlide() {
    goToSlide(currentIndex + 1);
  }

  function prevSlide() {
    goToSlide(currentIndex - 1);
  }

  function startAuto() {
    stopAuto();
    autoTimer = setInterval(nextSlide, AUTO_INTERVAL_MS);
  }

  function stopAuto() {
    if (autoTimer) {
      clearInterval(autoTimer);
      autoTimer = null;
    }
  }

  // Prev / Next button listeners
  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      prevSlide();
      stopAuto();
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      nextSlide();
      stopAuto();
    });
  }

  // Space Row (tab) click listeners
  spaceItems.forEach(item => {
    item.addEventListener('click', () => {
      const targetIdx = parseInt(item.dataset.heroTarget, 10);
      if (!isNaN(targetIdx)) {
        goToSlide(targetIdx);
        stopAuto();
      }
    });
  });

  // Keyboard navigation on gallery
  gallery.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      prevSlide();
      stopAuto();
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      nextSlide();
      stopAuto();
    }
  });

  // Pause auto-rotation on hover
  gallery.addEventListener('mouseenter', stopAuto);
  gallery.addEventListener('mouseleave', startAuto);
  gallery.addEventListener('focusin', stopAuto);
  gallery.addEventListener('focusout', startAuto);

  // Touch Swipe Support
  let touchStartX = 0;
  let touchEndX = 0;
  gallery.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
    stopAuto();
  }, { passive: true });

  gallery.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    const diff = touchEndX - touchStartX;
    if (Math.abs(diff) > 40) {
      if (diff < 0) nextSlide();
      else prevSlide();
    }
    startAuto();
  }, { passive: true });

  // Initial display sync
  goToSlide(0);
  startAuto();
}
